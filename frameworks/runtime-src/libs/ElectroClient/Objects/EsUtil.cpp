/*
 * EsUtil.cpp
 *
 *  Created on: Feb 1, 2016
 *      Author: QuyetNguyen
 */

#include "EsUtil.h"

static std::map<unsigned short, es::type::MessageType> s_decode_message = {
	{ 60, es::type::MessageType::CrossDomainRequest },
	{ 81, es::type::MessageType::CreateRoomRequest },
	{ 74, es::type::MessageType::JoinRoomRequest },
	{ 76, es::type::MessageType::LoginRequest },
	{ 108, es::type::MessageType::LogOutRequest },
	{ 37, es::type::MessageType::ValidateAdditionalLoginRequest },
	{ 38, es::type::MessageType::ValidateAdditionalLoginResponse },
	{ 80, es::type::MessageType::PublicMessageRequest },
	{ 112, es::type::MessageType::PrivateMessageRequest },
	{ 118, es::type::MessageType::LeaveRoomRequest },
	{ 110, es::type::MessageType::CreateRoomVariableRequest },
	{ 78, es::type::MessageType::DeleteRoomVariableRequest },
	{ 111, es::type::MessageType::UpdateRoomVariableRequest },
	{ 115, es::type::MessageType::GetZonesRequest },
	{ 116, es::type::MessageType::GetRoomsInZoneRequest },
	{ 104, es::type::MessageType::UpdateRoomDetailsRequest },
	{ 65, es::type::MessageType::AddRoomOperatorRequest },
	{ 66, es::type::MessageType::RemoveRoomOperatorRequest },
	{ 68, es::type::MessageType::FindZoneAndRoomByNameRequest },
	{ 107, es::type::MessageType::GetUsersInRoomRequest },
	{ 72, es::type::MessageType::DeleteUserVariableRequest },
	{ 73, es::type::MessageType::UpdateUserVariableRequest },
	{ 75, es::type::MessageType::AddBuddiesRequest },
	{ 77, es::type::MessageType::RemoveBuddiesRequest },
	{ 83, es::type::MessageType::EvictUserFromRoomRequest },
	{ 48, es::type::MessageType::GetUserCountRequest },
	{ 67, es::type::MessageType::PluginRequest },
	{ 40, es::type::MessageType::CreateOrJoinGameRequest },
	{ 52, es::type::MessageType::JoinGameRequest },
	{ 42, es::type::MessageType::FindGamesRequest },
	{ 43, es::type::MessageType::GetUserVariablesRequest },
	{ 51, es::type::MessageType::AggregatePluginRequest },
	{ 45, es::type::MessageType::GetServerLocalTimeRequest },
	{ 3, es::type::MessageType::GetGameTypesRequest },
	{ 99, es::type::MessageType::ConnectionResponse },
	{ 62, es::type::MessageType::CrossDomainResponse },
	{ 109, es::type::MessageType::LoginResponse },
	{ 98, es::type::MessageType::GetZonesResponse },
	{ 100, es::type::MessageType::GetRoomsInZoneResponse },
	{ 101, es::type::MessageType::GenericErrorResponse },
	{ 103, es::type::MessageType::FindZoneAndRoomByNameResponse },
	{ 70, es::type::MessageType::GetUsersInRoomResponse },
	{ 49, es::type::MessageType::GetUserCountResponse },
	{ 95, es::type::MessageType::CreateOrJoinGameResponse },
	{ 41, es::type::MessageType::FindGamesResponse },
	{ 61, es::type::MessageType::GetUserVariablesResponse },
	{ 92, es::type::MessageType::AddBuddiesResponse },
	{ 47, es::type::MessageType::RemoveBuddiesResponse },
	{ 44, es::type::MessageType::GetServerLocalTimeResponse },
	{ 4, es::type::MessageType::GetGameTypesResponse },
	{ 97, es::type::MessageType::PublicMessageEvent },
	{ 114, es::type::MessageType::PrivateMessageEvent },
	{ 105, es::type::MessageType::SessionIdleEvent },
	{ 82, es::type::MessageType::JoinRoomEvent },
	{ 90, es::type::MessageType::JoinZoneEvent },
	{ 85, es::type::MessageType::UserUpdateEvent },
	{ 86, es::type::MessageType::ZoneUpdateEvent },
	{ 87, es::type::MessageType::LeaveRoomEvent },
	{ 88, es::type::MessageType::LeaveZoneEvent },
	{ 113, es::type::MessageType::RoomVariableUpdateEvent },
	{ 69, es::type::MessageType::UpdateRoomDetailsEvent },
	{ 79, es::type::MessageType::BuddyStatusUpdatedEvent },
	{ 84, es::type::MessageType::UserEvictedFromRoomEvent },
	{ 89, es::type::MessageType::UserVariableUpdateEvent },
	{ 102, es::type::MessageType::PluginMessageEvent },
	{ 71, es::type::MessageType::AggregatePluginMessageEvent },
	{ 50, es::type::MessageType::RegistryConnectToPreferredGatewayRequest },
	{ 122, es::type::MessageType::DisconnectedEvent },
	{ 35, es::type::MessageType::GatewayStartupExceptionsMessage },
	{ 121, es::type::MessageType::RegistryLoginResponse },
	{ 33, es::type::MessageType::RegistryConnectionResponse },
	{ 94, es::type::MessageType::GatewayKickUserRequest },
	{ 1, es::type::MessageType::ServerKickUserEvent },
	{ 63, es::type::MessageType::UdpBackchannelEvent },
	{ 117, es::type::MessageType::Unknown },
	{ 144, es::type::MessageType::RtmpPlayVideo },
	{ 145, es::type::MessageType::RtmpEventResponse },
	{ 146, es::type::MessageType::RtmpRecordVideo },
	{ 147, es::type::MessageType::RtmpPublishVideo },
	{ 148, es::type::MessageType::RtmpUnpublishVideo },
	{ 149, es::type::MessageType::RtmpAppendVideo },
	{ 150, es::type::MessageType::RtmpStreamingStart },
	{ 151, es::type::MessageType::RtmpStreamingStop },
	{ 152, es::type::MessageType::DHInitiate },
	{ 153, es::type::MessageType::DHPublicNumbers },
	{ 154, es::type::MessageType::DHSharedModulusRequest },
	{ 155, es::type::MessageType::DHSharedModulusResponse },
	{ 156, es::type::MessageType::EncryptionStateChange },
	{ 157, es::type::MessageType::ConnectionAttemptResponse },
	{ 158, es::type::MessageType::ConnectionClosedEvent },
	{ 53, es::type::MessageType::RegisterUDPConnectionRequest },
	{ 54, es::type::MessageType::RegisterUDPConnectionResponse },
	{ 57, es::type::MessageType::RemoveUDPConnectionRequest },
	{ 46, es::type::MessageType::RemoveUDPConnectionResponse },
	{ 55, es::type::MessageType::PingRequest },
	{ 56, es::type::MessageType::PingResponse },
	{ 0, es::type::MessageType::IdleTimeoutWarningEvent },
	{ 2, es::type::MessageType::MarkGatewayClientLoggedInMessage }
};

