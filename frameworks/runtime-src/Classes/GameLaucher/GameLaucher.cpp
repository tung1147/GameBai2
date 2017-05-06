/*
 * GameLaucher.cpp
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#include "GameLaucher.h"
#include <stdint.h> // for ssize_t on android
#include "json/rapidjson.h"
#include "json/document.h"
#include "json/stringbuffer.h"
#include "json/prettywriter.h"
#include "../Plugin/SystemPlugin.h"
#include "network/HttpClient.h"
#include "jsapi.h"
#include "jsfriendapi.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "WorkerManager.h"

namespace quyetnd {

GameLaucher::GameLaucher() {
	// TODO Auto-generated constructor stub
	versionFile = "version.json";
	versionHash = "";
//	jsMainFile = "js/main.js";
	resourceHost = "https://c567vip.com/demo/mobile/";
	//resourceHost = "http://sandbox.c567vip.com/tuyennc/mobile/";
	//resourceHost = "http://sandbox.c567vip.com/tampn/mobile/";
}

GameLaucher::~GameLaucher() {
	// TODO Auto-generated destructor stub
	this->clear();
}

void GameLaucher::clear(){
	for (auto it = _allResources.begin(); it != _allResources.end(); it++){
		delete it->second;
	}
	_allResources.clear();
}

void GameLaucher::initLaucher(){
	resourceLoader.processHandler = CC_CALLBACK_2(GameLaucher::onLoadResourceProcess, this);

	std::string filePath = FileUtils::getInstance()->fullPathForFilename("version.json");
	if (filePath.empty()){
		return;
	}

	Data d = FileUtils::getInstance()->getDataFromFile(filePath);
	if (d.isNull()){
		return;
	}
	char* data = (char*)d.getBytes();
	ssize_t fileSize = d.getSize();
	std::string buffer(data, data + fileSize);

	rapidjson::Document doc;
	bool error = doc.Parse<0>(buffer.data()).HasParseError();
	if (!error){
		const rapidjson::Value& files = doc["files"];
		for (int i = 0; i < files.Size(); i++){
			const rapidjson::Value& fileData = files[i];

			std::string fileName = fileData["file"].GetString();
			std::string md5Digest = fileData["hash"].GetString();
			std::transform(md5Digest.begin(), md5Digest.end(), md5Digest.begin(), ::tolower);
			int fileSize = fileData["size"].GetUint();
			GameFile* resource = new GameFile(fileName, md5Digest, fileSize);

			_allResources.insert(std::make_pair(fileName, resource));
		}
	}
}

void GameLaucher::run(){
	this->onProcessStatus(GameLaucherStatus::GetUpdate);
	WorkerManager::getInstance()->start(4);
	//clear all
	this->clear();
	this->requestGetUpdate();
	Director::getInstance()->getScheduler()->scheduleUpdate(this, 0, false);
}

void GameLaucher::update(float dt){
	resourceLoader.update(dt);
	UIThread::getInstance()->update(dt);
	if (status == GameLaucherStatus::LoadResource){
		if (resourceLoader.isFinished()){
			this->loadScript();
		}
	}
}

void GameLaucher::requestGetUpdate(){
#ifdef FORCE_UPDATE
	this->checkVersionFile();
	return;
#endif

	//resourceHost = "";
	versionHash = "";
//	this->checkVersionFile();
	this->checkFiles();
	return;

	std::string urlRequest = "http://10.0.1.106/quyetnd/GBVCity/acs.json";
	cocos2d::network::HttpRequest* request = new cocos2d::network::HttpRequest();
	request->setUrl(urlRequest.c_str());
	request->setRequestType(cocos2d::network::HttpRequest::Type::GET);
	request->setResponseCallback([=](cocos2d::network::HttpClient* client, cocos2d::network::HttpResponse* response){
		if (response->isSucceed()){
			std::vector<char>* mData = response->getResponseData();
			std::string data(mData->begin(), mData->end());
			rapidjson::Document doc;
			bool error = doc.Parse<0>(data.data()).HasParseError();
			if (!error){
				std::string updateHost = doc["UpdateHost"].GetString();
				std::string versionHash = doc["LastVersionHash"].GetString();

				const rapidjson::Value& configValue = doc["config"];
				rapidjson::StringBuffer stringBuffer;
				rapidjson::PrettyWriter<rapidjson::StringBuffer> writer(stringBuffer);
				configValue.Accept(writer);
				std::string gameConfig = stringBuffer.GetString();

				CCLOG("updateHost: %s", updateHost.c_str());
				CCLOG("hashVersionFile: %s", versionHash.c_str());
				CCLOG("config: %s", gameConfig.c_str());

				this->resourceHost = updateHost;
				this->versionHash = versionHash;

				this->checkVersionFile();
				return;
			}
		}

		CCLOG("loi ket noi mang");
		this->requestGetUpdate();
	});

	cocos2d::network::HttpClient::getInstance()->send(request);
	request->release();
}

void GameLaucher::checkVersionFile(){
	this->onProcessStatus(GameLaucherStatus::TestVersion);
	WorkerManager::getInstance()->pushAction([=](){
		this->checkVersionFileThread();
	});
}

void GameLaucher::checkFiles(){
	this->onProcessStatus(GameLaucherStatus::TestHashFiles);
	WorkerManager::getInstance()->pushAction([=](){
		this->checkFilesThread();
	});
}


void GameLaucher::loadResource(){
	this->onProcessStatus(GameLaucherStatus::LoadResource);

	for (auto it = _allResources.begin(); it != _allResources.end(); it++){
		it->second->getFullPath();
	}

	GameFile* file = this->getFile("resources.json");
	if (!file){
		CCLOG("load resource failure");
		return;
	}

	Data d = FileUtils::getInstance()->getDataFromFile(file->fullPath);
	if (d.isNull()){
		CCLOG("resource Metafile NULL");
		return;
	}

	ssize_t fileSize = d.getSize();
	char* data = (char*)d.getBytes();
	std::string buffer(data, data + fileSize);

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

	resourceLoader.start();
}

void GameLaucher::loadScript(){
	this->onProcessStatus(GameLaucherStatus::LoadScript);
	WorkerManager::getInstance()->pushAction([=](){
		this->loadScriptMetaThread();
	});
}

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
void GameLaucher::loadAndroidExt(){
	//this->onProcessStatus(GameLaucherStatus::LoadAndroidExt);
	//auto file = this->getFile("jar/extension.json");
	//if (file){
	//	Data d = FileUtils::getInstance()->getDataFromFile(file->filePath);
	//	if (!d.isNull()){
	//		char* data = (char*)d.getBytes();
	//		ssize_t fileSize = d.getSize();
	//		std::string buffer(data, data + fileSize);

	//		rapidjson::Document doc;
	//		bool error = doc.Parse<0>(buffer.data()).HasParseError();
	//		if (!error){
	//			for (int i = 0; i < doc.Size(); i++){
	//				std::string jarFilePath = doc[i]["extFile"].GetString();
	//				auto jarFile = this->getFile("jar/" + jarFilePath);
	//				if (jarFile){
	//					auto extFilePath = FileUtils::getInstance()->getWritablePath() + "Game/" + jarFile->fileName;
	//					if (!FileUtils::getInstance()->isFileExist(extFilePath)){
	//						Data d = FileUtils::getInstance()->getDataFromFile(jarFile->fileName);
	//						if (d.isNull()){
	//							CCLOG("not found android-ext: %s", jarFile->fileName.c_str());
	//						}
	//						else{
	//							size_t n = extFilePath.find_last_of("/");
	//							std::string parentFolder = extFilePath.substr(0, n);
	//							if (!FileUtils::getInstance()->isDirectoryExist(parentFolder)){
	//								FileUtils::getInstance()->createDirectory(parentFolder);
	//							}
	//							FileUtils::getInstance()->writeDataToFile(d, extFilePath);
	//						}
	//					}
	//					SystemPlugin::getInstance()->androidLoadExtension(extFilePath);
	//				}
	//				else{
	//					CCLOG("no JAR: %s", jarFilePath.c_str());
	//				}
	//			}
	//		}
	//		else{
	//			CCLOG("parse android-ext metafile error");
	//		}
	//	}
	//	else{
	//		CCLOG("no android-ext metafile");
	//	}	
	//}
	//else{
	//	CCLOG("android no extension");
	//}
	//this->finishLaucher();
}
#endif

void GameLaucher::finishLaucher(){
	WorkerManager::getInstance()->stop();
	this->onProcessStatus(GameLaucherStatus::Finished);
	Director::getInstance()->getScheduler()->unscheduleUpdate(this);
}

/*thread*/
void GameLaucher::checkVersionFileThread(){

#ifdef FORCE_UPDATE
	GameFile versionFile("version.json", "", 0);
#else
	std::transform(versionHash.begin(), versionHash.end(), versionHash.begin(), ::tolower);
	GameFile versionFile("version.json", versionHash, 0);
#endif

	if (!versionFile.test()){
		//int returnCode = versionFile.updateNoHandler(resourceHost + versionFile.fileName);
		FileUtils::getInstance()->purgeCachedEntries();
        int returnCode = versionFile.update(resourceHost, false);
		if (returnCode != 0){
			UIThread::getInstance()->runOnUI([=](){
				this->onProcessStatus(GameLaucherStatus::UpdateFailure);
			});
			return;
		}
	}

	versionFile.getFullPath();
	std::string filePath = versionFile.fullPath;
	UIThread::getInstance()->runOnUI([=](){
		this->versionFile = filePath;
		this->checkFiles();
	});
}

