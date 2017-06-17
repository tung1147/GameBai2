/*
 * HttpFileDownloader.cpp
 *
 *  Created on: Mar 23, 2016
 *      Author: Quyet Nguyen
 */

#include "HttpFileDownloader.h"
#include "cocos2d.h"
USING_NS_CC;

#include <curl/curl.h>
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32) || (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
#include <direct.h>
#endif
#include <sys/types.h>
#include <sys/stat.h>
#include "../GameLaucher/EngineUtilsThreadSafe.h"

namespace quyetnd{

size_t _DownloadRequest_write_data_handler(void *ptr, size_t size, size_t nmemb, DownloadRequest* writer) {
	size_t written = writer->onDownloadHandler(ptr, size, nmemb);
	return written;
}

DownloadRequest::DownloadRequest(){
	_url = "";
	_fileName = "";
	finishedCallback = nullptr;
	processCallback = nullptr;
	fileWrite = 0;
}

DownloadRequest::DownloadRequest(const std::string& url, const std::string& fileName){
	_url = url;
	_fileName = fileName;
	finishedCallback = nullptr;
	processCallback = nullptr;
	fileWrite = 0;
}

DownloadRequest::~DownloadRequest(){

}

size_t DownloadRequest::onDownloadHandler(void *ptr, size_t size, size_t nmemb){
	size_t ret = size * nmemb;
	if (fileWrite){
		ret = fwrite(ptr, size, nmemb, fileWrite);
	}
	if (processCallback){
		processCallback((unsigned char*)ptr, size * nmemb);
	}

	return ret;
}

void DownloadRequest::onFinished(int returnCode){
	if (finishedCallback){
		finishedCallback(returnCode);
	}
}

void DownloadRequest::execute(){
	fileWrite = 0;
	if (_fileName.empty()){
		this->downloadNoCache();
	}
	else{
		this->downloadWithCache();
	}
}

void DownloadRequest::downloadWithCache(){
	CURL *curl;
	CURLcode res;
	curl = curl_easy_init();
	if (curl != NULL) {
		//_gamefile_create_parent_folder(filePath);
		auto n = _fileName.find_last_of("/");
		if (n != std::string::npos && n != 0){
			std::string parentFolder = _fileName.substr(0, n);
			if (!EngineUtilsThreadSafe::getInstance()->isDirectoryExist(parentFolder)){
				EngineUtilsThreadSafe::getInstance()->createDirectory(parentFolder);
			}
		}

		fileWrite = fopen(_fileName.c_str(), "wb");

		if (fileWrite != NULL) {
			curl_easy_setopt(curl, CURLOPT_URL, _url.c_str());
			curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, true);
			curl_easy_setopt(curl, CURLOPT_AUTOREFERER, true);
			curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 10);
			curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 120);
			curl_easy_setopt(curl, CURLOPT_TIMEOUT, 120);
			curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, false);
			curl_easy_setopt(curl, CURLOPT_FRESH_CONNECT, true);
			curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, _DownloadRequest_write_data_handler);
			curl_easy_setopt(curl, CURLOPT_WRITEDATA, this);
			res = curl_easy_perform(curl);
			curl_easy_cleanup(curl);

			fclose(fileWrite);
			fileWrite = 0;
			if (res == CURLE_OK) {
				CCLOG("download file OK : %s", _url.c_str());
				this->onFinished(DownloadResult::OK);
			}
			else{
				CCLOG("download file network error[%d]: %s", res, _url.c_str());
				remove(_fileName.c_str());
				this->onFinished(DownloadResult::NETWORK_ERROR);
			}

		}
		else{
			CCLOG("download file cannot create file:  %s", _url.c_str());
			curl_easy_cleanup(curl);
			this->onFinished(DownloadResult::FILE_ERROR);
		}
	}
	else{
		CCLOG("init curl error:  %s", _url.c_str());
		this->onFinished(DownloadResult::CURL_ERROR);
	}
}

void DownloadRequest::downloadNoCache(){
	CURL *curl;
	CURLcode res;
	curl = curl_easy_init();
	if (curl != NULL) {
		curl_easy_setopt(curl, CURLOPT_URL, _url.c_str());
		curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, true);
		curl_easy_setopt(curl, CURLOPT_AUTOREFERER, true);
		curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 10);
		curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 120);
		curl_easy_setopt(curl, CURLOPT_TIMEOUT, 120);
		curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, false);
		curl_easy_setopt(curl, CURLOPT_FRESH_CONNECT, true);
		curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, _DownloadRequest_write_data_handler);
		curl_easy_setopt(curl, CURLOPT_WRITEDATA, this);
		res = curl_easy_perform(curl);
		curl_easy_cleanup(curl);

		if (res == CURLE_OK) {
			CCLOG("download file OK : %s", _url.c_str());
			this->onFinished(DownloadResult::OK);
		}
		else{
			CCLOG("download file network error[%d]: %s", res, _url.c_str());
			remove(_fileName.c_str());
			this->onFinished(DownloadResult::NETWORK_ERROR);
		}
	}
	else{
		CCLOG("init curl error:  %s", _url.c_str());
		this->onFinished(DownloadResult::CURL_ERROR);
	}
}

/****/

HttpFileDownloader::HttpFileDownloader(){

}

HttpFileDownloader::~HttpFileDownloader(){
	this->stop();
}

void HttpFileDownloader::init(){
	std::thread workerThread(&HttpFileDownloader::updateThread, this);
	workerThread.detach();
}

void HttpFileDownloader::stop(){
	std::unique_lock<std::mutex> lk(_request_mutex);
	while (!_request.empty()){
		auto r = _request.front();
		delete r;
		_request.pop();
	}
	_request_condition_variable.notify_all();
}

void HttpFileDownloader::updateThread(){
	do
	{
		auto request = this->takeRequest();
		if (request){
			request->execute();
			delete request;
		}
		else{
			break;
		}
	} while (true);
}

DownloadRequest* HttpFileDownloader::takeRequest(){
	std::unique_lock<std::mutex> lk(_request_mutex);
	if (!_request.empty()){
		auto request = _request.front();
		_request.pop();
		return request;
	}
	_request_condition_variable.wait(lk);
	if (!_request.empty()){
		auto request = _request.front();
		_request.pop();
		return request;
	}
	return 0;
}

void HttpFileDownloader::addRequest(DownloadRequest* request){
	std::unique_lock<std::mutex> lk(_request_mutex);
	_request.push(request);
	_request_condition_variable.notify_one();
}

static HttpFileDownloader* s_HttpFileDownloader = 0;
HttpFileDownloader* HttpFileDownloader::getInstance(){
	if (!s_HttpFileDownloader){
		s_HttpFileDownloader = new HttpFileDownloader();
		s_HttpFileDownloader->init();
	}
	return s_HttpFileDownloader;
}

}