static std::map<es::type::MessageType, short> s_encode_message = {
	{ es::type::MessageType::CrossDomainRequest, 60 },
	{ es::type::MessageType::CreateRoomRequest, 81 },
	{ es::type::MessageType::JoinRoomRequest, 74 },
	{ es::type::MessageType::LoginRequest, 76 },
	{ es::type::MessageType::LogOutRequest, 108 },
	{ es::type::MessageType::ValidateAdditionalLoginRequest, 37 },
	{ es::type::MessageType::ValidateAdditionalLoginResponse, 38 },
	{ es::type::MessageType::PublicMessageRequest, 80 },
	{ es::type::MessageType::PrivateMessageRequest, 112 },
	{ es::type::MessageType::LeaveRoomRequest, 118 },
	{ es::type::MessageType::CreateRoomVariableRequest, 110 },
	{ es::type::MessageType::DeleteRoomVariableRequest, 78 },
	{ es::type::MessageType::UpdateRoomVariableRequest, 111 },
	{ es::type::MessageType::GetZonesRequest, 115 },
	{ es::type::MessageType::GetRoomsInZoneRequest, 116 },
	{ es::type::MessageType::UpdateRoomDetailsRequest, 104 },
	{ es::type::MessageType::AddRoomOperatorRequest, 65 },
	{ es::type::MessageType::RemoveRoomOperatorRequest, 66 },
	{ es::type::MessageType::FindZoneAndRoomByNameRequest, 68 },
	{ es::type::MessageType::GetUsersInRoomRequest, 107 },
	{ es::type::MessageType::DeleteUserVariableRequest, 72 },
	{ es::type::MessageType::UpdateUserVariableRequest, 73 },
	{ es::type::MessageType::AddBuddiesRequest, 75 },
	{ es::type::MessageType::RemoveBuddiesRequest, 77 },
	{ es::type::MessageType::EvictUserFromRoomRequest, 83 },
	{ es::type::MessageType::GetUserCountRequest, 48 },
	{ es::type::MessageType::PluginRequest, 67 },
	{ es::type::MessageType::CreateOrJoinGameRequest, 40 },
	{ es::type::MessageType::JoinGameRequest, 52 },
	{ es::type::MessageType::FindGamesRequest, 42 },
	{ es::type::MessageType::GetUserVariablesRequest, 43 },
	{ es::type::MessageType::AggregatePluginRequest, 51 },
	{ es::type::MessageType::GetServerLocalTimeRequest, 45 },
	{ es::type::MessageType::GetGameTypesRequest, 3 },
	{ es::type::MessageType::ConnectionResponse, 99 },
	{ es::type::MessageType::CrossDomainResponse, 62 },
	{ es::type::MessageType::LoginResponse, 109 },
	{ es::type::MessageType::GetZonesResponse, 98 },
	{ es::type::MessageType::GetRoomsInZoneResponse, 100 },
	{ es::type::MessageType::GenericErrorResponse, 101 },
	{ es::type::MessageType::FindZoneAndRoomByNameResponse, 103 },
	{ es::type::MessageType::GetUsersInRoomResponse, 70 },
	{ es::type::MessageType::GetUserCountResponse, 49 },
	{ es::type::MessageType::CreateOrJoinGameResponse, 95 },
	{ es::type::MessageType::FindGamesResponse, 41 },
	{ es::type::MessageType::GetUserVariablesResponse, 61 },
	{ es::type::MessageType::AddBuddiesResponse, 92 },
	{ es::type::MessageType::RemoveBuddiesResponse, 47 },
	{ es::type::MessageType::GetServerLocalTimeResponse, 44 },
	{ es::type::MessageType::PublicMessageEvent, 97 },
	{ es::type::MessageType::PrivateMessageEvent, 114 },
	{ es::type::MessageType::SessionIdleEvent, 105 },
	{ es::type::MessageType::JoinRoomEvent, 82 },
	{ es::type::MessageType::JoinZoneEvent, 90 },
	{ es::type::MessageType::UserUpdateEvent, 85 },
	{ es::type::MessageType::ZoneUpdateEvent, 86 },
	{ es::type::MessageType::LeaveRoomEvent, 87 },
	{ es::type::MessageType::LeaveZoneEvent, 88 },
	{ es::type::MessageType::RoomVariableUpdateEvent, 113 },
	{ es::type::MessageType::UpdateRoomDetailsEvent, 69 },
	{ es::type::MessageType::BuddyStatusUpdatedEvent, 79 },
	{ es::type::MessageType::UserEvictedFromRoomEvent, 84 },
	{ es::type::MessageType::UserVariableUpdateEvent, 89 },
	{ es::type::MessageType::PluginMessageEvent, 102 },
	{ es::type::MessageType::AggregatePluginMessageEvent, 71 },
	{ es::type::MessageType::RegistryConnectToPreferredGatewayRequest, 50 },
	{ es::type::MessageType::DisconnectedEvent, 122 },
	{ es::type::MessageType::GatewayStartupExceptionsMessage, 35 },
	{ es::type::MessageType::RegistryLoginResponse, 121 },
	{ es::type::MessageType::RegistryConnectionResponse, 33 },
	{ es::type::MessageType::GatewayKickUserRequest, 94 },
	{ es::type::MessageType::ServerKickUserEvent, 1 },
	{ es::type::MessageType::UdpBackchannelEvent, 63 },
	{ es::type::MessageType::Unknown, 117 },
	{ es::type::MessageType::RtmpPlayVideo, 144 },
	{ es::type::MessageType::RtmpEventResponse, 145 },
	{ es::type::MessageType::RtmpRecordVideo, 146 },
	{ es::type::MessageType::RtmpPublishVideo, 147 },
	{ es::type::MessageType::RtmpUnpublishVideo, 148 },
	{ es::type::MessageType::RtmpAppendVideo, 149 },
	{ es::type::MessageType::RtmpStreamingStart, 150 },
	{ es::type::MessageType::RtmpStreamingStop, 151 },
	{ es::type::MessageType::DHInitiate, 152 },
	{ es::type::MessageType::DHPublicNumbers, 153 },
	{ es::type::MessageType::DHSharedModulusRequest, 154 },
	{ es::type::MessageType::DHSharedModulusResponse, 155 },
	{ es::type::MessageType::EncryptionStateChange, 156 },
	{ es::type::MessageType::ConnectionAttemptResponse, 157 },
	{ es::type::MessageType::ConnectionClosedEvent, 158 },
	{ es::type::MessageType::RegisterUDPConnectionRequest, 53 },
	{ es::type::MessageType::RegisterUDPConnectionResponse, 54 },
	{ es::type::MessageType::RemoveUDPConnectionRequest, 57 },
	{ es::type::MessageType::RemoveUDPConnectionResponse, 46 },
	{ es::type::MessageType::PingRequest, 55 },
	{ es::type::MessageType::PingResponse, 56 },
	{ es::type::MessageType::IdleTimeoutWarningEvent, 0 },
	{ es::type::MessageType::MarkGatewayClientLoggedInMessage, 2 }
};

