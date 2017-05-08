/*
 * ResourceLoader.h
 *
 *  Created on: Dec 15, 2015
 *      Author: QuyetNguyen
 */

#ifndef COMMON_RESOURCELOADER_H_
#define COMMON_RESOURCELOADER_H_

#include "cocos2d.h"
USING_NS_CC;

namespace quyetnd {
struct TextureData{
	std::string texture;
	std::string plist;
};

struct BMFontData{
	std::string texture;
	std::string font;
};

enum ResourceLoaderStep{
	kStepUnloadImage = 1,
	kStepUnloadSound,

	kStepLoadBMFont,
	kStepLoadImage,
	kStepLoadSound,
	kStepWaitingLoadImage,

	kStepPreFinishLoadResource,
	kStepFinishLoadResource,
};

typedef std::function<void(int, int)> LoaderProcessHandler;
//typedef std::function<void()> LoadResourcesAction;

class ResourceLoader : public Ref{
	std::vector<TextureData> _preLoad;
	std::vector<TextureData> _preUnload;
	std::vector<BMFontData> _preloadBMFont;

	std::vector<std::string> _preloadSound;
	std::vector<std::string> _unloadSound;
//
	std::mutex fileUtilsMutex;

	//std::queue<std::function<void()>> _actions;
	//std::mutex _actionsMutex;
	//std::condition_variable _actions_condition_variable;

	int index;
	ResourceLoaderStep step;

	int targetStep;
	int currentStep;

	void loadTexture(const std::string& img, std::function<void(cocos2d::Texture2D*)> callback);
	void onProcessLoader();

	//LoadResourcesAction takeAction();
	//void pushAction(const LoadResourcesAction& action);
	//void runActionThread();

	void loadTextureAction(const std::string& img, const std::string& plist);
	void loadSpriteAction(cocos2d::Texture2D* tex, const std::string& plist);
	void onLoadTextureSuccess();

	void loadBitmapAction(const std::string& img, const std::string& fnt);
	void onLoadBitmapSuccess();
	//std::string getFullPath(const std::string& fileName);
public:
	bool running;
	std::function<void(int, int)> processHandler;
public:
	ResourceLoader();
	virtual ~ResourceLoader();

	void addTextureLoad(const std::string &img, const std::string &plist = "");
	void addBMFontLoad(const std::string &texture, const std::string &font);

	void addTextureUnLoad(const std::string &textureKey, const std::string &plist = "");

	void addSoundPreload(const std::string& sound);
	void addSoundUnload(const std::string& sound);

	void update(float dt);
	void start();
	void stop();

	int getMaxStep();
	int getCurrentStep();
	bool isFinished();
};

} /* namespace quyetnd */

#endif /* COMMON_RESOURCELOADER_H_ */