void GameLaucher::checkFilesThread(){
	this->clear();
	_resourceUpdate.clear();
	
	Data d = FileUtils::getInstance()->getDataFromFile(versionFile);
	char* data = (char*)d.getBytes();
	ssize_t fileSize = d.getSize();

	std::vector<char> buffer(data, data + fileSize);
	buffer.push_back('\0');

	rapidjson::Document doc;
	doc.Parse<0>(buffer.data());
	bool zipFileAvailable = false;
	if (doc.HasMember("zipFileAvailable")){
		zipFileAvailable = doc["zipFileAvailable"].GetBool();
	}

	const rapidjson::Value& files = doc["files"];
	for (int i = 0; i < files.Size(); i++){
		const rapidjson::Value& fileData = files[i];

		
		std::string fileName = fileData["file"].GetString();
		std::string md5Digest = fileData["hash"].GetString();
		std::transform(md5Digest.begin(), md5Digest.end(), md5Digest.begin(), ::tolower);
		int fileSize = fileData["size"].GetUint();
		GameFile* resource = new GameFile(fileName, md5Digest, fileSize);

		_allResources.insert(std::make_pair(fileName, resource));
	}

	stepIndex = 0;
	stepTarget = _allResources.size();

	downloadMaxValue = 0;
	for (auto it = _allResources.begin(); it != _allResources.end(); it++){
		auto res = it->second;
		WorkerManager::getInstance()->pushAction([=](){
			auto ret = res->test();
			UIThread::getInstance()->runOnUI([=](){
				if (ret){
					CCLOG("HASH true: %s", res->fullPath.c_str());
				}
				else{
					CCLOG("HASH false: %s", res->fullPath.c_str());
					downloadMaxValue += res->fileSize;
					_resourceUpdate.push_back(res);
				}
				stepIndex++;
				if (stepIndex >= stepTarget){
					this->updateResources();
					CCLOG("done");
				}
			});	
		});
	}
}

