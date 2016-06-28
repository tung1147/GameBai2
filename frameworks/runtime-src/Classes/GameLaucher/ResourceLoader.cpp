/*
 * ResourceLoader.cpp
 *
 *  Created on: Dec 15, 2015
 *      Author: QuyetNguyen
 */

#include "ResourceLoader.h"
#include "2d/CCFontAtlasCache.h"
#include "audio/include/SimpleAudioEngine.h"
using namespace CocosDenshion;

namespace quyetnd {

ResourceLoader::ResourceLoader() {
	// TODO Auto-generated constructor stub
	_preFinishedHandler = nullptr;
	running = false;
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

void ResourceLoader::setPreFinishedHandler(const LoaderPreFinishdHandler& handler){
	_preFinishedHandler = handler;
}

void ResourceLoader::update(float dt){
	if (running){
		//TextureCache* textureCache = Director::getInstance()->getTextureCache();
		//SpriteFrameCache* spriteCache = SpriteFrameCache::getInstance();
		//SimpleAudioEngine* audioEngine = SimpleAudioEngine::getInstance();

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

					SimpleAudioEngine* audioEngine = SimpleAudioEngine::getInstance();
					audioEngine->unloadEffect(_unloadSound[index].c_str());

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
					CCLOG("load texture: %s -- plist: %s....", textureImg.c_str(), plistData.c_str());
                    

					TextureCache* textureCache = Director::getInstance()->getTextureCache();
					textureCache->addImageAsync(textureImg, [=](Texture2D* texture){
						if (texture){
							CCLOG("load texture: %s OK!!!!!", textureImg.c_str());

							if (plistData != ""){
								SpriteFrameCache* spriteCache = SpriteFrameCache::getInstance();
								spriteCache->addSpriteFramesWithFileContent(plistData, texture);
							}
						}
						else{
							CCLOG("load texture: %s FAILURE!!!!!", textureImg.c_str());
						}
						
						index++;
						currentStep++;
						onProcessLoader();
						step = kStepLoadImage; 
					});

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
					CCLOG("load fonts: %s -- font: %s", _preloadBMFont[index].texture.c_str(), _preloadBMFont[index].font.c_str());

					TextureCache* textureCache = Director::getInstance()->getTextureCache();
					textureCache->addImageAsync(_preloadBMFont[index].texture, [=](Texture2D* texture){
						FontAtlasCache::getFontAtlasFNT(_preloadBMFont[index].font);

						index++;
						currentStep++;
						onProcessLoader();
						step = kStepLoadBMFont;
					});					
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
					SimpleAudioEngine* audioEngine = SimpleAudioEngine::getInstance();
					audioEngine->preloadEffect(_preloadSound[index].c_str());

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
				if (_preFinishedHandler){
					_preFinishedHandler();
					_preFinishedHandler = nullptr;
				}
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
				onFinishedLoader();
				break;
			}
		}

	}
}

void ResourceLoader::start(const LoaderFinishedHandler &finishedHandler, const LoaderProcessHandler &processHandler){
	_finishedHandler = finishedHandler;
	_processHandler = processHandler;

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

	Director::getInstance()->getScheduler()->unscheduleUpdate(this);
	Director::getInstance()->getScheduler()->scheduleUpdate(this, INT_MIN, false);
}

void ResourceLoader::stop(){
	running = false;
	Director::getInstance()->getScheduler()->unscheduleUpdate(this);
}

void ResourceLoader::onProcessLoader(){
	if (_processHandler){
		_processHandler(currentStep, targetStep);
	}
}

void ResourceLoader::onFinishedLoader(){
	if (_finishedHandler){
		_finishedHandler();
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

} /* namespace quyetnd */
