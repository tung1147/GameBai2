/*
 * TCPClient.cpp
 *
 *  Created on: Jun 6, 2016
 *      Author: Quyet Nguyen
 */

#include "TCPClient.h"
#include <thread>
#include <chrono>
#include "../Logger/Logger.h"

namespace quyetnd {
namespace net{

TCPSender::TCPSender(){

}

TCPSender::~TCPSender(){

}

void TCPSender::update(){
	int rs;
	int sentData;
	auto releasePool = quyetnd::data::AutoReleasePool::getInstance()->getPool();
	while (true){
		releasePool->releaseAll();
		if (!isRunning()){
			return;
		}

		SocketData* sendData = mData->take();
		if (sendData){
			sentData = 0;
			this->toBufferData(sendData);
			const std::vector<char>& sendBuffer = writer->getBuffer();

			while (true) {
				rs = send(mSocket, sendBuffer.data() + sentData, sendBuffer.size() - sentData, 0);
				//rs = write(mSocket, senderBuffer.data(), senderBuffer.size());
				if (rs > 0){
					sentData += rs;
					if (sentData < sendBuffer.size()){
						continue;
					}
					break;
				}
				else if (rs == 0){
#ifdef LOBBY_LOGGER
					quyetnd::log("server shutdown[2]");
#endif
					this->setRunning(false);
					return;
				}
				else{
#ifdef LOBBY_LOGGER
					quyetnd::log("send error");
#endif
					this->setRunning(false);
					return;
				}
			}
		}
		else{
			this->setRunning(false);
			return;
		}
	}
}

/****/
TCPReceiver::TCPReceiver(){

}

TCPReceiver::~TCPReceiver(){

}

#define BUFFER_SIZE 102400 //100KB
void TCPReceiver::update(){
	int rs;
	char dataBuffer[BUFFER_SIZE];
	auto releasePool = quyetnd::data::AutoReleasePool::getInstance()->getPool();
	while (true){
		std::this_thread::sleep_for(std::chrono::milliseconds(1));
		releasePool->releaseAll();

		if (!isRunning()){
			break;
		}
		rs = recv(mSocket, dataBuffer, BUFFER_SIZE, 0);
		if (rs > 0){
#ifdef LOBBY_LOGGER
			quyetnd::log("recvdata: %d",rs);
#endif
			this->recvData(dataBuffer, rs);
		}
		else if (rs == 0){
#ifdef LOBBY_LOGGER
			quyetnd::log("server shutdown[1]");
#endif
			this->setRunning(false);
			break;
		}
		else{
			//error
#ifdef LOBBY_LOGGER
			quyetnd::log("recv header error");
#endif
			this->setRunning(false);
			break;
		}
	}
}

/**/
TCPClient::TCPClient() {
	// TODO Auto-generated constructor stub
	mSocket = SYS_SOCKET_INVALID;
}

TCPClient::~TCPClient() {
	// TODO Auto-generated destructor stub
	//Director::getInstance()->getScheduler()->unscheduleAllForTarget(this);
}

void TCPClient::closeSocket(){
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

void TCPClient::resetSocket(){
	std::unique_lock<std::mutex> lk(socketMutex);
	mSocket = SYS_SOCKET_INVALID;
}

void TCPClient::createAdapter(){
	std::unique_lock<std::mutex> lk(clientMutex);
	mSender = new TCPSender();
	mReceiver = new TCPReceiver();
}

void TCPClient::startAdapter(){
	std::unique_lock<std::mutex> lk(clientMutex);
	((TCPSender*)mSender)->mSocket =  mSocket;
	mSender->start();
	((TCPReceiver*)mReceiver)->mSocket  = mSocket;
	mReceiver->start();
}


bool TCPClient::connectThread(){
#ifdef USE_WINSOCK_2
	WORD wVersionRequested;
	WSADATA wsaData;
	wVersionRequested = MAKEWORD(2, 2);
	//SOCKET_ERROR
	if (0 != WSAStartup(wVersionRequested, &wsaData)){
		quyetnd::log("socket startup failure");
		return false;
	}
#endif

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
	hints.ai_family = AF_UNSPEC;
	hints.ai_socktype = SOCK_STREAM;

	char service[128];
	sprintf(service, "%d", port);
	if (int ret = getaddrinfo(host.c_str(), service, &hints, &peer) != 0){
		quyetnd::log("getaddrinfo failure %d", ret);
		return false;
	}

	for (auto _peer = peer; _peer; _peer = _peer->ai_next){
		mSocket = socket(_peer->ai_family, _peer->ai_socktype, _peer->ai_protocol);
		if (mSocket == SYS_SOCKET_INVALID){
			quyetnd::log("create socket failure");
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
	quyetnd::log("connection failure 3");
	return false;
}

}
} /* namespace quyetnd */
