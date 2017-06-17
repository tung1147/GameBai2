/*
 * GameFile.cpp
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#include "GameResource.h"
#include "cocos2d.h"
USING_NS_CC;
#include <algorithm>
#include <ostream>
#include <iostream>
#include "../Plugin/MD5.h"
#include "network/HttpClient.h"
#include "GameLaucher.h"
#include <stdio.h>
#include "EngineUtilsThreadSafe.h"
#include "../Plugin/HttpFileDownloader.h"

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

void GameFile::update(const std::string url, UpdateHandler processHandler, UpdateHandler finishedCallback){
	auto request = new quyetnd::DownloadRequest(url, filePath);

	MD5* md5 = 0;
	if (!md5Digest.empty()){
		md5 = new MD5();
	}

	request->processCallback = [=](unsigned char* data, size_t size){
		if (md5){
			md5->update(data, size);
		}
		if (processHandler){
			processHandler(size);
		}
	};

	request->finishedCallback = [=](int returnCode){
		if (returnCode == 0 && md5){
			md5->finalize();
			auto md5Str = md5->hexdigest();
			std::transform(md5Str.begin(), md5Str.end(), md5Str.begin(), ::tolower);
			if (md5Str != md5Digest){
				CCLOG("download file invalid hash: %s", this->fileName.c_str());
				returnCode = -1;
			}
		}

		if (md5){
			delete md5;
		}

		//if (finishedCallback){
		//	finishedCallback(returnCode);
		//}

		if (returnCode == DownloadResult::NETWORK_ERROR){		
			this->update(url, processHandler, finishedCallback);

			//Director::getInstance()->getScheduler()->performFunctionInCocosThread([=](){
			//	//log("retry: %s", url.c_str());
			//	Director::getInstance()->getScheduler()->schedule([=](float){
			//		Director::getInstance()->getScheduler()->unschedule("_update_res", this);				
			//	}, this, 1.0, false, "_update_res");
			//});
		}
		else{
			if (finishedCallback){
				finishedCallback(returnCode);
			}
		}
	};

	quyetnd::HttpFileDownloader::getInstance()->addRequest(request);
}

} /* namespace quyetnd */
