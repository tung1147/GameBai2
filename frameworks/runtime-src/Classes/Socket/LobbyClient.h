/*
 * LobbyClient.h
 *
 *  Created on: Jun 23, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SOCKET_LOBBYCLIENT_H_
#define SOCKET_LOBBYCLIENT_H_

#include "jsapi.h"
#include "jsfriendapi.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "LobbyServer.h"
#include <vector>

namespace quyetnd {
enum LobbyClientType{
	UDT = 0,
	TCP = 1
};

class LobbyClient {
	quyetnd::net::SocketClient* mClient;

	void onRecvMessage(quyetnd::net::SocketData* data);
	void onRecvStatus(const quyetnd::net::SocketStatusData& data);
	void sendMessage(quyetnd::data::Value* message);
	void sendJSMessage(const std::string& messageName, const std::string& value);
	
	bool _waitingPing;
	float _pingTime;
	float _pingTimeInterval;
	void updatePing(float dt);
public:
	LobbyClient();
	virtual ~LobbyClient();

	void initClientWithType(int type);
	void update(float dt);

	void connect(const std::string& host, int port);
	void setPingTimeInterval(float time);
	void close();
	void send(const std::string& json);

	int getStatus();
};

} /* namespace quyetnd */

#endif /* SOCKET_LOBBYCLIENT_H_ */
