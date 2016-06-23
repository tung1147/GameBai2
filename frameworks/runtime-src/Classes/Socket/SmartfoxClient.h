/*
 * SmartfoxClient.h
 *
 *  Created on: Jun 23, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SOCKET_SMARTFOXCLIENT_H_
#define SOCKET_SMARTFOXCLIENT_H_

#include "SFSServer.h"
#include "jsapi.h"
#include "jsfriendapi.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"

namespace quyetnd {

class SmartfoxClient {
	SFS::TcpSocketClient* client;

	void onRecvMessage(SFS::SocketData* data);
	void onRecvStatus(const SFS::SocketStatusData& data);
	void sendMessage(SFS::SocketData* message);
	void sendJSMessage(const std::string& messageName, const std::string& value);
public:
	SmartfoxClient();
	virtual ~SmartfoxClient();

	void update(float dt);

	void connect(const std::string& host, int port);
	void close();
	void send(const std::string& json);
};

} /* namespace quyetnd */

#endif /* SOCKET_SMARTFOXCLIENT_H_ */
