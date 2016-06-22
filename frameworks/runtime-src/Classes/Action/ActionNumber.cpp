/*
 * ActionNumber.cpp
 *
 *  Created on: May 16, 2016
 *      Author: Quyet Nguyen
 */

#include "ActionNumber.h"
#include <algorithm>
//#include "../Global/Global.h"

namespace quyetnd{
static char stringBuffer[128];
inline std::string _actionNumber_numberFormat1(int64_t number){
	if (number < 1000){
		sprintf(stringBuffer, "%lld", number);
		return std::string(stringBuffer);
	}
	else if (number < 1000000){
		sprintf(stringBuffer, "%lldK", (int64_t)(number / 1000));
		return std::string(stringBuffer);
	}
	else if (number < 1000000000){
		sprintf(stringBuffer, "%lldM", (int64_t)(number / 1000000));
		return std::string(stringBuffer);
	}

	sprintf(stringBuffer, "%lldB", (int64_t)(number / 1000000000));
	return std::string(stringBuffer);
}

inline std::string _actionNumber_numberFormat2(int64_t number){
	bool sign = false;
	if (number < 0){
		number = -number;
		sign = true;
	}
	sprintf(stringBuffer, "%lld", number);
	std::string strRet(stringBuffer);
	int i = strRet.size() - 3;
	while (i > 0){
		strRet.insert(i, ".");
		i -= 3;
	}
	if (sign){
		strRet.insert(0, "-");
	}

	return strRet;
}


ActionNumberCount::ActionNumberCount() {
	// TODO Auto-generated constructor stub
	_from = 0;
	_to = 0;

	_label = 0;
	_text = 0;

	formatType = NumberFormatType::FormatTypeNone;
}

ActionNumberCount::~ActionNumberCount() {
	// TODO Auto-generated destructor stub
	
}

void ActionNumberCount::initWithCount(float duration, int from, int to){
	ActionInterval::initWithDuration(duration);
	_from = from;
	_to = to;
}

void ActionNumberCount::setFormatType(int type){
	formatType = type;
}

void ActionNumberCount::startWithTarget(Node *target){
	ActionInterval::startWithTarget(target);
	_label = 0;
	_text = 0; 

	if (_label = dynamic_cast<LabelProtocol*>(target)){
		
	}
	else if (_text = dynamic_cast<ui::Text*>(target)){
		
	}
}

void ActionNumberCount::update(float t){
	int current = _from + t * (_to - _from);
	if (formatType == NumberFormatType::FormatTypeNone){
		updateFormatNone(current);
	}
	else if (formatType == NumberFormatType::FormatType1){
		updateFormat1(current);
	}
	else{
		updateFormat2(current);
	}
}

void ActionNumberCount::updateFormatNone(int count){
	sprintf(stringBuffer, "%d", count);
	if (_label){
		_label->setString(stringBuffer);
	}
	else if (_text){
		_text->setString(stringBuffer);
	}
}

void ActionNumberCount::updateFormat1(int count){
	if (_label){
		_label->setString(_actionNumber_numberFormat1(count));
	}
	else if (_text){
		_text->setString(_actionNumber_numberFormat1(count));
	}
}

void ActionNumberCount::updateFormat2(int count){
	if (_label){
		_label->setString(_actionNumber_numberFormat2(count));
	}
	else if (_text){
		_text->setString(_actionNumber_numberFormat2(count));
	}
}

ActionNumberCount* ActionNumberCount::create(float duration, int from, int to){
	auto action = new ActionNumberCount();
	action->initWithCount(duration, from, to);
	action->autorelease();
	return action;
}

}

