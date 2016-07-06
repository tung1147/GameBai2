/*
 * NewWidget.h
 *
 *  Created on: Jul 6, 2016
 *      Author: Quyet Nguyen
 */

#ifndef NEWGUI_NEWWIDGET_H_
#define NEWGUI_NEWWIDGET_H_

#include "cocos2d.h"
#include "ui/CocosGUI.h"
USING_NS_CC;

namespace quyetnd {

class Widget : public ui::Widget{
protected:
	Size _virtualSize;
	bool _isSetVirtualSize;
public:
	Widget();
	virtual ~Widget();

	virtual Size getVirtualRendererSize() const;
	virtual void setVirtualRendererSize(const Size& size);

	static Widget* create();
};

} /* namespace quyetnd */

#endif /* NEWGUI_NEWWIDGET_H_ */