#include <functional>
//#include "ConnectionResponse.h"
//#include "LoginResponse.h"
//#include "PluginMessageEvent.h"
//#include "ConnectionClosedEvent.h"
//#include "JoinRoomEvent.h"
//#include "LeaveRoomEvent.h"
//#include "PublicMessageEvent.h"
//#include "GatewayKickUserRequest.h"
//#include "ServerKickUserEvent.h"
//#include "GenericErrorResponse.h"
//#include "UserEvictedFromRoomEvent.h"
//#include "PrivateMessageEvent.h"
//#include "ZoneUpdateEvent.h"

namespace es {
	typedef std::function<es::BaseMessage*()> MessageHandler;
	static std::map<es::type::MessageType, MessageHandler> s_message_handler = {
		{ es::type::MessageType::ConnectionResponse, [](){return new ConnectionResponse(); } },
		{ es::type::MessageType::LoginResponse, [](){return new es::LoginResponse(); } },
		{ es::type::MessageType::PluginMessageEvent, [](){return new es::PluginMessageEvent(); } },
		{ es::type::MessageType::ConnectionClosedEvent, [](){return new es::ConnectionClosedEvent(); } },
		{ es::type::MessageType::JoinRoomEvent, [](){return new es::JoinRoomEvent(); } },
		{ es::type::MessageType::LeaveRoomEvent, [](){return new es::LeaveRoomEvent(); } },
		{ es::type::MessageType::GatewayKickUserRequest, [](){return new es::GatewayKickUserRequest(); } },
		{ es::type::MessageType::ServerKickUserEvent, [](){return new es::ServerKickUserEvent(); } },
		{ es::type::MessageType::PingResponse, [](){return new es::ServerKickUserEvent(); } },
		{ es::type::MessageType::GenericErrorResponse, [](){return new es::GenericErrorResponse(); } },
		{ es::type::MessageType::UserEvictedFromRoomEvent, [](){return new es::UserEvictedFromRoomEvent(); } },
		{ es::type::MessageType::PrivateMessageEvent, [](){return new es::PrivateMessageEvent(); } },
		{ es::type::MessageType::ZoneUpdateEvent, [](){return new es::ZoneUpdateEvent(); } },
		{ es::type::MessageType::UserUpdateEvent, [](){return new es::UserUpdateEvent(); } },
		{ es::type::MessageType::JoinZoneEvent, [](){return new es::JoinZoneEvent(); } },
		{ es::type::MessageType::PublicMessageEvent, [](){return new es::PublicMessageEvent(); } }
	};



	unsigned short encodeMessageType(type::MessageType messageType){
		auto it = s_encode_message.find(messageType);
		if (it != s_encode_message.end()){
			return it->second;
		}

		return s_encode_message.find(es::type::MessageType::Unknown)->second;
	}

	type::MessageType decodeMessageType(unsigned short type){
		auto it = s_decode_message.find(type);
		if (it != s_decode_message.end()){
			return it->second; 
		}

		return es::type::MessageType::Unknown;
	}

	es::BaseMessage* createMessageWithType(type::MessageType type){
		auto it = s_message_handler.find(type);
		if (it != s_message_handler.end()){
			return it->second();
		}

		return 0;
	}

} /* namespace es */
