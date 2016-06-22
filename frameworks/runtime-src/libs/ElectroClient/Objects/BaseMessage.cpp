/*
 * BaseObject.cpp
 *
 *  Created on: Jan 20, 2016
 *      Author: QuyetNguyen
 */

#include "BaseMessage.h"
#include "EsUtil.h"
#include "../ElectroLogger.h"

namespace es {

BaseMessage::BaseMessage() {
// TODO Auto-generated constructor stub
	flag = 0x00;
	messageType = es::type::MessageType::Unknown;
	messageNumber = 0;
}

BaseMessage::~BaseMessage() {
	// TODO Auto-generated destructor stub
  //  es::log("delete BaseMessage");
}

void BaseMessage::getBytes(std::vector<char> &buffer){
	buffer.push_back(flag);

	unsigned short type = htons(es::encodeMessageType(messageType));
	buffer.insert(buffer.end(), (char*)&type, (char*)&type + 2);

	unsigned int number = htonl(messageNumber);
	buffer.insert(buffer.end(), (char*)&number, (char*)&number + 4);
}

void BaseMessage::printDebug(){
	
}

/****/

SocketStatus::SocketStatus(){
	messageType = es::type::SocketStatus;
}

SocketStatus::~SocketStatus(){

}

bool SocketStatus::initWithBytes(const char* bytes, int len){
	return true;
}

void SocketStatus::getBytes(std::vector<char> &buffer){

}

/****/
TimeoutMessage::TimeoutMessage(){
	requestId = -1;
}

TimeoutMessage::~TimeoutMessage(){

}

bool TimeoutMessage::initWithBytes(const char* bytes, int len){
	return true;
}

void TimeoutMessage::getBytes(std::vector<char> &buffer){

}

} /* namespace es */
