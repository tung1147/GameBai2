/*
 * LeaveRoomRequest.cpp
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#include "LeaveRoomRequest.h"

namespace SFS {
namespace Request{

LeaveRoomRequest::LeaveRoomRequest() {
	// TODO Auto-generated constructor stub
	messageType = MessageType::LeaveRoom;
	roomId = -1;
}

LeaveRoomRequest::~LeaveRoomRequest() {
	// TODO Auto-generated destructor stub
}

void LeaveRoomRequest::toByteArray(std::vector<char> &bytes){
	contents->setInt("r", roomId);
	BaseRequest::toByteArray(bytes);
}

}
} /* namespace SFS */
