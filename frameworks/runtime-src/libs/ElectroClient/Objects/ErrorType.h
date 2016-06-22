/*
 * ErrorType.h
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_ERRORTYPE_H_
#define ELECTROCLIENT_OBJECTS_ERRORTYPE_H_

namespace es {
	namespace type {
		enum ErrorType {
			UserNameExists = 1,
			UserAlreadyLoggedIn = 2,
			InvalidMessageNumber = 3,
			InboundMessageFailedValidation = 4,
			MaximumClientConnectionsReached = 5,
			ZoneNotFound = 6,
			RoomNotFound = 7,
			RoomAtCapacity = 8,
			RoomPasswordMismatch = 9,
			GatewayPaused = 10,
			AccessDenied = 11,
			RoomVariableLocked = 12,
			RoomVariableAlreadyExists = 13,
			DuplicateRoomName = 14,
			DuplicateZoneName = 15,
			UserVariableAlreadyExists = 16,
			UserVariableDoesNotExist = 17,
			ZoneAllocationFailure = 18,
			RoomAllocationFailure = 19,
			UserBanned = 20,
			UserAlreadyInRoom = 21,
			LanguageFilterCheckFailed = 22,
			RegistryTransactionEncounteredError = 23,
			ActionRequiresLogin = 24,
			GenericError = 25,
			PluginNotFound = 26,
			LoginEventHandlerFailure = 27,
			InvalidUserName = 28,
			ExtensionNotFound = 29,
			PluginInitializationFailed = 30,
			EventNotFound = 31,
			FloodingFilterCheckFailed = 32,
			UserNotJoinedToRoom = 33,
			ManagedObjectNotFound = 34,
			IdleTimeReached = 35,
			ServerError = 36,
			OperationNotSupported = 37,
			InvalidLanguageFilterSettings = 38,
			InvalidFloodingFilterSettings = 39,
			ExtensionForcedReload = 40,
			UserLogOutRequested = 41,
			OnlyRtmpConnectionRemains = 42,
			GameDoesntExist = 43,
			FailedToJoinGameRoom = 44,
			GameIsLocked = 45,
			InvalidParameters = 46,
			PublicMessageRejected = 47,
			UserKickedFromServer = 48,
			LanguageFilterNotFound = 49,
			InvalidCryptoState = 50,
			FloodingFilterNotFound = 51,
			ConnectionFailed = 52,
			MultipleZonesFound = 53,
			MultipleRoomsFound = 54,
			LoginsAreDisabled = 55,
			ClientDroppedConnection = 56
		};

		const char* errorType_name(ErrorType errorType);
		const char* errorType_name(int type);

	}
} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ERRORTYPE_H_ */
