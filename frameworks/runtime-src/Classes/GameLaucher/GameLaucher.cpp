/*
 * GameLaucher.cpp
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#include "GameLaucher.h"
#include "json/rapidjson.h"
#include "json/document.h"
#include "json/stringbuffer.h"
#include "json/prettywriter.h"
#include "../Plugin/SystemPlugin.h"
#include "network/HttpClient.h"
#include "jsapi.h"
#include "jsfriendapi.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"

namespace quyetnd {

GameLaucher::GameLaucher() {
	// TODO Auto-generated constructor stub
	versionFile = "";
	versionHash = "";
	jsMainFile = "js/main.js";
	resourceHost = "";

	statusCallback = nullptr;
	downloadCallback = nullptr;
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
	Data d = FileUtils::getInstance()->getDataFromFile("version.json");
	if (d.isNull()){
		return;
	}
	char* data = (char*)d.getBytes();
	ssize_t fileSize = d.getSize();
	std::string buffer(data, data + fileSize);

	rapidjson::Document doc;
	bool error = doc.Parse<0>(buffer.data()).HasParseError();
	if (!error){
		std::string versionName = doc["versionName"].GetString();
		uint32_t versionCode = doc["versionCode"].GetInt();
		if (doc.HasMember("main")){
			jsMainFile = doc["main"].GetString();
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
	}
	resourceLoader.processHandler = CC_CALLBACK_2(GameLaucher::onLoadResourceProcess, this);
}

void GameLaucher::run(){
	this->onProcessStatus(GameLaucherStatus::GetUpdate);
	//clear all
	this->clear();
	this->requestGetUpdate();
	Director::getInstance()->getScheduler()->scheduleUpdateForTarget(this, 0, false);
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
	resourceHost = "";
	versionHash = "";
	/* start check version */
	std::thread checkVersion(&GameLaucher::checkVersionFileThread, this);
	checkVersion.detach();
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

				cocos2d::log("updateHost: %s", updateHost.c_str());
				cocos2d::log("hashVersionFile: %s", versionHash.c_str());
				cocos2d::log("config: %s", gameConfig.c_str());

				this->resourceHost = updateHost;
				this->versionHash = versionHash;

				this->checkVersionFile();
				return;
			}
		}

		log("loi ket noi mang");
		this->requestGetUpdate();
	});

	cocos2d::network::HttpClient::getInstance()->send(request);
	request->release();
}

void GameLaucher::checkVersionFile(){
	this->onProcessStatus(GameLaucherStatus::TestVersion);
	std::thread checkVersion(&GameLaucher::checkVersionFileThread, this);
	checkVersion.detach();
}

void GameLaucher::checkFiles(){
	this->onProcessStatus(GameLaucherStatus::TestHashFiles);
	std::thread checkThread(&GameLaucher::checkFilesThread, this);
	checkThread.detach();
}


void GameLaucher::loadResource(){
	this->onProcessStatus(GameLaucherStatus::LoadResource);

	GameFile* file = this->getFile("resources.json");
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

	resourceLoader.start();
}

void GameLaucher::loadScript(){
	this->onProcessStatus(GameLaucherStatus::LoadSciprt);
	std::thread loadThread(&GameLaucher::loadScriptMetaThread, this);
	loadThread.detach();
}

