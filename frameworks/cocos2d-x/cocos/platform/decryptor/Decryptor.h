/*
* Decryptor.h
*
*  Created on: Dec 15, 2015
*      Author: QuyetNguyen
*/

#ifndef DECRYPTOR_DECRYPTOR_H
#define DECRYPTOR_DECRYPTOR_H
#include <vector>
#include <string>
#include "platform/CCPlatformMacros.h"

namespace decryptor{

class CC_DLL Decryptor{
	std::vector<char> mKey;
	std::string signature;
public:
	Decryptor();
	virtual ~Decryptor();

	void setDecryptSignature(const std::string& signature);
	void setDecryptKey(const char* key);
	bool isDataEncrypted(const char* data, int len);
	void decyrpt(std::vector<char> &outBuffer, const char* encryptedData, int len);

	static Decryptor* getInstance();
};

}


#endif //DECRYPTOR_DECRYPTOR_H