/*
 * PublicMessageRequest.h
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_PUBLICMESSAGEREQUEST_H_
#define ELECTROCLIENT_OBJECTS_PUBLICMESSAGEREQUEST_H_

#include "BaseMessage.h"
#include "EsObject.h"

namespace es {

class PublicMessageRequest : public BaseMessage{
public:
	int zoneId;
	int roomId;
	std::string message;
	EsObject* esObject;
public:
	PublicMessageRequest();
	virtual ~PublicMessageRequest();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);

	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_PUBLICMESSAGEREQUEST_H_ */
