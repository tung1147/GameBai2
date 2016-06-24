/*
 * NetworkCore.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_SOCKET_NETWORKCORE_H_
#define SFSCLIENT_SOCKET_NETWORKCORE_H_
#include "NetworkDefine.h"
#include "../Entities/BaseMessage.h"

namespace SFS{
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
	SFS::SocketStatusType preStatus;
	SFS::SocketStatusType status;
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
	SFS::SocketStatusType clientStatus;
	std::mutex statusMutex;
	std::vector<SFS::SocketStatusData> statusEvent;

	//	SocketStatusCallback mStatusCallback;
public:
	SocketClientStatus();
	~SocketClientStatus();

	void set(SFS::SocketStatusType status, bool isEvent);
	SFS::SocketStatusType get();

	void popAllStatus(std::vector<SFS::SocketStatusData> &buffer);
	void clear();
};

typedef SFS::BaseMessage SocketData;

}
#endif /* SFSCLIENT_SOCKET_NETWORKCORE_H_ */
