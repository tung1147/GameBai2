/*
 * LeaveRoomRequest.h
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_LEAVEROOMREQUEST_H_
#define ELECTROCLIENT_OBJECTS_LEAVEROOMREQUEST_H_

#include "BaseRequest.h"

namespace es {

class LeaveRoomRequest : public BaseRequest{
public:
	int roomId;
	int zoneId;
public:
	LeaveRoomRequest();
	virtual ~LeaveRoomRequest();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void initWithJson(const rapidjson::Value& jsonData);
	virtual void getBytes(std::vector<char> &buffer);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_LEAVEROOMREQUEST_H_ */
