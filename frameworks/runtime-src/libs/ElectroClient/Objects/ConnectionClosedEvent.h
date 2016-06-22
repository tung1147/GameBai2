/*
 * ConnectionClosedEvent.h
 *
 *  Created on: Jan 20, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_CONNECTIONCLOSEDEVENT_H_
#define ELECTROCLIENT_OBJECTS_CONNECTIONCLOSEDEVENT_H_

#include "BaseMessage.h"

namespace es {

class ConnectionClosedEvent : public BaseMessage{
public:
	int connectionId;
public:
	ConnectionClosedEvent();
	virtual ~ConnectionClosedEvent();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_CONNECTIONCLOSEDEVENT_H_ */
