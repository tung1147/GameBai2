/*
 * ResourceLoader.h
 *
 *  Created on: Dec 15, 2015
 *      Author: QuyetNguyen
 */

#ifndef COMMON_RESOURCELOADER_H_
#define COMMON_RESOURCELOADER_H_

#include "cocos2d.h"
#include "WorkerManager.h"
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

class ResourceLoader : public Ref{
	std::vector<TextureData> _preLoad;
	std::vector<TextureData> _preUnload;
	std::vector<BMFontData> _preloadBMFont;

	std::vector<std::string> _preloadSound;
	std::vector<std::string> _unloadSound;

	int index;
	ResourceLoaderStep step;

	int targetStep;
	int currentStep;

	void onProcessLoader();

	void onLoadImageThread(std::string img, std::function<void(cocos2d::Texture2D*)> callback);
	void onLoadSpriteFrameThread(std::string plist, cocos2d::Texture2D* texture, std::function<void(bool)> callback);

	void runOnUI(const std::function<void()>& runable);
	void loadTexture(std::string img, std::string plist, WorkerTicket* ticket);
	void loadSpriteFrame(Texture2D* tex, std::string plist, WorkerTicket* ticket);
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
