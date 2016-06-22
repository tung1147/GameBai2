/*
 * RequestType.h
 *
 *  Created on: Jun 1, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_CORE_H_
#define SFSCLIENT_CORE_H_

namespace SFS {

enum MessageType{
	//--- System API Requests -----------------------------------------------------
	Handshake = 0,
	Login = 1,
	Logout = 2,
	GetRoomList = 3,
	JoinRoom = 4,
	AutoJoin = 5,
	CreateRoom = 6,
	GenericMessage = 7,
	ChangeRoomName = 8,
	ChangeRoomPassword = 9,
	ObjectMessage = 10,
	SetRoomVariables = 11,
	SetUserVariables = 12,
	CallExtension = 13,
	LeaveRoom = 14,
	SubscribeRoomGroup = 15,
	UnsubscribeRoomGroup = 16,
	SpectatorToPlayer = 17,
	PlayerToSpectator = 18,
	ChangeRoomCapacity = 19,
	PublicMessage = 20,
	PrivateMessage = 21,
	ModeratorMessage = 22,
	AdminMessage = 23,
	KickUser = 24,
	BanUser = 25,
	ManualDisconnection = 26,
	FindRooms = 27,
	FindUsers = 28,
	PingPong = 29,
	SetUserPosition = 30,

	//--- Buddy List API Requests -------------------------------------------------
	InitBuddyList = 200,
	AddBuddy = 201,
	BlockBuddy = 202,
	RemoveBuddy = 203,
	SetBuddyVariables = 204,
	GoOnline = 205,

	//--- Game API Requests --------------------------------------------------------
	InviteUser = 300,
	InvitationReply = 301,
	CreateSFSGame = 302,
	QuickJoinGame = 303,

	//only reponse code
	UserEnterRoom = 1000,
	UserCountChange = 1001,
	UserLost  = 1002,
	RoomLost = 1003,
	UserExitRoom = 1004,
	ClientDisconnection = 1005,
	ReconnectionFailure = 1006,
	SetMMOItemVariables = 1007,

	SocketStatus = 2001,
};

const char* _request_type_name(int requestId);

} /* namespace SFS */

#endif /* SFSCLIENT_CORE_H_ */
