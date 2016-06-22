/*
 * EsUtil.h
 *
 *  Created on: Feb 1, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_ESUTIL_H_
#define ELECTROCLIENT_OBJECTS_ESUTIL_H_

#include "MessageType.h"
#include "BaseMessage.h"

#include "ConnectionClosedEvent.h"
#include "ConnectionResponse.h"
#include "ErrorType.h"
#include "EsObject.h"
#include "GatewayKickUserRequest.h"
#include "GenericErrorResponse.h"
#include "JoinRoomEvent.h"
#include "JoinRoomRequest.h"
#include "LeaveRoomEvent.h"
#include "LeaveRoomRequest.h"
#include "LoginRequest.h"
#include "LoginResponse.h"
#include "LogoutRequest.h"
#include "MessageType.h"
#include "PingRequest.h"
#include "PingResponse.h"
#include "PluginMessageEvent.h"
#include "PluginRequest.h"
#include "PublicMessageEvent.h"
#include "PublicMessageRequest.h"
#include "RoomVariable.h"
#include "ServerKickUserEvent.h"
#include "UserEvictedFromRoomEvent.h"
#include "PrivateMessageEvent.h"
#include "PrivateMessageRequest.h"
#include "ZoneUpdateEvent.h"
#include "UserUpdateEvent.h"
#include "JoinZoneEvent.h"

namespace es {
	unsigned short encodeMessageType(type::MessageType messageType);
	type::MessageType decodeMessageType(unsigned short type);

	es::BaseMessage* createMessageWithType(type::MessageType type);

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ESUTIL_H_ */
