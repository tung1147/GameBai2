/*
 * ListViewWithAdaptor.cpp
 *
 *  Created on: May 16, 2016
 *      Author: Quyet Nguyen
 */

#include "ListViewWithAdapter.h"
namespace quyetnd{

ListViewWithAdaptor::ListViewWithAdaptor(){
	_padding = 0.0f;
	_marginLeft = 0.0f;
	_marginRight = 0.0f;
	_marginTop = 0.0f;
	_marginBottom = 0.0f;

	_lastIndex = -1;
	_createItemCallback = nullptr;
	_itemAdaptor = nullptr;
	_sizeCallback = nullptr;
}

ListViewWithAdaptor::~ListViewWithAdaptor(){

}

void ListViewWithAdaptor::setSizeCallback(const std::function<int()>& sizeCallback){
	_sizeCallback = sizeCallback;
}

void ListViewWithAdaptor::setCreateItemCallback(const std::function<Node*()>& callback){
	_createItemCallback = callback;
}

void ListViewWithAdaptor::setItemAdaptor(const std::function<void(int, Node*)>& adaptor){
	_itemAdaptor = adaptor;
}

void ListViewWithAdaptor::visit(Renderer *renderer, const Mat4 &parentTransform, uint32_t parentFlags){
	Node* node = this;
	while (node) {
		if (!node->isVisible()){
			return;
		}
		node = node->getParent();
	}

	this->initItem();

	float containerY = this->getInnerContainerPosition().y;
	if (containerY > 0.0f){
		containerY = 0.0f;
	}

	float viewTop = this->getInnerContainerSize().height + containerY - this->getContentSize().height - _marginTop;

	float cellSize = _itemSize.height + _padding;
	int a = (int)(viewTop / cellSize);
	if (a < 0){
		a = 0;
	}

	if (a != _lastIndex){
		_lastIndex = a;
		this->forceRefreshView();
	}

	ui::ScrollView::visit(renderer, parentTransform, parentFlags);
}

void ListViewWithAdaptor::refreshView(){
	_lastIndex = -1;

	int n = this->getItemSize();
	float containerHeight = (n - 1) * _padding + n * _itemSize.height + _marginTop + _marginBottom;

	if (containerHeight < this->getContentSize().height){
		containerHeight = this->getContentSize().height;
	}

	this->setInnerContainerSize(Size(this->getContentSize().width, containerHeight));
}

void ListViewWithAdaptor::setPadding(float padding){
	_padding = padding;
}

void ListViewWithAdaptor::setMargin(float left, float right, float top, float bottom){
	_marginLeft = left;
	_marginRight = right;
	_marginBottom = bottom;
	_marginTop = top;
}

void ListViewWithAdaptor::initItem(){
	if (_allItems.size() > 0){
		return;
	}

	auto _defaultItem = _createItemCallback();
	_allItems.push_back(_defaultItem);

	_itemSize.setSize(_defaultItem->getContentSize().width * _defaultItem->getScaleX(), _defaultItem->getContentSize().height * _defaultItem->getScaleY());

	int itemCount = (int)(this->getContentSize().height / _itemSize.height) + 2;
	for (int i = 1; i < itemCount; i++){
		auto item = _createItemCallback();
		this->_allItems.push_back(item);
	}

	for (int i = 0; i < _allItems.size(); i++){
		_allItems[i]->setAnchorPoint(Point(0.5f, 0.5f));
		_allItems[i]->setPosition(this->getContentSize() / 2);
		_allItems[i]->setVisible(false);
		this->addChild(_allItems[i]);
	}

	this->refreshView();
	_lastIndex = -1;
}

void ListViewWithAdaptor::forceRefreshView(){
	if (_lastIndex < 0){
		return;
	}
	if (this->getItemSize() <= 0){
		return;
	}

	for (int i = 0; i < _allItems.size(); i++){
		_allItems[i]->setVisible(false);
	}

	int itemSize = _lastIndex + _allItems.size();
	if (itemSize > this->getItemSize()){
		itemSize = this->getItemSize();
	}


	float y = this->getInnerContainerSize().height - _marginTop - _itemSize.height / 2 - (_padding + _itemSize.height) * _lastIndex;

	for (int i = _lastIndex; i < itemSize; i++){
		auto item = _allItems[i - _lastIndex];
		item->setVisible(true);
		if (_itemAdaptor){
			_itemAdaptor(i, item);
		}

		item->setPositionY(y);
		y -= (_padding + item->getContentSize().height);
	}
}

int ListViewWithAdaptor::getItemSize(){
	if (_sizeCallback){
		return _sizeCallback();
	}
	return 0;
}

void ListViewWithAdaptor::initWithSize(const cocos2d::Size& size){
	ui::ScrollView::init();
	this->setDirection(ui::ScrollView::Direction::VERTICAL);
	this->setContentSize(size);
	this->refreshView();
}

ListViewWithAdaptor* ListViewWithAdaptor::create(const cocos2d::Size& size){
	auto listView = new ListViewWithAdaptor();
	listView->initWithSize(size);
	listView->autorelease();
	return listView;
}

}