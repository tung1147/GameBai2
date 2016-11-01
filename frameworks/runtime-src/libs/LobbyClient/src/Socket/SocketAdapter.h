/*
 * SocketAdapter.h
 *
 *  Created on: Dec 1, 2015
 *      Author: QuyetNguyen
 */

#ifndef LOBBY_SOCKET_SOCKETADAPTER_H_
#define LOBBY_SOCKET_SOCKETADAPTER_H_

#include "NetworkCore.h"
#include <queue>
#include <condition_variable>
#include <ctime>
#include "../Objects/ValueReader.h"

//#define USE_MESSAGE_HEADER 1

namespace quyetnd{
namespace net{

typedef std::function<void(quyetnd::net::SocketData*)> ReceiverCallback;
typedef std::function<void(const quyetnd::net::SocketStatusData& data)> SocketStatusCallback;

class SocketPool{
protected:
	std::queue<quyetnd::net::SocketData*>* mData;
	std::mutex poolMutex;
	std::condition_variable poolCond;
public:
	SocketPool();
	virtual ~SocketPool();

	virtual void push(quyetnd::net::SocketData* data);
	virtual quyetnd::net::SocketData* take();
	virtual quyetnd::net::SocketData* pop();
	virtual void clear();
};

//class SocketPoolSender : public quyetnd::net::SocketPool{
//	std::condition_variable poolCond;
//	char headerBuffer[4];
//public:
//	SocketPoolSender();
//	virtual ~SocketPoolSender();
//
//	void push(quyetnd::net::SocketData* data);
//	quyetnd::net::SocketData* take();
//	void clear();
//};
//
//class SocketPoolReceiver : public quyetnd::net::SocketPool{
//public:
//	SocketPoolReceiver();
//	virtual ~SocketPoolReceiver();
//
//	void push(quyetnd::net::SocketData* data);
//};

class SocketAdapter : public quyetnd::data::LobbyRef{
protected:
	bool running;
	std::mutex mMutex;

	quyetnd::net::SocketPool* mData;
	virtual void update();
public:
	SocketAdapter();
	virtual ~SocketAdapter();

	virtual void updateThread();

	virtual bool isRunning();
	virtual void setRunning(bool running);

	virtual void start();
	virtual void stop();

	virtual void pushMessage(quyetnd::net::SocketData* data);
	virtual quyetnd::net::SocketData* popMessage();
	//	virtual void popAllMessage(std::vector<SocketData*> &arr);
};

class SocketSender : public quyetnd::net::SocketAdapter{
protected:
	//std::vector<char> sendBuffer;
	quyetnd::data::ValueWriter* writer;
	void toBufferData(quyetnd::net::SocketData* data);
public:
	SocketSender();
	virtual ~SocketSender();
};

class SocketReceiver : public quyetnd::net::SocketAdapter, public quyetnd::data::ValueReaderDelegate{
protected:
#ifdef USE_MESSAGE_HEADER
	std::vector<char> byteBuffer;
	int dataSize;
	bool recvHeader;

	virtual void onRecvData();
	virtual void onUpdateDataHeader();
	virtual void onUpdateData();
#endif

	quyetnd::data::ValueReader* reader;
	virtual void recvData(const char* data, int size);
	virtual void onRecvMessage(quyetnd::data::Value* value);
public:
	SocketReceiver();
	virtual ~SocketReceiver();

	virtual void updateThread();
};

/**/
class SocketClient : public quyetnd::data::LobbyRef{
protected:
	quyetnd::data::ReleasePool* releasePool;

	long long connectTime;
	std::string host;
	int port;

	std::mutex clientMutex;

	quyetnd::net::SocketClientStatus _clientStatus;
	quyetnd::net::SocketSender* mSender;
	quyetnd::net::SocketReceiver* mReceiver;

	std::vector<quyetnd::net::SocketStatusData> _statusBuffer;

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
	quyetnd::net::ReceiverCallback _recvCallback;
	quyetnd::net::SocketStatusCallback _statusCallback;
public:
	SocketClient();
	virtual ~SocketClient();

	virtual void connectTo(const std::string& host, int port);

	virtual void closeClient();
	virtual void closeSocket();

	virtual quyetnd::net::SocketStatusType getStatus();
	virtual void setStatus(quyetnd::net::SocketStatusType status, bool isEvent = true);

	virtual void sendMessage(quyetnd::net::SocketData* data);

	virtual void processMessage();
};

}
}
#endif /* LOBBY_SOCKET_SOCKETADAPTER_H_ */
