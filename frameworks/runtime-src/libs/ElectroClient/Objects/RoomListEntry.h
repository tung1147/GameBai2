/*
 * RoomListEntry.h
 *
 *  Created on: Feb 24, 2016
 *      Author: Quyet Nguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_ROOMLISTENTRY_H_
#define ELECTROCLIENT_OBJECTS_ROOMLISTENTRY_H_

#include "BaseMessage.h"

namespace es {

class RoomListEntry {
public:
	int roomId;
	int zoneId;
	std::string roomName;
	int userCount;
	std::string roomDescription;
	int capacity;
	bool hasPassword;
public:
	RoomListEntry();
	virtual ~RoomListEntry();

	void initFromThrift(void* data);
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ROOMLISTENTRY_H_ */
