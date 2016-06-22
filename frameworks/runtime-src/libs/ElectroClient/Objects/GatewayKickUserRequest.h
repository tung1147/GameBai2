/*
 * GatewayKickUserRequest.h
 *
 *  Created on: Jan 28, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_GATEWAYKICKUSERREQUEST_H_
#define ELECTROCLIENT_OBJECTS_GATEWAYKICKUSERREQUEST_H_

#include "BaseMessage.h"
#include "EsObject.h"

namespace es {

class GatewayKickUserRequest : public BaseMessage{
public:
	int64_t clientId;
	int error;
	EsObject* esObject;
public:
	GatewayKickUserRequest();
	virtual ~GatewayKickUserRequest();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_GATEWAYKICKUSERREQUEST_H_ */
