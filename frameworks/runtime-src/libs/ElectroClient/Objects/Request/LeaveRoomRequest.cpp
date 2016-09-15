/*
 * LeaveRoomRequest.cpp
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#include "LeaveRoomRequest.h"

#include "../thrift/libs/TBinaryProtocol.h"
#include "../thrift/libs/TBufferTransports.h"
#include "../thrift/ThriftLeaveRoomRequest_types.h"

namespace es {

LeaveRoomRequest::LeaveRoomRequest() {
	// TODO Auto-generated constructor stub
	messageType = es::type::LeaveRoomRequest; 

	roomId = -1;
	zoneId = -1;
}

LeaveRoomRequest::~LeaveRoomRequest() {
	// TODO Auto-generated destructor stub
}

bool LeaveRoomRequest::initWithBytes(const char* bytes, int len){
	
	return true;
}

void LeaveRoomRequest::initWithJson(const rapidjson::Value& jsonData){
	if (jsonData.HasMember("zoneId") && jsonData["zoneId"].IsNumber()){
		zoneId = jsonData["zoneId"].GetInt();
	}
	if (jsonData.HasMember("roomId") && jsonData["roomId"].IsNumber()){
		roomId = jsonData["roomId"].GetInt();
	}
}

void LeaveRoomRequest::getBytes(std::vector<char> &buffer){
	BaseMessage::getBytes(buffer);

	ThriftLeaveRoomRequest thriftObj;
	thriftObj.__set_roomId(roomId);
	thriftObj.__set_zoneId(zoneId);

	apache::thrift::transport::TMemoryBuffer transport;
	apache::thrift::protocol::TBinaryProtocol protocol(&transport);
	thriftObj.write(&protocol);
	uint8_t* dataPtr;
	uint32_t len;
	transport.getBuffer(&dataPtr, &len);
	buffer.insert(buffer.end(), dataPtr, dataPtr + len);
}

void LeaveRoomRequest::printDebug(){

}

} /* namespace es */
