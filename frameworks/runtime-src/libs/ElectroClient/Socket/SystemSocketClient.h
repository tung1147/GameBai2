/*
 * SystemSocketClient.h
 *
 *  Created on: Oct 14, 2015
 *      Author: QuyetNguyen
 */

#ifndef SYSTEMSOCKETCLIENT_H_
#define SYSTEMSOCKETCLIENT_H_

#include "NetwordDefine.h"
#include "SocketAdapter.h"
#include <queue>

class SystemSocketSender : public SocketSender{
	SSocket mSocket;
	char headerBuffer[4];
    int messageNumber;

	virtual void update();
public:
	SystemSocketSender();
	virtual ~SystemSocketSender();

	void setSocket(SSocket socket);
};

class SystemSocketReceiver : public SocketReceiver{
	SSocket mSocket;

	bool recvHeader;
	int headerSize;

	std::vector<char> recvBuffer;	
	std::string crossDomainString;

	bool isRecvCrossDomain;

	virtual void updateCrossDomain(char* data, int size);
	virtual void updateRecvData(char* data,int size);
	virtual void updateRecvBuffer();
	virtual void processMessage(char *data, int len);

	virtual void update();
public:
	SystemSocketReceiver();
	virtual ~SystemSocketReceiver();

	void setSocket(SSocket socket);
};

class SystemSocketClient : public SocketClient{
	SSocket mSocket;
	std::mutex socketMutex;

    virtual void resetSocket();
    virtual void createAdapter();
    virtual bool connectThread();
	virtual void startAdapter();
	virtual void processSocketError();
public:
	SystemSocketClient();
	virtual ~SystemSocketClient();

	virtual void closeSocket();

    void onApplicationPause(const SocketData& sendData);
    void onApplicationResume();
};

#endif /* SYSTEMSOCKETCLIENT_H_ */
