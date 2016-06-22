/*
 * PublicMessageEvent.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "PublicMessageEvent.h"

#include "thrift/libs/TBinaryProtocol.h"
#include "thrift/libs/TBufferTransports.h"

#include "thrift/ThriftPublicMessageEvent_types.h"

namespace es {

PublicMessageEvent::PublicMessageEvent() {
	// TODO Auto-generated constructor stub
	messageType = es::type::PublicMessageEvent; 

	message = "";
	userName = "";
	zoneId = -1;
	roomId = -1;
	esObject = 0;;
}

PublicMessageEvent::~PublicMessageEvent() {
	// TODO Auto-generated destructor stub
	if (esObject){
		delete esObject;
		esObject = 0;
	}
}

bool PublicMessageEvent::initWithBytes(const char* bytes, int len){
	apache::thrift::transport::TMemoryBuffer transport((uint8_t*)bytes, len, apache::thrift::transport::TMemoryBuffer::MemoryPolicy::OBSERVE);
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);

	ThriftPublicMessageEvent thriftObj;
	thriftObj.read(&protocol);
	
	this->message = thriftObj.message;
	this->userName = thriftObj.userName;
	this->zoneId = thriftObj.zoneId;
	this->roomId = thriftObj.roomId;

	if (thriftObj.__isset.esObject){
		esObject = new EsObject();
		esObject->initFromFlattenedEsObject(&thriftObj.esObject);
	}

	return true;
}

void PublicMessageEvent::printDebug(){

}

} /* namespace es */
