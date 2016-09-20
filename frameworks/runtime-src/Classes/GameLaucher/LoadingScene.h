/*
 * LoadingScene.h
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#ifndef GAMELAUCHER_LOADINGSCENE_H_
#define GAMELAUCHER_LOADINGSCENE_H_

#include "cocos2d.h"
#include "GameLaucher.h"
#include "ResourceLoader.h"
#include "jsapi.h"
#include "jsfriendapi.h"
USING_NS_CC;

class LoadingScene : public Scene{
	quyetnd::GameLaucher* gameLaucher;
	quyetnd::UIThread* uiThread;
	std::vector<std::string> jsFiles;

	quyetnd::ResourceLoader resourceLoader;
	int currentStep;
	int maxStep;

	Label* statusLabel;

	std::string gameConfig;
	std::string updateHost;
	std::string versionHash;

	void initScene();
	void startJS();
	void startLoadResources();
	int status;

	void androidLoadExtension();
	void onResourcesLoaderFinished();
	void onResourcesLoaderProcess(int current, int max);
	void onCheckVersionStatus(quyetnd::GameLaucherStatus status);
	void onResourceDownloadProcress(int _current, int _max);
	void loadScriptMetaFile();	
	void updateLoadResource();

	void requestGetUpdate();
	void updateVersionFile();
public:
	LoadingScene();
	virtual ~LoadingScene();
	void loadScript();

	virtual void update(float dt);

	virtual void onEnter();
	virtual void onExit();

	static LoadingScene* scene();
};

#endif /* GAMELAUCHER_LOADINGSCENE_H_ */
