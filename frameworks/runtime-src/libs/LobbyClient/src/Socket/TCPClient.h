/*
 * TCPClient.h
 *
 *  Created on: Jun 6, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBYCLIENT_SOCKET_TCPCLIENT_H_
#define LOBBYCLIENT_SOCKET_TCPCLIENT_H_
#include "SocketAdapter.h"

namespace quyetnd {
namespace net{

#ifdef USE_WINSOCK_2
	typedef SOCKET TcpSocket;
#else 
	typedef int TcpSocket;
#endif

class TCPSender : public quyetnd::net::SocketSender{
public:
	quyetnd::net::TcpSocket mSocket;
protected:
	virtual void update();
public:
	TCPSender();
	virtual ~TCPSender();
};

class TCPReceiver : public quyetnd::net::SocketReceiver{
	virtual void update();
public:
	quyetnd::net::TcpSocket mSocket;
public:
	TCPReceiver();
	virtual ~TCPReceiver();
};

class TCPClient : public quyetnd::net::SocketClient{
	TcpSocket mSocket;
	std::mutex socketMutex;

	virtual void resetSocket();
	virtual void createAdapter();
	virtual bool connectThread();
	virtual void startAdapter();
public:
	TCPClient();
	virtual ~TCPClient();

	virtual void closeSocket();
};


}
} /* namespace quyetnd */

#endif /* LOBBYCLIENT_SOCKET_TCPCLIENT_H_ */