#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
void GameLaucher::loadAndroidExt(){
	this->onProcessStatus(GameLaucherStatus::LoadAndroidExt);
	auto file = this->getFile("jar/extension.json");
	if (file){
		ssize_t fileSize;
		Data d = FileUtils::getInstance()->getDataFromFile(file->filePath);
		char* data = (char*)d.getBytes();
		ssize_t fileSize = d.getSize();
		std::vector<char> buffer(data, data + fileSize);
		buffer.push_back('\0');
		delete[] data;

		rapidjson::Document doc;
		doc.Parse<0>(buffer.data());
		for (int i = 0; i < doc.Size(); i++){
			std::string jarFilePath = doc[i]["extFile"].GetString();
			auto jarFile = this->getFile("jar/" + jarFilePath);
			if (jarFile){
				if (jarFile->filePath[0] == '/'){
					SystemPlugin::getInstance()->androidLoadExtension(jarFile->filePath);
				}
				else{
					SystemPlugin::getInstance()->androidLoadExtension("Game/" + jarFile->fileName);
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

	this->finishLaucher();
}
#endif

void GameLaucher::finishLaucher(){
	this->onProcessStatus(GameLaucherStatus::Finished);
	Director::getInstance()->getScheduler()->unscheduleUpdate(this);
}

/*thread*/
void GameLaucher::checkVersionFileThread(){
	GameFile versionFile;
	versionFile.fileName = "version.json";
	versionFile.md5Digest = versionHash;
	std::transform(versionFile.md5Digest.begin(), versionFile.md5Digest.end(), versionFile.md5Digest.begin(), ::tolower);
	versionFile.fileSize = 0;

	if (!versionFile.test()){
		int returnCode = versionFile.updateNoHandler(resourceHost + versionFile.fileName);
		if (returnCode != 0){
			UIThread::getInstance()->runOnUI([=](){
				this->onProcessStatus(GameLaucherStatus::UpdateFailure);
			});
			return;
		}
	}

	std::string filePath = versionFile.filePath;
	UIThread::getInstance()->runOnUI([=](){
		this->versionFile = filePath;
		this->checkFiles();
	});
}

void GameLaucher::checkFilesThread(){
	this->clear();

	std::vector<GameFile*> _resourceUpdate;
	Data d = FileUtils::getInstance()->getDataFromFile(versionFile);
	char* data = (char*)d.getBytes();
	ssize_t fileSize = d.getSize();

	std::vector<char> buffer(data, data + fileSize);
	buffer.push_back('\0');

	rapidjson::Document doc;
	doc.Parse<0>(buffer.data());
	std::string versionName = doc["versionName"].GetString();
	uint32_t versionCode = doc["versionCode"].GetInt();
	if (doc.HasMember("main")){
		jsMainFile = doc["main"].GetString();
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

	downloadMaxValue = 0;
	for (auto it = _allResources.begin(); it != _allResources.end(); it++){
		if (it->second->test()){
			CCLOG("HASH true: %s", it->second->filePath.c_str());
		}
		else{
			CCLOG("HASH false: %s", it->second->fileName.c_str());
			downloadMaxValue += it->second->fileSize;
			_resourceUpdate.push_back(it->second);
		}	
	}

	if (_resourceUpdate.size() > 0){
		downloadCurrentValue = 0;
		FileUtils::getInstance()->purgeCachedEntries();

		UIThread::getInstance()->runOnUI([=](){
			this->onProcessStatus(GameLaucherStatus::Updating);
		});		
		for (int i = 0; i < _resourceUpdate.size();){
			auto pret = _resourceUpdate[i]->update(resourceHost + _resourceUpdate[i]->fileName);
			if (pret == 0){
				i++;
			}
			else{
				UIThread::getInstance()->runOnUI([=](){
					this->onProcessStatus(GameLaucherStatus::UpdateFailure);
				});
				return;
			}
		}
	}

	/*start loadResource*/
	UIThread::getInstance()->runOnUI([=](){		
		this->loadResource();
	});
}

void GameLaucher::loadScriptMetaThread(){
	auto scriptMetaFile = this->getFile("script.json");
	Data data = FileUtils::getInstance()->getDataFromFile(scriptMetaFile->filePath);
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
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
			this->loadAndroidExt();
#else
			this->finishLaucher();
#endif
			
		});
	}
}

/*event*/
void GameLaucher::onUpdateDownloadProcess(int size){
	UIThread::getInstance()->runOnUI([=](){
		downloadCurrentValue += size;
		if (this->downloadCallback){
			this->downloadCallback(downloadCurrentValue, downloadMaxValue);
		}
	});
}

void GameLaucher::onProcessStatus(int status){
	this->status = status;
	cocos2d::log("onProcessStatus: %d", status);
	if (this->statusCallback){
		this->statusCallback(status);
	}
}

void GameLaucher::onLoadResourceProcess(int current, int max){

}

GameFile* GameLaucher::getFile(const std::string& file){
	auto it = _allResources.find(file);
	if (it != _allResources.end()){
		return it->second;
	}
	return 0;
}

GameFile* GameLaucher::getMainJs(){
	return this->getFile(jsMainFile);
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
