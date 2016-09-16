/*
 * FileEcrypt.cpp
 *
 *  Created on: Dec 15, 2015
 *      Author: QuyetNguyen
 */

#include "FileEncrypt.h"
#include "GameLaucher.h"
#include "../Plugin/crypt_aes.h"
#include "../Plugin/MD5.h"

#define FILE_AES_KEY_SIZE_BIT 128
#define FILE_AES_KEY_SIZE_BYTE 16

static std::string s_EncryptSignature = "EncryptedByQuyetND";

FileEncrypt::FileEncrypt(){
	filePath = "";
}

FileEncrypt::~FileEncrypt(){
	
}

void FileEncrypt::initWithFile(){
	std::string fullpath = FileUtils::getInstance()->fullPathForFilename(filePath);
	Data data = FileUtils::getInstance()->getDataFromFile(fullpath);
	if (!data.isNull()){
		char* buffer = (char*)data.getBytes();
		int size = data.getSize();
		rawDataEncrypted.assign(buffer, buffer+size);
		this->decryptData();
	}
}

void FileEncrypt::setKey(const char* key){
	mKey.assign(key, key + FILE_AES_KEY_SIZE_BYTE);
}

void FileEncrypt::setFilePath(const std::string& filePath){
	this->filePath = filePath;
}

#include <sstream>
bool FileEncrypt::isDecrypted(){
	int dataSize = rawDataEncrypted.size();
	const char* data = rawDataEncrypted.data();

	if (dataSize <= 16){
		return false;
	}

	if (dataSize % 16){
		return false;
	}

	std::vector<unsigned char> salt = { 0x2c, 0x32, 0xc3, 0xfe, 0x2c, 0xd9, 0x37, 0xf0, 0x74, 0x38, 0xe5, 0xda, 0xed, 0xc0, 0x72, 0x99 };

	int blockCount = (dataSize - 16) / 16;

	std::vector<char> vectorTemp(salt.begin(), salt.end());
	vectorTemp.insert(vectorTemp.end(), mKey.begin(), mKey.end());
	vectorTemp.insert(vectorTemp.end(), (char*)(&blockCount), ((char*)(&blockCount)) + 4);
	MD5* md5 = new MD5();
	md5->update(vectorTemp.data(), vectorTemp.size());
	md5->finalize();
	char signatureBuffer[16];
	memcpy(signatureBuffer, md5->getDigest(), 16);
	delete md5;

	for (int i = 0; i < 16; i++){
		if (data[i] != signatureBuffer[i]){
			return false;
		}
	}

	return true;
}

void FileEncrypt::decryptData(){
	std::string fileSignature(rawDataEncrypted.begin(), rawDataEncrypted.begin() + s_EncryptSignature.size());
	if (isDecrypted()){
		CCLOG("file ecnrypted");

		std::vector<char> retData;
		std::vector<char> vectorTemp;
	
		//
		std::vector<unsigned char> salt = { 0x2c, 0x32, 0xc3, 0xfe, 0x2c, 0xd9, 0x37, 0xf0, 0x74, 0x38, 0xe5, 0xda, 0xed, 0xc0, 0x72, 0x99 };

		//read signature
		std::vector<char> signature(rawDataEncrypted.begin(), rawDataEncrypted.begin() + 16);

		//create iv
		vectorTemp.clear();
		vectorTemp.assign(signature.begin(), signature.end());
		vectorTemp.insert(vectorTemp.end(), salt.begin(), salt.end());
		vectorTemp.insert(vectorTemp.end(), mKey.begin(), mKey.end());
		MD5* md5 = new MD5();
		md5->update(vectorTemp.data(), vectorTemp.size());
		md5->finalize();
		uint8_t ivBuffer[16];
		memcpy(ivBuffer, md5->getDigest(), 16);
		delete md5;

		//create aes_key
		vectorTemp.clear();
		vectorTemp.insert(vectorTemp.end(), ivBuffer, ivBuffer + 16);
		vectorTemp.insert(vectorTemp.end(), mKey.begin(), mKey.end());
		vectorTemp.insert(vectorTemp.end(), salt.begin(), salt.end());	
		md5 = new MD5();
		md5->update(vectorTemp.data(), vectorTemp.size());
		md5->finalize();
		uint8_t keyBuffer[16];
		memcpy(keyBuffer, md5->getDigest(), 16);
		delete md5;

		//decrypt
		int encyrptSize = rawDataEncrypted.size() - 16;
		int blockSize = encyrptSize / FILE_AES_KEY_SIZE_BYTE;
		aes_ks_t secretKey;
		aes_setks_decrypt(keyBuffer, FILE_AES_KEY_SIZE_BIT, &secretKey);
		uint8_t* outputBuffer = new uint8_t[encyrptSize];
		aes_cbc_decrypt((const uint8_t*)(rawDataEncrypted.data() + 16), outputBuffer, ivBuffer, blockSize, &secretKey);

		//remove padding
		uint8_t lastByte = outputBuffer[encyrptSize - 1];
		int flag = 1;
		for (int i = encyrptSize - 2; i >= 0; i--){
			if (outputBuffer[i] == lastByte){
				flag++;
			}
			else{
				break;
			}
		}
		if (flag == lastByte){
			encyrptSize -= flag;
		}

		mData.assign(outputBuffer, outputBuffer + encyrptSize);
		delete[] outputBuffer;
	}
	else{
		CCLOG("raw data");
		mData.assign(rawDataEncrypted.begin(), rawDataEncrypted.end());
	}
}

