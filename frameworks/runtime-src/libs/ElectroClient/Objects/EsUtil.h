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

#include "Event/ConnectionClosedEvent.h"
#include "Event/ConnectionResponse.h"
#include "ErrorType.h"
#include "Entity/EsObject.h"
#include "Entity/EsArray.h"
#include "Entity/EsPrimitive.h"
#include "Request/GatewayKickUserRequest.h"
#include "Event/GenericErrorResponse.h"
#include "Event/JoinRoomEvent.h"
#include "Request/JoinRoomRequest.h"
#include "Event/LeaveRoomEvent.h"
#include "Request/LeaveRoomRequest.h"
#include "Request/LoginRequest.h"
#include "Event/LoginResponse.h"
#include "Request/LogoutRequest.h"
#include "MessageType.h"
#include "Request/PingRequest.h"
#include "Event/PingResponse.h"
#include "Event/PluginMessageEvent.h"
#include "Request/PingRequest.h"
#include "Event/PublicMessageEvent.h"
#include "Request/PublicMessageRequest.h"
#include "Event/RoomVariable.h"
#include "Event/ServerKickUserEvent.h"
#include "Event/UserEvictedFromRoomEvent.h"
#include "Event/PrivateMessageEvent.h"
#include "Request/PrivateMessageRequest.h"
#include "Event/ZoneUpdateEvent.h"
#include "Event/UserUpdateEvent.h"
#include "Event/JoinZoneEvent.h"

namespace es {
	unsigned short encodeMessageType(type::MessageType messageType);
	type::MessageType decodeMessageType(unsigned short type);

	es::BaseMessage* createMessageWithType(type::MessageType type);

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ESUTIL_H_ */
