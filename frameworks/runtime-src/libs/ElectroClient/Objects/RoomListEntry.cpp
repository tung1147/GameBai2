/*
 * RoomListEntry.cpp
 *
 *  Created on: Feb 24, 2016
 *      Author: Quyet Nguyen
 */

#include "RoomListEntry.h"

namespace es {

RoomListEntry::RoomListEntry() {
	// TODO Auto-generated constructor stub
	roomId = -1;
	zoneId = -1;
	roomName = "";
	userCount = -1;
	roomDescription = "";
	capacity = -1;
	hasPassword = false;
}

RoomListEntry::~RoomListEntry() {
	// TODO Auto-generated destructor stub
}

void RoomListEntry::initFromThrift(void* data){

}

} /* namespace es */
