/*
 * ElectroClient.h
 *
 *  Created on: Sep 15, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SOCKET_ELECTROCLIENT_H_
#define SOCKET_ELECTROCLIENT_H_
#include "ElectroServer.h"
#include "jsapi.h"
#include "jsfriendapi.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"

class ElectroClient {
	es::TcpSocketClient* client;

	void onRecvMessage(es::SocketData* data);
	void onRecvStatus(const es::SocketStatusData& data);

	bool _waitingPing;
	float _pingTime;
	virtual void updatePing(float dt);
public:
	ElectroClient();
	virtual ~ElectroClient();

	void update(float dt);

	void connect(const std::string& host, int port);
	void close();
	void send(const std::string& contensJSON);
	int getStatus();
};

#endif /* SOCKET_ELECTROCLIENT_H_ */
