/*
 * SFSTcpClient.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "ElectroTcpClient.h"
#include <thread>
#include <cstdio>
#include "../ElectroLogger.h"
#include "../Objects/EsUtil.h"

#define ES_DEBUG 1

namespace es{

TcpSocketSender::TcpSocketSender(){
	messageNumber = 0;
}

TcpSocketSender::~TcpSocketSender(){

}

void TcpSocketSender::setSocket(SSocket socket){
	mSocket = socket;
}

void TcpSocketSender::update(){
	int rs;
	int sentData;
	unsigned int dataSize;

	es::ReleasePool* mPool = es::AutoReleasePool::getInstance()->getPool();
	std::vector<char> senderBuffer(100 * 1024);

	while (true){
		mPool->releaseAll();
		std::this_thread::sleep_for(std::chrono::milliseconds(1));

		if (!isRunning()){
			break;
		}

		SocketData* sendData = mData->take();
		if (sendData){
			sendData->messageNumber = messageNumber;
			messageNumber++;
			if (messageNumber >= 10000){
				messageNumber = 0;
			}

			senderBuffer.clear();

			sendData->getBytes(senderBuffer);
			dataSize = senderBuffer.size();
			dataSize = htonl(dataSize);
			senderBuffer.insert(senderBuffer.begin(), (char*)&dataSize, (char*)&dataSize + 4);

			sentData = 0;

			bool _exit = false;
			while (true) {
				rs = send(mSocket, senderBuffer.data() + sentData, senderBuffer.size() - sentData, 0);
				if(rs > 0){
					sentData += rs;
					if (sentData < senderBuffer.size()){
						continue;
					}
					else{
#ifdef ES_DEBUG
						es::log("---------------------");
						//es::log("SEND message[%s] - %d bytes", es::type::messageTypeName(sendData->messageType), sentData);
						sendData->printDebug();
						es::log("---------------------");
#endif
					}

					break;
				}
				else if (rs == 0){
#ifdef ES_DEBUG
					es::log("server shutdown[2]");
#endif
					this->setRunning(false);
					_exit = true;
					break;
				}
				else{
#ifdef ES_DEBUG
					es::log("send error");
#endif
					this->setRunning(false);
					_exit = true;
					break;
				}
			}

			if (_exit){
				break;
			}
		}
		else{
			break;
		}
	}
}

/**/
TcpSocketReceiver::TcpSocketReceiver(){
	recvBuffer.reserve(1024 * 1024); //1M Buffer
}

TcpSocketReceiver::~TcpSocketReceiver(){

}

void TcpSocketReceiver::setSocket(SSocket socket){
	mSocket = socket;
}

void TcpSocketReceiver::updateCrossDomain(char* data, int size){
	if (size <= 0){
		return;
	}

	int i = 0;
	for (i = 0; i < size; i++){
		if (data[i] == 0){

			isRecvCrossDomain = false;
			break;
		}
	}

	crossDomainString.insert(crossDomainString.end(), &data[0], &data[i]);

	if (!isRecvCrossDomain){

		recvHeader = true;
		recvBuffer.clear();

		updateRecvData(&data[i + 1], size - (i + 1));
#ifdef ES_DEBUG
		es::log("crossDomain:\n%s", crossDomainString.c_str());
#endif
	}
}

void TcpSocketReceiver::updateRecvData(char* data, int size){
	if (size <= 0){
		return;
	}
	recvBuffer.insert(recvBuffer.end(), &data[0], &data[size]);
	updateRecvBuffer();
}

void TcpSocketReceiver::updateRecvBuffer(){
	if (recvBuffer.size() <= 0){
		return;
	}
	if (recvHeader){
		if (recvBuffer.size() >= 4){
			memcpy(&headerSize, recvBuffer.data(), 4);
			headerSize = htonl(headerSize);
			recvBuffer.erase(recvBuffer.begin(), recvBuffer.begin() + 4);
			recvHeader = false;
			updateRecvBuffer();
		}

	}
	else{
		if (recvBuffer.size() >= headerSize){
			processMessage(recvBuffer.data(), headerSize);
			recvBuffer.erase(recvBuffer.begin(), recvBuffer.begin() + headerSize);

			recvHeader = true;
			updateRecvBuffer();
		}
	}
}

void TcpSocketReceiver::processMessage(char *data, int len){
	unsigned char flag;
	unsigned short messageType;
	unsigned int messageNumber;

	memcpy(&flag, &data[0], 1);
	memcpy(&messageType, &data[1], 2);
	memcpy(&messageNumber, &data[3], 4);
	messageType = htons(messageType);
	messageNumber = htonl(messageNumber);

	es::type::MessageType type = es::decodeMessageType(messageType);
	es::BaseMessage* message = es::createMessageWithType(type);
	if (message){
		message->flag = flag;
		message->messageType = type;
		message->messageNumber = messageNumber;
		if (message->initWithBytes(&data[7], len - 7)){
#ifdef ES_DEBUG
			es::log(" ---------- ");
			es::log("RECV message[%s] : %d bytes", es::type::messageTypeName(type), headerSize + 4);
			message->printDebug();
			es::log(" ---------- ");
#endif
			mData->push(message);
		}
		else{
#ifdef ES_DEBUG
			es::log("RECV message[%s] not init", es::type::messageTypeName(type));
#endif
		}
	}else{
#ifdef ES_DEBUG
		es::log("RECV message[%s] not handler", es::type::messageTypeName(type));
#endif
		message->release();
	}
}