void GameLaucher::updateResources(){
	if (_resourceUpdate.size() == 0){
		UIThread::getInstance()->runOnUI([=](){		
			this->loadResource();
		});
		return;
	}

	bool zipFileAvailable = false;
	FileUtils::getInstance()->purgeCachedEntries();
	UIThread::getInstance()->runOnUI([=](){
		this->onProcessStatus(GameLaucherStatus::Updating);
	});	

	stepIndex = 0;
	stepTarget = _resourceUpdate.size();
	downloadCurrentValue = 0;

	for (int i = 0; i < _resourceUpdate.size();i++){
		auto res = _resourceUpdate[i];
		WorkerManager::getInstance()->pushAction([=](){
			auto pret = res->update(resourceHost, zipFileAvailable, [=](int bytes){
				CCLOG("b: %d", bytes);
				this->onUpdateDownloadProcess(bytes);
			});
			UIThread::getInstance()->runOnUI([=](){
				if (pret == 0){
					CCLOG("UPDATE OK: %s", res->fullPath.c_str());
					stepIndex++;
					if (stepIndex >= stepTarget){
						this->loadResource();
					}
				}
				else{
					this->onProcessStatus(GameLaucherStatus::UpdateFailure);
				}
			});
		});
	}
}

void GameLaucher::loadScriptMetaThread(){
	auto scriptMetaFile = this->getFile("script.json");
	Data data = FileUtils::getInstance()->getDataFromFile(scriptMetaFile->fullPath);
	if (data.getSize() > 0){
		std::vector<std::string> scripts;

		std::string str((char*)data.getBytes(), data.getSize());
		rapidjson::Document doc;
		bool error = doc.Parse<0>(str.c_str()).HasParseError();
		if (!error && doc.IsArray()){
			for (int i = 0; i < doc.Size(); i++){
				std::string file = doc[i].GetString();
				scripts.push_back(file);
			}
		}

		UIThread::getInstance()->runOnUI([=](){
			auto sc = ScriptingCore::getInstance();
			auto cx = sc->getGlobalContext();
			auto rootObject = sc->getGlobalObject();
			JSAutoCompartment ac(cx, rootObject);
			JS::RootedObject globalObj(cx, rootObject);

			for (int i = 0; i < scripts.size(); i++){
				JS::RootedValue returnValue(cx);
				sc->requireScript(scripts[i].c_str(), globalObj, cx, &returnValue);
			}

			this->finishLaucher();			
		});
	}
}

