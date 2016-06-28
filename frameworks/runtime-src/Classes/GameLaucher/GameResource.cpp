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

	ssize_t fileSize;
	FILE* file = fopen(filePath.c_str(), "rb");
	fseek(file, 0, SEEK_END);
	fileSize = ftell(file);
	fseek(file, 0, SEEK_SET);
	char* data = new char[fileSize + 1];
	fread(data, 1, fileSize, file);
	fclose(file);
	
	MD5 md5;
	md5.update(data, fileSize);
	md5.finalize();
	std::string md5Str = md5.hexdigest();
	std::transform(md5Str.begin(), md5Str.end(), md5Str.begin(), ::tolower);
	std::transform(md5Digest.begin(), md5Digest.end(), md5Digest.begin(), ::tolower);
	if (md5Str == md5Digest){
		pret = true;
	}
	delete[] data;
	return pret;
}

#define GAME_FILE_NOT_HASH 1
bool GameFile::test(){
#ifdef GAME_FILE_NOT_HASH
	filePath = filePath = FileUtils::getInstance()->fullPathForFilename(fileName);
	return true;
#else	
	filePath = filePath = FileUtils::getInstance()->fullPathForFilename(fileName);
	if (filePath != ""){
		bool b = checkHashFile();
		if (b){
			return true;
		}
	}
	//failure
	filePath = FileUtils::getInstance()->getWritablePath() + "Game/" + fileName;
	return false;
#endif

	//filePath = FileUtils::getInstance()->getWritablePath() + "Game/" + fileName;
	//return false;
}

size_t _GameFile_write_data(void *ptr, size_t size, size_t nmemb, FILE *stream) {
	size_t written = fwrite(ptr, size, nmemb, stream);
	return written;
}

void _gamefile_create_parant_folder(const std::string& filePath){
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
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32) || (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
		_mkdir(parentFolder.c_str());
#else
		mkdir(parentFolder.c_str(), 0770);
#endif

	}
}

int GameFile::update(const std::string& url){
	//load from url
	CURL *curl;
	CURLcode res;
	auto root = FileUtils::getInstance()->getWritablePath();
	curl = curl_easy_init();
	if (curl != NULL) {
		_gamefile_create_parant_folder(filePath);

		FILE *fp;
		fp = fopen(filePath.c_str(), "wb+");
		if (fp != NULL) {
			curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
			curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, _GameFile_write_data);
			curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);
			res = curl_easy_perform(curl);
			curl_easy_cleanup(curl);
			if (res == CURLE_OK) {
				if (this->test()){
					fclose(fp);
					return 0;
				}
				else{
					CCLOG("download file invalid hash: %s", url.c_str());
					return 1;
				}
			}
			else{
				CCLOG("download file network error[%d]: %s", res, url.c_str());
				return 2;
			}

			fclose(fp);
		}
	}
	return 3;
}

} /* namespace quyetnd */
