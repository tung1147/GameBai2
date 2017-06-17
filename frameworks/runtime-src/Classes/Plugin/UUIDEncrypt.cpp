/*
 * UUIDEncrypt.cpp
 *
 *  Created on: Mar 23, 2016
 *      Author: Quyet Nguyen
 */

#include "UUIDEncrypt.h"

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#include "base64.h"
#include "MD5.h"
#include "jni/JniHelper.h"
extern "C"{
std::string jniGetMainAccount(){
	JniMethodInfo sMethod;
	bool bRet = JniHelper::getStaticMethodInfo(sMethod,"vn/quyetnguyen/plugin/system/UUDIPlugin","jniGetGoogleAccount","()Ljava/lang/String;");
	if(bRet){
		jstring jstr = (jstring) sMethod.env->CallStaticObjectMethod(sMethod.classID, sMethod.methodID);
		std::string pStr = JniHelper::jstring2string(jstr);
		sMethod.env->DeleteLocalRef(sMethod.classID);
		sMethod.env->DeleteLocalRef(jstr);
		return pStr;
	}
	return "account google not avaibale";
}

std::string jniGetAndroidPackage(){
	JniMethodInfo sMethod;
	bool bRet = JniHelper::getStaticMethodInfo(sMethod,"vn/quyetnguyen/plugin/system/UUDIPlugin","jniGetAndroidPackage","()Ljava/lang/String;");
	if(bRet){
		jstring jstr = (jstring) sMethod.env->CallStaticObjectMethod(sMethod.classID, sMethod.methodID);
		std::string pStr = JniHelper::jstring2string(jstr);
		sMethod.env->DeleteLocalRef(sMethod.classID);
		sMethod.env->DeleteLocalRef(jstr);
		return pStr;
	}
	return "";
}

std::string jniGetExternalStoragePath(const std::string& fileName){
	JniMethodInfo sMethod;
	bool bRet = JniHelper::getStaticMethodInfo(sMethod,"vn/quyetnguyen/plugin/system/UUDIPlugin","jniGetExternalStoragePath","(Ljava/lang/String;)Ljava/lang/String;");
	if(bRet){
		jstring _fileName = sMethod.env->NewStringUTF(fileName.c_str());
		jstring jstr = (jstring) sMethod.env->CallStaticObjectMethod(sMethod.classID, sMethod.methodID, _fileName);
		std::string pStr = JniHelper::jstring2string(jstr);
		sMethod.env->DeleteLocalRef(sMethod.classID);
		sMethod.env->DeleteLocalRef(jstr);
		sMethod.env->DeleteLocalRef(_fileName);
		return pStr;
	}
	return "";
}

std::string jniGetUUID(const std::string &appKeys){
	JniMethodInfo sMethod;
	bool bRet = JniHelper::getStaticMethodInfo(sMethod,"vn/quyetnguyen/plugin/system/UUDIPlugin","jniGetPsuedoUniqueID","(Ljava/lang/String;)Ljava/lang/String;");
	if(bRet){
		jstring _appKeys = sMethod.env->NewStringUTF(appKeys.c_str());
		jstring uuid = (jstring)sMethod.env->CallStaticObjectMethod(sMethod.classID, sMethod.methodID, _appKeys);
		std::string _uuid = JniHelper::jstring2string(uuid);

		sMethod.env->DeleteLocalRef(sMethod.classID);
		sMethod.env->DeleteLocalRef(uuid);
		sMethod.env->DeleteLocalRef(_appKeys);

		return _uuid;
	}
	return "";
}


}

#include "crypt_aes.h"
#define KEY_SIZE_BIT 128
#define KEY_SIZE_BYTE 16