/*event*/
void GameLaucher::onUpdateDownloadProcess(int size){
	UIThread::getInstance()->runOnUI([=](){
		downloadCurrentValue += size;
		CCLOG("a: %d", downloadCurrentValue);

		//call js event running scene;
		auto scene = Director::getInstance()->getRunningScene();
		js_proxy_t * p = jsb_get_native_proxy(scene);
		if (p){
			auto sc = ScriptingCore::getInstance();
			auto cx = sc->getGlobalContext();
			auto global = sc->getGlobalObject();
			JSAutoCompartment ac(cx, global);

			JS::RootedObject jstarget(cx, p->obj);
			JS::RootedValue value(cx);
			bool ok = JS_GetProperty(cx, jstarget, "onUpdateDownloadProcess", &value);
			if (ok && !value.isNullOrUndefined()){
				jsval dataVal[2] = {
					INT_TO_JSVAL(downloadCurrentValue),
					INT_TO_JSVAL(downloadMaxValue)
				};
				JS::RootedValue retval(cx);
				auto ret = sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onUpdateDownloadProcess", 2, dataVal, &retval);
			}
		}
	});
}

void GameLaucher::onProcessStatus(int status){
	this->status = status;
	//CCLOG("onProcessStatus: %d", status);
	//call js event running scene;
	auto scene = Director::getInstance()->getRunningScene();
	js_proxy_t * p = jsb_get_native_proxy(scene);
	if (p){	
		auto sc = ScriptingCore::getInstance();
		auto cx = sc->getGlobalContext();
		auto global = sc->getGlobalObject();
		JSAutoCompartment ac(cx, global);

		JS::RootedObject jstarget(cx, p->obj);
		JS::RootedValue value(cx);
		bool ok = JS_GetProperty(cx, jstarget, "onProcessStatus", &value);
		if (ok && !value.isNullOrUndefined()){
			jsval dataVal[1] = {
				INT_TO_JSVAL(this->status)
			};
			JS::RootedValue retval(cx);
			auto ret = sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onProcessStatus", 1, dataVal, &retval);
		}
	}
}

void GameLaucher::onLoadResourceProcess(int current, int max){
	//call js event running scene;
	auto scene = Director::getInstance()->getRunningScene();
	js_proxy_t * p = jsb_get_native_proxy(scene);
	if (p){
		auto sc = ScriptingCore::getInstance();
		auto cx = sc->getGlobalContext();
		auto global = sc->getGlobalObject();
		JSAutoCompartment ac(cx, global);

		JS::RootedObject jstarget(cx, p->obj);
		JS::RootedValue value(cx);
		bool ok = JS_GetProperty(cx, jstarget, "onLoadResourceProcess", &value);
		if (ok && !value.isNullOrUndefined()){
			jsval dataVal[2] = {
				INT_TO_JSVAL(current),
				INT_TO_JSVAL(max)
			};
			JS::RootedValue retval(cx);
			auto ret = sc->executeFunctionWithOwner(OBJECT_TO_JSVAL(p->obj), "onLoadResourceProcess", 2, dataVal, &retval);
		}
	}
}

GameFile* GameLaucher::getFile(const std::string& file){
	auto it = _allResources.find(file);
	if (it != _allResources.end()){
		return it->second;
	}
	return 0;
}

bool GameLaucher::checkFileValidate(const std::string& filename){
	auto file = this->getFile(filename);
	if (file){
		return file->test();
	}
	return false;
}

static GameLaucher* s_GameLaucher = 0;

GameLaucher* GameLaucher::getInstance(){
	if (!s_GameLaucher){
		s_GameLaucher = new GameLaucher();
		s_GameLaucher->initLaucher();
	}
	return s_GameLaucher;
}

/****/
UIThread::UIThread(){

}
UIThread::~UIThread(){

}

UIThreadRunnable UIThread::popEvent(){
	std::unique_lock<std::mutex> lk(_mutex);
	if (!mQueue.empty()){
		auto ev = mQueue.front();
		mQueue.pop();
		return ev;
	}
	return nullptr;
}

void UIThread::runOnUI(const std::function<void()>& callback){
	std::unique_lock<std::mutex> lk(_mutex);
	mQueue.push(callback);
}

void UIThread::update(float dt){
	auto ev = this->popEvent();
	while (ev){
		ev();
		ev = this->popEvent();
	}
}

static UIThread* s_UIThread = 0;
UIThread* UIThread::getInstance(){
	if (!s_UIThread){
		s_UIThread = new UIThread();
	}
	return s_UIThread;
}


} /* namespace quyetnd */
