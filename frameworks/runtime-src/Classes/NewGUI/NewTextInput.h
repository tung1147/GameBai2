/*
 * NewTextInput.h
 *
 *  Created on: Jun 28, 2016
 *      Author: Quyet Nguyen
 */

#ifndef NEWGUI_NEWTEXTINPUT_H_
#define NEWGUI_NEWTEXTINPUT_H_

#include <string>
#include <stdint.h>
#include "cocos2d.h"
#include "ui/CocosGUI.h"
USING_NS_CC;

namespace quyetnd {

class EditBox : public ui::EditBox{
protected:
	float _marginLeft;
	float _marginRight;
	float _marginTop;
	float _marginBottom;
	virtual void adaptRenderers() override;
public:
	EditBox();
	virtual ~EditBox();
	bool initWithSize(const Size& size);

	void setBackgoundMargin(float left, float top, float right, float bottom);
	static EditBox* create(const Size& size, ui::Scale9Sprite* normalSprite, ui:: Scale9Sprite* pressedSprite = nullptr, ui::Scale9Sprite* disabledSprite = nullptr);
	static EditBox* create(const Size& size, const std::string& normal9SpriteBg, ui::Widget::TextureResType texType = ui::Widget::TextureResType::LOCAL);
	static EditBox* create(const Size& size);
};

} /* namespace quyetnd */

#endif /* NEWGUI_NEWTEXTINPUT_H_ */
