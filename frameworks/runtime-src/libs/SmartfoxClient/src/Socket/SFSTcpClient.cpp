/*
 * SFSTcpClient.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "SFSTcpClient.h"
#include <thread>
#include <cstdio>
#include "../Logger/SFSLogger.h"
#include "../Entities/SFSObject.h"
#include "../Entities/MessageJSON.h"
#include "zlib.h"

namespace SFS{
//#define PRINT_DEBUG 1

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

	SFS::ReleasePool* mPool = SFS::AutoReleasePool::getInstance()->getPool();

	while (true){
		std::this_thread::sleep_for(std::chrono::milliseconds(1));
		mPool->releaseAll();

		if (!isRunning()){
			break;
		}

		SocketData* sendData = mData->take();

		if (sendData){
			writer.clear();
			sendData->writeToBuffer(&writer);
			auto senderBuffer = writer.getBuffer();
			sentData = 0;

			bool _exit = false;
			while (true) {
				rs = send(mSocket, senderBuffer.data() + sentData, senderBuffer.size() - sentData, 0);;
				if (rs > 0){
					sentData += rs;
					if (sentData < senderBuffer.size()){
						continue;
					}
					else{
#ifdef SFS_PRINT_DEBUG	
						SFS::log("---------------------");
						SFS::log("SEND =>");
						sendData->printDebug();
						SFS::log("---------------------");
#endif
					}

					break;
				}
				else if (rs == 0){
#ifdef SFS_PRINT_DEBUG
					SFS::log("server shutdown[2]");
#endif
					this->setRunning(false);
					_exit = true;
					break;
				}
				else{
#ifdef SFS_PRINT_DEBUG
					SFS::log("send error");
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

void TcpSocketReceiver::updateRecvData(char* data, int size){
	if (size <= 0){
		return;
	}
	recvBuffer.insert(recvBuffer.end(), &data[0], &data[size]);
	updateRecvBuffer();
}

void TcpSocketReceiver::updateRecvHeader(){
	if (recvBuffer.size() > 0){
		headerByte = recvBuffer.at(0);
		recvBuffer.erase(recvBuffer.begin());

		headerByte = recvBuffer.at(0);
		binary = headerByte & 0x80;
		encrypted = headerByte & 0x40;
		compressed = headerByte & 0x20;
		blueBoxed = headerByte & 0x10;
		bigSized = headerByte & 0x08;
		if (!binary){
#ifdef SFS_PRINT_DEBUG
			SFS::log("data is not binary");
#endif
			setRunning(false);
			return;
		}
		if (encrypted){
#ifdef SFS_PRINT_DEBUG
			SFS::log("data encrypted");
#endif      
			setRunning(false);
			return;
		}

		if (compressed){
#ifdef SFS_PRINT_DEBUG
			SFS::log("data compressed");
#endif
		}
		if (blueBoxed){
#ifdef SFS_PRINT_DEBUG
			SFS::log("data blueBoxed");
#endif
			setRunning(false);
			return;
		}

		dataSizeLength = 2;
		if (bigSized){
#ifdef SFS_PRINT_DEBUG
			SFS::log("data bigSized");
#endif
			dataSizeLength = 4;
		}

		recvState = SFS::TcpSocketReceiver::RECV_STATE_READ_DATA_SIZE;
		updateRecvBuffer();
	}
}

void TcpSocketReceiver::updateRecvDataSize(){
	if (recvBuffer.size() >= dataSizeLength){
		if (bigSized){
			memcpy(&dataSize, recvBuffer.data(), dataSizeLength);
			dataSize = htons(dataSize);
		}
		else{
			short _size;
			memcpy(&_size, recvBuffer.data(), dataSizeLength);
			_size = htons(_size);
			dataSize = (unsigned int)_size;
		}

		recvBuffer.erase(recvBuffer.begin(), recvBuffer.begin() + dataSizeLength);
		recvState = SFS::TcpSocketReceiver::RECV_STATE_READ_DATA;
		updateRecvBuffer();
	}
}

void TcpSocketReceiver::updateRecvData(){
	if (recvBuffer.size() >= dataSize){
		SFS::Entity::SFSEntity* sfsEntity = 0;
		if (compressed){
			//uncompress
			unsigned long uncompressSize = dataSize * 2;
			unsigned char* uncompressBuffer = 0;
			do{
				if (uncompressBuffer){
					delete[] uncompressBuffer;
					uncompressBuffer = 0;
				}
				uncompressBuffer = new unsigned char[uncompressSize];
				memset(uncompressBuffer, 0x00, uncompressSize);

				long int result = uncompress(uncompressBuffer, &uncompressSize, (unsigned char*)recvBuffer.data(), (unsigned long)dataSize);

				if (result == Z_BUF_ERROR){
					uncompressSize += dataSize;
					continue;
				}
				break;

			} while (true);

			sfsEntity = SFS::Entity::SFSEntity::createEntityWithData((char*)uncompressBuffer, uncompressSize);

			if (uncompressBuffer){
				delete[] uncompressBuffer;
				uncompressBuffer = 0;
			}
		}
		else{
			sfsEntity = SFS::Entity::SFSEntity::createEntityWithData(recvBuffer.data(), dataSize);
		}
		if (!sfsEntity){
#ifdef SFS_PRINT_DEBUG
			SFS::log("parse SFSEntity = NULL");
#endif	
			this->setRunning(false);
			return;
		}
		if (sfsEntity->dataType != SFS::Entity::SFSDataType::SFSDATATYPE_SFS_OBJECT){
#ifdef SFS_PRINT_DEBUG
			SFS::log("SFSEntity is not SFSObject");
#endif	
			this->setRunning(false);
			return;
		}

		auto sfsObject = (SFS::Entity::SFSObject*)sfsEntity;
		sfsObject->toJSON();
		if (sfsObject){
			int targetController = sfsObject->getByte(SFS_CONTROLLER_ID);
			int messageType = sfsObject->getShort(SFS_ACTION_ID);
			SFS::Entity::SFSObject* contents = sfsObject->getSFSObject(SFS_PARAM_ID);

			auto message = new MessageJSON();
			message->targetControler = targetController;
			message->messageType = messageType;
			message->setContents(contents);
#ifdef SFS_PRINT_DEBUG
			SFS::log("---------------------");
			SFS::log("RECV <=");
			message->printDebug();
			SFS::log("---------------------");
#endif	
			this->pushMessage(message);
			message->release();
			sfsObject->release();
		}

		//
		recvBuffer.erase(recvBuffer.begin(), recvBuffer.begin() + dataSize);
		recvState = SFS::TcpSocketReceiver::RECV_STATE_READ_HEADER;
		updateRecvBuffer();
	}
}

void TcpSocketReceiver::updateRecvBuffer(){
	if (recvBuffer.size() <= 0){
		return;
	}

	switch (recvState)
	{
	case SFS::TcpSocketReceiver::RECV_STATE_READ_HEADER:
		updateRecvHeader();
		break;
	case SFS::TcpSocketReceiver::RECV_STATE_READ_DATA_SIZE:
		updateRecvDataSize();
		break;
	case SFS::TcpSocketReceiver::RECV_STATE_READ_DATA:
		updateRecvData();
		break;
	}
}

void TcpSocketReceiver::processMessage(char *data, int len){
	
}

void TcpSocketReceiver::update(){
	int rs;

	char dataBuffer[BUFFER_SIZE];
	recvState = SFS::TcpSocketReceiver::RECV_STATE_READ_HEADER;
	SFS::ReleasePool* mPool = SFS::AutoReleasePool::getInstance()->getPool();

	while (true){
		std::this_thread::sleep_for(std::chrono::milliseconds(1));
		mPool->releaseAll();

		if (!isRunning()){
			break;
		}

		//  es::log("waiting data...");

		/*read dataSize*/
		rs = recv(mSocket, dataBuffer, BUFFER_SIZE, 0);
		if (rs > 0){
			//OK
			//es::log("will process");
			updateRecvData(&dataBuffer[0], rs);	
			//es::log("end process: %d", recvBuffer.size());
		}
		else if (rs == 0){
#ifdef SFS_PRINT_DEBUG
			SFS::log("server shutdown[1]");
#endif
			this->setRunning(false);
			break;
		}
		else{
			//error
#ifdef SFS_PRINT_DEBUG
			SFS::log("recv header error");
#endif
			this->setRunning(false);

			//	auto errorCode = WSAGetLastError();
			break;
		}

	}
}

