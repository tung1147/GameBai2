/*
 * JoinRoomRequest.h
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_JOINROOMREQUEST_H_
#define ELECTROCLIENT_OBJECTS_JOINROOMREQUEST_H_
#include "BaseRequest.h"

namespace es {

class JoinRoomRequest : public BaseRequest{
public:
	std::string zoneName;
	std::string roomName;
	int zoneId;
	int roomId;
	std::string password;
	bool receivingRoomListUpdates;
	bool receivingRoomAttributeUpdates;
	bool receivingUserListUpdates;
	bool receivingUserVariableUpdates;
	bool receivingRoomVariableUpdates;
	bool receivingVideoEvents;
public:
	JoinRoomRequest();
	virtual ~JoinRoomRequest();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_JOINROOMREQUEST_H_ */
