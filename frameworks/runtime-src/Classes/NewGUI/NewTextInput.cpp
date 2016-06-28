/*
 * NewTextInput.cpp
 *
 *  Created on: Jun 28, 2016
 *      Author: Quyet Nguyen
 */


#include "NewTextInput.h"

#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
#include "ui/UIEditBox/UIEditBoxImpl-ios.h"
#elif CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#include "ui/UIEditBox/UIEditBoxImpl-android.h"
#elif CC_TARGET_PLATFORM == CC_PLATFORM_WINRT
#include "ui/UIEditBox/UIEditBoxImpl-winrt.h"
#elif CC_TARGET_PLATFORM == CC_PLATFORM_WIN32
#include "ui/UIEditBox/UIEditBoxImpl-win32.h"
#elif CC_TARGET_PLATFORM == CC_PLATFORM_MAC
#include "ui/UIEditBox/UIEditBoxImpl-mac.h"
#elif CC_TARGET_PLATFORM == CC_PLATFORM_LINUX
#include "ui/UIEditBox/UIEditBoxImpl-linux.h"
#elif CC_TARGET_PLATFORM == CC_PLATFORM_TIZEN
#include "ui/UIEditBox/UIEditBoxImpl-tizen.h"
#else

#endif

namespace quyetnd {

	EditBox::EditBox() {
	// TODO Auto-generated constructor stub
	_backgroundSprite = 0;

	_marginLeft = 0;
	_marginRight = 0;
	_marginTop = 0;
	_marginBottom = 0;
}

	EditBox::~EditBox() {
	// TODO Auto-generated destructor stub
}

	bool EditBox::initWithSize(const Size& size){
	if (ui::Widget::init()){				
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
		_editBoxImpl = new ui::EditBoxImplIOS(this);
#elif CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
		_editBoxImpl = new ui::EditBoxImplAndroid(this);
#elif CC_TARGET_PLATFORM == CC_PLATFORM_WINRT
		_editBoxImpl = new ui::UIEditBoxImplWinrt(this);
#elif CC_TARGET_PLATFORM == CC_PLATFORM_WIN32
		_editBoxImpl = new (std::nothrow) ui::EditBoxImplWin(this);
#elif CC_TARGET_PLATFORM == CC_PLATFORM_MAC
		_editBoxImpl = new ui::EditBoxImplMac(this);
#elif CC_TARGET_PLATFORM == CC_PLATFORM_LINUX
		_editBoxImpl = new ui::EditBoxImplLinux(this);
#elif CC_TARGET_PLATFORM == CC_PLATFORM_TIZEN
		_editBoxImpl = new ui::EditBoxImplTizen(this);
#else
		_editBoxImpl = 0;
#endif
		if (_editBoxImpl){
			_editBoxImpl->initWithSize(size);
			_editBoxImpl->setInputMode(ui::EditBox::InputMode::ANY);
		}				
		this->setContentSize(size);
		this->setPosition(Vec2(0, 0));

		this->setTouchEnabled(true);
		this->addTouchEventListener(CC_CALLBACK_2(EditBox::touchDownAction, this));

		return true;
	}
	return false;
}

void EditBox::setBackgoundMargin(float left, float top, float right, float bottom){
	_marginLeft = left;
	_marginRight = right;
	_marginTop = top;
	_marginBottom = bottom;
	_contentSizeDirty = true;
}

void EditBox::adaptRenderers(){
	if (_contentSizeDirty){
		if (_backgroundSprite){
			_backgroundSprite->setContentSize(_contentSize + Size(_marginLeft + _marginRight, _marginTop + _marginBottom));
			_backgroundSprite->setPosition(Vec2(_contentSize.width / 2, _contentSize.height / 2) +
				Point((_marginLeft - _marginRight) / 2, (_marginBottom - _marginTop) / 2));
		}	
	}
}


EditBox* EditBox::create(const Size& size,const std::string& normalSprite,ui::Widget::TextureResType texType){
	EditBox* pRet = new (std::nothrow) EditBox();
	if (pRet != nullptr && pRet->initWithSizeAndBackgroundSprite(size, normalSprite, texType)){
		pRet->autorelease();
	}
	else{
		CC_SAFE_DELETE(pRet);
	}

	return pRet;
}

EditBox* EditBox::create(const cocos2d::Size &size, cocos2d::ui::Scale9Sprite *normalSprite, ui::Scale9Sprite *pressedSprite, ui::Scale9Sprite* disabledSprite){
	EditBox* pRet = new (std::nothrow) EditBox();
	if (pRet != nullptr && pRet->initWithSizeAndBackgroundSprite(size, normalSprite)){
		pRet->autorelease();
	}
	else{
		CC_SAFE_DELETE(pRet);
	}

	return pRet;
}

EditBox* EditBox::create(const Size& size){
	EditBox* pRet = new (std::nothrow) EditBox();
	if (pRet != nullptr && pRet->initWithSize(size)){
		pRet->autorelease();
	}
	else{
		CC_SAFE_DELETE(pRet);
	}

	return pRet;
}

} /* namespace quyetnd */
