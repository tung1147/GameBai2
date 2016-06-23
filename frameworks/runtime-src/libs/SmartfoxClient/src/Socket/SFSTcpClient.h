/*
 * SFSTcpClient.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_SOCKET_SFSTCPCLIENT_H_
#define SFSCLIENT_SOCKET_SFSTCPCLIENT_H_
#include "SocketAdapter.h"

namespace SFS{

    class TcpSocketSender : public SFS::SocketSender{
		SSocket mSocket;
		char headerBuffer[4];
		int messageNumber;

		SFS::StreamWriter writer;
		virtual void update();
	public:
		TcpSocketSender();
		virtual ~TcpSocketSender();

		void setSocket(SSocket socket);
	};

    class TcpSocketReceiver : public SFS::SocketReceiver{
		enum RecvState
		{
			RECV_STATE_READ_HEADER = 0,
			RECV_STATE_READ_DATA_SIZE,
			RECV_STATE_READ_DATA
		};
		SSocket mSocket;

		char headerByte;
		short dataSize;
		RecvState recvState;

		std::vector<char> recvBuffer;

		virtual void updateRecvHeader();
		virtual void updateRecvDataSize();
		virtual void updateRecvData();
		virtual void updateRecvData(char* data, int size);
		virtual void updateRecvBuffer();
		virtual void processMessage(char *data, int len);

		virtual void update();
	public:
		TcpSocketReceiver();
		virtual ~TcpSocketReceiver();

		void setSocket(SSocket socket);
	};

    class TcpSocketClient : public SFS::SocketClient{
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
