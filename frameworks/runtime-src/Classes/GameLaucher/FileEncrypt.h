/*
 * FileEcrypt.h
 *
 *  Created on: Dec 15, 2015
 *      Author: QuyetNguyen
 */

#ifndef FILE_ENCRYPT_H_
#define FILE_ENCRYPT_H_

#include "cocos2d.h"
USING_NS_CC;

class FileEncrypt{
protected:
	std::vector<char> rawDataEncrypted;
	std::vector<char> mData;
	std::vector<char> mKey;
	std::string filePath;

	virtual void decryptData();
public:
	FileEncrypt();
	virtual ~FileEncrypt();
	virtual void initWithFile();
	virtual void setKey(const char* key);
	virtual void setFilePath(const std::string& filePath);
};

class ImageEncrypt : public FileEncrypt{
public:
	cocos2d::Image* imageData;
	cocos2d::Texture2D* texture;
public:
	ImageEncrypt();
	virtual ~ImageEncrypt();
	virtual void initWithFile();
};

class PlistEncrypt : public FileEncrypt{
public:
	std::string plistContent;
public:
	PlistEncrypt();
	virtual ~PlistEncrypt();
	virtual void initWithFile();
};

typedef std::function < void(const std::string&, const FileEncrypt*) > FileLoadCallback;
typedef std::function < void(FileEncrypt*) > FileLoadFinished;
class FileEncryptUtils{
	std::vector<unsigned char> mKey;
	void loadFileThread(FileEncrypt* file, const FileLoadFinished callback);
public:
	FileEncryptUtils();
	virtual ~FileEncryptUtils();
	void setKey(const char* key);

	void loadImageAsync(const std::string& file, const FileLoadCallback& callback);
	void loadPlistAsync(const std::string& file, const FileLoadCallback& callback);
	void loadFileAsync(const std::string& file, const FileLoadCallback& callback);

	static FileEncryptUtils* getInstance();
};

#endif /* FILE_ENCRYPT_H_ */
