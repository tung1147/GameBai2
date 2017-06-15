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
#include "EngineUtilsThreadSafe.h"
#include "jsapi.h"
#include "jsfriendapi.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "WorkerManager.h"
#include "../Plugin/HttpFileDownloader.h"

//

static unsigned char aes_key[16] = { 0x33, 0x5a, 0x35, 0x16, 0x96, 0xff, 0xe8, 0x20, 0xa1, 0x62, 0x16, 0xbe, 0x77, 0x6a, 0x4e, 0xea };
std::string _createJsonConfig(const std::map<std::string, std::string>& params){
	rapidjson::Document document;
	document.SetObject();

	for (auto it = params.begin(); it != params.end(); it++){
		rapidjson::Value value;
		value.SetString(it->second.data(), it->second.size(), document.GetAllocator());

		rapidjson::Value key;
		key.SetString(it->first.data(), it->first.size(), document.GetAllocator());
		document.AddMember(key, value, document.GetAllocator());
	}

	rapidjson::StringBuffer buffer;
	buffer.Clear();
	rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
	document.Accept(writer);
	return std::string(buffer.GetString());
}

static const char HEX_CHAR[17] = "0123456789ABCDEF";
std::string _URLEncode(const std::string& data){
	std::string pRet = "";
	for (int i = 0; i<data.size(); i++){
		if (('0' <= data[i] && data[i] <= '9') ||
			('a' <= data[i] && data[i] <= 'z') ||
			('A' <= data[i] && data[i] <= 'Z') ||
			(data[i] == '-' || data[i] == '_' || data[i] == '.' || data[i] == '~')){
			pRet.append(&data[i], 1);
		}
		else{
			//to hext
			pRet.append("%");
			char dig1 = (data[i] & 0xF0) >> 4;
			char dig2 = (data[i] & 0x0F);
			pRet.append(&HEX_CHAR[dig1], 1);
			pRet.append(&HEX_CHAR[dig2], 1);
		}
	}
	return pRet;
}

