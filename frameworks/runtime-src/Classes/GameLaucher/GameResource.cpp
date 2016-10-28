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
#include <stdio.h>

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

#define HASH_BUFFER_SIZE 1024
static char *s_hashBuffer = 0;
bool GameFile::checkHashFile(){
	std::string fullPath = FileUtils::getInstance()->fullPathForFilename(filePath);
	FILE *file = fopen(fullPath.c_str(), "rb");
	if (file){
		if (!s_hashBuffer){
			s_hashBuffer = new char[HASH_BUFFER_SIZE];
		}
		MD5 md5;
		size_t n;
		bool pret = false;
		while (true){
			n = fread(s_hashBuffer, 1, HASH_BUFFER_SIZE, file);
			if (n > 0){
				md5.update(s_hashBuffer, n);
			}
			else{
				break;
			}
		}
		md5.finalize();
		std::string md5Str = md5.hexdigest();
		std::transform(md5Str.begin(), md5Str.end(), md5Str.begin(), ::tolower);
		if (md5Str == md5Digest){
			pret = true;
		}
		fclose(file);
		return pret;
	}
	return checkHashFileContent();
}

bool GameFile::checkHashFileContent(){
	Data d;
	FileUtils::getInstance()->getContents(filePath, &d);
	char* mData = (char*)d.getBytes();
	ssize_t fileSize = d.getSize();

	MD5 md5;
	if (mData){
		md5.update(mData, fileSize);	
	}
	md5.finalize();
	std::string md5Str = md5.hexdigest();
	std::transform(md5Str.begin(), md5Str.end(), md5Str.begin(), ::tolower);
	if (md5Str == md5Digest){
		return true;
	}
	return false;
}

#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
#define GAME_FILE_NOT_HASH 1
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
#if CC_TARGET_PLATFORM != CC_PLATFORM_ANDROID
	if (string_end_with(fileName, ".dex")){
		return true;
	}
#endif
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

//inline void _gamefile_create_folder_tree(const std::string& filePath){
//	//create parent
//	size_t n = filePath.find_last_of("/");
//	std::string parentFolder = filePath.substr(0, n);
//	
//	//create folder
//	struct stat info;
//	bool _parent = false;
//	if (stat(parentFolder.c_str(), &info) != 0){
//		_parent = false;
//	}
//	else if (info.st_mode & S_IFDIR){  // S_ISDIR() doesn't exist on my windows
//		_parent = true;
//	}
//	else{
//		_parent = false;
//	}
//	if (!_parent){
//		_gamefile_create_folder_tree(parentFolder);
//	}
//
//#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32) || (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
//	_mkdir(filePath.c_str());
//#else
//	mkdir(filePath.c_str(), 0770);
//#endif
//}
//
//inline void _gamefile_create_parent_folder(const std::string& filePath){
//	size_t n = filePath.find_last_of("/");
//	std::string parentFolder = filePath.substr(0, n);
//
//	struct stat info;
//	bool folderExist = false;
//
//	if (stat(parentFolder.c_str(), &info) != 0){
//		folderExist = false;
//	}
//	else if (info.st_mode & S_IFDIR){  // S_ISDIR() doesn't exist on my windows
//		folderExist = true;
//	}
//	else{
//		folderExist = false;
//	}
//
//	if (!folderExist){		
//		_gamefile_create_folder_tree(parentFolder);
//	}
//}

size_t _GameFile_write_data_handler(void *ptr, size_t size, size_t nmemb, WriteDataHandler* writer) {
    size_t written = fwrite(ptr, size, nmemb, writer->file);
	writer->md5->update((const char*)ptr, size* nmemb);
    if(writer->handler != nullptr){
        writer->handler((int)(nmemb * size));
    }
    return written;
}

//size_t _GameFile_write_data(void *ptr, size_t size, size_t nmemb, FILE *fp) {
//	size_t written = fwrite(ptr, size, nmemb, fp);
//	return written;
//}
//
//size_t GameFile::writeData(void *ptr, size_t size, size_t nmemb, FILE *fp){
//	size_t written = fwrite(ptr, size, nmemb, fp);
//	GameLaucher::getInstance()->onUpdateDownloadProcess((int)(nmemb * size));
//	return written;
//}

int GameFile::update(const std::string& url, UpdateHandler handler){
	//load from url
	CURL *curl;
	CURLcode res;
	curl = curl_easy_init();
	if (curl != NULL) {
		//_gamefile_create_parent_folder(filePath);
		size_t n = filePath.find_last_of("/");
		std::string parentFolder = filePath.substr(0, n);
		if (!FileUtils::getInstance()->isDirectoryExist(parentFolder)){
			FileUtils::getInstance()->createDirectory(parentFolder);
		}

		FILE *fp;
		fp = fopen(filePath.c_str(), "wb");
		if (fp != NULL) {

			MD5 md5;
			WriteDataHandler dataHandler;
			//dataHandler.mHander = CC_CALLBACK_3(GameFile::writeData, this, fp);
            dataHandler.file = fp;
			dataHandler.md5 = &md5;
            dataHandler.handler = handler;

			curl_easy_setopt(curl, CURLOPT_URL, url.c_str());			
			curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, true);
			curl_easy_setopt(curl, CURLOPT_AUTOREFERER, true);
			curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 10);
			curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 120);
			curl_easy_setopt(curl, CURLOPT_TIMEOUT, 120);
			curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, true);
			curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, _GameFile_write_data_handler);
			curl_easy_setopt(curl, CURLOPT_WRITEDATA, &dataHandler);
			res = curl_easy_perform(curl);
			curl_easy_cleanup(curl);

			fclose(fp);
			if (res == CURLE_OK) {
				md5.finalize();
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

//int GameFile::updateNoHandler(const std::string& url){
//	//load from url
//	CURL *curl;
//	CURLcode res;
//	auto root = FileUtils::getInstance()->getWritablePath();
//	curl = curl_easy_init();
//
//	int pret = 0;
//	if (curl != NULL) {
//		_gamefile_create_parent_folder(filePath);
//
//		FILE *fp;
//		fp = fopen(filePath.c_str(), "wb");
//		if (fp != NULL) {
//			curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
//			curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, true);
//			curl_easy_setopt(curl, CURLOPT_AUTOREFERER, true);
//			curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 10);
//			curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 120);
//			curl_easy_setopt(curl, CURLOPT_TIMEOUT, 120);
//			curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, true);
//			curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, _GameFile_write_data);
//			curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);
//			res = curl_easy_perform(curl);
//			curl_easy_cleanup(curl);
//			if (res == CURLE_OK) {
//				fclose(fp);				
//				if (this->test()){ 
//					CCLOG("download file OK : %s", url.c_str());
//					return 0;
//				}
//				else{
//					CCLOG("download file invalid hash: %s -> delete file", url.c_str());
//					remove(filePath.c_str());
//					return 1;
//				}
//			}
//			else{
//				CCLOG("download file network error[%d]: %s", res, url.c_str());
//				fclose(fp);
//				return 2;
//			}
//
//		}
//		else{
//			CCLOG("download file cannot create file:  %s", url.c_str());
//			return 3;
//		}
//	}
//	return 4;
//}

} /* namespace quyetnd */
