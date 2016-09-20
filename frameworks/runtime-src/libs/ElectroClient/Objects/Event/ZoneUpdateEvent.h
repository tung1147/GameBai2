/*
 * ZoneUpdateEvent.h
 *
 *  Created on: Feb 24, 2016
 *      Author: Quyet Nguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_ZONEUPDATEEVENT_H_
#define ELECTROCLIENT_OBJECTS_ZONEUPDATEEVENT_H_

#include "BaseEvent.h"
#include "ZoneUpdateAction.h"
#include "RoomListEntry.h"

namespace es {

class ZoneUpdateEvent : public BaseEvent{
public:
	int zoneId;
	es::type::ZoneUpdateAction action;
	int roomId;
	int roomCount;
	RoomListEntry* roomListEntry;
public:
	ZoneUpdateEvent();
	virtual ~ZoneUpdateEvent();
	
	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ZONEUPDATEEVENT_H_ */
