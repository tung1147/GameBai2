 /*
 * LoadingScene.cpp
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#include "LoadingScene.h"
#include "../Plugin/SystemPlugin.h"

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

#include "../Action/jsb_quyetnd_action.hpp"
#include "../NewGUI/jsb_quyetnd_newui.hpp"
#include "../Socket/jsb_quyetnd_lobbysocket.hpp"
#include "../Socket/jsb_quyetnd_sfssocket.hpp"
#include "../Plugin/jsb_quyetnd_systemplugin.hpp"
#include "../Plugin/jsb_quyetnd_facebook_plugin.hpp"
#include "GameLaucher.h"
#include "json/rapidjson.h"
#include "json/document.h"

using namespace quyetnd;

LoadingScene::LoadingScene() {
	// TODO Auto-generated constructor stub

}

LoadingScene::~LoadingScene() {
	// TODO Auto-generated destructor stub
}

void LoadingScene::startJS(){
	/****/
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
	sc->addRegisterCallback(register_all_quyetnd_systemplugin);
	sc->addRegisterCallback(register_all_quyetnd_facebook_plugin);

	sc->start();

	sc->runScript("script/jsb_boot.js");
#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
	sc->enableDebugger();
#endif
	sc->runScript("js/jsLoader.js");
	this->status = 3;
	this->currentStep++;
	this->updateLoadResource();

	this->androidLoadExtension();
}

void LoadingScene::threadLoadJS(){
	ScriptingCore* sc = ScriptingCore::getInstance();
	sc->runScript("script/jsb_boot.js");
	sc->runScript("js/jsLoader.js");

	UIThread::getInstance()->runOnUI([=](){
#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
		sc->enableDebugger();
#endif
		this->status = 3;
		this->currentStep++;
		this->updateLoadResource();
	});
}


void LoadingScene::startLoadResources(){
	std::string externalPath = FileUtils::getInstance()->getWritablePath() + "Game/";
	FileUtils::getInstance()->addSearchPath("res/Game/", true);
	FileUtils::getInstance()->addSearchPath(externalPath, true);

	GameFile* file =  gameLaucher->getFile("resources.json");

	ssize_t fileSize;
	char* data = (char*)FileUtils::getInstance()->getFileData(file->filePath, "rb", &fileSize);

	std::vector<char> buffer(data, data + fileSize);
	buffer.push_back('\0');
	delete[] data;

	rapidjson::Document doc;
	doc.Parse<0>(buffer.data());
	const rapidjson::Value& texture = doc["texture"];
	for (int i = 0; i < texture.Size(); i++){
		const rapidjson::Value& item = texture[i];
		auto img = item["img"].GetString();
		std::string plist = "";
		auto it = item.FindMember("plist");
		if (it != item.MemberEnd()){
			plist = it->value.GetString();
		}
		resourceLoader.addTextureLoad(img, plist);
	}

	const rapidjson::Value& fonts = doc["fonts"];
	for (int i = 0; i < fonts.Size(); i++){
		const rapidjson::Value& item = fonts[i];
		std::string img = item["img"].GetString();
		std::string fnt = item["fnt"].GetString();
		resourceLoader.addBMFontLoad(img, fnt);
	}

	const rapidjson::Value& sound = doc["Sound"];
	for (int i = 0; i < sound.Size(); i++){
		std::string soundPath = sound[i].GetString();
		resourceLoader.addSoundPreload(soundPath);
	}

	resourceLoader.start(CC_CALLBACK_0(LoadingScene::onResourcesLoaderFinished, this),
							CC_CALLBACK_2(LoadingScene::onResourcesLoaderProcess, this)
	);
}

void LoadingScene::initScene(){
	Scene::init();

	Size winSize = Director::getInstance()->getWinSize();
	statusLabel = Label::createWithSystemFont("Ä�ang táº£i dá»¯ liá»‡u", "arial", 30);
	statusLabel->setPosition(winSize.width / 2, winSize.height / 2);
	this->addChild(statusLabel);

	gameLaucher = quyetnd::GameLaucher::getInstance();
	gameLaucher->statusCallback = CC_CALLBACK_1(LoadingScene::onCheckVersionStatus, this);
	gameLaucher->downloadCallback = CC_CALLBACK_2(LoadingScene::onResourceDownloadProcress, this);

	uiThread = quyetnd::UIThread::getInstance();
}


