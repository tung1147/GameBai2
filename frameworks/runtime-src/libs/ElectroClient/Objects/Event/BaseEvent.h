/*
 * BaseEvent.h
 *
 *  Created on: Jan 20, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_BASEEVENT_H_
#define ELECTROCLIENT_OBJECTS_BASEEVENT_H_

#include "../BaseMessage.h"
#include "../ErrorType.h"

namespace es {

class BaseEvent : public BaseMessage{
protected:
	std::string jsonData;
public:
	BaseEvent();
	virtual ~BaseEvent();
};
}

#endif /* ELECTROCLIENT_OBJECTS_BASEEVENT_H_ */
