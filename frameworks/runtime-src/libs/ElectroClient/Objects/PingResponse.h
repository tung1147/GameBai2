/*
 * PingResponse.h
 *
 *  Created on: Jan 29, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_PINGRESPONSE_H_
#define ELECTROCLIENT_OBJECTS_PINGRESPONSE_H_

#include "BaseMessage.h"

namespace es {

class PingResponse : public BaseMessage{
public:
	bool globalResponseRequested;
	int pingRequestId;
public:
	PingResponse();
	virtual ~PingResponse();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_PINGRESPONSE_H_ */
