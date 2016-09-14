/*
 * UserUpdateEvent.cpp
 *
 *  Created on: Feb 24, 2016
 *      Author: Quyet Nguyen
 */

#include "UserUpdateEvent.h"

namespace es {

UserUpdateEvent::UserUpdateEvent() {
	// TODO Auto-generated constructor stub
	zoneId = -1;
	roomId = -1;
	//::es::ThriftUserUpdateAction::type action;
	userName = "";
	//std::vector< ::es::ThriftUserVariable>  userVariables;
	sendingVideo = false;
	videoStreamName = "";
}

UserUpdateEvent::~UserUpdateEvent() {
	// TODO Auto-generated destructor stub
}

bool UserUpdateEvent::initWithBytes(const char* bytes, int len){
	return false;
}

void UserUpdateEvent::getBytes(std::vector<char> &buffer){

}

void UserUpdateEvent::printDebug(){

}

} /* namespace es */
