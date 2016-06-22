/*
 * LeaveRoomEvent.h
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_LEAVEROOMEVENT_H_
#define ELECTROCLIENT_OBJECTS_LEAVEROOMEVENT_H_
#include "BaseMessage.h"

namespace es {

class LeaveRoomEvent : public BaseMessage{
public:
	int zoneId;
	int roomId;
public:
	LeaveRoomEvent();
	virtual ~LeaveRoomEvent();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_LEAVEROOMEVENT_H_ */