namespace quyetnd {

GameLaucher::GameLaucher() {
	// TODO Auto-generated constructor stub
	versionFile = "version.json";
	versionHash = "";
	resourceHost = "";
	//resourceHost = "http://sandbox.c567vip.com/quyetnd/testcrash/";
}

void GameLaucher::runOnUI(const std::function<void()>& handler){
	Director::getInstance()->getScheduler()->performFunctionInCocosThread(handler);
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
}

/*acs config*/
#define ACS_URL "http://the-new-acs.c567vip.com/gaia_acs?"
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#define ACS_PLATFORM_NAME "Android"
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#define ACS_PLATFORM_NAME "IOS"
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
#define ACS_PLATFORM_NAME "Winphone"
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#define ACS_PLATFORM_NAME "Android"
#else
#define ACS_PLATFORM_NAME "IOS"
#endif

void GameLaucher::requestGetUpdate(){
#ifdef FORCE_UPDATE
	this->checkVersionFile();
	return;
#else

	std::string versionName = quyetnd::SystemPlugin::getInstance()->getVersionName();
	std::string bundleName = quyetnd::SystemPlugin::getInstance()->getPackageName();
	std::map<std::string, std::string> params;
	params.insert(std::make_pair("bundleName", bundleName));
	params.insert(std::make_pair("version", versionName));
	params.insert(std::make_pair("platformName", ACS_PLATFORM_NAME));
	std::string json = _createJsonConfig(params);
	std::string paramsStr = quyetnd::SystemPlugin::getInstance()->dataEncryptBase64((char*)aes_key, json);
	std::string httpString = std::string(ACS_URL) + "params=" + _URLEncode(paramsStr);

	CCLOG("httpString: %s", httpString.c_str());

	cocos2d::network::HttpRequest* request = new cocos2d::network::HttpRequest();
	request->setUrl(httpString.c_str());
	request->setRequestType(cocos2d::network::HttpRequest::Type::GET);
	request->setResponseCallback([=](cocos2d::network::HttpClient* client, cocos2d::network::HttpResponse* response){
		if (response->isSucceed()){
			std::vector<char>* mData = response->getResponseData();
			mData->push_back('\0');
			CCLOG("data: %s", mData->data());

			std::string base64Encrypt(mData->data());
			std::string json = quyetnd::SystemPlugin::getInstance()->dataDecryptBase64((char*)aes_key, base64Encrypt);
			//std::string json = "{\"data\":{\"UpdateConfig\":{\"host\":\"http://sandbox.c567vip.com/quyetnd/mobile/\",\"versionHash\":\"dd3048e0135d638868019dc67daff521\", \"demo\":true}}}";
			CCLOG("json: %s", json.c_str());

			rapidjson::Document doc;
			bool error = doc.Parse<0>(json.data()).HasParseError();
			if (!error){
				if (doc.HasMember("data")){
					const rapidjson::Value& data = doc["data"];
					if (data.HasMember("UpdateConfig")){
						const rapidjson::Value& config = data["UpdateConfig"];

						std::string updateHost = config["host"].GetString();
						std::string versionHash = config["versionHash"].GetString();
						bool isInReview = false;
						if (config.HasMember("demo")){
							isInReview = config["demo"].GetBool();
						}

						CCLOG("updateHost: %s", updateHost.c_str());
						CCLOG("hashVersionFile: %s", versionHash.c_str());

						this->resourceHost = updateHost;
						this->versionHash = versionHash;

						if (isInReview){ //review
							FileUtils::getInstance()->setSearchPaths({ "res/Game/", "src/" });

							if (FileUtils::getInstance()->isFileExist("version.json")){ //ignore if version.json exist
								CCLOG("load resource internal");
								this->checkFiles();
							}
							else{
								CCLOG("is demo not exist version.json -> load resource from host");
								std::string externalPath = FileUtils::getInstance()->getWritablePath() + "Game/";
								FileUtils::getInstance()->setSearchPaths({ externalPath, "res/Game/" });
								FileUtils::getInstance()->addSearchPath("src/", false);
								this->checkVersionFile();
							}
						}
						else{
							CCLOG("NOT demo");
							this->checkVersionFile();
						}
						return;
					}
				}
			}
			else{
				CCLOG("ACS error getConfig");
			}

		}
		else{
			CCLOG("ACS error network");
		}

		this->onProcessStatus(GameLaucherStatus::UpdateFailure);

		Director::getInstance()->getScheduler()->schedule([=](float){
			Director::getInstance()->getScheduler()->unschedule("acs_update", this);
			this->requestGetUpdate();
		}, this, 1.0, false, "acs_update");
	});

	cocos2d::network::HttpClient::getInstance()->send(request);
	request->release();
#endif
}

void GameLaucher::run(){
	this->onProcessStatus(GameLaucherStatus::GetUpdate);
	//clear all
	this->clear();
	this->requestGetUpdate();
	Director::getInstance()->getScheduler()->scheduleUpdate(this, 0, false);
	WorkerManager::getInstance()->start(4);
}

void GameLaucher::update(float dt){
	resourceLoader.update(dt);
	if (status == GameLaucherStatus::LoadResource){
		if (resourceLoader.isFinished()){
			this->loadScript();
		}
	}
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

void GameLaucher::updateResources(std::vector<GameFile*>* resUpdate){
	if (resUpdate->size() > 0){
		downloadCurrentValue = 0;
		downloadMaxValue = 0;

		for (int i = 0; i < resUpdate->size(); i++){
			auto res = resUpdate->at(i);
			downloadMaxValue += res->fileSize;
		}

		auto ticket = WorkerTicket::create(resUpdate->size());
		ticket->finishedCallback = [=](bool success){ //update ok
			/*start loadResource*/
			this->runOnUI([=](){
				FileUtils::getInstance()->purgeCachedEntries();
				this->loadResource();
			});
		};

		this->runOnUI([=](){
			this->onProcessStatus(GameLaucherStatus::Updating);
		});

		for (int i = 0; i < resUpdate->size(); i++){
			auto res = resUpdate->at(i);
			res->update(resourceHost + res->fileName, 
			[=](int bytes){
				this->onUpdateDownloadProcess(bytes);
			}, 
			[=](int returnCode){
				ticket->done(returnCode == 0);
				if (returnCode != 0){
					this->runOnUI([=](){
						this->onProcessStatus(GameLaucherStatus::UpdateFailure);
					});
				}
			});
		}
	}
	else{
		/*start loadResource*/
		this->runOnUI([=](){
			this->loadResource();
		});
	}
}

void GameLaucher::loadResource(){
	this->onProcessStatus(GameLaucherStatus::LoadResource);
	GameFile* file = this->getFile("resources.json");
	if (!file){
		CCLOG("load resource failure");
		return;
	}

	Data d = EngineUtilsThreadSafe::getInstance()->getFileData(file->filePath);
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

void GameLaucher::finishLaucher(){
	this->onProcessStatus(GameLaucherStatus::Finished);
	Director::getInstance()->getScheduler()->unscheduleUpdate(this);
	resourceHost = "";
	WorkerManager::getInstance()->stop();
}

/*thread*/
void GameLaucher::checkVersionFileThread(){
	GameFile* versionFile = new GameFile();
	_allResources.insert(std::make_pair("version.json", versionFile));

	versionFile->fileName = "version.json";
#ifdef FORCE_UPDATE
	versionFile.md5Digest = "";
	versionFile.fileSize = 0;
#else
	versionFile->md5Digest = versionHash;
	std::transform(versionFile->md5Digest.begin(), versionFile->md5Digest.end(), versionFile->md5Digest.begin(), ::tolower);
	versionFile->fileSize = 0;
#endif

	if (!versionFile->test()){
		versionFile->update(resourceHost + versionFile->fileName, nullptr, [=](int returnCode){
			if (returnCode != 0){
				this->runOnUI([=](){
					this->onProcessStatus(GameLaucherStatus::UpdateFailure);
				});
			}
			else{
				std::string filePath = versionFile->filePath;
				this->runOnUI([=](){
					this->versionFile = filePath;
					this->checkFiles();
				});
			}
		});
	}
	else{
		std::string filePath = versionFile->filePath;
		this->runOnUI([=](){
			this->versionFile = filePath;
			this->checkFiles();
		});
	}
}

void GameLaucher::checkFilesThread(){
	this->clear();

	std::vector<GameFile*> _resourceUpdate;
	Data d = EngineUtilsThreadSafe::getInstance()->getFileData(versionFile);
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

		GameFile* resource = new GameFile();
		resource->fileName = fileData["file"].GetString();
		resource->md5Digest = fileData["hash"].GetString();
		std::transform(resource->md5Digest.begin(), resource->md5Digest.end(), resource->md5Digest.begin(), ::tolower);
		resource->fileSize = fileData["size"].GetUint();

		_allResources.insert(std::make_pair(resource->fileName, resource));
	}

	auto updateRes = new std::vector<GameFile*>();
	auto ticket = WorkerTicket::create(_allResources.size());
	ticket->finishedCallback = [=](bool){
		this->updateResources(updateRes);
		delete updateRes;
	};

	for (auto it = _allResources.begin(); it != _allResources.end(); it++){
		auto file = it->second;
		WorkerManager::getInstance()->pushAction([=](){
			if (file->test()){
				CCLOG("HASH true: %s", file->filePath.c_str());
			}
			else{
				updateRes->push_back(file);
			}
			ticket->done(true);
		});
	}
}

void GameLaucher::loadScriptMetaThread(){
	auto scriptMetaFile = this->getFile("script.json");
	Data data = EngineUtilsThreadSafe::getInstance()->getFileData(scriptMetaFile->filePath);
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

		this->runOnUI([=](){
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
	this->runOnUI([=](){
		downloadCurrentValue += size;

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


} /* namespace quyetnd */
