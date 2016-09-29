/*
 * UDTClient.cpp
 *
 *  Created on: Jun 6, 2016
 *      Author: Quyet Nguyen
 */

#include "UDTClient.h"
#include <thread>
#include <chrono>
#include "../Logger/Logger.h"
#include "udt.h"

namespace quyetnd {
namespace net{

UDTSender::UDTSender(){

}

UDTSender::~UDTSender(){
	
}

void UDTSender::update(){
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
				rs = UDT::send(mSocket, sendBuffer.data() + sentData, sendBuffer.size() - sentData, 0);
				if (rs != UDT::ERROR){
#ifdef LOBBY_LOGGER
					quyetnd::log("writeData: %d", rs);
#endif
					sentData += rs;
					if (sentData < sendBuffer.size()){
						continue;
					}
					break;
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

UDTReceiver::UDTReceiver(){

}

UDTReceiver::~UDTReceiver(){

}

#define BUFFER_SIZE 100 * 1024
void UDTReceiver::update(){
	int rs;
	char dataBuffer[BUFFER_SIZE];
	auto releasePool = quyetnd::data::AutoReleasePool::getInstance()->getPool();
	while (true){
		releasePool->releaseAll();
		std::this_thread::sleep_for(std::chrono::milliseconds(1));
		if (!isRunning()){
			break;
		}
		rs = UDT::recv(mSocket, dataBuffer, BUFFER_SIZE, 0);
		if (rs > 0){
#ifdef LOBBY_LOGGER
			quyetnd::log("recvdata: %d", rs);
#endif
			this->recvData(&dataBuffer[0], rs);
		}
		else if (rs == 0){
#ifdef LOBBY_LOGGER
			quyetnd::log_to_console("server shutdown[1]");
#endif
			this->setRunning(false);
			break;
		}
		else{
			//error
#ifdef LOBBY_LOGGER
			quyetnd::log_to_console("recv header error");
#endif
			this->setRunning(false);
			break;
		}
	}
}


/**/
UDTClient::UDTClient() {
	// TODO Auto-generated constructor stub
	mSocket = SYS_SOCKET_INVALID;
	UDT::startup();
}

UDTClient::~UDTClient() {
	// TODO Auto-generated destructor stub
	//Director::getInstance()->getScheduler()->unscheduleAllForTarget(this);
	UDT::cleanup();
}

void UDTClient::closeSocket(){
	std::unique_lock<std::mutex> lk(socketMutex);
	if (mSocket != SYS_SOCKET_INVALID){
		UDT::close(mSocket);
		//UDT::cleanup();
		mSocket = SYS_SOCKET_INVALID;
	}
}

void UDTClient::resetSocket(){
	this->closeSocket();
	std::unique_lock<std::mutex> lk(socketMutex);
	mSocket = SYS_SOCKET_INVALID;
}

void UDTClient::createAdapter(){
	std::unique_lock<std::mutex> lk(clientMutex);
	mSender = new UDTSender();
	mReceiver = new UDTReceiver();
}

void UDTClient::startAdapter(){
	std::unique_lock<std::mutex> lk(clientMutex);
	((UDTSender*)mSender)->mSocket = mSocket;
	mSender->start();
	((UDTReceiver*)mReceiver)->mSocket = mSocket;
	mReceiver->start();
}


bool UDTClient::connectThread(){
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
#ifdef LOBBY_LOGGER
		quyetnd::log("getaddrinfo failure %d", ret);
#endif
		return false;
	}

	for (auto _peer = peer; _peer; _peer = _peer->ai_next){
		mSocket = UDT::socket(_peer->ai_family, _peer->ai_socktype, _peer->ai_protocol);
		if (mSocket == SYS_SOCKET_INVALID){
#ifdef LOBBY_LOGGER
			quyetnd::log("create socket failure");
#endif
			continue;
		}


		int mss_size = 1052;
		UDT::setsockopt(mSocket, 0, UDT_MSS, &mss_size, sizeof(int));

		//linger u_linger;
		//u_linger.l_onoff = 1;
		//u_linger.l_linger = 0;
		//UDT::setsockopt(mSocket, 0, UDT_LINGER, &u_linger, sizeof(linger));

#ifdef WIN32
#elif __APPLE__
#include "TargetConditionals.h"
#if TARGET_IPHONE_SIMULATOR || TARGET_OS_IPHONE
		quyetnd::log("iOS");
		// iOS Simulator
		// iOS device
		//64000
		int snd_buf = 64000;
		int rcv_buf = 64000;
		UDT::setsockopt(mSocket, 0, UDT_SNDBUF, &snd_buf, sizeof(int));
		UDT::setsockopt(mSocket, 0, UDT_RCVBUF, &rcv_buf, sizeof(int));
		UDT::setsockopt(mSocket, 0, UDP_SNDBUF, &snd_buf, sizeof(int));
		UDT::setsockopt(mSocket, 0, UDP_RCVBUF, &rcv_buf, sizeof(int));
#elif TARGET_OS_MAC
		quyetnd::log("Mac OS");

		int rcv_buf = 5590000;
		UDT::setsockopt(mSocket, 0, UDP_RCVBUF, &rcv_buf, sizeof(int));
#else
		// Unsupported platform
#endif
#elif __linux //android
		quyetnd::log("linux");
#elif __unix // all unices not caught above
		quyetnd::log("__unix");
#elif __posix
		quyetnd::log("__posix");
#endif

		int rs = UDT::connect(mSocket, _peer->ai_addr, _peer->ai_addrlen);
		if (rs != UDT::ERROR){
			std::unique_lock<std::mutex> lk(clientMutex);
			if (mSender && mReceiver){
				freeaddrinfo(peer);
				return true;
			}
		}

//		UDT::close(mSocket);
	}

	freeaddrinfo(peer);
#ifdef LOBBY_LOGGER
	quyetnd::log("connection failure 3");
#endif
	return false;
}
}
} /* namespace quyetnd */
