/*
 * JoinRoomEvent.h
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_JOINROOMEVENT_H_
#define ELECTROCLIENT_OBJECTS_JOINROOMEVENT_H_
#include "BaseMessage.h"
#include "UserListEntry.h"
#include "RoomVariable.h"

namespace es {

class JoinRoomEvent : public BaseMessage{
public:
	int zoneId;
	int roomId;
	std::string roomName;
	std::string roomDescription;
	bool hasPassword;
	bool hidden;
	int capacity;
	std::vector<UserListEntry*> users;
	std::vector<RoomVariable*> roomVariables;
	std::vector<std::string> pluginHandles;
public:
	JoinRoomEvent();
	virtual ~JoinRoomEvent();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_JOINROOMEVENT_H_ */