void TcpSocketReceiver::update(){
	int rs;

	isRecvCrossDomain = true;
	recvHeader = true;
	crossDomainString = "";

	char dataBuffer[BUFFER_SIZE];

	while (true){
		std::this_thread::sleep_for(std::chrono::milliseconds(1));

		if (!isRunning()){
			break;
		}
		/*read dataSize*/
		rs = recv(mSocket, dataBuffer, BUFFER_SIZE, 0);
		if (rs > 0){
			if (isRecvCrossDomain){
				updateCrossDomain(&dataBuffer[0], rs);
			}
			else{
				updateRecvData(&dataBuffer[0], rs);
			}
		}
		else if (rs == 0){
#ifdef ES_DEBUG
			es::log("server shutdown[1]");
#endif
			this->setRunning(false);
			break;
		}
		else{
#ifdef ES_DEBUG
			es::log("recv header error");
#endif
			this->setRunning(false);
			break;
		}
	}
}

/**/
TcpSocketClient::TcpSocketClient() {
	// TODO Auto-generated constructor stub
	mSocket = SYS_SOCKET_INVALID;
#ifdef USE_WINSOCK_2
	WORD wVersionRequested;
	WSADATA wsaData;
	wVersionRequested = MAKEWORD(2, 2);
	WSAStartup(wVersionRequested, &wsaData);
#endif
}

TcpSocketClient::~TcpSocketClient() {
	// TODO Auto-generated destructor stub
	//Director::getInstance()->getScheduler()->unscheduleAllForTarget(this);
#ifdef USE_WINSOCK_2
	WSACleanup();
#endif
}

void TcpSocketClient::onApplicationPause(const SocketData& sendData){

}

void TcpSocketClient::onApplicationResume(){

}

void TcpSocketClient::closeSocket(){
	std::unique_lock<std::mutex> lk(socketMutex);
	if (mSocket != SYS_SOCKET_INVALID){
#ifdef USE_WINSOCK_2
		//closesocket(mSocket);
		shutdown(mSocket, SD_BOTH);
#else
		//close(mSocket);
		shutdown(mSocket, SHUT_RDWR);
#endif
		mSocket = SYS_SOCKET_INVALID;
	}
}

void TcpSocketClient::resetSocket(){
	this->closeSocket();
	std::unique_lock<std::mutex> lk(socketMutex);
	mSocket = SYS_SOCKET_INVALID;
}

void TcpSocketClient::createAdapter(){
	std::unique_lock<std::mutex> lk(clientMutex);
	mSender = new TcpSocketSender();
	mReceiver = new TcpSocketReceiver();
}

void TcpSocketClient::startAdapter(){
	std::unique_lock<std::mutex> lk(clientMutex);
	((TcpSocketSender*)mSender)->setSocket(mSocket);
	mSender->start();
	((TcpSocketReceiver*)mReceiver)->setSocket(mSocket);
	mReceiver->start();
}

bool TcpSocketClient::connectThread(){
	addrinfo hints, *peer;

	memset(&hints, 0, sizeof(struct addrinfo));
#ifdef __linux
#if defined(ANDROID)
	hints.ai_flags = AI_PASSIVE;
#else
	hints.ai_flags = AI_ALL;
#endif
#else
	hints.ai_flags = AI_ALL;
#endif
	hints.ai_family = PF_UNSPEC;
	hints.ai_socktype = SOCK_STREAM;

	char service[16];
	sprintf(service, "%d", port);
    if (int ret = getaddrinfo(host.c_str(), service, &hints, &peer) != 0){
        es::log("getaddrinfo failure %d", ret);
        return false;
    }
    
    for(auto _peer = peer; _peer; _peer = _peer->ai_next){
        mSocket = socket(_peer->ai_family, _peer->ai_socktype, _peer->ai_protocol);
        if (mSocket == SYS_SOCKET_INVALID){
			es::log("create socket failure");
            continue;
        }
        
		int rs = connect(mSocket, _peer->ai_addr, _peer->ai_addrlen);
        if (rs == 0){
            std::unique_lock<std::mutex> lk(clientMutex);
            if (mSender && mReceiver){
                freeaddrinfo(peer);
                return true;
            }
        }
        
#ifdef USE_WINSOCK_2
        closesocket(mSocket);
#else
        close(mSocket);
#endif
    }

	freeaddrinfo(peer);
	es::log("connection failure 3");
	return false;
}

}
