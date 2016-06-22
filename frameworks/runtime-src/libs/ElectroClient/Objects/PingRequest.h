/*
 * PingRequest.h
 *
 *  Created on: Jan 29, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_PINGREQUEST_H_
#define ELECTROCLIENT_OBJECTS_PINGREQUEST_H_

#include "BaseMessage.h"

namespace es {

class PingRequest : public BaseMessage{
public:
	bool globalResponseRequested;
	int sessionKey;
	int pingRequestId;

	bool globalResponseRequested_set;
	bool sessionKey_set;
	bool pingRequestId_set;
public:
	PingRequest();
	virtual ~PingRequest();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_PINGREQUEST_H_ */
