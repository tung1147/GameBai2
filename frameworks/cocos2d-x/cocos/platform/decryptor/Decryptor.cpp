#include "Decryptor.h"
#include "MD5.h"
#include "crypt_aes.h"

namespace decryptor{
static Decryptor* s_Decryptor = 0;

Decryptor* Decryptor::getInstance(){
	if (!s_Decryptor){
		s_Decryptor = new Decryptor();
	}
	return s_Decryptor;
}

Decryptor::Decryptor(){
	signature = "EncryptedByQuyetND";
}

Decryptor::~Decryptor(){

}

void Decryptor::setDecryptSignature(const std::string& signature){
	this->signature = signature;
}

void Decryptor::setDecryptKey(const char* key){
	mKey.assign(key, key + 16);
}

bool Decryptor::isDataEncrypted(const char* data, int len){
	int dataSize = len;

	if (dataSize <= 16){
		return false;
	}

	if (dataSize % 16){
		return false;
	}

	MD5* md5 = new MD5();
	md5->update(data + 16, dataSize - 16);
	md5->finalize();
	auto digest = md5->getDigest();
	std::vector<char> hashBuffer(digest, digest + 16);
	hashBuffer.insert(hashBuffer.end(), signature.begin(), signature.end());

	delete md5;
	md5 = new MD5();
	md5->update(hashBuffer.data(), hashBuffer.size());
	md5->finalize();
	digest = md5->getDigest();
	for (int i = 0; i < 16; i++){
		if (data[i] != digest[i]){
			delete md5;
			return false;
		}
	}
	delete md5;
	return true;
}

void Decryptor::decyrpt(std::vector<char> &outBuffer, const char* encryptedData, int len){
	std::vector<char> retData;

	//create iv
	std::vector<char> iv_temp(mKey.begin(), mKey.end());
	iv_temp.insert(iv_temp.end(), signature.data(), signature.data() + signature.size());
	MD5* md5 = new MD5();
	md5->update(iv_temp.data(), iv_temp.size());
	md5->finalize();

	uint8_t ivBuffer[16];
	memcpy(ivBuffer, md5->getDigest(), 16);
	delete md5;

	//decrypt
	int encyrptSize = len - 16;
	int blockSize = encyrptSize / 16;
	aes_ks_t secretKey;
	decryptor_aes_setks_decrypt((const uint8_t*)mKey.data(), 128, &secretKey);
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