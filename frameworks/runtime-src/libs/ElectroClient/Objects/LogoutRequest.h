/*
 * LogoutRequest.h
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_LOGOUTREQUEST_H_
#define ELECTROCLIENT_OBJECTS_LOGOUTREQUEST_H_
#include "BaseMessage.h"

namespace es {

class LogoutRequest : public BaseMessage{
public:
	bool dropConnection;
	bool dropAllConnections;
public:
	LogoutRequest();
	virtual ~LogoutRequest();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);

	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_LOGOUTREQUEST_H_ */
