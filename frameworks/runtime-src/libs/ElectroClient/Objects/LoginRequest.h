/*
 * LoginRequest.h
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_LOGINREQUEST_H_
#define ELECTROCLIENT_OBJECTS_LOGINREQUEST_H_
#include "BaseMessage.h"
#include "EsObject.h"

namespace es {

class LoginRequest : public BaseMessage{
public:
	std::string userName;
	std::string password;
	std::string sharedSecret;

	int protocol;
	int hashId;
	std::string clientVersion;
	std::string clientType;

	EsObject* esObject;
	std::map<std::string, EsObject*> userVariables;
public:
	LoginRequest();
	virtual ~LoginRequest();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);

	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_LOGINREQUEST_H_ */
