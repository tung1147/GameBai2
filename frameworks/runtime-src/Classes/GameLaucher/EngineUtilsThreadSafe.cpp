/*
 * EngineUtilsThreadSafe.cpp
 *
 *  Created on: Dec 15, 2015
 *      Author: QuyetNguyen
 */

#include "EngineUtilsThreadSafe.h"
#include "platform/decryptor/Decryptor.h"
USING_NS_CC;

EngineUtilsThreadSafe::EngineUtilsThreadSafe(){

}

EngineUtilsThreadSafe::~EngineUtilsThreadSafe(){

}

std::string EngineUtilsThreadSafe::fullPathForFilename(const std::string& filePath){
	std::unique_lock<std::mutex> lk(s_filesUtils_mutex);
	return FileUtils::getInstance()->fullPathForFilename(filePath);
}

bool EngineUtilsThreadSafe::isDirectoryExist(const std::string& dirPath){
	std::unique_lock<std::mutex> lk(s_filesUtils_mutex);
	return FileUtils::getInstance()->isDirectoryExist(dirPath);
}

bool EngineUtilsThreadSafe::createDirectory(const std::string& dirPath){
	std::unique_lock<std::mutex> lk(s_filesUtils_mutex);
	return FileUtils::getInstance()->createDirectory(dirPath);
}

std::string EngineUtilsThreadSafe::getWritablePath(){
	std::unique_lock<std::mutex> lk(s_filesUtils_mutex);
	return FileUtils::getInstance()->getWritablePath();
}

bool EngineUtilsThreadSafe::isFileExist(const std::string& filePath){
	std::unique_lock<std::mutex> lk(s_filesUtils_mutex);
	return FileUtils::getInstance()->isFileExist(filePath);
}

cocos2d::Data EngineUtilsThreadSafe::getFileData(const std::string& filePath){
	cocos2d::Data d = this->getRawFileData(filePath);
	if (!d.isNull()){
		bool b = decryptor::Decryptor::getInstance()->isDataEncrypted((char*)d.getBytes(), d.getSize());
		if (b){
			std::vector<char> outBuffer;
			decryptor::Decryptor::getInstance()->decyrpt(outBuffer, (char*)d.getBytes(), d.getSize());
			d.copy((const unsigned char*)outBuffer.data(), outBuffer.size());
		}
	}
	return d;
}

cocos2d::Data EngineUtilsThreadSafe::getRawFileData(const std::string& filePath){
	cocos2d::Data retData;
	std::string fullPath = this->fullPathForFilename(filePath);
	if (!fullPath.empty()){
		FILE* pFile = fopen(fullPath.c_str(), "rb");
		if (pFile){
			/*read file by self*/

			fseek(pFile, 0, SEEK_END);
			long lSize = ftell(pFile);
			rewind(pFile);

			unsigned char* buffer = new unsigned char[lSize];
			auto ret = fread(buffer, 1, lSize, pFile);

			if (ret != lSize){
				delete[] buffer;
				fclose(pFile);
				CCLOG("ERROR READ FILE: %s", fullPath.c_str());
				return retData;
			}
			retData.clear();
			retData.fastSet(buffer, lSize);

			fclose(pFile);
		}
		else{
			//read file by engine
			s_filesUtils_mutex.lock();
			FileUtils::getInstance()->getContents(fullPath, &retData);
			s_filesUtils_mutex.unlock();
		}
	}
	return retData;
}

/****/

cocos2d::Texture2D* EngineUtilsThreadSafe::getTextureForKey(const std::string& key){
	std::unique_lock<std::mutex> lk(s_textureCache_mutex);
	return cocos2d::TextureCache::getInstance()->getTextureForKey(key);
}

static EngineUtilsThreadSafe* s_FilesUtilsThreadSafe = 0;
EngineUtilsThreadSafe* EngineUtilsThreadSafe::getInstance(){
	if (!s_FilesUtilsThreadSafe){
		s_FilesUtilsThreadSafe = new EngineUtilsThreadSafe();
	}
	return s_FilesUtilsThreadSafe;
}