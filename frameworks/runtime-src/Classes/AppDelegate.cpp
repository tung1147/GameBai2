#include "AppDelegate.h"
#include "cocos2d.h"
#include "audio/include/SimpleAudioEngine.h"
USING_NS_CC;
using namespace CocosDenshion;

#include "scripting/js-bindings/auto/jsb_cocos2dx_3d_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_3d_extension_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_builder_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_navmesh_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_physics3d_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_spine_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_studio_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_ui_auto.hpp"
#include "scripting/js-bindings/manual/3d/jsb_cocos2dx_3d_manual.h"
#include "scripting/js-bindings/manual/chipmunk/js_bindings_chipmunk_registration.h"
#include "scripting/js-bindings/manual/cocosbuilder/js_bindings_ccbreader.h"
#include "scripting/js-bindings/manual/cocostudio/jsb_cocos2dx_studio_manual.h"
#include "scripting/js-bindings/manual/extension/jsb_cocos2dx_extension_manual.h"
#include "scripting/js-bindings/manual/jsb_opengl_registration.h"
#include "scripting/js-bindings/manual/localstorage/js_bindings_system_registration.h"
#include "scripting/js-bindings/manual/navmesh/jsb_cocos2dx_navmesh_manual.h"
#include "scripting/js-bindings/manual/network/XMLHTTPRequest.h"
#include "scripting/js-bindings/manual/network/jsb_socketio.h"
#include "scripting/js-bindings/manual/network/jsb_websocket.h"
#include "scripting/js-bindings/manual/physics3d/jsb_cocos2dx_physics3d_manual.h"
#include "scripting/js-bindings/manual/spine/jsb_cocos2dx_spine_manual.h"
#include "scripting/js-bindings/manual/ui/jsb_cocos2dx_ui_manual.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include "scripting/js-bindings/auto/jsb_cocos2dx_experimental_video_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_experimental_webView_auto.hpp"
#include "scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_video_manual.h"
#include "scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_webView_manual.h"
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT || CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "scripting/js-bindings/auto/jsb_cocos2dx_audioengine_auto.hpp"
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "cocos/scripting/js-bindings/manual/platform/android/CCJavascriptJavaBridge.h"
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
#include "cocos/scripting/js-bindings/manual/platform/ios/JavaScriptObjCBridge.h"
#endif


/**/
#include "Action/jsb_quyetnd_action.hpp"
#include "NewGUI/jsb_quyetnd_newui.hpp"
#include "Socket/jsb_quyetnd_lobbysocket.hpp"
#include "Socket/jsb_quyetnd_sfssocket.hpp"
#include "Socket/jsb_quyetnd_electro_socket.hpp"
#include "Plugin/jsb_quyetnd_systemplugin.hpp"
#include "Plugin/jsb_quyetnd_facebook_plugin.hpp"
#include "json/rapidjson.h"
#include "json/document.h"
#include "json/prettywriter.h"
#include "json/stringbuffer.h"
#include "GameLaucher/GameLaucher.h"
#include "GameLaucher/GameResource.h"
#include "platform/decryptor/Decryptor.h"
using namespace quyetnd;

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#include "Plugin/UUIDEncrypt.h"
#endif

#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
#include "iOS_native_linker.h"
#endif

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
		glview = cocos2d::GLViewImpl::createWithRect("GameBai", Rect(0, 0, 640, 480));
		//glview = cocos2d::GLViewImpl::createWithRect("GameBai", Rect(0, 0, 800, 480));
		//glview = cocos2d::GLViewImpl::createWithRect("GameBai", Rect(0, 0, 854, 480));
		//glview = cocos2d::GLViewImpl::createWithRect("GameBai", Rect(0, 0, 720, 480));
#else	
		glview = cocos2d::GLViewImpl::create("GameBai");
#endif
        director->setOpenGLView(glview);
}

	Size frameSize = glview->getFrameSize();
	float designHeight = 720.0f;
	float designWidth = frameSize.width * designHeight / frameSize.height;
	if (designWidth < 960.0f){
		designWidth = 960.0f;
	}
	if (designWidth > 1280.0f){
		designWidth = 1280.0f;
	}
	//glview->setDesignResolutionSize(1280,720, ResolutionPolicy::SHOW_ALL);
	glview->setDesignResolutionSize(designWidth, designHeight, ResolutionPolicy::SHOW_ALL);

    // set FPS. the default value is 1.0/60 if you don't call this
    director->setAnimationInterval(1.0 / 60);
    
	std::string externalPath = FileUtils::getInstance()->getWritablePath() + "Game/";
	FileUtils::getInstance()->addSearchPath("res/Game/", true);
	FileUtils::getInstance()->addSearchPath(externalPath, true);

	/*decrypt*/
	std::vector<unsigned char> aesKey = { 0x2c, 0x32, 0xc3, 0xfe, 0x2c, 0xd9, 0x37, 0xf0, 0x74, 0x38, 0xe5, 0xda, 0xed, 0xc0, 0x72, 0x99 };
	decryptor::Decryptor::getInstance()->setDecryptKey((const char*) aesKey.data());

