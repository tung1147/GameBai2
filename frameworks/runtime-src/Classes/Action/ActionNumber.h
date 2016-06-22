/*
 * ActionNumber.h
 *
 *  Created on: May 16, 2016
 *      Author: Quyet Nguyen
 */

#ifndef COMMON_ACTIONNUMBER_H_
#define COMMON_ACTIONNUMBER_H_

#include "cocos2d.h"
#include "ui/CocosGUI.h"
USING_NS_CC;

namespace quyetnd{

class ActionNumberCount : public ActionInterval{
public:
	enum NumberFormatType{
		FormatTypeNone = 0,
		FormatType1,
		FormatType2,
	};

protected:
	int formatType;
	int _from;
	int _to;
	LabelProtocol* _label;
	ui::Text* _text;

	void updateFormatNone(int count);
	void updateFormat1(int count);
	void updateFormat2(int count);
public:
	ActionNumberCount();
	virtual ~ActionNumberCount();
	virtual void initWithCount(float duration, int from, int to);
	virtual void setFormatType(int type);

	virtual void startWithTarget(Node *target);
	virtual void update(float t);

	static ActionNumberCount* create(float duration, int from, int to);
};

}


#endif /* COMMON_ACTIONNUMBER_H_ */
