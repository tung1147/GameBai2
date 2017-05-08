/*
 * ResourceLoader.cpp
 *
 *  Created on: Dec 15, 2015
 *      Author: QuyetNguyen
 */

#include "ResourceLoader.h"
#include "2d/CCFontAtlasCache.h"
#include "audio/include/AudioEngine.h"
#include "GameLaucher.h"
#include "WorkerManager.h"

namespace quyetnd {

ResourceLoader::ResourceLoader() {
	// TODO Auto-generated constructor stub
	running = false;
	processHandler = nullptr;
}

ResourceLoader::~ResourceLoader() {
	// TODO Auto-generated destructor stub
	Director::getInstance()->getScheduler()->unscheduleAllForTarget(this);
	this->stop();
	CCLOG("ResourceLoader::~ResourceLoader");
}

//std::string ResourceLoader::getFullPath(const std::string& fileName){
//	std::unique_lock<std::mutex> lk(fileUtilsMutex);
//	return FileUtils::getInstance()->fullPathForFilename(fileName);
//}

void ResourceLoader::addTextureLoad(const std::string &img, const std::string &plist){
	TextureData textureLoad;
	textureLoad.texture = img;
	textureLoad.plist = plist;
	_preLoad.push_back(textureLoad);
}

void ResourceLoader::addBMFontLoad(const std::string &texture, const std::string &font){
	BMFontData fontData;
	fontData.texture = texture;
	fontData.font = font;
	_preloadBMFont.push_back(fontData);
}

void ResourceLoader::addTextureUnLoad(const std::string &img, const std::string &plist){
	TextureData textureLoad;
	textureLoad.texture = img;
	textureLoad.plist = plist;
	_preUnload.push_back(textureLoad);
}

void ResourceLoader::addSoundPreload(const std::string& sound){
	_preloadSound.push_back(sound);
}

void ResourceLoader::addSoundUnload(const std::string& sound){
	_unloadSound.push_back(sound);
}

void ResourceLoader::loadTexture(const std::string& img, std::function<void(cocos2d::Texture2D*)> callback){
	std::string fullpath = FileUtils::getInstance()->fullPathForFilename(img);
	Texture2D* texture = TextureCache::getInstance()->getTextureForKey(fullpath);
	if (texture){
		UIThread::getInstance()->runOnUI([=](){
			callback(texture);
		});
		return;
	}
	else{
		Data data = FileUtils::getInstance()->getDataFromFile(fullpath);
		if (!data.isNull()){
			Image* imageData = new Image();
			imageData->initWithImageData(data.getBytes(), data.getSize());			
			UIThread::getInstance()->runOnUI([=](){
				Texture2D* texture = TextureCache::getInstance()->addImage(imageData, fullpath);
				callback(texture);
				imageData->release();
				//delete imageData;
			});
			return;
		}
	}
	UIThread::getInstance()->runOnUI([=](){
		callback(0);
	});
}

void ResourceLoader::update(float dt){
	if (running){
		switch (step)
		{
			case kStepUnloadImage:
			{	
				if (index < _preUnload.size()){
					TextureCache* textureCache = Director::getInstance()->getTextureCache();
					Texture2D* texture = textureCache->getTextureForKey(_preUnload[index].texture);
					if (texture){
						SpriteFrameCache* spriteCache = SpriteFrameCache::getInstance();
						TextureCache* textureCache = Director::getInstance()->getTextureCache();

						spriteCache->removeSpriteFramesFromTexture(texture);
						textureCache->removeTexture(texture);
					}
					
					currentStep++;
					index++;
					onProcessLoader();				
				}
				else{
					index = 0;
					step = kStepUnloadSound;
				}

				break;
			}

			case kStepUnloadSound:
			{
				if (index < _unloadSound.size()){
					CCLOG("unload sound: %s", _unloadSound[index].c_str());
					cocos2d::experimental::AudioEngine::uncache(_unloadSound[index]);

					index++;
					currentStep++;
					onProcessLoader();
				}
				else{
					index = 0;
					step = kStepLoadImage;
				}

				break;
			}

			case kStepLoadImage:
			{	
				if (_preLoad.size() > 0){
					step = kStepWaitingLoadImage;
					for (int i = 0; i < _preLoad.size(); i++){
						auto textureImg = _preLoad[i].texture;
						auto plistData = _preLoad[i].plist;
						WorkerManager::getInstance()->pushAction([=](){
							this->loadTextureAction(textureImg, plistData);
						});
					}
				}
				else{
					step = kStepLoadBMFont;
				}
				
				break;
			}

			case kStepLoadBMFont:
			{	
				if (_preloadBMFont.size() > 0){
					step = kStepWaitingLoadImage;
					for (int i = 0; i < _preloadBMFont.size(); i++){
						auto textureImg = _preloadBMFont[i].texture;
						auto fntData = _preloadBMFont[i].font;
						WorkerManager::getInstance()->pushAction([=](){
							this->loadBitmapAction(textureImg, fntData);
						});
					}
					break;
				}
				else{
					step = kStepLoadSound;
				}
			}

			case kStepWaitingLoadImage:
			{
				break;
			}

			case kStepLoadSound:
			{
				if (index < _preloadSound.size()){
					auto n = _preloadSound.size() - index;
					if (n > 10){
						n = 10;
					}
					for (auto i = 0; i < n; i++){
						CCLOG("load sound: %s", _preloadSound[index + i].c_str());
						cocos2d::experimental::AudioEngine::preload(_preloadSound[index + i]);
					}
					
					index += n;
					currentStep += n;
					onProcessLoader();
				}
				else{
					index = 0;
					step = kStepPreFinishLoadResource;
				}	
				break;
			}

			case kStepPreFinishLoadResource:
			{	
				currentStep++;
				onProcessLoader();
				step = kStepFinishLoadResource;
				break;
			}

			case kStepFinishLoadResource:
			{	
				/*clear all*/
				_preLoad.clear();
				_preUnload.clear();
				_preloadBMFont.clear();
				_preloadSound.clear();
				_unloadSound.clear();
				/**/
				running = false;
				break;
			}
		}

	}
}

void ResourceLoader::start(){
	running = true;
	index = 0;
	currentStep = 0;
	step = kStepUnloadImage;

	targetStep = 1;
	targetStep += _preUnload.size();
	targetStep += _preLoad.size();
	targetStep += _preloadBMFont.size();
	targetStep += _unloadSound.size();
	targetStep += _preloadSound.size();
}

void ResourceLoader::stop(){
	running = false;
}

void ResourceLoader::loadSpriteAction(cocos2d::Texture2D* tex, const std::string& plist){
	if (plist == ""){
		UIThread::getInstance()->runOnUI([=](){
			this->onLoadTextureSuccess();
		});
		return;
	}

	std::string fullpath = FileUtils::getInstance()->fullPathForFilename(plist);
	Data data = FileUtils::getInstance()->getDataFromFile(fullpath);
	if (!data.isNull()){
		std::string plistContent(data.getBytes(), data.getBytes() + data.getSize());

		UIThread::getInstance()->runOnUI([=](){
			SpriteFrameCache::getInstance()->addSpriteFramesWithFileContent(plistContent, tex);
			UIThread::getInstance()->runOnUI([=](){
				this->onLoadTextureSuccess();
			});
		});
		return;
	}

	UIThread::getInstance()->runOnUI([=](){
		CCLOG("load loadSpriteAction failure 3");
	});
}

void ResourceLoader::loadTextureAction(const std::string& img, const std::string& plist){
	this->loadTexture(img, [=](cocos2d::Texture2D* tex){
		if (tex){
			WorkerManager::getInstance()->pushAction([=](){
				this->loadSpriteAction(tex, plist);
			});
		}
		else{
			CCLOG("Load Texture FAILURE: %s", img.c_str());
		}
	});
}

void ResourceLoader::onLoadTextureSuccess(){
	index++;
	currentStep++;
	onProcessLoader();

	if (index >= _preLoad.size()){
		index = 0;
		step = kStepLoadBMFont;
	}
}

void ResourceLoader::loadBitmapAction(const std::string& img, const std::string& fnt){
	this->loadTexture(img, [=](cocos2d::Texture2D* tex){
		if (tex){
			UIThread::getInstance()->runOnUI([=](){
				FontAtlasCache::getFontAtlasFNT(fnt);

				index++;
				currentStep++;
				onProcessLoader();

				if (index >= _preloadBMFont.size()){
					index = 0;
					step = kStepLoadSound;
				}
			});
		}
		else{
			CCLOG("Load Bitmap FAILURE: %s", img.c_str());
		}
	});
}

void ResourceLoader::onLoadBitmapSuccess(){
	FontAtlasCache::getFontAtlasFNT(_preloadBMFont[index].font);
}

void ResourceLoader::onProcessLoader(){
	if (processHandler){
		processHandler(currentStep, targetStep);
	}
}

int ResourceLoader::getMaxStep(){
	targetStep = 1;
	targetStep += _preUnload.size();
	targetStep += _preLoad.size();
	targetStep += _preloadBMFont.size();
	targetStep += _unloadSound.size();
	targetStep += _preloadSound.size();
	return targetStep;
}

int ResourceLoader::getCurrentStep(){
	return currentStep;
}

bool ResourceLoader::isFinished(){
	return (currentStep >= targetStep);
}

} /* namespace quyetnd */