#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    // set writePath no backup
    auto writePath = FileUtils::getInstance()->getWritablePath();
    c_to_objC_set_iClound_no_backup_folder(writePath.c_str());
#endif

	/*startJS*/
	ScriptingCore* sc = ScriptingCore::getInstance();
	sc->addRegisterCallback(register_all_cocos2dx);
	sc->addRegisterCallback(register_cocos2dx_js_core);
	sc->addRegisterCallback(jsb_register_system);

	// extension can be commented out to reduce the package
	sc->addRegisterCallback(register_all_cocos2dx_extension);
	sc->addRegisterCallback(register_all_cocos2dx_extension_manual);

	// chipmunk can be commented out to reduce the package
	sc->addRegisterCallback(jsb_register_chipmunk);
	// opengl can be commented out to reduce the package
	sc->addRegisterCallback(JSB_register_opengl);

	// builder can be commented out to reduce the package
	sc->addRegisterCallback(register_all_cocos2dx_builder);
	sc->addRegisterCallback(register_CCBuilderReader);

	// ui can be commented out to reduce the package, attension studio need ui module
	sc->addRegisterCallback(register_all_cocos2dx_ui);
	sc->addRegisterCallback(register_all_cocos2dx_ui_manual);

	// studio can be commented out to reduce the package,
	sc->addRegisterCallback(register_all_cocos2dx_studio);
	sc->addRegisterCallback(register_all_cocos2dx_studio_manual);

	// spine can be commented out to reduce the package
	sc->addRegisterCallback(register_all_cocos2dx_spine);
	sc->addRegisterCallback(register_all_cocos2dx_spine_manual);

	// XmlHttpRequest can be commented out to reduce the package
	sc->addRegisterCallback(MinXmlHttpRequest::_js_register);
	// websocket can be commented out to reduce the package
	sc->addRegisterCallback(register_jsb_websocket);
	// sokcet io can be commented out to reduce the package
	sc->addRegisterCallback(register_jsb_socketio);

	// 3d can be commented out to reduce the package
	sc->addRegisterCallback(register_all_cocos2dx_3d);
	sc->addRegisterCallback(register_all_cocos2dx_3d_manual);

	// 3d extension can be commented out to reduce the package
	sc->addRegisterCallback(register_all_cocos2dx_3d_extension);

#if CC_USE_3D_PHYSICS && CC_ENABLE_BULLET_INTEGRATION
	// Physics 3d can be commented out to reduce the package
	sc->addRegisterCallback(register_all_cocos2dx_physics3d);
	sc->addRegisterCallback(register_all_cocos2dx_physics3d_manual);
#endif

#if CC_USE_NAVMESH
	sc->addRegisterCallback(register_all_cocos2dx_navmesh);
	sc->addRegisterCallback(register_all_cocos2dx_navmesh_manual);
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
	sc->addRegisterCallback(register_all_cocos2dx_experimental_video);
	sc->addRegisterCallback(register_all_cocos2dx_experimental_video_manual);
	sc->addRegisterCallback(register_all_cocos2dx_experimental_webView);
	sc->addRegisterCallback(register_all_cocos2dx_experimental_webView_manual);
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT || CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
	sc->addRegisterCallback(register_all_cocos2dx_audioengine);
#endif
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
	sc->addRegisterCallback(JavascriptJavaBridge::_js_register);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
	sc->addRegisterCallback(JavaScriptObjCBridge::_js_register);
#endif

	//custom
	sc->addRegisterCallback(register_all_quyetnd_action);
	sc->addRegisterCallback(register_all_quyetnd_newui);
	sc->addRegisterCallback(register_all_quyetnd_lobbysocket);
	sc->addRegisterCallback(register_all_quyetnd_sfssocket);
	sc->addRegisterCallback(register_all_quyetnd_electro_socket);
	sc->addRegisterCallback(register_all_quyetnd_systemplugin);
	sc->addRegisterCallback(register_all_quyetnd_facebook_plugin);

	sc->start();

	sc->runScript("script/jsb_boot.js");
#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
	sc->enableDebugger();
#endif

	ScriptEngineProtocol *engine = ScriptingCore::getInstance();
	ScriptEngineManager::getInstance()->setScriptEngine(engine);
	GameFile* mainJs = GameLaucher::getInstance()->getMainJs();
	if (mainJs){
		std::string file = FileUtils::getInstance()->fullPathForFilename(mainJs->filePath);
		if (file != ""){
			bool b = ScriptingCore::getInstance()->runScript(file);
			if (b){
				return true;
			}		
		}
	}
	
	std::string file = FileUtils::getInstance()->fullPathForFilename("js/main.js");
	ScriptingCore::getInstance()->runScript(file);
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

#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
	auto runningScene = Director::getInstance()->getRunningScene();
	if (dynamic_cast<LoadingScene*>(runningScene)){
		Director::getInstance()->end();
		exit(0);
	}
#endif
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
