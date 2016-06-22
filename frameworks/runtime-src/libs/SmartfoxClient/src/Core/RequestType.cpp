/*
 * RequestType.cpp
 *
 *  Created on: Jun 1, 2016
 *      Author: Quyet Nguyen
 */

#include "RequestType.h"
#include <map>

namespace SFS {
	std::map<int, std::string> _s_request_name = 
	{
		{ MessageType::Handshake, "Handshake" },
		{ MessageType::Login, "Login" },
		{ MessageType::Logout, "Logout" },
		{ MessageType::GetRoomList, "GetRoomList" },
		{ MessageType::JoinRoom, "JoinRoom" },
		{ MessageType::AutoJoin, "AutoJoin" },
		{ MessageType::CreateRoom, "CreateRoom" },
		{ MessageType::GenericMessage, "GenericMessage" },
		{ MessageType::ChangeRoomName, "ChangeRoomName" },
		{ MessageType::ChangeRoomPassword, "ChangeRoomPassword" },
		{ MessageType::ObjectMessage, "ObjectMessage" },
		{ MessageType::SetRoomVariables, "SetRoomVariables" },
		{ MessageType::SetUserVariables, "SetUserVariables" },
		{ MessageType::CallExtension, "CallExtension" },
		{ MessageType::LeaveRoom, "LeaveRoom" },
		{ MessageType::SubscribeRoomGroup, "SubscribeRoomGroup" },
		{ MessageType::UnsubscribeRoomGroup, "UnsubscribeRoomGroup" },
		{ MessageType::SpectatorToPlayer, "SpectatorToPlayer" },
		{ MessageType::PlayerToSpectator, "PlayerToSpectator" },
		{ MessageType::ChangeRoomCapacity, "ChangeRoomCapacity" },
		{ MessageType::PublicMessage, "PublicMessage" },
		{ MessageType::PrivateMessage, "PrivateMessage" },
		{ MessageType::ModeratorMessage, "ModeratorMessage" },
		{ MessageType::AdminMessage, "AdminMessage" },
		{ MessageType::KickUser, "KickUser" },
		{ MessageType::BanUser, "BanUser" },
		{ MessageType::ManualDisconnection, "ManualDisconnection" },
		{ MessageType::FindRooms, "FindRooms" },
		{ MessageType::FindUsers, "FindUsers" },
		{ MessageType::PingPong, "PingPong" },
		{ MessageType::SetUserPosition, "SetUserPosition" },

		//--- Buddy List API Requests -------------------------------------------------
		{ MessageType::InitBuddyList, "InitBuddyList" },
		{ MessageType::AddBuddy, "AddBuddy" },
		{ MessageType::BlockBuddy, "BlockBuddy" },
		{ MessageType::RemoveBuddy, "RemoveBuddy" },
		{ MessageType::SetBuddyVariables, "SetBuddyVariables" },
		{ MessageType::GoOnline, "GoOnline" },

		//--- Game API Requests --------------------------------------------------------
		{ MessageType::InviteUser, "InviteUser" },
		{ MessageType::InvitationReply, "InvitationReply" },
		{ MessageType::CreateSFSGame, "CreateSFSGame" },
		{ MessageType::QuickJoinGame, "QuickJoinGame" },

		{ MessageType::UserEnterRoom, "UserEnterRoom"},
		{ MessageType::UserCountChange, "UserCountChange" },
		{ MessageType::UserLost, "UserLost" },
		{ MessageType::RoomLost, "RoomLost" },
		{ MessageType::UserExitRoom, "UserExitRoom" },
		{ MessageType::ClientDisconnection, "ClientDisconnection" },
		{ MessageType::ReconnectionFailure, "ReconnectionFailure" },
		{ MessageType::SetMMOItemVariables, "SetMMOItemVariables" },
	};

	static std::string __s_request_name_unknown = "unknown";

const char* _request_type_name(int requestId){
	auto it = _s_request_name.find(requestId);
	if (it != _s_request_name.end()){
		return it->second.c_str();
	}

	return __s_request_name_unknown.c_str();
}

} /* namespace SFS */
