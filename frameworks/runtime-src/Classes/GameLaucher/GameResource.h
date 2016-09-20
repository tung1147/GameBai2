/*
 * GameResource.h
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#ifndef GAMELAUCHER_GAMERESOURCE_H_
#define GAMELAUCHER_GAMERESOURCE_H_

#include "string"
#include "../Plugin/MD5.h"
#include <functional>

namespace quyetnd {
typedef std::function<size_t(void*, size_t, size_t)> WriteDataHandler;
class GameFile {
	bool isExistFile(const std::string& filePath);
	bool checkHashFile();

	MD5* md5;
	size_t writeData(void *ptr, size_t size, size_t nmemb, FILE *fp);
	std::string downloadHash;
public:
	std::string fileName;
	std::string filePath;
	std::string md5Digest;
	int fileSize;
public:
	GameFile();
	virtual ~GameFile();
	bool test();
	int update(const std::string& url);
	int updateNoHandler(const std::string& url);
};


} /* namespace quyetnd */

#endif /* GAMELAUCHER_GAMERESOURCE_H_ */