/****/

ImageEncrypt::ImageEncrypt(){
	imageData = 0;
	texture = 0;
}

ImageEncrypt::~ImageEncrypt(){
	if (imageData){
		imageData->release();
		imageData = 0;
	}
}

void ImageEncrypt::initWithFile(){
	FileEncrypt::initWithFile();
	if (mData.size() > 0){
		imageData = new Image();
		imageData->initWithImageData((unsigned char*)mData.data(), mData.size());
	}
}
/****/

PlistEncrypt::PlistEncrypt(){
	plistContent = "";
}

PlistEncrypt::~PlistEncrypt() {

}

void PlistEncrypt::initWithFile(){
	FileEncrypt::initWithFile();
	plistContent = std::string(mData.data(), mData.size());
}

/****/
void FileEncryptUtils::loadFileThread(FileEncrypt* file, const FileLoadFinished _callback){
	file->initWithFile();
	quyetnd::UIThread::getInstance()->runOnUI([=](){
		_callback(file);
	});
}

FileEncryptUtils::FileEncryptUtils(){

}

FileEncryptUtils::~FileEncryptUtils(){

}

void FileEncryptUtils::setKey(const char* key){
	mKey.assign(key, key + FILE_AES_KEY_SIZE_BYTE);
}

void FileEncryptUtils::loadImageAsync(const std::string& file, const FileLoadCallback& callback){
	auto imgFile = new ImageEncrypt();
	imgFile->setKey((char*)mKey.data());
	imgFile->setFilePath(file);
	std::thread loadThread(&FileEncryptUtils::loadFileThread, this, imgFile, [=](FileEncrypt*){
		if (imgFile->imageData){
			std::string fullPath = FileUtils::getInstance()->fullPathForFilename(file);
			imgFile->texture = TextureCache::getInstance()->addImage(imgFile->imageData, fullPath);
		}	
		callback(file, imgFile);
		delete imgFile;
	});
	loadThread.detach();
}

void FileEncryptUtils::loadPlistAsync(const std::string& file, const FileLoadCallback& callback){
	auto imgFile = new PlistEncrypt();
	imgFile->setKey((char*)mKey.data());
	imgFile->setFilePath(file);
	std::thread loadThread(&FileEncryptUtils::loadFileThread, this, imgFile, [=](FileEncrypt*){
		callback(file, imgFile);
		delete imgFile;
	});
	loadThread.detach();
}

void FileEncryptUtils::loadFileAsync(const std::string& file, const FileLoadCallback& callback){
	auto imgFile = new FileEncrypt();
	imgFile->setKey((char*)mKey.data());
	imgFile->setFilePath(file);
	std::thread loadThread(&FileEncryptUtils::loadFileThread, this, imgFile, [=](FileEncrypt*){
		callback(file, imgFile);
		delete imgFile;
	});
	loadThread.detach();
}

static FileEncryptUtils* s_FileEncryptUtils = 0;
FileEncryptUtils* FileEncryptUtils::getInstance(){
	if (!s_FileEncryptUtils){
		s_FileEncryptUtils = new FileEncryptUtils();
	}
	return s_FileEncryptUtils;
}