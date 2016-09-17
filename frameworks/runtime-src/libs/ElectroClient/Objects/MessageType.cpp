//
//  MessageType.cpp
//  GameBaiVip
//
//  Created by QuyetNguyen on 1/30/16.
//
//

#include "MessageType.h"
#include <map>
#include <string>

namespace es{  
	namespace type{
		static std::string message_name_default = "noname";
		static std::map<int, std::string> s_messageType_name = {
			{ MessageType::CrossDomainRequest, "CrossDomainRequest" },
			{ MessageType::CreateRoomRequest, "CreateRoomRequest" },
			{ MessageType::JoinRoomRequest, "JoinRoomRequest" },
			{ MessageType::LoginRequest, "LoginRequest" },
			{ MessageType::LogOutRequest, "LogOutRequest" },
			{ MessageType::ValidateAdditionalLoginRequest, "ValidateAdditionalLoginRequest" },
			{ MessageType::ValidateAdditionalLoginResponse, "ValidateAdditionalLoginResponse" },
			{ MessageType::PublicMessageRequest, "PublicMessageRequest" },
			{ MessageType::PrivateMessageRequest, "PrivateMessageRequest" },
			{ MessageType::LeaveRoomRequest, "LeaveRoomRequest" },
			{ MessageType::CreateRoomVariableRequest, "CreateRoomVariableRequest" },
			{ MessageType::DeleteRoomVariableRequest, "DeleteRoomVariableRequest" },
			{ MessageType::UpdateRoomVariableRequest, "UpdateRoomVariableRequest" },
			{ MessageType::GetZonesRequest, "GetZonesRequest" },
			{ MessageType::GetRoomsInZoneRequest, "GetRoomsInZoneRequest" },
			{ MessageType::UpdateRoomDetailsRequest, "UpdateRoomDetailsRequest" },
			{ MessageType::AddRoomOperatorRequest, "AddRoomOperatorRequest" },
			{ MessageType::RemoveRoomOperatorRequest, "RemoveRoomOperatorRequest" },
			{ MessageType::FindZoneAndRoomByNameRequest, "FindZoneAndRoomByNameRequest" },
			{ MessageType::GetUsersInRoomRequest, "GetUsersInRoomRequest" },
			{ MessageType::DeleteUserVariableRequest, "DeleteUserVariableRequest" },
			{ MessageType::UpdateUserVariableRequest, "UpdateUserVariableRequest" },
			{ MessageType::AddBuddiesRequest, "AddBuddiesRequest" },
			{ MessageType::RemoveBuddiesRequest, "RemoveBuddiesRequest" },
			{ MessageType::EvictUserFromRoomRequest, "EvictUserFromRoomRequest" },
			{ MessageType::GetUserCountRequest, "GetUserCountRequest" },
			{ MessageType::PluginRequest, "PluginRequest" },
			{ MessageType::CreateOrJoinGameRequest, "CreateOrJoinGameRequest" },
			{ MessageType::JoinGameRequest, "JoinGameRequest" },
			{ MessageType::FindGamesRequest, "FindGamesRequest" },
			{ MessageType::GetUserVariablesRequest, "GetUserVariablesRequest" },
			{ MessageType::AggregatePluginRequest, "AggregatePluginRequest" },
			{ MessageType::GetServerLocalTimeRequest, "GetServerLocalTimeRequest" },
			{ MessageType::GetGameTypesRequest, "GetGameTypesRequest" },
			{ MessageType::ConnectionResponse, "ConnectionResponse" },
			{ MessageType::CrossDomainResponse, "CrossDomainResponse" },
			{ MessageType::LoginResponse, "LoginResponse" },
			{ MessageType::GetZonesResponse, "GetZonesResponse" },
			{ MessageType::GetRoomsInZoneResponse, "GetRoomsInZoneResponse" },
			{ MessageType::GenericErrorResponse, "GenericErrorResponse" },
			{ MessageType::FindZoneAndRoomByNameResponse, "FindZoneAndRoomByNameResponse" },
			{ MessageType::GetUsersInRoomResponse, "GetUsersInRoomResponse" },
			{ MessageType::GetUserCountResponse, "GetUserCountResponse" },
			{ MessageType::CreateOrJoinGameResponse, "CreateOrJoinGameResponse" },
			{ MessageType::FindGamesResponse, "FindGamesResponse" },
			{ MessageType::GetUserVariablesResponse, "GetUserVariablesResponse" },
			{ MessageType::AddBuddiesResponse, "AddBuddiesResponse" },
			{ MessageType::RemoveBuddiesResponse, "RemoveBuddiesResponse" },
			{ MessageType::GetServerLocalTimeResponse, "GetServerLocalTimeResponse" },
			{ MessageType::GetGameTypesResponse, "GetGameTypesResponse" },
			{ MessageType::PublicMessageEvent, "PublicMessageEvent" },
			{ MessageType::PrivateMessageEvent, "PrivateMessageEvent" },
			{ MessageType::SessionIdleEvent, "SessionIdleEvent" },
			{ MessageType::JoinRoomEvent, "JoinRoomEvent" },
			{ MessageType::JoinZoneEvent, "JoinZoneEvent" },
			{ MessageType::UserUpdateEvent, "UserUpdateEvent" },
			{ MessageType::ZoneUpdateEvent, "ZoneUpdateEvent" },
			{ MessageType::LeaveRoomEvent, "LeaveRoomEvent" },
			{ MessageType::LeaveZoneEvent, "LeaveZoneEvent" },
			{ MessageType::RoomVariableUpdateEvent, "RoomVariableUpdateEvent" },
			{ MessageType::UpdateRoomDetailsEvent, "UpdateRoomDetailsEvent" },
			{ MessageType::BuddyStatusUpdatedEvent, "BuddyStatusUpdatedEvent" },
			{ MessageType::UserEvictedFromRoomEvent, "UserEvictedFromRoomEvent" },
			{ MessageType::UserVariableUpdateEvent, "UserVariableUpdateEvent" },
			{ MessageType::PluginMessageEvent, "PluginMessageEvent" },
			{ MessageType::AggregatePluginMessageEvent, "AggregatePluginMessageEvent" },
			{ MessageType::RegistryConnectToPreferredGatewayRequest, "RegistryConnectToPreferredGatewayRequest" },
			{ MessageType::DisconnectedEvent, "DisconnectedEvent" },
			{ MessageType::GatewayStartupExceptionsMessage, "GatewayStartupExceptionsMessage" },
			{ MessageType::RegistryLoginResponse, "RegistryLoginResponse" },
			{ MessageType::RegistryConnectionResponse, "RegistryConnectionResponse" },
			{ MessageType::GatewayKickUserRequest, "GatewayKickUserRequest" },
			{ MessageType::ServerKickUserEvent, "ServerKickUserEvent" },
			{ MessageType::UdpBackchannelEvent, "UdpBackchannelEvent" },
			{ MessageType::Unknown, "Unknown" },
			{ MessageType::RtmpPlayVideo, "RtmpPlayVideo" },
			{ MessageType::RtmpEventResponse, "RtmpEventResponse" },
			{ MessageType::RtmpRecordVideo, "RtmpRecordVideo" },
			{ MessageType::RtmpPublishVideo, "RtmpPublishVideo" },
			{ MessageType::RtmpUnpublishVideo, "RtmpUnpublishVideo" },
			{ MessageType::RtmpAppendVideo, "RtmpAppendVideo" },
			{ MessageType::RtmpStreamingStart, "RtmpStreamingStart" },
			{ MessageType::RtmpStreamingStop, "RtmpStreamingStop" },
			{ MessageType::DHInitiate, "DHInitiate" },
			{ MessageType::DHPublicNumbers, "DHPublicNumbers" },
			{ MessageType::DHSharedModulusRequest, "DHSharedModulusRequest" },
			{ MessageType::DHSharedModulusResponse, "DHSharedModulusResponse" },
			{ MessageType::EncryptionStateChange, "EncryptionStateChange" },
			{ MessageType::ConnectionAttemptResponse, "ConnectionAttemptResponse" },
			{ MessageType::ConnectionClosedEvent, "ConnectionClosedEvent" },
			{ MessageType::RegisterUDPConnectionRequest, "RegisterUDPConnectionRequest" },
			{ MessageType::RegisterUDPConnectionResponse, "RegisterUDPConnectionResponse" },
			{ MessageType::RemoveUDPConnectionRequest, "RemoveUDPConnectionRequest" },
			{ MessageType::RemoveUDPConnectionResponse, "RemoveUDPConnectionResponse" },
			{ MessageType::PingRequest, "PingRequest" },
			{ MessageType::PingResponse, "PingResponse" },
			{ MessageType::IdleTimeoutWarningEvent, "IdleTimeoutWarningEvent" },
			{ MessageType::MarkGatewayClientLoggedInMessage, "MarkGatewayClientLoggedInMessage" }
		};

		const char* messageTypeName(MessageType messageType){
			return messageTypeName((int)messageType);
		}

		const char* messageTypeName(int type){
			auto it = s_messageType_name.find(type);
			if (it != s_messageType_name.end()){
				return it->second.c_str();
			}

			return message_name_default.c_str();
		}
	}
}

