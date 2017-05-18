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
#include "cocos2d.h"
USING_NS_CC;
#include "GameResource.h"
#include "ResourceLoader.h"

//#define FORCE_UPDATE

namespace quyetnd {
enum GameLaucherStatus{
	GetUpdate = 0,	//0
	TestVersion,	//1
	TestHashFiles,	//2
	Updating,		//3
	UpdateFailure,	//4
	LoadResource,	//5
	LoadScript,		//6
	LoadAndroidExt,	//7
	Finished,		//8
};

class GameLaucher {
	quyetnd::ResourceLoader resourceLoader;
	std::map<std::string, GameFile*> _allResources;
	std::vector<GameFile*> _resourceUpdate;

	std::string resourceHost;
	std::string versionHash;
	std::string versionFile;
//	std::string jsMainFile;
	int stepIndex;
	int stepTarget;
	
	void initLaucher();
	void clear();

	int status;
	int downloadCurrentValue;
	int downloadMaxValue;

	void checkVersionFileThread();
	void checkFilesThread();
	void updateResources();
	void loadScriptMetaThread();

	void requestGetUpdate();
	void checkVersionFile();
	void checkFiles();
	void loadResource();
	void loadScript();
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	void loadAndroidExt();
#endif
	void finishLaucher();
	void onProcessStatus(int status);
	void onLoadResourceProcess(int current, int max);
public:
	GameLaucher();
	virtual ~GameLaucher();

	void run();
	void update(float dt);
	void onUpdateDownloadProcess(int size);
	
	GameFile* getFile(const std::string& file);
//	GameFile* getMainJs();
	bool checkFileValidate(const std::string& file);

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
