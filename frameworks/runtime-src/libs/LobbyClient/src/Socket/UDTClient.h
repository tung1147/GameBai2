/*
 * UDTClient.h
 *
 *  Created on: Jun 6, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBYCLIENT_SOCKET_UDTCLIENT_H_
#define LOBBYCLIENT_SOCKET_UDTCLIENT_H_
#include "SocketAdapter.h"

namespace quyetnd {
namespace net{
class UDTSender : public quyetnd::net::SocketSender{
public:
	int mSocket;
protected:
	virtual void update();
public:
	UDTSender();
	virtual ~UDTSender();
};

class UDTReceiver : public quyetnd::net::SocketReceiver{
	virtual void update();
public:
	int mSocket;
public:
	UDTReceiver();
	virtual ~UDTReceiver();
};

class UDTClient : public quyetnd::net::SocketClient{
	int mSocket;
	std::mutex socketMutex;

	virtual void resetSocket();
	virtual void createAdapter();
	virtual bool connectThread();
	virtual void startAdapter();
public:
	UDTClient();
	virtual ~UDTClient();

	virtual void closeSocket();
};

}
} /* namespace quyetnd */

#endif /* LOBBYCLIENT_SOCKET_UDTCLIENT_H_ */
