/*
 * JoinRoomRequest.cpp
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#include "JoinRoomRequest.h"

namespace SFS {
namespace Request{

JoinRoomRequest::JoinRoomRequest() {
	// TODO Auto-generated constructor stub
	messageType = MessageType::JoinRoom;

	roomId = -1;
	roomName = "";
	roomPass = "";
	roomIdToLeave = 0;
	asSpectator = false;
}

JoinRoomRequest::~JoinRoomRequest() {
	// TODO Auto-generated destructor stub
}

void JoinRoomRequest::toByteArray(std::vector<char> &bytes){
	if (roomId > -1){
		contents->setInt("i", roomId);
	}
	else if (roomName != ""){
		contents->setString("n", roomName);
	}

	contents->setString("p", roomPass);
	contents->setInt("rl", roomIdToLeave);
	contents->setBool("sp", asSpectator);

	BaseRequest::toByteArray(bytes);
}

}
} /* namespace SFS */
