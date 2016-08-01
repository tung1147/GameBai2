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
#include <functional>
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
	typedef std::function<void()> EventCallback;
	std::vector<EventCallback> events;
	std::mutex event_mutex;

	std::string resourceHost;

	std::string versionFile;
	std::map<std::string, GameFile*> _allResources;
	
	bool checkFileExist(const std::string& file);

	int status;
	int downloadCurrentValue;
	int downloadMaxValue;

	void checkFiles();
public:
	std::function<void(GameLaucherStatus)> statusCallback;
	std::function<void(int currentValue, int maxValue)> downloadCallback;
public:
	GameLaucher();
	virtual ~GameLaucher();

	bool startFromFile(const std::string& versionFile);
	//int getStatus();
	//void getDownloadStatus(int &current, int& max);

	void update(float dt);
	void onUpdateDownloadProcess(int size);
	void onProcessStatus(GameLaucherStatus status);

	GameFile* getFile(const std::string& file);

	static GameLaucher* getInstance();
};

} /* namespace quyetnd */

#endif /* GAMELAUCHER_GAMELAUCHER_H_ */
