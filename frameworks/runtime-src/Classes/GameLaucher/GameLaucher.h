/*
 * GameLaucher.h
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#ifndef GAMELAUCHER_GAMELAUCHER_H_
#define GAMELAUCHER_GAMELAUCHER_H_

#include <string>
#include <vector>
#include <map>
#include <mutex>
#include "GameResource.h"

namespace quyetnd {
enum GameLaucherStatus{
	GameLaucherStatus_TestVersion = 0,
	GameLaucherStatus_TestHash,
	GameLaucherStatus_Updating,
	GameLaucherStatus_UpdateFailure,
	GameLaucherStatus_Finished,
};

class GameLaucher {
	std::string versionFile;
	std::map<std::string, GameFile*> _allResources;
	
	bool checkFileExist(const std::string& file);

	int status;
	std::mutex status_mutex;

	void checkFiles();
public:

public:
	GameLaucher();
	virtual ~GameLaucher();

	bool startFromFile(const std::string& versionFile);
	int getStatus();

	GameFile* getFile(const std::string& file);

	static GameLaucher* getInstance();
};

} /* namespace quyetnd */

#endif /* GAMELAUCHER_GAMELAUCHER_H_ */
