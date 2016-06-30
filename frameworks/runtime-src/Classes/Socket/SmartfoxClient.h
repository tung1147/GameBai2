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
public:
	SmartfoxClient();
	virtual ~SmartfoxClient();

	void update(float dt);

	void connect(const std::string& host, int port);
	void close();
	void send(int messageType, const std::string& contensJSON);
	int getStatus();
};

} /* namespace quyetnd */

#endif /* SOCKET_SMARTFOXCLIENT_H_ */
