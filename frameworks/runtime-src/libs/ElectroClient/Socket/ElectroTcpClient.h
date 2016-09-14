/*
 * SFSTcpClient.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_SOCKET_SFSTCPCLIENT_H_
#define SFSCLIENT_SOCKET_SFSTCPCLIENT_H_
#include "SocketAdapter.h"

namespace es{

class TcpSocketSender : public es::SocketSender{
	SSocket mSocket;
	char headerBuffer[4];
	int messageNumber;

	virtual void update();
public:
	TcpSocketSender();
	virtual ~TcpSocketSender();
	void setSocket(SSocket socket);
};

class TcpSocketReceiver : public es::SocketReceiver{
	SSocket mSocket;

	bool recvHeader;
	int headerSize;

	std::vector<char> recvBuffer;
	std::string crossDomainString;

	bool isRecvCrossDomain;

	virtual void updateCrossDomain(char* data, int size);
	virtual void updateRecvData(char* data, int size);
	virtual void updateRecvBuffer();
	virtual void processMessage(char *data, int len);

	virtual void update();
public:
	TcpSocketReceiver();
	virtual ~TcpSocketReceiver();
	void setSocket(SSocket socket);
};

class TcpSocketClient : public es::SocketClient{
	SSocket mSocket;
	std::mutex socketMutex;

	virtual void resetSocket();
	virtual void createAdapter();
	virtual bool connectThread();
	virtual void startAdapter();
public:
	TcpSocketClient();
	virtual ~TcpSocketClient();

	virtual void closeSocket();

	void onApplicationPause(const SocketData& sendData);
	void onApplicationResume();
};

}

#endif /* SFSCLIENT_SOCKET_SFSTCPCLIENT_H_ */
