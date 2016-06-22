/*
 * NetworkCore.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "NetworkCore.h"
#include <map>

namespace quyetnd{
namespace net{

static std::map<int, std::string> s_socketstatus_name = {
	{ NotConnection, "NotConnection" },
	{ Connecting, "Connecting" },
	{ Connected, "Connected" },
	{ ConnectFailure, "ConnectFailure" },
	{ LostConnection, "LostConnection" },
	{ Closed, "Closed" },
};

const char* SocketStatusName(int status){
	auto it = s_socketstatus_name.find(status);
	if (it != s_socketstatus_name.end()){
		return it->second.c_str();
	}
	return "";
}

/****/
SocketClientStatus::SocketClientStatus(){
	//	mStatusCallback = nullptr;
	clientStatus = SocketStatusType::NotConnection;
}

SocketClientStatus::~SocketClientStatus(){

}

void SocketClientStatus::set(SocketStatusType status, bool isEvent){
	std::unique_lock<std::mutex> lk(statusMutex);
	//statusMutex.lock();

	if (clientStatus != status){
		if (isEvent){
			SocketStatusData mEvent;
			mEvent.preStatus = clientStatus;
			mEvent.status = status;
			statusEvent.push_back(mEvent);
		}

		clientStatus = status;
	}
	//statusMutex.unlock();
}

SocketStatusType SocketClientStatus::get(){
	std::unique_lock<std::mutex> lk(statusMutex);
	return clientStatus;
}

void SocketClientStatus::popAllStatus(std::vector<SocketStatusData> &buffer){
	std::unique_lock<std::mutex> lk(statusMutex);
	for (int i = 0; i < statusEvent.size(); i++){
		buffer.push_back(statusEvent[i]);
	}
	statusEvent.clear();
}

void SocketClientStatus::clear(){
	std::unique_lock<std::mutex> lk(statusMutex);
	clientStatus = SocketStatusType::NotConnection;
	statusEvent.clear();
}

}
}