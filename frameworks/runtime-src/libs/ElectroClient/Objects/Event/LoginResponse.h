/*
 * LoginResponse.h
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_LOGINRESPONSE_H_
#define ELECTROCLIENT_OBJECTS_LOGINRESPONSE_H_
#include "BaseEvent.h"

namespace es {

class LoginResponse : public BaseEvent{
public:
	bool successful;
	int errorCode;
	EsObject* esObject;
	std::string userName;
	std::map<std::string, EsObject*> userVariables;
	std::map<std::string, EsObject*> buddyListEntries;
public:
	LoginResponse();
	virtual ~LoginResponse();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);

	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_LOGINRESPONSE_H_ */
