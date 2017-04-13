/*
 * ResourcesDownloader.cpp
 *
 *  Created on: Mar 23, 2016
 *      Author: Quyet Nguyen
 */

#include "ResourcesDownloader.h"
#include "MD5.h"
#include <curl/curl.h>

#define RESOURCES_CACHE_DIR "res_cache/"

namespace quyetnd{

Resources::Resources(){
	_url = "";
	_cacheFileName = "";
	_isLoading = false;
	_isSucess = false;
	_isCache = true;
}

Resources::~Resources(){

}

void Resources::onLoadResourcePreFinished(){

}

void Resources::onLoadResourceFinished(){
	if (_buffer.size() > 0){
		_isSucess = true;
	}
	else{
		_isSucess = false;
	}
}

void Resources::invokeCallback(){
	_isLoading = false;
	for (int i = 0; i < _s_callback.size(); i++){
		_s_callback[i](this);
	}
	_s_callback.clear();
}

void Resources::setUrl(const std::string& url){
	this->_url = url;
	_cacheFileName = ResourcesDownloader::getInstance()->getCacheDir() +  string_to_md5(url);
}

void Resources::addData(unsigned char* data, int size){
	_buffer.insert(_buffer.end(), data, data + size);
}

void Resources::loadFromCache(){
	Data d = FileUtils::getInstance()->getDataFromFile(_cacheFileName);
	if (!d.isNull()){
		_buffer.assign(d.getBytes(), d.getBytes() + d.getSize());
	}
	else{
		FileUtils::getInstance()->removeFile(_cacheFileName);
	}

	this->onLoadResourcePreFinished();
	Director::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
		this->onLoadResourceFinished();
		this->invokeCallback();
	});
}

size_t _Resources_Downloader_write_data_handler(void *ptr, size_t size, size_t nmemb, ResourcesDownload* writer) {
	size_t ret = (size * nmemb);
	if (writer->file){
		ret = fwrite(ptr, size, nmemb, writer->file);
	}
	writer->resources->addData((unsigned char*)ptr, size * nmemb);
	return 	ret;
}

void Resources::loadFromUrl(){
	_buffer.clear();

	CURL *curl;
	CURLcode res;
	curl = curl_easy_init();
	if (curl != NULL) {
		FILE *fp = NULL;
		if (this->_isCache){
			fp = fopen(_cacheFileName.c_str(), "wb");
		}
		
		ResourcesDownload writeData;
		writeData.file = fp;
		writeData.resources = this;

		curl_easy_setopt(curl, CURLOPT_URL, _url.c_str());
		curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, true);
		curl_easy_setopt(curl, CURLOPT_AUTOREFERER, true);
		curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 10);
		curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 120);
		curl_easy_setopt(curl, CURLOPT_TIMEOUT, 120);
		curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, true);
		curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, _Resources_Downloader_write_data_handler);
		curl_easy_setopt(curl, CURLOPT_WRITEDATA, &writeData);
		res = curl_easy_perform(curl);
		curl_easy_cleanup(curl);

		if (fp){
			fclose(fp);
		}	
		if (res != CURLE_OK) {
			_buffer.clear();
		}

		if (_buffer.size() == 0){
			remove(_cacheFileName.c_str());
		}
	}

	//finished
	this->onLoadResourcePreFinished();
	Director::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
		this->onLoadResourceFinished();
		this->invokeCallback();
	});
}

void Resources::loadResources(){
	_isLoading = true;
	if (_isCache){
		if (FileUtils::getInstance()->isFileExist(_cacheFileName)){
			std::thread loadThread(&Resources::loadFromCache, this);
			loadThread.detach();
		}
		else{
			std::thread loadThread(&Resources::loadFromUrl, this);
			loadThread.detach();
		}
	}
	else{
		std::thread loadThread(&Resources::loadFromUrl, this);
		loadThread.detach();
	}
}

void Resources::load( const DownloadCallback& callback){
	if (_isSucess){
		if (callback){
			callback(this);
		}
		return;
	}
	else{
		_s_callback.push_back(callback);
		if (!_isLoading){	
			this->loadResources();
		}
	}
	
}

/****/
ResourcesTexture::ResourcesTexture(){
	image = 0;
	texture = 0;
}

ResourcesTexture::~ResourcesTexture(){
	if (image){
		image->release();
		image = 0;
	}
}

void ResourcesTexture::onLoadResourcePreFinished(){
	if (_buffer.size() > 0){
		image = new Image();
		bool b = image->initWithImageData(_buffer.data(), _buffer.size());
		if (!b){
			_buffer.clear();
			image->release();
			image = 0;
			remove(_cacheFileName.c_str());
		}
	}
}

void ResourcesTexture::onLoadResourceFinished(){
	if (image){
		_isSucess = true;
		texture = Director::getInstance()->getTextureCache()->addImage(image, _cacheFileName);
	}
	else{	
		_isSucess = false;
	}
}

/***/
static ResourcesDownloader* s_ResourcesDownloader = 0;
ResourcesDownloader* ResourcesDownloader::getInstance(){
	if (!s_ResourcesDownloader){
		s_ResourcesDownloader = new ResourcesDownloader();
		s_ResourcesDownloader->init();
	}
	return s_ResourcesDownloader;
}

ResourcesDownloader::ResourcesDownloader(){
	_cacheDir = "";
}

ResourcesDownloader::~ResourcesDownloader(){

}

void ResourcesDownloader::init(){
	_cacheDir = FileUtils::getInstance()->getWritablePath() + RESOURCES_CACHE_DIR;
	if (!FileUtils::getInstance()->isDirectoryExist(_cacheDir)){
		FileUtils::getInstance()->createDirectory(_cacheDir);
	}
}

const std::string& ResourcesDownloader::getCacheDir(){
	return _cacheDir;
}

Resources* ResourcesDownloader::createResourcesWithType(int resType){
	if (resType == ResourcesType::kResourcesTypeTexture){
		return new ResourcesTexture();
	}
	return new Resources();
}

void ResourcesDownloader::loadResources(const std::string& url, int resType, const DownloadCallback &callback, bool isCache){
	auto it = _resources.find(url);
	if (it != _resources.end()){		
		if (callback != nullptr){
			it->second->load(callback);
		}
	}
	else{
		auto res = this->createResourcesWithType(resType);
		res->_isCache = isCache;
		_resources.insert(std::make_pair(url, res));
		res->setUrl(url);
		res->load(callback);
	}
}

void ResourcesDownloader::loadTexture(const std::string& url, std::function<void(cocos2d::Texture2D*)> _callback, bool isCache){
	this->loadResources(url, ResourcesType::kResourcesTypeTexture, [=](Resources* res){
		ResourcesTexture* resTex = (ResourcesTexture*)res;
		_callback(resTex->texture);
	}, isCache);
}

}