inline void _aes_encrypt_to_bytes(const std::vector<char>& src, std::vector<char> &outputData, const uint8_t* key, uint8_t* iv){
	//add padding
	int blockSize = src.size() / KEY_SIZE_BYTE + 1;
	int padding = blockSize*KEY_SIZE_BYTE - src.size();
	uint8_t* inputBuffer = new uint8_t[blockSize*KEY_SIZE_BYTE];
	memcpy(inputBuffer, src.data(), src.size());
	memset(&inputBuffer[src.size()], padding, padding);

	aes_ks_t secretKey;
	aes_setks_encrypt(key, KEY_SIZE_BIT, &secretKey);
	int outputSize = blockSize*KEY_SIZE_BYTE;
	uint8_t* outputBuffer = new uint8_t[outputSize];

	aes_cbc_encrypt(inputBuffer, outputBuffer, iv, blockSize, &secretKey);
	outputData.assign(outputBuffer, outputBuffer+outputSize);
//	outputData->setData(outputBuffer, outputSize);

	delete[] inputBuffer;
	delete[] outputBuffer;
}

inline void _aes_decyrpt_to_bytes(const std::vector<char>& src, std::vector<char>& outputData, const uint8_t* key, uint8_t* iv){
	int dataSize = src.size();
	aes_ks_t secretKey;
	aes_setks_decrypt(key, KEY_SIZE_BIT, &secretKey);
	uint8_t* outputBuffer = new uint8_t[src.size()];
	aes_cbc_decrypt((const uint8_t*)src.data(), outputBuffer, iv, dataSize / KEY_SIZE_BYTE, &secretKey);

	//remove padding
	int padding = outputBuffer[dataSize - 1];
	int i = 1;
	while (outputBuffer[dataSize - i] == padding){
		i++;
	}
	i--;
	if (i == padding){
		dataSize -= padding;
	}

	outputData.assign(outputBuffer, outputBuffer+dataSize);
	delete[] outputBuffer;
}

inline void _aes_make_byte_random(int size, std::vector<uint8_t>& outputData){
	for (int i = 0; i < size; i++){
		outputData.push_back((uint8_t)rand());
	}
}

#include "sha1.h"
#define SHA_1_LENGTH 20
inline bool _test_hash_sha1(uint8_t* dataBuffer, int bufferSize, uint8_t* hashData){
	if (bufferSize < 1){
		return false;
	}
	uint8_t hashBuffer[SHA_1_LENGTH + 10];
	sha1::calc(dataBuffer, bufferSize, hashBuffer);
	for (int i = 0; i < SHA_1_LENGTH; i++){
		if (hashBuffer[i] != hashData[i]){
			return false;
		}
	}
	return true;
}

static UUIDEncrypt* s_UUIDEncrypt = 0;
UUIDEncrypt* UUIDEncrypt::getInstance(){
	if(!s_UUIDEncrypt){
		s_UUIDEncrypt = new UUIDEncrypt();
		s_UUIDEncrypt->initPlugin();
	}
	return s_UUIDEncrypt;
}

UUIDEncrypt::UUIDEncrypt() {
	// TODO Auto-generated constructor stub

}

UUIDEncrypt::~UUIDEncrypt() {
	// TODO Auto-generated destructor stub
}

//static std::vector<std::string> s_path = {
//		"system/data/",
//		"data/apps/",
//		"system/",
//		"download/"};

static std::vector<std::string> s_path = {
	"c3lzdGVtL2RhdGEv",
	"ZGF0YS9hcHBzLw==",
	"c3lzdGVtLw==",
	"ZG93bmxvYWQv"};

void UUIDEncrypt::initPlugin(){
	encryptBuffer.clear();
	/* write data */
	std::string dataFileName = "Data-gamebai389" ;//+ jniGetAndroidPackage();
	std::string dataPath = FileUtils::getInstance()->getWritablePath() + "." + string_to_md5(dataFileName);;
	allPath.push_back(dataPath);

	/* write sdcard */
	std::string fileName = "UUIDEncrypt-gamebai389";// + jniGetAndroidPackage();
	for(int i=0; i<s_path.size(); i++){ 
		fileName = string_to_md5(fileName);
		std::string filePath = base64_decode(s_path[i]) + "." + fileName;
		allPath.push_back(jniGetExternalStoragePath(filePath));
	}

	bool isSave = false;
	bool isGetUUID = true;
	for(int i=0; i<allPath.size(); i++){
		if(readFromFile(allPath[i])){
			isGetUUID = false;
		}
		else{
			isSave = true;
		}
	}

	if(isGetUUID){
		_uuid = jniGetMainAccount();
		if(_uuid == ""){
			isSave = false;
		}
	}

	if(isSave){
//		log("2");
		std::thread saveThread(&UUIDEncrypt::saveData, this);
		saveThread.detach();
	//	this->saveData();
	}
}