static char stringBuffer[512];
void LoadingScene::update(float dt){
	switch (status)
	{
	case 0:break; //check version
	case 1:{ //load resource
		if(currentStep >= maxStep){
			status = 2;
			this->startJS();
		}
		break;
	}
	case 2: break; //load js
	case 3:{//next scene
		status = -1;
		ScriptEngineProtocol *engine = ScriptingCore::getInstance();
		ScriptEngineManager::getInstance()->setScriptEngine(engine);
		GameFile* mainJs = gameLaucher->getFile("js/main.js");
		ScriptingCore::getInstance()->runScript(mainJs->filePath.c_str());
		break;
	}
	}
	uiThread->update(dt);
}

void  LoadingScene::updateLoadResource(){
	float per = 100.0f * currentStep / (maxStep + 1);
	sprintf(stringBuffer, "Đang tải tài nguyên [%d]", (int)per);
	statusLabel->setString(stringBuffer);
}

/**/

void LoadingScene::androidLoadExtension(){
	auto file = gameLaucher->getFile("jar/extension.json");
	if (file){
		ssize_t fileSize;
		char* data = (char*)FileUtils::getInstance()->getFileData(file->filePath, "rb", &fileSize);
		std::vector<char> buffer(data, data + fileSize);
		buffer.push_back('\0');
		delete[] data;

		rapidjson::Document doc;
		doc.Parse<0>(buffer.data());
		for (int i = 0; i < doc.Size(); i++){
			std::string jarFilePath = doc[i]["extFile"].GetString();
			auto jarFile = gameLaucher->getFile("jar/" + jarFilePath);
			if (jarFile){
				std::string className = doc[i]["extClass"].GetString();
				if (jarFile->filePath[0] == '/'){
					SystemPlugin::getInstance()->androidLoadExtension(jarFile->filePath, className);
				}
				else{
					SystemPlugin::getInstance()->androidLoadExtension("Game/" + jarFile->fileName, className);
				}
			}
			else{
				CCLOG("no JAR: %s", jarFilePath.c_str());
			}
		}
	}
	else{
		CCLOG("android no extension");
	}
}

void LoadingScene::onResourcesLoaderFinished(){

}

void LoadingScene::onResourcesLoaderProcess(int current, int max){
	this->currentStep = current;
	this->maxStep = max;
	this->updateLoadResource();
}

void LoadingScene::onCheckVersionStatus(quyetnd::GameLaucherStatus gameLaucherStatus){
	if(gameLaucherStatus == quyetnd::GameLaucherStatus::GameLaucherStatus_Finished){
		currentStep = 0;
		maxStep = resourceLoader.getMaxStep();
		statusLabel->setString("Đang tải tài nguyên");
		status = 1;
		startLoadResources();
	}
	else if(gameLaucherStatus == quyetnd::GameLaucherStatus::GameLaucherStatus_UpdateFailure){
		statusLabel->setString("Cập nhật thất bại, vui lòng kiểm tra kết nối mạng");
		status = -1;
	}
	else if(gameLaucherStatus == quyetnd::GameLaucherStatus::GameLaucherStatus_Updating){
		statusLabel->setString("Đang cập nhật phiên bản");
	}
}

void LoadingScene::onResourceDownloadProcress(int _current, int _max){
	sprintf(stringBuffer, "Đang tải cập nhật [%d/%d]", _current, _max);
}


/*rapidjson::StringBuffer stringBuffer;
rapidjson::PrettyWriter<rapidjson::StringBuffer> writer(stringBuffer);
files.Accept(writer);
cocos2d::log("files: %s", stringBuffer.GetString());*/

void LoadingScene::onEnter(){
	status = 0;
	Scene::onEnter(); 

	statusLabel->setString("Đang kiểm tra phiên bản");
	gameLaucher->startFromFile("res/Game/version.json");
	//gameLaucher->startFromFile("version.json");
	this->scheduleUpdate();
}

void LoadingScene::onExit(){
	this->unscheduleUpdate();
	Scene::onExit();
}

LoadingScene* LoadingScene::scene(){
	auto scene = new LoadingScene();
	scene->initScene();
	scene->autorelease();
	return scene;
}

