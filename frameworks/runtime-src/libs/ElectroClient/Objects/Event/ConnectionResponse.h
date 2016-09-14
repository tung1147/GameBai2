/*
 * ConnectionResponse.h
 *
 *  Created on: Jan 20, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_CONNECTIONRESPONSE_H_
#define ELECTROCLIENT_OBJECTS_CONNECTIONRESPONSE_H_
#include "BaseEvent.h"
#include "ProtocolConfiguration.h"

namespace es {

class ConnectionResponse : public BaseEvent{
public:
	bool successful;
	int hashId;
	int error;
	ProtocolConfiguration protocolConfiguration;
	std::string serverVersion;
public:
	ConnectionResponse();
	virtual ~ConnectionResponse();

	virtual bool initWithBytes(const char* bytes, int len);
	virtual void getBytes(std::vector<char> &buffer);
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_CONNECTIONRESPONSE_H_ */
