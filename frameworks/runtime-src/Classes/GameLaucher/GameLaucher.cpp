/*
 * GameLaucher.cpp
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#include "GameLaucher.h"
#include "json/rapidjson.h"
#include "json/document.h"
#include "cocos2d.h"
USING_NS_CC;

namespace quyetnd {

GameLaucher::GameLaucher() {
	// TODO Auto-generated constructor stub
	versionFile = "";
	statusCallback = nullptr;
	downloadCallback = nullptr;
	resourceHost = "http://10.0.1.106/quyetnd/Game/";
}

GameLaucher::~GameLaucher() {
	// TODO Auto-generated destructor stub
	for (auto it = _allResources.begin(); it != _allResources.end(); it++){
		delete it->second;
	}
	_allResources.clear();
}

bool GameLaucher::checkFileExist(const std::string& file){
	bool pret = false;
	FILE* f = fopen(file.c_str(), "rb");
	if (f){
		pret = true;
		fclose(f);
	}
	return pret;
}

void GameLaucher::checkFiles(){
	std::vector<GameFile*> _resourceUpdate;

	ssize_t fileSize;
	char* data = (char*)FileUtils::getInstance()->getFileData(versionFile, "rb", &fileSize);

	std::vector<char> buffer(data, data + fileSize);
	buffer.push_back('\0');
	delete[] data;

	rapidjson::Document doc;
	doc.Parse<0>(buffer.data());
	std::string versionName = doc["versionName"].GetString();
	uint32_t versionCode = doc["versionCode"].GetInt();

	const rapidjson::Value& files = doc["files"];
	for (int i = 0; i < files.Size(); i++){
		const rapidjson::Value& fileData = files[i];

		GameFile* resource = new GameFile();
		resource->fileName = fileData["file"].GetString();
		resource->md5Digest = fileData["hash"].GetString();
		resource->fileSize = fileData["hash"].GetUint();

		_allResources.insert(std::make_pair(resource->fileName, resource));
	}

	this->onProcessStatus(GameLaucherStatus_TestHash);
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
		//downloadMaxValue = _resourceUpdate.size();
		this->onProcessStatus(GameLaucherStatus_Updating);
		for (int i = 0; i < _resourceUpdate.size();){
			auto pret = _resourceUpdate[i]->update(resourceHost + _resourceUpdate[i]->fileName);
			if (pret == 0){
				i++;
				//this->onUpdateDownloadProcess(1);
			}
			else{
				this->onProcessStatus(GameLaucherStatus_UpdateFailure);
				return;
			}
		}
	}
	this->onProcessStatus(GameLaucherStatus_Finished);
}

bool GameLaucher::startFromFile(const std::string& versionFile){
	this->versionFile = versionFile;
	this->status = GameLaucherStatus_TestVersion;
	std::thread checkThread(&GameLaucher::checkFiles, this);
	checkThread.detach();
	return true;
}

//int GameLaucher::getStatus(){
//	std::unique_lock<std::mutex> lk(status_mutex);
//	return status;
//}
//
//void GameLaucher::getDownloadStatus(int &current, int& max){
//	std::unique_lock<std::mutex> lk(status_mutex);
//	current = this->cDownload;
//	max = this->maxDownload;
//}

void GameLaucher::update(float dt){
	std::unique_lock<std::mutex> lk(event_mutex);
	for(int i=0;i<events.size();i++){
		events[i]();
	}
	events.clear();
}

void GameLaucher::onUpdateDownloadProcess(int size){
	std::unique_lock<std::mutex> lk(event_mutex);
	downloadCurrentValue += size;
	auto eventCallback = [=](){
		if(this->downloadCallback){
			this->downloadCallback(downloadCurrentValue, downloadMaxValue);
		}
	};
	events.push_back(eventCallback);
}

void GameLaucher::onProcessStatus(GameLaucherStatus status){
	std::unique_lock<std::mutex> lk(event_mutex);
	this->status = status;
	auto eventCallback = [=](){
		if(this->statusCallback){
			this->statusCallback(status);
		}
	};
	events.push_back(eventCallback);
}

GameFile* GameLaucher::getFile(const std::string& file){
	auto it = _allResources.find(file);
	if (it != _allResources.end()){
		return it->second;
	}
	return 0;
}

static GameLaucher* s_GameLaucher = 0;

GameLaucher* GameLaucher::getInstance(){
	if (!s_GameLaucher){
		s_GameLaucher = new GameLaucher();
	}
	return s_GameLaucher;
}

} /* namespace quyetnd */
