/*
 * NetworkCore.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_SOCKET_NETWORKCORE_H_
#define SFSCLIENT_SOCKET_NETWORKCORE_H_
#include "NetworkDefine.h"
#include "../Objects/BaseMessage.h"

namespace es{
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
	es::SocketStatusType preStatus;
	es::SocketStatusType status;
};

class SocketRef {
protected:
	int retainCount;
	std::mutex refMutex;
public:
	SocketRef();
	virtual ~SocketRef();

	virtual void retain();
	virtual void release();
};

class SocketClientStatus{
	es::SocketStatusType clientStatus;
	std::mutex statusMutex;
	std::vector<es::SocketStatusData> statusEvent;

	//	SocketStatusCallback mStatusCallback;
public:
	SocketClientStatus();
	~SocketClientStatus();

	void set(es::SocketStatusType status, bool isEvent);
	es::SocketStatusType get();

	void popAllStatus(std::vector<es::SocketStatusData> &buffer);
	void clear();
};

typedef es::BaseMessage SocketData;

}
#endif /* SFSCLIENT_SOCKET_NETWORKCORE_H_ */
