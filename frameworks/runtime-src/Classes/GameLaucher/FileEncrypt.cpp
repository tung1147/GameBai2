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

void FileEncrypt::decryptData(){
	std::string fileSignature(rawDataEncrypted.begin(), rawDataEncrypted.begin() + s_EncryptSignature.size());
	if (fileSignature == s_EncryptSignature){
		CCLOG("file ecnrypted");

		std::vector<char> retData;

		//read iv
		std::vector<char> iv_temp(mKey.begin(), mKey.end());
		iv_temp.insert(iv_temp.end(), s_EncryptSignature.data(), s_EncryptSignature.data() + s_EncryptSignature.size());
		MD5* md5 = new MD5();
		md5->update(iv_temp.data(), iv_temp.size());
		md5->finalize();

		uint8_t ivBuffer[FILE_AES_KEY_SIZE_BYTE];
		memcpy(ivBuffer, md5->getDigest(), FILE_AES_KEY_SIZE_BYTE);
		delete md5;

		//decrypt
		int encyrptSize = rawDataEncrypted.size() - s_EncryptSignature.size();
		int blockSize = encyrptSize / FILE_AES_KEY_SIZE_BYTE;
		aes_ks_t secretKey;
		aes_setks_decrypt((const uint8_t*)mKey.data(), FILE_AES_KEY_SIZE_BIT, &secretKey);
		uint8_t* outputBuffer = new uint8_t[encyrptSize];
		aes_cbc_decrypt((const uint8_t*)(rawDataEncrypted.data() + s_EncryptSignature.size()), outputBuffer, ivBuffer, blockSize, &secretKey);

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
	mKey = { 0x2c, 0x32, 0xc3, 0xfe, 0x2c, 0xd9, 0x37, 0xf0, 0x74, 0x38, 0xe5, 0xda, 0xed, 0xc0, 0x72, 0x99 };
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