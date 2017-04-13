/*
 * NewTextInput.cpp
 *
 *  Created on: Jun 28, 2016
 *      Author: Quyet Nguyen
 */


#include "NewTextField.h"

namespace quyetnd{

TextField::TextField(){
	_isEnable = true;
	_touchListener = 0;
	inputText = "";
	isPassword = false;
	isAttachWithIME = false;

	_keyboardMe = false;
	_keyboardShowMe = false;

	_cursorSprite = 0;
	maxLength = 0;

	_returnCallback = nullptr;
	_focusCallback = nullptr;
	_textChangeCallback = nullptr;

	_TextFieldTTF = false;
	_autoDetachWithIME = true;

	_alignment = TextFieldAlignment::CENTER;
}

TextField::~TextField(){
	if(!isAttachWithIME){
		IMEKeyboardNotificationInfo info;
		info.duration = 0.0f;
		this->keyboardWillHide(info);

		this->detachWithIME();
	}
	if (_touchListener){
		Director::getInstance()->getEventDispatcher()->removeEventListener(_touchListener);
		_touchListener = 0;
	}
	Director::getInstance()->getEventDispatcher()->removeEventListenersForTarget(this);
}

TextField* TextField::createWithTTFFont(const Size& size, const std::string& textFont, float textFontSize, const std::string& placeHolderFont, float placeHolderFontSize){
	TextField* textField = new TextField();
	textField->initWithTTFFont(size, textFont, textFontSize, placeHolderFont, placeHolderFontSize);
	textField->autorelease();
	return textField;
}

TextField* TextField::createWithBMFont(const Size& size, const std::string& textFont, const std::string& placeHolderFont){
	TextField* textField = new TextField();
	textField->initWithBMFont(size, textFont, placeHolderFont);
	textField->autorelease();
	return textField;
}

bool TextField::checkVisible(){
	Node* node = this;
	while (node){
		if (!node->isVisible()){
			return false;
		}
		node = node->getParent();
	}
	return true;
}

std::string _newui_subStringOfUTF8String(const std::string& str, std::string::size_type start, std::string::size_type length)
{
	if (length == 0)
	{
		return "";
	}
	std::string::size_type c, i, ix, q, min = std::string::npos, max = std::string::npos;
	for (q = 0, i = 0, ix = str.length(); i < ix; i++, q++)
	{
		if (q == start)
		{
			min = i;
		}
		if (q <= start + length || length == std::string::npos)
		{
			max = i;
		}

		c = (unsigned char)str[i];

		if (c <= 127) i += 0;
		else if ((c & 0xE0) == 0xC0) i += 1;
		else if ((c & 0xF0) == 0xE0) i += 2;
		else if ((c & 0xF8) == 0xF0) i += 3;
		else return "";//invalid utf8
	}
	if (q <= start + length || length == std::string::npos)
	{
		max = i;
	}
	if (min == std::string::npos || max == std::string::npos)
	{
		return "";
	}
	return str.substr(min, max);
}

void TextField::updateText(){
	if (isPassword){
		std::string displayText = "";
		for (int i = 0; i < inputText.length(); i++){
			displayText.append("*");
		}
		_textLabel->setString(displayText);
	}
	else{
		_textLabel->setString(inputText);
	}

	if(isAttachWithIME){
		_placeHolderLabel->setVisible(false);
	}
	else{
		if (inputText == ""){
			_placeHolderLabel->setVisible(true);
		}
		else{
			_placeHolderLabel->setVisible(false);
		}
	}

	this->updateTextSize();
}

void TextField::updateTextSize(){
	if (_alignment == TextFieldAlignment::CENTER){
		updateTextSizeCenter();
	}
	else if (_alignment == TextFieldAlignment::LEFT){
		updateTextSizeLeft();
	}
}

void TextField::updateTextSizeCenter(){
	if (isAttachWithIME){
		float textMargin = 0.0f;
		if (_cursorSprite){
			textMargin = _cursorSprite->getContentSize().width + 2.0f;
		}

		float w = _textLabel->getContentSize().width + textMargin;
		if (w > this->getContentSize().width){
			float _x = this->getContentSize().width - textMargin - _textLabel->getContentSize().width / 2;
			_textLabel->setPositionX(_x);
		}
		else{
			_textLabel->setPositionX(this->getContentSize().width / 2);
		}

		if (_cursorSprite){
			float _x = _textLabel->getPositionX() + _textLabel->getContentSize().width / 2 + _cursorSprite->getContentSize().width / 2;
			_cursorSprite->setPositionX(_x);
		}
	}
	else{
		if (_textLabel->getContentSize().width > this->getContentSize().width){
			_textLabel->setPositionX(_textLabel->getContentSize().width / 2);
		}
		else{

			_textLabel->setPositionX(this->getContentSize().width / 2);
		}
	}
}

void TextField::updateTextSizeLeft(){
	if (isAttachWithIME){
		float textMargin = 0.0f;
		if (_cursorSprite){
			textMargin = _cursorSprite->getContentSize().width + 2.0f;
		}

		float w = _textLabel->getContentSize().width + textMargin;
		if (w > this->getContentSize().width){
			float _x = this->getContentSize().width - textMargin - _textLabel->getContentSize().width;
			_textLabel->setPositionX(_x);
		}
		else{
			_textLabel->setPositionX(0.0f);
		}

		if (_cursorSprite){
			float _x = _textLabel->getPositionX() + _textLabel->getContentSize().width + _cursorSprite->getContentSize().width / 2;
			_cursorSprite->setPositionX(_x);
		}
	}
	else{
		_textLabel->setPositionX(0.0f);
	}
}

void TextField::initWithSize(const Size& size){
	Node::init();

	//auto layerColor = LayerColor::create(Color4B(255, 0, 0, 255), size.width, size.height);
	//layerColor->setAnchorPoint(Point::ZERO);
	//layerColor->setPosition(Point::ZERO);
	//this->addChild(layerColor);

	this->setContentSize(size);
	this->setAnchorPoint(Point(0.5f, 0.5f));
	_touchRect.setRect(0, 0, size.width, size.height);

	auto mTouch = EventListenerTouchOneByOne::create();
	mTouch->setSwallowTouches(true);
	mTouch->onTouchBegan = [=](Touch* t, Event*){
		if (!_isEnable){
			return false;
		}

		if (this->isRunning() && this->checkVisible()){
			if (isAttachWithIME){
				_autoDetachWithIME = true;
				if (this->detachWithIME()){
					return true;
				}
				else{
					_autoDetachWithIME = false;
				}
			}
			else{
				auto p = this->convertToNodeSpace(t->getLocation());
				if (_touchRect.containsPoint(p)){
					if (!isAttachWithIME){
						if (this->attachWithIME()){
							_autoDetachWithIME = false;
							return true;
						}
					}
				}
			}
		}
		return false;		
	};

	Director::getInstance()->getEventDispatcher()->addEventListenerWithSceneGraphPriority(mTouch, this);


	auto showTouch = EventListenerTouchOneByOne::create();
	showTouch->setSwallowTouches(true);
	showTouch->onTouchBegan = [=](Touch* t, Event*){
		if (isAttachWithIME){
			if (this->isRunning() && this->checkVisible()){
				_autoDetachWithIME = true;
				if (this->detachWithIME()){
					return true;
				}
				else{
					_autoDetachWithIME = false;
				}
			}		
		}	
		return false;
	};
	Director::getInstance()->getEventDispatcher()->addEventListenerWithFixedPriority(showTouch, -128);
	_touchListener = showTouch;

	clippingNode = ClippingRectangleNode::create(_touchRect);
	clippingNode->setAnchorPoint(Point::ZERO);
	clippingNode->setPosition(Point::ZERO); 
	this->addChild(clippingNode);
}

void TextField::initWithTTFFont(const Size& size, const std::string& textFont, float textFontSize, const std::string& placeHolderFont, float placeHolderFontSize){
	this->initWithSize(size);

	_textLabel = Label::createWithTTF("", textFont, textFontSize, Size::ZERO, TextHAlignment::CENTER);
	_textLabel->setPosition(this->getContentSize().width / 2, this->getContentSize().height / 2);
	clippingNode->addChild(_textLabel);

	if (placeHolderFontSize < 0){
		placeHolderFontSize = textFontSize;
	}
	if (placeHolderFont == ""){
		_placeHolderLabel = Label::createWithTTF("", textFont, placeHolderFontSize, Size::ZERO, TextHAlignment::CENTER);
	}
	else{
		_placeHolderLabel = Label::createWithTTF("", placeHolderFont, placeHolderFontSize, Size::ZERO, TextHAlignment::CENTER);
	}
	_placeHolderLabel->setPosition(this->getContentSize().width / 2, this->getContentSize().height / 2);
	clippingNode->addChild(_placeHolderLabel);

	_cursorSprite = Label::createWithTTF("|", textFont, textFontSize);
	_cursorSprite->setPosition(_textLabel->getPosition());
	_cursorSprite->setVisible(false);
	this->addChild(_cursorSprite);

	_TextFieldTTF = true;

	setAlignment(_alignment);
	this->updateText();
}

void TextField::initWithBMFont(const Size& size, const std::string& textFont, const std::string& placeHolderFont){
	this->initWithSize(size);

	_textLabel = Label::createWithBMFont(textFont, "", TextHAlignment::CENTER);
	_textLabel->setPosition(this->getContentSize().width / 2, this->getContentSize().height / 2);
	clippingNode->addChild(_textLabel);

	if (placeHolderFont == ""){
		_placeHolderLabel = Label::createWithBMFont(textFont, "", TextHAlignment::CENTER);
	}
	else{
		_placeHolderLabel = Label::createWithBMFont(placeHolderFont, "", TextHAlignment::CENTER);
	}
	_placeHolderLabel->setPosition(this->getContentSize().width / 2, this->getContentSize().height / 2);
	clippingNode->addChild(_placeHolderLabel);

	_cursorSprite = Label::createWithBMFont(textFont, "|");
	_cursorSprite->setPosition(_textLabel->getPosition());
	_cursorSprite->setVisible(false);
	this->addChild(_cursorSprite);

	setAlignment(_alignment);
	this->updateText();
}

void TextField::setPlaceHolder(const std::string& placeHolder){
	_placeHolderLabel->setString(placeHolder);
}

void TextField::setText(const std::string& text){
	inputText = text;
	if (maxLength > 0){
		int charCount = StringUtils::getCharacterCountInUTF8String(inputText);
		if (charCount > maxLength){
			inputText = _newui_subStringOfUTF8String(inputText, 0, maxLength);
		}
	}
	_textLabel->setString(inputText);
	this->updateText();
}

const std::string& TextField::getText(){
	return inputText;
}

void TextField::setTextColor(const Color3B& color){
	_textLabel->setColor(color);
}

void TextField::setPlaceHolderColor(const Color3B& color){
	_placeHolderLabel->setColor(color);
}

void TextField::setTextColor(const Color4B& color){
	if (_TextFieldTTF){
		_textLabel->setTextColor(color);
	}
	else{
		this->setTextColor(Color3B(color));
	}
}

void TextField::setPlaceHolderColor(const Color4B& color){
	if (_TextFieldTTF){
		_placeHolderLabel->setTextColor(color);
	}
	else{
		this->setPlaceHolderColor(Color3B(color));
	}
}

void TextField::setPasswordEnable(bool isPassword){
	this->isPassword = isPassword;
	this->updateText();
}

void TextField::setMaxLength(int maxLength){
	this->maxLength = maxLength; 
}

void TextField::onEnter(){
	Node::onEnter();
}

void TextField::setEnable(bool isEnable){
	_isEnable = isEnable;
}

void TextField::onExit(){
	Node::onExit();
	if(_keyboardShowMe){
		Scene* scene = Director::getInstance()->getRunningScene();
		if(scene){
			scene->setPositionY(0.0f);
		}
	}
	if (isAttachWithIME){
		_autoDetachWithIME = true;
		this->detachWithIME();
	}
}

bool TextField::canAttachWithIME(){
	if (!_running || !this->checkVisible()){
		return false;
	}
	return true;
}

bool TextField::canDetachWithIME(){
	return _autoDetachWithIME;
}

void TextField::didAttachWithIME(){
	isAttachWithIME = true;
	if (_cursorSprite){
		_cursorSprite->stopAllActions();
		_cursorSprite->setVisible(true);
		auto action = Sequence::createWithTwoActions(
			Blink::create(0.3f, 1),
			Blink::create(0.3f, 0)
			);
		_cursorSprite->runAction(RepeatForever::create(action));
	}
	//log("didAttachWithIME");
	this->updateText();
	if (_focusCallback){
		_focusCallback(true);
	}
}

void TextField::didDetachWithIME(){
	//log("didDetachWithIME");
	isAttachWithIME = false;
	_keyboardMe = false;
	if (_cursorSprite){
		_cursorSprite->stopAllActions();
		_cursorSprite->setVisible(false);
	}
	
	this->updateText();
	if (_focusCallback){
		_focusCallback(false);
	}
}

//static std::size_t _calcCharCount(const char * text)
//{
//	int n = 0;
//	char ch = 0;
//	while ((ch = *text))
//	{
//		CC_BREAK_IF(!ch);
//
//		if (0x80 != (0xC0 & ch))
//		{
//			++n;
//		}
//		++text;
//	}
//	return n;
//}

void TextField::insertText(const char * text, size_t len){
	//log("insertText : %s -- %d", text, len);
	std::string insert(text, len);

	// insert \n means input end
	int pos = static_cast<int>(insert.find((char)TextFormatter::NewLine));
	if ((int)insert.npos != pos)
	{
		len = pos;
		insert.erase(pos);
	}

	if (len > 0){
		std::string newText = inputText;
		newText.append(insert);
		if (maxLength > 0){
			int charCount = StringUtils::getCharacterCountInUTF8String(newText);
			if (charCount > maxLength){
				newText = _newui_subStringOfUTF8String(newText, 0, maxLength);
			}
		}

		if (_textChangeCallback && _textChangeCallback(TextChangeType::INSERT, newText)){
			return;
		}

		inputText = newText;	
		this->updateText();
	}

	if ((int)insert.npos == pos) {
		return;
	}
	if (_returnCallback && _returnCallback(this)){
		return;
	}
	// if callback hasn't processed, detach from IME by default
	_autoDetachWithIME = true;
	this->detachWithIME();
}

void TextField::deleteBackward(){
	//inputText.erase(inputText.en)
//	log("deleteBackward");

	size_t len = inputText.length();
	if (!len){
		// there is no string
		return;
	}

	// get the delete byte number
	size_t deleteLen = 1;    // default, erase 1 byte
	while (0x80 == (0xC0 & inputText.at(len - deleteLen))){
		++deleteLen;
	}

	std::string newText = "";
	if (len > deleteLen){
		newText = inputText.substr(0, len - deleteLen);
	}
	newText = inputText.substr(0, len - deleteLen);

	if (_textChangeCallback && _textChangeCallback(TextChangeType::DELETE, newText)){
		// delegate doesn't want to delete backwards
		return;
	}

	inputText = newText;
	this->updateText();
}

const std::string& TextField::getContentText(){
	return inputText;
}

void TextField::keyboardWillShow(IMEKeyboardNotificationInfo& info){
	if (_keyboardMe){
		Point p = this->convertToWorldSpace(Point::ZERO);
		Scene* scene = Director::getInstance()->getRunningScene();
		if(scene){
			if(info.end.size.height > p.y){
				//log("keyboardWillShow : %f", info.end.size.height);
				_keyboardShowMe = true;
				float _y = info.end.size.height - p.y;

				if(info.duration > 0){
					scene->stopAllActionsByTag(1234);
					scene->runAction(MoveTo::create(info.duration, Point(0.0f, _y)));
				}
				else{
					scene->setPositionY(_y);
				}
			}
		}
	}
}

void TextField::keyboardDidShow(IMEKeyboardNotificationInfo& info){

}

void TextField::keyboardWillHide(IMEKeyboardNotificationInfo& info){
	if(_keyboardShowMe){
		_keyboardShowMe = false;
		Scene* scene = Director::getInstance()->getRunningScene();
		if(scene){
			if(info.duration > 0.0f){
				scene->stopAllActionsByTag(1234);
				scene->runAction(MoveTo::create(info.duration, Point::ZERO));
			}
			else{;
				scene->setPositionY(0.0f);
			}
		}
	}


}

void TextField::keyboardDidHide(IMEKeyboardNotificationInfo& info){
	//log("keyboardDidHide");
}

bool TextField::attachWithIME(){
	bool ret = IMEDelegate::attachWithIME();
	if (ret){
		// open keyboard
		auto pGlView = Director::getInstance()->getOpenGLView();
		if (pGlView){
			_keyboardMe = true;
			pGlView->setIMEKeyboardState(true);
		}
	}
	return ret;
}

bool TextField::detachWithIME(){
	bool ret = IMEDelegate::detachWithIME();
	if (ret){
		// close keyboard
		auto glView = Director::getInstance()->getOpenGLView();
		if (glView){
			_keyboardMe = false;
			glView->setIMEKeyboardState(false);
		}
	}
	return ret;
}

void TextField::setReturnCallback(const TextFieldReturnCallback& callback){
	this->_returnCallback = callback;
}

void TextField::setFocusListener(std::function<void(bool)>& callback){
	this->_focusCallback = callback;
}

void TextField::setTextChangeListener(std::function<bool(int, const std::string&)>& callback){
	this->_textChangeCallback = callback;
}

void TextField::setAlignment(int alignment){
	_alignment = alignment;
	if (_alignment == TextFieldAlignment::CENTER){
		_textLabel->setAnchorPoint(Point(0.5f, 0.5f));
		_placeHolderLabel->setAnchorPoint(Point(0.5f, 0.5f));
		_placeHolderLabel->setPositionX(this->getContentSize().width / 2);
	}
	else if (_alignment == TextFieldAlignment::LEFT){
		_textLabel->setAnchorPoint(Point(0.0f, 0.5f));
		_placeHolderLabel->setAnchorPoint(Point(0.0f, 0.5f));
		_placeHolderLabel->setPositionX(0.0f);
	}
	this->updateTextSize();
}

void TextField::showKeyboard(){
	if (!isAttachWithIME){
		this->attachWithIME();
	}
}

void TextField::hideKeyboard(){
	if (isAttachWithIME){
		auto flag = _autoDetachWithIME;
		_autoDetachWithIME = true;
		if (this->detachWithIME()){
			_autoDetachWithIME = false;
		}
		_autoDetachWithIME = flag;
	}
}

} /* namespace quyetnd */
