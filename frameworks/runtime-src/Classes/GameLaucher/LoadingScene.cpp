 /*
 * LoadingScene.cpp
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#include "LoadingScene.h"
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

#include "Action/jsb_quyetnd_action.hpp"
#include "NewGUI/jsb_quyetnd_newui.hpp"
#include "Socket/jsb_quyetnd_lobbysocket.hpp"
#include "Socket/jsb_quyetnd_sfssocket.hpp"
#include "Plugin/jsb_quyetnd_systemplugin.hpp"
#include "Plugin/jsb_quyetnd_facebook_plugin.hpp"
#include "GameLaucher.h"
#include "json/rapidjson.h"
#include "json/document.h"

using namespace quyetnd;

bool jsb_quyetnd_load_script(JSContext *cx, uint32_t argc, jsval *vp){
	return true; 
}

void jsb_quyetnd_register_load_script(JSContext* cx, JS::HandleObject obj){
	//auto sc = ScriptingCore::getInstance();
	//ssize_t fileSize;
	//char* data = (char*)FileUtils::getInstance()->getFileData("script.json", "rb", &fileSize);
	//std::vector<char> buffer(data, data + fileSize);
	//buffer.push_back('\0');
	//delete[] data;

	//rapidjson::Document doc;
	//doc.Parse<0>(buffer.data());
	//for (int i = 0; i < doc.Size(); i++){
	//	std::string script = doc[i].GetString();
	//	script = FileUtils::getInstance()->fullPathForFilename(script);
	//	
	//	//JS::MutableHandleValue pret;
	////	sc->requireScript(script.c_str(), pret);
	//}
}


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

	//custom
	sc->addRegisterCallback(register_all_quyetnd_action);
	sc->addRegisterCallback(register_all_quyetnd_newui);
	sc->addRegisterCallback(register_all_quyetnd_lobbysocket);
	sc->addRegisterCallback(register_all_quyetnd_sfssocket);
	sc->addRegisterCallback(register_all_quyetnd_systemplugin);
	sc->addRegisterCallback(register_all_quyetnd_facebook_plugin);
	sc->addRegisterCallback(jsb_quyetnd_register_load_script);

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
	sc->addRegisterCallback(JavascriptJavaBridge::_js_register);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
	sc->addRegisterCallback(JavaScriptObjCBridge::_js_register);
#endif
	sc->start();
	sc->runScript("script/jsb_boot.js");
	//sc->runScript("src/jsb_boot.js");
#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
	sc->enableDebugger();
#endif
	ScriptEngineProtocol *engine = ScriptingCore::getInstance();
	ScriptEngineManager::getInstance()->setScriptEngine(engine);
	GameFile* mainJs = gameLaucher->getFile("js/main.js");
	ScriptingCore::getInstance()->runScript(mainJs->filePath.c_str());
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
	statusLabel = Label::createWithSystemFont("Đang tải dữ liệu", "arial", 30);
	statusLabel->setPosition(winSize.width / 2, winSize.height / 2);
	this->addChild(statusLabel);

	gameLaucher = quyetnd::GameLaucher::getInstance();
}


static char stringBuffer[512];
void LoadingScene::update(float dt){
	switch (status)
	{
	case 0:{ //update	
		if (gameLaucher->getStatus() == quyetnd::GameLaucherStatus::GameLaucherStatus_Updating){
			int current = 0;
			int max = 0;
			gameLaucher->getDownloadStatus(current, max);
			sprintf(stringBuffer, "Đang cập nhật [%d/%d]", current, max);
			statusLabel->setString(stringBuffer);
		}
		else if (gameLaucher->getStatus() == quyetnd::GameLaucherStatus::GameLaucherStatus_Finished){
			//load resource
			startLoadResources();
			currentStep = 0;
			maxStep = resourceLoader.getMaxStep();
			statusLabel->setString("Đang tải tài nguyên");
			status = 1;
		}	
		else if (gameLaucher->getStatus() == quyetnd::GameLaucherStatus::GameLaucherStatus_UpdateFailure){
			statusLabel->setString("Cập nhật thất bại, vui lòng kiểm tra lại kết nối mạng");
			status = -1;
		}
		break;
	}

	case 1:{
		float per = 100.0f * currentStep / maxStep;
		sprintf(stringBuffer, "Đang tải tài nguyên [%d%]", (int)per);
		statusLabel->setString(stringBuffer);
		break;
	}
	case 2:{ //next scene
		status = -1;
		this->startJS();
	}
	}
}

void LoadingScene::onResourcesLoaderFinished(){
	status = 2;
}

void LoadingScene::onResourcesLoaderProcess(int current, int max){
	this->currentStep = current;
	this->maxStep = max;
}

void LoadingScene::onEnter(){
	status = 0;
	Scene::onEnter(); 

	statusLabel->setString("Đang kiểm tra phiên bản");
	this->scheduleUpdate();
	gameLaucher->startFromFile("res/Game/version.json");
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

