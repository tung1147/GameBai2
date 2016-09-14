/*
 * BaseMessage.h
 *
 *  Created on: Jan 20, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_BASEOBJECT_H_
#define ELECTROCLIENT_OBJECTS_BASEOBJECT_H_

#include <vector>
#include <map>
#include <string>

#ifdef WIN32
#include "intrin.h"
#include <winsock2.h>
#include <ws2tcpip.h>
#include <Ws2tcpip.h>

#elif defined(WINRT)
#include "intrin.h"
#include <winsock2.h>
#include <ws2tcpip.h>
#include <Ws2tcpip.h>

#else
#include <cstdint>
#include <netdb.h>
#include <signal.h>
#include <unistd.h>
#include <netinet/in.h>
#endif

//#include "../ElectroLogger.h"
#include "MessageType.h"
#include "ErrorType.h"
#include "Entity/EsObject.h"

namespace es {

class BaseMessage {
public:
	unsigned char flag;
	es::type::MessageType messageType;
	unsigned int messageNumber;
public:
	BaseMessage();
	virtual ~BaseMessage();

	virtual bool initWithBytes(const char* bytes, int len) = 0;
	virtual void getBytes(std::vector<char> &buffer);

	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_BASEOBJECT_H_ */
