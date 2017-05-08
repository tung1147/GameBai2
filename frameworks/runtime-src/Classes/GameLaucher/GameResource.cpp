/*
 * GameFile.cpp
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#include "GameResource.h"
#include <algorithm>
#include <ostream>
#include <iostream>

#include "cocos2d.h"
#include <curl/curl.h>
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32) || (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
#include <direct.h>
#endif
#include <sys/types.h>
#include <sys/stat.h>
#include "../Plugin/MD5.h"
USING_NS_CC;
//#include "network/HttpClient.h"
#include "GameLaucher.h"
#include <stdio.h>

static std::mutex s_fileUtils_mutex;
static std::string s_getWritablePath = "";

namespace quyetnd {

GameFile::GameFile(const std::string& fileName, const std::string& md5Digest, int fileSize) {
	// TODO Auto-generated constructor stub
	this->fileName = fileName;
	this->md5Digest = md5Digest;
	this->fileSize = fileSize;
	downloadHash = "";
	this->getFullPath(); 
}

GameFile::~GameFile() {
	// TODO Auto-generated destructor stub
}

void GameFile::getFullPath(){
	//s_fileUtils_mutex.lock();
	if (s_getWritablePath == ""){
		s_getWritablePath = FileUtils::getInstance()->getWritablePath();
		CCLOG("s_getWritablePath: %s", s_getWritablePath.c_str());
	}
	fullPath = FileUtils::getInstance()->fullPathForFilename(fileName);
	//s_fileUtils_mutex.unlock();
}

bool GameFile::isExistFile(const std::string& filePath){
	if (filePath == ""){
		return false;
	}

	bool pret = false;
	FILE* f = fopen(filePath.c_str(), "rb");
	if (f){
		pret = true;
		fclose(f);
	}
	return pret;
}

bool GameFile::checkHashFileContent(){
	Data d;
	FileUtils::getInstance()->getContents(fullPath, &d);
	char* mData = (char*)d.getBytes();
	ssize_t fileSize = d.getSize();

	MD5 md5;
	if (mData){
		md5.update(mData, fileSize);	
	}
	md5.finalize();
	std::string md5Str = md5.hexdigest();
	//std::transform(md5Str.begin(), md5Str.end(), md5Str.begin(), ::tolower);
	if (md5Str == md5Digest){
		return true;
	}
	return false;
}

#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
#ifndef FORCE_UPDATE
//#define GAME_FILE_NOT_HASH 1
#endif
#endif

inline bool string_end_with(const std::string &str, const std::string &strend) {
	if (str.length() >= strend.length()) {
		return (0 == str.compare(str.length() - strend.length(), strend.length(), strend));
	} 
	return false;
}

bool GameFile::test(){
#ifdef GAME_FILE_NOT_HASH
	fullPath = "res/Game/" + fileName;
	return true;
#else	
#if CC_TARGET_PLATFORM != CC_PLATFORM_ANDROID
	if (string_end_with(fileName, ".dex")){
		return true;
	}
#endif
	if (!FileUtils::getInstance()->isFileExist(fullPath)){
		fullPath = "";

		CCLOG("Test file not found");
		return false;
	}

	if (checkHashFileContent()){
		return true;
	}
	CCLOG("Test Invalid hash");
	return false;
#endif
}

size_t _GameFile_write_data_handler(void *ptr, size_t size, size_t nmemb, WriteDataHandler* writer) {
    size_t written = fwrite(ptr, size, nmemb, writer->file);
	if (writer->md5){
		writer->md5->update((const char*)ptr, size* nmemb);
	}
    if(writer->handler != nullptr){
        writer->handler((int)(nmemb * size));
    }
    return written;
}

inline std::string _getFileName(const std::string& filePath){
	auto pos =  filePath.find_last_of("/");
	if (pos != std::string::npos){
		std::string fileName = filePath.substr(pos + 1);
		return fileName;
	}
	return filePath;
}

int GameFile::update(const std::string& host, bool zipFileAvailable, UpdateHandler handler){
	//load from url
	std::string url = host + fileName;

	CURL *curl;
	CURLcode res;
	curl = curl_easy_init();
	if (curl != NULL) {
		//_gamefile_create_parent_folder(filePath);
		std::string writePath = s_getWritablePath + "Game/" + fileName;
		size_t n = writePath.find_last_of("/");
		std::string parentFolder = writePath.substr(0, n);

		s_fileUtils_mutex.lock();
		if (!FileUtils::getInstance()->isDirectoryExist(parentFolder)){
			FileUtils::getInstance()->createDirectory(parentFolder);
		}
		s_fileUtils_mutex.unlock();

		FILE *fp;
		std::string zipFilePath = "";
		std::string zipFileName = "";

		if (zipFileAvailable){
			zipFilePath = writePath + ".zip";
			fp = fopen(zipFilePath.c_str(), "wb");

			zipFileName = _getFileName(fileName);
		}
		else{
			fp = fopen(writePath.c_str(), "wb");
		}
		
		if (fp != NULL) {

			MD5 md5;
			WriteDataHandler dataHandler;
			//dataHandler.mHander = CC_CALLBACK_3(GameFile::writeData, this, fp);
            dataHandler.file = fp;
			dataHandler.handler = handler;
			if (zipFileAvailable){
				dataHandler.md5 = 0;
				std::string str = url + ".zip";
				curl_easy_setopt(curl, CURLOPT_URL, str.c_str());
			}
			else{
				dataHandler.md5 = &md5;
				curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
			}		
			curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, true);
			curl_easy_setopt(curl, CURLOPT_AUTOREFERER, true);
			curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 10);
			curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 120);
			curl_easy_setopt(curl, CURLOPT_TIMEOUT, 120);
			curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, false);
			curl_easy_setopt(curl, CURLOPT_FRESH_CONNECT, true);
			curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, _GameFile_write_data_handler);
			curl_easy_setopt(curl, CURLOPT_WRITEDATA, &dataHandler);
			res = curl_easy_perform(curl);
			curl_easy_cleanup(curl);

			fclose(fp);
			if (res == CURLE_OK) {
				if (zipFileAvailable){
					ssize_t dataSize = 0;
					CCLOG("unzip: %s", zipFilePath.c_str());
					unsigned char* data = FileUtils::getInstance()->getFileDataFromZip(zipFilePath, zipFileName, &dataSize);
					if (data && dataSize > 0){
						FILE* file = fopen(writePath.c_str(), "wb");
						fwrite(data, 1, dataSize, file);
						fclose(file);

						md5.update((const char*)data, dataSize);
					}
					remove(zipFilePath.c_str());
				} 

				md5.finalize();

				if (md5Digest == ""){
					CCLOG("download file OK [no check hash]: %s", url.c_str());
					return 0;
				}
				else{
					auto md5Str = md5.hexdigest();
					std::transform(md5Str.begin(), md5Str.end(), md5Str.begin(), ::tolower);
					if (md5Str == md5Digest){
						CCLOG("download file OK : %s", url.c_str());
						return 0;
					}
					else{
						CCLOG("download file invalid hash: %s -> delete file", url.c_str());
						remove(fileName.c_str());
						return 1;
					}
				}			
			}
			else{
				CCLOG("download file network error[%d]: %s", res, url.c_str());
				remove(fileName.c_str());
				return 2;
			}		
			
		}
		else{
			CCLOG("download file cannot create file:  %s", url.c_str());
			return 3;
		}
	}
	return 4;
}

} /* namespace quyetnd */
