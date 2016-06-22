/*
 * UserEvictedFromRoomEvent.h
 *
 *  Created on: Feb 4, 2016
 *      Author: Quyet Nguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_USEREVICTEDFROMROOMEVENT_H_
#define ELECTROCLIENT_OBJECTS_USEREVICTEDFROMROOMEVENT_H_

#include "BaseMessage.h"

namespace es {

class UserEvictedFromRoomEvent : public BaseMessage{
public:
	int zoneId;
	int roomId;
	std::string userName;
	std::string reason;
	bool ban;
	int duration;
public:
	UserEvictedFromRoomEvent();
	virtual ~UserEvictedFromRoomEvent();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_USEREVICTEDFROMROOMEVENT_H_ */
