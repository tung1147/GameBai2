/*
 * NetworkCore.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBY_CLIENT_SOCKET_NETWORKCORE_H_
#define LOBBY_CLIENT_SOCKET_NETWORKCORE_H_
#include "NetworkDefine.h"
#include "../Objects/Value.h"

namespace quyetnd{
namespace net{

enum SocketStatusType{
	NotConnection = 0,
	Connecting, //1
	Connected, //2
	ConnectFailure, //3
	LostConnection, //4
	Closed //5
};

const char* SocketStatusName(int status);

struct SocketStatusData{
	quyetnd::net::SocketStatusType preStatus;
	quyetnd::net::SocketStatusType status;
};

class SocketClientStatus{
	quyetnd::net::SocketStatusType clientStatus;
	std::mutex statusMutex;
	std::vector<quyetnd::net::SocketStatusData> statusEvent;
public:
	SocketClientStatus();
	~SocketClientStatus();

	void set(quyetnd::net::SocketStatusType status, bool isEvent);
	quyetnd::net::SocketStatusType get();

	void popAllStatus(std::vector<quyetnd::net::SocketStatusData> &buffer);
	void clear();
};

typedef quyetnd::data::Value SocketData;

}
}
#endif /* LOBBY_CLIENT_SOCKET_NETWORKCORE_H_ */
