/*
 * GameResource.h
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#ifndef GAMELAUCHER_GAMERESOURCE_H_
#define GAMELAUCHER_GAMERESOURCE_H_

#include "string"

namespace quyetnd {

class GameFile {
	bool isExistFile(const std::string& filePath);
	bool checkHashFile();
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
};


} /* namespace quyetnd */

#endif /* GAMELAUCHER_GAMERESOURCE_H_ */
