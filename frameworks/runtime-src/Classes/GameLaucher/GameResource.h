/*
 * GameResource.h
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#ifndef GAMELAUCHER_GAMERESOURCE_H_
#define GAMELAUCHER_GAMERESOURCE_H_

#include <string>
#include "../Plugin/MD5.h"
#include <functional>

namespace quyetnd {
typedef std::function<void(int)> UpdateHandler;
    
struct WriteDataHandler{
	//std::function<size_t(void*, size_t, size_t)> mHander;
    FILE* file;
	MD5* md5;
    UpdateHandler handler;
};
class GameFile {
	bool checkHashFile();
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
	int update(const std::string& url, UpdateHandler handler = nullptr);
};


} /* namespace quyetnd */

#endif /* GAMELAUCHER_GAMERESOURCE_H_ */
