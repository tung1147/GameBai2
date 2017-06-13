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
#include "network/HttpClient.h"
#include "GameLaucher.h"
#include <stdio.h>
#include "EngineUtilsThreadSafe.h"

namespace quyetnd {

GameFile::GameFile() {
	// TODO Auto-generated constructor stub
	fileName = "";
	filePath = "";
	md5Digest = "";
	downloadHash = "";
}

GameFile::~GameFile() {
	// TODO Auto-generated destructor stub
}

bool GameFile::checkHashFile(){
	Data d = EngineUtilsThreadSafe::getInstance()->getRawFileData(filePath);
	if (!d.isNull()){
		MD5 md5;
		md5.update(d.getBytes(), d.getSize());
		md5.finalize();
		std::string md5Str = md5.hexdigest();
		if (md5Str == md5Digest){
			return true;
		}
	}
	return false;
}

#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
//#define GAME_FILE_NOT_HASH 1
#endif

inline bool string_end_with(const std::string &str, const std::string &strend) {
	if (str.length() >= strend.length()) {
		return (0 == str.compare(str.length() - strend.length(), strend.length(), strend));
	} 
	return false;
}

bool GameFile::test(){
#ifdef GAME_FILE_NOT_HASH
	filePath = "res/Game/" + fileName;
	return true;
#else	
	filePath = EngineUtilsThreadSafe::getInstance()->fullPathForFilename(fileName);
	if (filePath != ""){
		bool b = checkHashFile();
		if (b){
			return true;
		}
		else{
			CCLOG("Test Invalid hash");
		}
	}
	else{
		CCLOG("Test file not found");
	}
	//failure	
	filePath = EngineUtilsThreadSafe::getInstance()->getWritablePath() + "Game/" + fileName;
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

int GameFile::update(const std::string& url, UpdateHandler handler){
	//load from url
	CURL *curl;
	CURLcode res;
	curl = curl_easy_init();
	if (curl != NULL) {
		//_gamefile_create_parent_folder(filePath);
		size_t n = filePath.find_last_of("/");
		std::string parentFolder = filePath.substr(0, n);
		if (!EngineUtilsThreadSafe::getInstance()->isDirectoryExist(parentFolder)){
			EngineUtilsThreadSafe::getInstance()->createDirectory(parentFolder);
		}

		FILE *fp;
		std::string zipFilePath = "";
		std::string zipFileName = "";
		fp = fopen(filePath.c_str(), "wb");
		
		if (fp != NULL) {

			MD5 md5;
			WriteDataHandler dataHandler;
			//dataHandler.mHander = CC_CALLBACK_3(GameFile::writeData, this, fp);
            dataHandler.file = fp;
			dataHandler.handler = handler;
			dataHandler.md5 = &md5;
			curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
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
						remove(filePath.c_str());
						return 1;
					}
				}			
			}
			else{
				CCLOG("download file network error[%d]: %s", res, url.c_str());
				remove(filePath.c_str());
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
