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
#include "../Entities/SFSRef.h"

namespace SFS{

typedef std::function<void(SFS::SocketData*)> ReceiverCallback;
typedef std::function<void(const SFS::SocketStatusData& data)> SocketStatusCallback;

class SocketPool{
protected:
	std::queue<SFS::SocketData*>* mData;
	std::mutex poolMutex;
	std::condition_variable poolCond;
public:
	SocketPool();
	virtual ~SocketPool();

	virtual void push(SFS::SocketData* data);
	virtual SFS::SocketData* take();
	virtual SFS::SocketData* pop();
	virtual void clear();
};

class SocketAdapter : public SFS::SocketRef{
protected:
	bool running;
	std::mutex mMutex;

	SFS::SocketPool* mData;
	virtual void update();
public:
	SocketAdapter();
	virtual ~SocketAdapter();

	virtual void updateThread();

	virtual bool isRunning();
	virtual void setRunning(bool running);

	virtual void start();
	virtual void stop();

	virtual void pushMessage(SFS::SocketData* data);
	virtual SocketData* popMessage();
	//	virtual void popAllMessage(std::vector<SocketData*> &arr);
};

class SocketSender : public SFS::SocketAdapter{
public:
	SocketSender();
	virtual ~SocketSender();
};

class SocketReceiver : public SFS::SocketAdapter{
public:
	SocketReceiver();
	virtual ~SocketReceiver();
};

/**/
class SocketClient : public SFS::SocketRef{
protected:
	SFS::ReleasePool* releasePool;

	long long connectTime;
	std::string host;
	int port;

	std::mutex clientMutex;

	SFS::SocketClientStatus _clientStatus;
	SFS::SocketSender* mSender;
	SFS::SocketReceiver* mReceiver;

	std::vector<SFS::SocketStatusData> _statusBuffer;

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
	SFS::ReceiverCallback _recvCallback;
	SFS::SocketStatusCallback _statusCallback;
public:
	SocketClient();
	virtual ~SocketClient();

	virtual void connectTo(const std::string& host, int port);

	virtual void closeClient();
	virtual void closeSocket();

	virtual SFS::SocketStatusType getStatus();
	virtual void setStatus(SFS::SocketStatusType status, bool isEvent = true);

	virtual void sendMessage(SFS::SocketData* data);

	virtual void processMessage();
};

}
#endif /* SFS_SOCKET_SOCKETADAPTER_H_ */
