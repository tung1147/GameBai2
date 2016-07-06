/*
 * Widget.cpp
 *
 *  Created on: Jul 6, 2016
 *      Author: Quyet Nguyen
 */

#include "NewWidget.h"

namespace quyetnd {

Widget::Widget() {
// TODO Auto-generated constructor stub
	_isSetVirtualSize = false;
	_ignoreSize = true;
}

Widget::~Widget() {
	// TODO Auto-generated destructor stub
}

Size Widget::getVirtualRendererSize() const {
	if (_isSetVirtualSize){
		return _virtualSize;
	}
	return _contentSize;
}

void Widget::setVirtualRendererSize(const Size& size){
	_virtualSize = size;
	_isSetVirtualSize = true;
	this->setContentSize(_virtualSize);
}

Widget* Widget::create(){
	Widget* widget = new (std::nothrow) Widget();
	if (widget && widget->init()){
		widget->autorelease();
		return widget;
	}
	CC_SAFE_DELETE(widget);
	return nullptr;
}

} /* namespace quyetnd */
