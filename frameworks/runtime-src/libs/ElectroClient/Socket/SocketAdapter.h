/*
 * SocketAdapter.h
 *
 *  Created on: Dec 1, 2015
 *      Author: QuyetNguyen
 */

#ifndef SFS_SOCKET_SOCKETADAPTER_H_
#define SFS_SOCKET_SOCKETADAPTER_H_

#include "NetworkCore.h"
#include <queue>
#include <condition_variable>
#include <ctime>
#include <string>
//#include "../Entities/SFSRef.h"

namespace es{

	typedef std::function<void(es::SocketData*)> ReceiverCallback;
	typedef std::function<void(const es::SocketStatusData& data)> SocketStatusCallback;

class SocketPool{
protected:
	std::queue<es::SocketData*>* mData;
	std::mutex poolMutex;
	std::condition_variable poolCond;
public:
	SocketPool();
	virtual ~SocketPool();

	virtual void push(es::SocketData* data);
	virtual es::SocketData* take();
	virtual es::SocketData* pop();
	virtual void clear();
};

class SocketAdapter : public es::SocketRef{
protected:
	bool running;
	std::mutex mMutex;

	es::SocketPool* mData;
	virtual void update();
public:
	SocketAdapter();
	virtual ~SocketAdapter();

	virtual void updateThread();

	virtual bool isRunning();
	virtual void setRunning(bool running);

	virtual void start();
	virtual void stop();

	virtual void pushMessage(es::SocketData* data);
	virtual es::SocketData* popMessage();
	//	virtual void popAllMessage(std::vector<SocketData*> &arr);
};

class SocketSender : public es::SocketAdapter{
public:
	SocketSender();
	virtual ~SocketSender();
};

class SocketReceiver : public es::SocketAdapter{
public:
	SocketReceiver();
	virtual ~SocketReceiver();
};

/**/
class SocketClient : public es::SocketRef{
protected:
//	es::ReleasePool* releasePool;

	long long connectTime;
	std::string host;
	int port;

	std::mutex clientMutex;

	es::SocketClientStatus _clientStatus;
	es::SocketSender* mSender;
	es::SocketReceiver* mReceiver;

	std::vector<es::SocketStatusData> _statusBuffer;

	virtual void processEvent();
	virtual void processRecvMessage();
	virtual void clearAdapter();
	virtual void resetSocket();
	virtual void updateConnection();
	virtual void startAdapter();

	virtual void createAdapter();
	virtual bool connectThread();
	virtual void processSocketError();
public:
	es::ReceiverCallback _recvCallback;
	es::SocketStatusCallback _statusCallback;
public:
	SocketClient();
	virtual ~SocketClient();

	virtual void connectTo(const std::string& host, int port);

	virtual void closeClient();
	virtual void closeSocket();

	virtual es::SocketStatusType getStatus();
	virtual void setStatus(es::SocketStatusType status, bool isEvent = true);

	virtual void sendMessage(es::SocketData* data);

	virtual void processMessage();
};

}
#endif /* SFS_SOCKET_SOCKETADAPTER_H_ */
