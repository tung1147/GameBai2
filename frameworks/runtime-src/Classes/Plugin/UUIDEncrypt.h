/*
 * UUIDEncrypt.h
 *
 *  Created on: Mar 23, 2016
 *      Author: Quyet Nguyen
 */

#ifndef DATA_UUIDENCRYPT_H_
#define DATA_UUIDENCRYPT_H_
#include "cocos2d.h"
USING_NS_CC;

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
class UUIDEncrypt {
	std::string _uuid;

	std::vector<std::string> allPath;
	std::vector<char> encryptBuffer;

	void initPlugin();

	std::mutex saveMutex;


	void saveToFile(const std::string& filePath, const std::vector<char> &buffer);
	void getWriteBuffer(std::vector<char> &buffer);
	bool readFromFile(const std::string& filePath);
public:
	UUIDEncrypt();
	virtual ~UUIDEncrypt();

	void saveData();

	const std::string& getUUID();

	static UUIDEncrypt* getInstance();
};
#endif
#endif /* DATA_UUIDENCRYPT_H_ */
