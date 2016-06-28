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

		_allResources.insert(std::make_pair(resource->fileName, resource));
	}

	status_mutex.lock();
	this->status = GameLaucherStatus_TestHash;
	status_mutex.unlock();

	for (auto it = _allResources.begin(); it != _allResources.end(); it++){
		if (it->second->test()){
			CCLOG("HASH true: %s", it->second->filePath.c_str());
		}
		else{
			CCLOG("HASH false: %s", it->second->fileName.c_str());
			_resourceUpdate.push_back(it->second);
		}	
	}

	if (_resourceUpdate.size() > 0){
		status_mutex.lock();
		this->status = GameLaucherStatus_Updating;
		status_mutex.unlock();

		for (int i = 0; i < _resourceUpdate.size();){
			auto pret = _resourceUpdate[i]->update("https://genknews.vcmedia.vn/k:2016/1-1467047402424/10bophimthamhoachothaysucmanhdangsocuametunhien.jpg");
			if (pret == 0){
				i++;
			}
			else{
				status_mutex.lock();
				this->status = GameLaucherStatus_UpdateFailure;
				status_mutex.unlock();
				return;
			}
		}
	}
	
	status_mutex.lock();
	this->status = GameLaucherStatus_Finished;
	status_mutex.unlock();	
}

bool GameLaucher::startFromFile(const std::string& versionFile){
	this->versionFile = versionFile;
	this->status = GameLaucherStatus_TestVersion;
	std::thread checkThread(&GameLaucher::checkFiles, this);
	checkThread.detach();
	return true;
}

int GameLaucher::getStatus(){
	std::unique_lock<std::mutex> lk(status_mutex);
	return status;
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
