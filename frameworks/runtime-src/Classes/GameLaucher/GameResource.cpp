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
#include <fstream>
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

namespace quyetnd {

GameFile::GameFile() {
	// TODO Auto-generated constructor stub
	fileName = "";
	filePath = "";
	md5Digest = "";
}

GameFile::~GameFile() {
	// TODO Auto-generated destructor stub
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

bool GameFile::checkHashFile(){
	bool pret = false;

	ssize_t fileSize = 0;
	unsigned char* mData = FileUtils::getInstance()->getFileData(filePath, "rb", &fileSize);
	if (mData){
		MD5 md5;
		md5.update(mData, fileSize);
		md5.finalize();
		std::string md5Str = md5.hexdigest();
		std::transform(md5Str.begin(), md5Str.end(), md5Str.begin(), ::tolower);
		std::transform(md5Digest.begin(), md5Digest.end(), md5Digest.begin(), ::tolower);
		if (md5Str == md5Digest){
			pret = true;
		}
		delete[] mData;
		return pret;
	}
	return false;
}

#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
#define GAME_FILE_NOT_HASH 1
#endif

bool GameFile::test(){
#ifdef GAME_FILE_NOT_HASH
	filePath = "res/Game/" + fileName;
	return true;
#else	
	filePath = FileUtils::getInstance()->getWritablePath() + "Game/" + fileName;
//	filePath = FileUtils::getInstance()->fullPathForFilename(filePath);
	if (!isExistFile(filePath)){
		filePath = "res/Game/" + fileName;
		if (!FileUtils::getInstance()->isFileExist(filePath)){
			filePath = "";
		}
	}
	
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
	filePath = FileUtils::getInstance()->getWritablePath() + "Game/" + fileName;
	return false;
#endif
}

size_t _GameFile_write_data(void *ptr, size_t size, size_t nmemb, FILE *stream) {
	size_t written = fwrite(ptr, size, nmemb, stream);
	GameLaucher::getInstance()->onUpdateDownloadProcess((int)(nmemb * size));
	return written;
}

void _gamefile_create_folder_tree(const std::string& filePath){
	//create parent
	size_t n = filePath.find_last_of("/");
	std::string parentFolder = filePath.substr(0, n);
	
	//create folder
	struct stat info;
	bool _parent = false;
	if (stat(parentFolder.c_str(), &info) != 0){
		_parent = false;
	}
	else if (info.st_mode & S_IFDIR){  // S_ISDIR() doesn't exist on my windows
		_parent = true;
	}
	else{
		_parent = false;
	}
	if (!_parent){
		_gamefile_create_folder_tree(parentFolder);
	}

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32) || (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
	_mkdir(filePath.c_str());
#else
	mkdir(filePath.c_str(), 0770);
#endif
}

void _gamefile_create_parent_folder(const std::string& filePath){
	size_t n = filePath.find_last_of("/");
	std::string parentFolder = filePath.substr(0, n);

	struct stat info;
	bool folderExist = false;

	if (stat(parentFolder.c_str(), &info) != 0){
		folderExist = false;
	}
	else if (info.st_mode & S_IFDIR){  // S_ISDIR() doesn't exist on my windows
		folderExist = true;
	}
	else{
		folderExist = false;
	}

	if (!folderExist){		
		_gamefile_create_folder_tree(parentFolder);
	}
}

int GameFile::update(const std::string& url){
	//load from url
	CURL *curl;
	CURLcode res;
	auto root = FileUtils::getInstance()->getWritablePath();
	curl = curl_easy_init();

	int pret = 0;
	if (curl != NULL) {
		_gamefile_create_parent_folder(filePath);

		FILE *fp;
		fp = fopen(filePath.c_str(), "wb");
		if (fp != NULL) {
			curl_easy_setopt(curl, CURLOPT_URL, url.c_str());			
			curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, true);
			curl_easy_setopt(curl, CURLOPT_AUTOREFERER, true);
			curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 10);
			curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 120);
			curl_easy_setopt(curl, CURLOPT_TIMEOUT, 120);
			curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, true);
			curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, _GameFile_write_data);
			curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);
			res = curl_easy_perform(curl);
			curl_easy_cleanup(curl);
			if (res == CURLE_OK) {
				fclose(fp);
				if (this->checkHashFile()){
					CCLOG("download file OK : %s", url.c_str());
					return 0; 
				}
				else{
					CCLOG("download file invalid hash: %s", url.c_str());
					return 1;
				}
			}
			else{
				CCLOG("download file network error[%d]: %s", res, url.c_str());
				fclose(fp);
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
