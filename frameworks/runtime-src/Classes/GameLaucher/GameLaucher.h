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
#include <queue>
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

	std::string resourceHost;
	std::string versionFile;
	std::string jsMainFile;
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

	void onUpdateDownloadProcess(int size);
	void onProcessStatus(GameLaucherStatus status);

	GameFile* getFile(const std::string& file);
	GameFile* getMainJs();

	static GameLaucher* getInstance();
};

typedef std::function<void()> UIThreadRunnable;
class UIThread{
	std::queue<UIThreadRunnable> mQueue;
	std::mutex _mutex;

	UIThreadRunnable popEvent();
public:
	UIThread();
	virtual ~UIThread();
	
	void runOnUI(const UIThreadRunnable& callback);
	void update(float dt);

	static UIThread* getInstance();
};

} /* namespace quyetnd */

#endif /* GAMELAUCHER_GAMELAUCHER_H_ */
