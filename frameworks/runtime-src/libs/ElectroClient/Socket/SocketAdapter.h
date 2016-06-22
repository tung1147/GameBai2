/*
 * SocketAdapter.h
 *
 *  Created on: Dec 1, 2015
 *      Author: QuyetNguyen
 */

#ifndef SOCKET_SOCKETADAPTER_H_
#define SOCKET_SOCKETADAPTER_H_

#include "NetwordDefine.h"
#include <queue>
#include <condition_variable>

class SocketPool{
protected:
    std::queue<SocketData*>* mData;
    std::mutex poolMutex;
public:
    SocketPool();
    virtual ~SocketPool();
    
	virtual void push(SocketData* data);
    virtual void clear();
    virtual SocketData* take();
    virtual void takeAll(std::vector<SocketData*> &arr);
};

class SocketPoolSender : public SocketPool{
    std::condition_variable poolCond;
    char headerBuffer[4];
public:
    SocketPoolSender();
    virtual ~SocketPoolSender();
    
    void push(SocketData* data);
    SocketData* take();
    void clear();
};

class SocketPoolReceiver : public SocketPool{
public:
    SocketPoolReceiver();
    virtual ~SocketPoolReceiver();
    
	void push(SocketData* data);
};

class SocketAdapter : public SocketRef{
protected:
	bool running;
	std::mutex mMutex;

	SocketPool* mData;
	virtual void update();
public:
	SocketAdapter();
	virtual ~SocketAdapter();

	virtual void updateThread();

	virtual bool isRunning();
	virtual void setRunning(bool running);

	virtual void start();
	virtual void stop();
    
	virtual void pushSendMessage(SocketData* data);
	virtual void popAllMessage(std::vector<SocketData*> &arr);
};

class SocketSender : public SocketAdapter{
public:
    SocketSender();
    virtual ~SocketSender();
};

class SocketReceiver : public SocketAdapter{
public:
    SocketReceiver();
    virtual ~SocketReceiver();
};

/**/
class SocketClient : public SocketRef{
protected:
	std::string host;
	int port;

	std::mutex clientMutex;

	SocketClientStatus _clientStatus;
	SocketSender* mSender;
	SocketReceiver* mReceiver;

	ReceiverCallback _recvCallback;

	std::vector<SocketData*> _recvBuffer;
	std::vector<SocketStatusEvent> _statusBuffer;

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
	SocketClient();
	virtual ~SocketClient();

	virtual void connectTo(const std::string& host, int port);

	virtual void closeClient();
	virtual void closeSocket();

	virtual SocketStatus getStatus();
	virtual void setStatus(SocketStatus status, bool isEvent = true);

	virtual void sendMessage(SocketData* data);
	virtual void addCallback(const ReceiverCallback& callback);

	virtual void processMessage();
};
#endif /* SOCKET_SOCKETADAPTER_H_ */
