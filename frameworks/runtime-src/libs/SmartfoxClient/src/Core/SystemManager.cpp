/*
 * SystemManager.cpp
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#include "SystemManager.h"

namespace SFS {

static SystemManager s_SystemManager;
static bool s_SystemManagerFirstRun = true;

SystemManager* SystemManager::getInstance(){
	if (s_SystemManagerFirstRun){
	
	}
	return &s_SystemManager;
}

SystemManager::SystemManager() {
	// TODO Auto-generated constructor stub
	mUserId = -1;
}

SystemManager::~SystemManager() {
	// TODO Auto-generated destructor stub
}

void SystemManager::setUserId(int userId){
	std::unique_lock<std::mutex> lk(userIdMutex);
	mUserId = userId;
}

int SystemManager::getUserId(){
	std::unique_lock<std::mutex> lk(userIdMutex);
	return mUserId;
}

void SystemManager::addRoom(int roomId){
	std::unique_lock<std::mutex> lk(lastRoomId_mutex);
	for (int i = 0; i < allRoom.size(); i++){
		if (allRoom[i] == roomId){
			return;
		}
	}
	allRoom.push_back(roomId);
	lastRoomId = roomId;
}

void SystemManager::removeRoom(int roomId){
	std::unique_lock<std::mutex> lk(lastRoomId_mutex);
	for (int i = 0; i < allRoom.size(); i++){
		if (allRoom[i] == roomId){
			allRoom.erase(allRoom.begin() + i);
			break;
		}
	}

	if (allRoom.size() <= 0){
		lastRoomId = -1;
	}
}

void SystemManager::clearRoom(){
	std::unique_lock<std::mutex> lk(lastRoomId_mutex);
	allRoom.clear();
	lastRoomId = -1;
}

int SystemManager::getLastRoom(){
	std::unique_lock<std::mutex> lk(lastRoomId_mutex);
	return lastRoomId;
}

} /* namespace SFS */