/**/
TcpSocketClient::TcpSocketClient() {
	// TODO Auto-generated constructor stub
	mSocket = SYS_SOCKET_INVALID;
}

TcpSocketClient::~TcpSocketClient() {
	// TODO Auto-generated destructor stub
	//Director::getInstance()->getScheduler()->unscheduleAllForTarget(this);
}

void TcpSocketClient::onApplicationPause(const SocketData& sendData){

}

void TcpSocketClient::onApplicationResume(){

}

void TcpSocketClient::closeSocket(){
	std::unique_lock<std::mutex> lk(socketMutex);
	if (mSocket != SYS_SOCKET_INVALID){
#ifdef USE_WINSOCK_2
		closesocket(mSocket);
		//shutdown(mSocket, SD_BOTH);
#else
		close(mSocket);
		//shutdown(mSocket, SHUT_RDWR);
#endif
		mSocket = SYS_SOCKET_INVALID;
	}
}

void TcpSocketClient::resetSocket(){
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
#ifdef USE_WINSOCK_2
	WORD wVersionRequested;
	WSADATA wsaData;
	wVersionRequested = MAKEWORD(2, 2);
	//SOCKET_ERROR
	if (0 != WSAStartup(wVersionRequested, &wsaData)){
		SFS::log("socket startup failure");
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
	hints.ai_family = PF_UNSPEC;
	hints.ai_socktype = SOCK_STREAM;

	char service[16];
	sprintf(service, "%d", port);
    if (int ret = getaddrinfo(host.c_str(), service, &hints, &peer) != 0){
        SFS::log("getaddrinfo failure %d", ret);
        return false;
    }
    
    //clearRoom
    for(auto _peer = peer; _peer; _peer = _peer->ai_next){
        mSocket = socket(_peer->ai_family, _peer->ai_socktype, _peer->ai_protocol);
        if (mSocket == SYS_SOCKET_INVALID){
            SFS::log("create socket failure");
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
	SFS::log("connection failure 3");
	return false;
}

}