void UUIDEncrypt::saveData(){
	saveMutex.lock();

	if(encryptBuffer.empty()){
//			log("return write");
		getWriteBuffer(encryptBuffer);
	}

	for(int i=0; i<allPath.size(); i++){
		saveToFile(allPath[i], encryptBuffer);
	}

	saveMutex.unlock();
}

void UUIDEncrypt::saveToFile(const std::string& filePath, const std::vector<char> &buffer){
	srand(time(0));
	FILE* file = fopen(filePath.c_str(), "wb");
	if (file){
		fwrite(buffer.data(), sizeof(char), buffer.size(), file);
		fflush(file);
		fclose(file);
	}
}

void UUIDEncrypt::getWriteBuffer(std::vector<char> &buffer){
	std::vector<uint8_t> keys;
	std::vector<uint8_t> iv;
	_aes_make_byte_random(KEY_SIZE_BYTE, keys);
	_aes_make_byte_random(KEY_SIZE_BYTE, iv);

	std::vector<char> outputData;
	outputData.insert(outputData.end(), iv.begin(), iv.end());
	outputData.insert(outputData.end(), keys.begin(), keys.end());

	std::vector<char> encryptBuffer;
	std::vector<char> inputData(_uuid.begin(), _uuid.end());
	_aes_encrypt_to_bytes(inputData, encryptBuffer, keys.data(), iv.data());

	outputData.insert(outputData.end(), encryptBuffer.begin(), encryptBuffer.end());

	uint8_t hashBuffer[SHA_1_LENGTH + 10];
	sha1::calc(outputData.data(), outputData.size(), hashBuffer);

	buffer.insert(buffer.end(), &hashBuffer[0], &hashBuffer[0] + SHA_1_LENGTH);
	buffer.insert(buffer.end(), outputData.begin(), outputData.end());
}

bool UUIDEncrypt::readFromFile(const std::string& filePath){
	FILE* file = fopen(filePath.c_str(), "rb");
	if (file){
		fseek(file, 0, SEEK_END);
		int size = ftell(file);
		fseek(file, 0, SEEK_SET);
		unsigned char* buffer = new unsigned char[size];
		fread(buffer, sizeof(unsigned char), size, file);
		int dataSize = size - SHA_1_LENGTH;

		if(_test_hash_sha1(&buffer[SHA_1_LENGTH], dataSize, buffer)){
			if(encryptBuffer.empty()){
//				log("return read");
				encryptBuffer.assign(buffer, buffer + size);

				std::vector<char> dataEncrypt;
				std::vector<char> outputData;

				uint8_t* iv = buffer + SHA_1_LENGTH;
				uint8_t* key = iv + KEY_SIZE_BYTE;
				uint8_t* data = key + KEY_SIZE_BYTE;

				dataEncrypt.assign(data, buffer + size);
				_aes_decyrpt_to_bytes(dataEncrypt, outputData, key, iv);

				_uuid.assign(outputData.begin(), outputData.end());
			}

//			log("return true");
			delete []buffer;
			fclose(file);
			return true;
		}

		delete []buffer;
		fclose(file);
	}

//	log("return false");
	return false;
}

const std::string& UUIDEncrypt::getUUID(){
	if(_uuid == ""){
		_uuid = jniGetMainAccount();
		if(_uuid != ""){
			std::thread saveThread(&UUIDEncrypt::saveData, this);
			saveThread.detach();
		}
	}
	return _uuid;
}
#endif
