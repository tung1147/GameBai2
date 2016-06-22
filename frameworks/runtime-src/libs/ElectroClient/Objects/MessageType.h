//
//  MessageType.h
//  GameBaiVip
//
//  Created by QuyetNguyen on 1/30/16.
//
//

#ifndef MessageType_h
#define MessageType_h

namespace es {
	namespace type{
		enum MessageType{
			CrossDomainRequest = 1,
			CreateRoomRequest = 2,
			JoinRoomRequest = 3,
			LoginRequest = 4,
			LogOutRequest = 5,
			ValidateAdditionalLoginRequest = 6,
			ValidateAdditionalLoginResponse = 7,
			PublicMessageRequest = 8,
			PrivateMessageRequest = 9,
			LeaveRoomRequest = 10,
			CreateRoomVariableRequest = 11,
			DeleteRoomVariableRequest = 12,
			UpdateRoomVariableRequest = 13,
			GetZonesRequest = 14,
			GetRoomsInZoneRequest = 15,
			UpdateRoomDetailsRequest = 16,
			AddRoomOperatorRequest = 17,
			RemoveRoomOperatorRequest = 18,
			FindZoneAndRoomByNameRequest = 19,
			GetUsersInRoomRequest = 20,
			DeleteUserVariableRequest = 21,
			UpdateUserVariableRequest = 22,
			AddBuddiesRequest = 23,
			RemoveBuddiesRequest = 24,
			EvictUserFromRoomRequest = 25,
			GetUserCountRequest = 26,
			PluginRequest = 27,
			CreateOrJoinGameRequest = 28,
			JoinGameRequest = 29,
			FindGamesRequest = 30,
			GetUserVariablesRequest = 31,
			AggregatePluginRequest = 32,
			GetServerLocalTimeRequest = 33,
			GetGameTypesRequest = 34,
			ConnectionResponse = 35,
			CrossDomainResponse = 36,
			LoginResponse = 37,
			GetZonesResponse = 38,
			GetRoomsInZoneResponse = 39,
			GenericErrorResponse = 40,
			FindZoneAndRoomByNameResponse = 41,
			GetUsersInRoomResponse = 42,
			GetUserCountResponse = 43,
			CreateOrJoinGameResponse = 44,
			FindGamesResponse = 45,
			GetUserVariablesResponse = 46,
			AddBuddiesResponse = 47,
			RemoveBuddiesResponse = 48,
			GetServerLocalTimeResponse = 49,
			GetGameTypesResponse = 50,
			PublicMessageEvent = 51,
			PrivateMessageEvent = 52,
			SessionIdleEvent = 53,
			JoinRoomEvent = 54,
			JoinZoneEvent = 55,
			UserUpdateEvent = 56,
			ZoneUpdateEvent = 57,
			LeaveRoomEvent = 58,
			LeaveZoneEvent = 59,
			RoomVariableUpdateEvent = 60,
			UpdateRoomDetailsEvent = 61,
			BuddyStatusUpdatedEvent = 62,
			UserEvictedFromRoomEvent = 63,
			UserVariableUpdateEvent = 64,
			PluginMessageEvent = 65,
			AggregatePluginMessageEvent = 66,
			RegistryConnectToPreferredGatewayRequest = 67,
			DisconnectedEvent = 68,
			GatewayStartupExceptionsMessage = 69,
			RegistryLoginResponse = 70,
			RegistryConnectionResponse = 71,
			GatewayKickUserRequest = 72,
			ServerKickUserEvent = 73,
			UdpBackchannelEvent = 74,
			Unknown = 75,
			RtmpPlayVideo = 76,
			RtmpEventResponse = 77,
			RtmpRecordVideo = 78,
			RtmpPublishVideo = 79,
			RtmpUnpublishVideo = 80,
			RtmpAppendVideo = 81,
			RtmpStreamingStart = 82,
			RtmpStreamingStop = 83,
			DHInitiate = 84,
			DHPublicNumbers = 85,
			DHSharedModulusRequest = 86,
			DHSharedModulusResponse = 87,
			EncryptionStateChange = 88,
			ConnectionAttemptResponse = 89,
			ConnectionClosedEvent = 90,
			RegisterUDPConnectionRequest = 91,
			RegisterUDPConnectionResponse = 92,
			RemoveUDPConnectionRequest = 93,
			RemoveUDPConnectionResponse = 94,
			PingRequest = 95,
			PingResponse = 96,
			IdleTimeoutWarningEvent = 97,
			MarkGatewayClientLoggedInMessage = 98,

			SocketStatus = 1001,
			RequestTimeout = 2001,
		};

		const char* messageTypeName(type::MessageType messageType);
		const char* messageTypeName(int type);
	}
   
}

#endif /* MessageType_h */
