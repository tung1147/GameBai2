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
    FILE* file;
	MD5* md5;
    UpdateHandler handler;
};
class GameFile {
	bool isExistFile(const std::string& filePath);
	bool checkHashFileContent();
	
	std::string downloadHash;

	std::string fileName;
	std::string md5Digest;
public:
	std::string fullPath;
	int fileSize;
public:
	GameFile(const std::string& fileName, const std::string& md5Digest, int fileSize);

	virtual ~GameFile();
	bool test();
	int update(const std::string& url, bool zipFileAvailable, UpdateHandler handler = nullptr);
	void getFullPath();
};


} /* namespace quyetnd */

#endif /* GAMELAUCHER_GAMERESOURCE_H_ */
