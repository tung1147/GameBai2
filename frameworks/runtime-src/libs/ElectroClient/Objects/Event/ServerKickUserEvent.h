/*
 * ServerKickUserEvent.h
 *
 *  Created on: Jan 28, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_SERVERKICKUSEREVENT_H_
#define ELECTROCLIENT_OBJECTS_SERVERKICKUSEREVENT_H_

#include "BaseEvent.h"

namespace es {

class ServerKickUserEvent : public BaseEvent{
public:
	int error;
	EsObject* esObject;
public:
	ServerKickUserEvent();
	virtual ~ServerKickUserEvent();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_SERVERKICKUSEREVENT_H_ */
