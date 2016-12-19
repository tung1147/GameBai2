/*
 * ResourceLoader.cpp
 *
 *  Created on: Dec 15, 2015
 *      Author: QuyetNguyen
 */

#include "ResourceLoader.h"
#include "2d/CCFontAtlasCache.h"
//#include "audio/include/SimpleAudioEngine.h"
#include "audio/include/AudioEngine.h"
#include "GameLaucher.h"
//using namespace CocosDenshion;

namespace quyetnd {

ResourceLoader::ResourceLoader() {
	// TODO Auto-generated constructor stub
	running = false;
	processHandler = nullptr;
}

ResourceLoader::~ResourceLoader() {
	// TODO Auto-generated destructor stub
	Director::getInstance()->getScheduler()->unscheduleAllForTarget(this);
	CCLOG("ResourceLoader::~ResourceLoader");
}

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

void ResourceLoader::onLoadImageThread(std::string img, std::function<void(cocos2d::Texture2D*)> callback){
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

void ResourceLoader::onLoadSpriteFrameThread(std::string plist, cocos2d::Texture2D* texture, std::function<void(bool)> callback){
	std::string fullpath = FileUtils::getInstance()->fullPathForFilename(plist);
	Data data = FileUtils::getInstance()->getDataFromFile(fullpath);
	if (!data.isNull()){
		std::string plistContent(data.getBytes(), data.getBytes() + data.getSize());		
		UIThread::getInstance()->runOnUI([=](){
			SpriteFrameCache::getInstance()->addSpriteFramesWithFileContent(plistContent, texture);
			callback(true);
		});
		return;
	}
	UIThread::getInstance()->runOnUI([=](){
		callback(false);
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
					//SimpleAudioEngine* audioEngine = SimpleAudioEngine::getInstance();
					//audioEngine->unloadEffect(_unloadSound[index].c_str());

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
				if (index < _preLoad.size()){
					step = kStepWaitingLoadImage;
                    auto textureImg = _preLoad[index].texture;
                    auto plistData = _preLoad[index].plist;
					CCLOG("loading texture: %s : %s", textureImg.c_str(), plistData.c_str());
					std::thread loadImg(&ResourceLoader::onLoadImageThread, this, textureImg, [=](Texture2D* texture){
						if (texture){
							if (plistData != ""){
								std::thread loadFrame(&ResourceLoader::onLoadSpriteFrameThread, this, plistData, texture, [=](bool ok){
									if (ok){
										index++;
										currentStep++;
										onProcessLoader();
										step = kStepLoadImage;
									}
									else{
										log("load Frame Error: %s", plistData.c_str());
									}
								});
								loadFrame.detach();
							}
							else{
								index++;
								currentStep++;
								onProcessLoader();
								step = kStepLoadImage;
							}
						}
						else{
							log("load Image Error: %s", textureImg.c_str());
						}
					});
					loadImg.detach();
				}
				else{
					index = 0;
					step = kStepLoadBMFont;
				}
				break;
			}

			case kStepLoadBMFont:
			{	
				if (index < _preloadBMFont.size()){
					step = kStepWaitingLoadImage;
					CCLOG("load fonts: %s : %s", _preloadBMFont[index].texture.c_str(), _preloadBMFont[index].font.c_str());
					std::thread loadImg(&ResourceLoader::onLoadImageThread, this, _preloadBMFont[index].texture, [=](Texture2D* texture){
						if (texture){
							FontAtlasCache::getFontAtlasFNT(_preloadBMFont[index].font);

							index++;
							currentStep++;
							onProcessLoader();
							step = kStepLoadBMFont;
						}
						else{
							log("load Image Error: %s", _preloadBMFont[index].texture.c_str());
						}
					});
					loadImg.detach();				
				}
				else{
					index = 0;
					step = kStepLoadSound;
				}
				break;
			}

			case kStepWaitingLoadImage:
			{
				break;
			}

			case kStepLoadSound:
			{
				if (index < _preloadSound.size()){
					CCLOG("load sound: %s", _preloadSound[index].c_str());
					/*SimpleAudioEngine* audioEngine = SimpleAudioEngine::getInstance();
					audioEngine->preloadEffect(_preloadSound[index].c_str());*/
					cocos2d::experimental::AudioEngine::preload(_preloadSound[index]);

					index++;
					currentStep++;
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
