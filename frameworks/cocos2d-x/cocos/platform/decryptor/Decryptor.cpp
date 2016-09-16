#include "Decryptor.h"
#include "MD5.h"
#include "crypt_aes.h"
#include <sstream>

namespace decryptor{
static Decryptor* s_Decryptor = 0;

Decryptor* Decryptor::getInstance(){
	if (!s_Decryptor){
		s_Decryptor = new Decryptor();
	}
	return s_Decryptor;
}

Decryptor::Decryptor(){

	salt = { 0xd6, 0x72, 0x71, 0xcc, 0xc5, 0x26, 0x7e, 0xa4, 0x5b, 0xdb, 0x28, 0xfd, 0x29, 0x9f, 0x41, 0xac };
}

Decryptor::~Decryptor(){

}

void Decryptor::setDecryptKey(const char* key){
	mKey.assign(key, key + 16);
}

bool Decryptor::isDataEncrypted(const char* data, int len){
	if (len % 16){
		return false;
	}

	int blockCount = (len / 16) - 1;
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

void Decryptor::decyrpt(std::vector<char> &outBuffer, const char* encryptedData, int len){
	std::vector<char> vectorTemp;

	//read signature
	std::vector<char> signature(encryptedData, encryptedData + 16);

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
	int encyrptSize = len - 16;
	int blockSize = encyrptSize / 16;
	aes_ks_t secretKey;
	decryptor_aes_setks_decrypt(keyBuffer, 128, &secretKey);
	uint8_t* outputBuffer = new uint8_t[encyrptSize];
	decryptor_aes_cbc_decrypt((const uint8_t*)(encryptedData + 16), outputBuffer, ivBuffer, blockSize, &secretKey);

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

	outBuffer.assign(outputBuffer, outputBuffer + encyrptSize);
	delete[] outputBuffer;
}
	
}