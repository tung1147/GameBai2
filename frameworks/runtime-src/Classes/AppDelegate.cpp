#include "AppDelegate.h"
#include "cocos2d.h"
#include "audio/include/SimpleAudioEngine.h"
#include "GameLaucher/LoadingScene.h"


#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#include "Plugin/UUIDEncrypt.h"
#endif

USING_NS_CC;
using namespace CocosDenshion;

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate()
{
    ScriptEngineManager::destroyInstance();
}

void AppDelegate::initGLContextAttrs()
{
    GLContextAttrs glContextAttrs = {8, 8, 8, 8, 24, 8};

    GLView::setGLContextAttrs(glContextAttrs);
}

bool AppDelegate::applicationDidFinishLaunching()
{		

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
	UUIDEncrypt::getInstance()->getUUID();
#endif

    // initialize director
    auto director = Director::getInstance();
    auto glview = director->getOpenGLView();
    if(!glview) {
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
		glview = cocos2d::GLViewImpl::createWithRect("GameBai", Rect(0, 0, 800, 480));
#else	
		glview = cocos2d::GLViewImpl::create("GameBai");
#endif
        director->setOpenGLView(glview);
}

	//Size frameSize = glview->getFrameSize();

	//float designHeight = 720.0f;
	//float designWidth = 



	std::string externalPath = FileUtils::getInstance()->getWritablePath() + "Game/";
	FileUtils::getInstance()->addSearchPath("res/Game/", true);
	FileUtils::getInstance()->addSearchPath(externalPath, true);
	auto a = FileUtils::getInstance()->getSearchPaths();

    // set FPS. the default value is 1.0/60 if you don't call this
    director->setAnimationInterval(1.0 / 60);
	director->runWithScene(LoadingScene::scene());

    return true;
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void AppDelegate::applicationDidEnterBackground()
{
    auto director = Director::getInstance();
    director->stopAnimation();
    director->getEventDispatcher()->dispatchCustomEvent("game_on_hide");
    SimpleAudioEngine::getInstance()->pauseBackgroundMusic();
    SimpleAudioEngine::getInstance()->pauseAllEffects();
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
    auto director = Director::getInstance();
    director->startAnimation();
    director->getEventDispatcher()->dispatchCustomEvent("game_on_show");
    SimpleAudioEngine::getInstance()->resumeBackgroundMusic();
    SimpleAudioEngine::getInstance()->resumeAllEffects();
}
