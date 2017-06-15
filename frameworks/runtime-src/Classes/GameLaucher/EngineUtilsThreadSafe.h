/*
 * EngineUtilsThreadSafe.h
 *
 *  Created on: Dec 15, 2015
 *      Author: QuyetNguyen
 */

#ifndef GAMELAUCHER_FilesUtilThreadSafe_H_
#define GAMELAUCHER_FilesUtilThreadSafe_H_

#include "cocos2d.h"

class EngineUtilsThreadSafe{
	std::mutex s_filesUtils_mutex;
	std::mutex s_textureCache_mutex;
public:
	EngineUtilsThreadSafe();
	virtual ~EngineUtilsThreadSafe();

	cocos2d::Data getFileData(const std::string& filePath);
	cocos2d::Data getRawFileData(const std::string& filePath);
	std::string fullPathForFilename(const std::string& filePath);
	bool isDirectoryExist(const std::string& dirPath); 
	bool createDirectory(const std::string& dirPath);
	std::string getWritablePath();
	bool isFileExist(const std::string& filePath);

	cocos2d::Texture2D* getTextureForKey(const std::string& key);
	
	static EngineUtilsThreadSafe* getInstance();
};


#endif /* GAMELAUCHER_FilesUtilThreadSafe_H_ */
