/*
 * PluginRequest.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "PluginRequest.h"

#include "thrift/ThriftPluginRequest_types.h"

#include "thrift/libs/TBinaryProtocol.h"
#include "thrift/libs/TBufferTransports.h"

namespace es {

PluginRequest::PluginRequest() {
	// TODO Auto-generated constructor stub
	pluginName = "";
	messageType = es::type::PluginRequest;

	parameters = 0;
	pluginName = "";
	zoneId = -1;
	roomId = -1;
	sessionKey = -1;
}

PluginRequest::~PluginRequest() {
	// TODO Auto-generated destructor stub
	if (parameters){
		delete parameters;
		parameters = 0;
	}
}

bool PluginRequest::initWithBytes(const char* bytes, int len){
	return true;
}

void PluginRequest::getBytes(std::vector<char> &buffer){
	BaseMessage::getBytes(buffer);

	ThriftPluginRequest thriftObj;
	thriftObj.__set_pluginName(pluginName);
	thriftObj.__set_roomId(roomId);
	thriftObj.__set_zoneId(zoneId);
	if (sessionKey >= 0){
		thriftObj.__set_sessionKey(sessionKey);
	}

	if (parameters){
		parameters->writeToFlattenedEsObject(&(thriftObj.parameters));
		thriftObj.__isset.parameters = true;
	}
	

	/* write to thrift */
	apache::thrift::transport::TMemoryBuffer transport;
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);
	thriftObj.write(&protocol);

	uint8_t* dataPtr;
	uint32_t len;
	transport.getBuffer(&dataPtr, &len);
	buffer.insert(buffer.end(), dataPtr, dataPtr + len);
}

void PluginRequest::printDebug(){

}

} /* namespace es */
