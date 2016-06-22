//
//  ErrorType.cpp
//  GameBaiVip
//
//  Created by QuyetNguyen on 1/30/16.
//
//

#include "ErrorType.h"
#include <map>




namespace es {
	namespace type{
		static std::string defaultErrorName = "unknown_error";

		static std::map<int, std::string> s_error_name = {
			{ UserNameExists, "UserNameExists" },
			{ UserAlreadyLoggedIn, "UserAlreadyLoggedIn" },
			{ InvalidMessageNumber, "InvalidMessageNumber" },
			{ InboundMessageFailedValidation, "InboundMessageFailedValidation" },
			{ MaximumClientConnectionsReached, "MaximumClientConnectionsReached" },
			{ ZoneNotFound, "ZoneNotFound" },
			{ RoomNotFound, "RoomNotFound" },
			{ RoomAtCapacity, "RoomAtCapacity" },
			{ RoomPasswordMismatch, "RoomPasswordMismatch" },
			{ GatewayPaused, "GatewayPaused" },
			{ AccessDenied, "AccessDenied" },
			{ RoomVariableLocked, "RoomVariableLocked" },
			{ RoomVariableAlreadyExists, "" },
			{ DuplicateRoomName, "DuplicateRoomName" },
			{ DuplicateZoneName, "DuplicateZoneName" },
			{ UserVariableAlreadyExists, "UserVariableAlreadyExists" },
			{ UserVariableDoesNotExist, "UserVariableDoesNotExist" },
			{ ZoneAllocationFailure, "ZoneAllocationFailure" },
			{ RoomAllocationFailure, "RoomAllocationFailure" },
			{ UserBanned, "UserBanned" },
			{ UserAlreadyInRoom, "UserAlreadyInRoom" },
			{ LanguageFilterCheckFailed, "LanguageFilterCheckFailed" },
			{ RegistryTransactionEncounteredError, "RegistryTransactionEncounteredError" },
			{ ActionRequiresLogin, "ActionRequiresLogin" },
			{ GenericError, "GenericError" },
			{ PluginNotFound, "PluginNotFound" },
			{ LoginEventHandlerFailure, "LoginEventHandlerFailure" },
			{ InvalidUserName, "InvalidUserName" },
			{ ExtensionNotFound, "ExtensionNotFound" },
			{ PluginInitializationFailed, "PluginInitializationFailed" },
			{ EventNotFound, "EventNotFound" },
			{ FloodingFilterCheckFailed, "FloodingFilterCheckFailed" },
			{ UserNotJoinedToRoom, "UserNotJoinedToRoom" },
			{ ManagedObjectNotFound, "ManagedObjectNotFound" },
			{ IdleTimeReached, "IdleTimeReached" },
			{ ServerError, "ServerError" },
			{ OperationNotSupported, "OperationNotSupported" },
			{ InvalidLanguageFilterSettings, "InvalidLanguageFilterSettings" },
			{ InvalidFloodingFilterSettings, "InvalidFloodingFilterSettings" },
			{ ExtensionForcedReload, "ExtensionForcedReload" },
			{ UserLogOutRequested, "UserLogOutRequested" },
			{ OnlyRtmpConnectionRemains, "OnlyRtmpConnectionRemains" },
			{ GameDoesntExist, "GameDoesntExist" },
			{ FailedToJoinGameRoom, "FailedToJoinGameRoom" },
			{ GameIsLocked, "GameIsLocked" },
			{ InvalidParameters, "InvalidParameters" },
			{ PublicMessageRejected, "PublicMessageRejected" },
			{ UserKickedFromServer, "UserKickedFromServer" },
			{ LanguageFilterNotFound, "LanguageFilterNotFound" },
			{ InvalidCryptoState, "InvalidCryptoState" },
			{ FloodingFilterNotFound, "FloodingFilterNotFound" },
			{ ConnectionFailed, "ConnectionFailed" },
			{ MultipleZonesFound, "MultipleZonesFound" },
			{ MultipleRoomsFound, "MultipleRoomsFound" },
			{ LoginsAreDisabled, "LoginsAreDisabled" },
			{ ClientDroppedConnection, "ClientDroppedConnection" }
		};
		const char* errorType_name(ErrorType errorType){
			return errorType_name((int)errorType);
		}

		const char* errorType_name(int type){
			auto it = s_error_name.find(type);
			if (it != s_error_name.end()){
				return it->second.c_str();
			}
			return defaultErrorName.c_str();
		}
	}
}

