/*
 * PrivateMessageEvent.h
 *
 *  Created on: Feb 5, 2016
 *      Author: Quyet Nguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_PRIVATEMESSAGEEVENT_H_
#define ELECTROCLIENT_OBJECTS_PRIVATEMESSAGEEVENT_H_

#include "BaseEvent.h"

namespace es {

class PrivateMessageEvent : public BaseEvent{
public:
	std::string userName;
	std::string message;
	EsObject* esObject;
public:
	PrivateMessageEvent();
	virtual ~PrivateMessageEvent();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_PRIVATEMESSAGEEVENT_H_ */
