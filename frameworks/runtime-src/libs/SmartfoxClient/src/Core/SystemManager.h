/*
 * SystemManager.h
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_CORE_SYSTEMMANAGER_H_
#define SFSCLIENT_CORE_SYSTEMMANAGER_H_
#include <mutex>
#include <vector>

namespace SFS {

class SystemManager {
private:
	std::mutex userIdMutex;
	int mUserId;

	int lastRoomId;
	std::vector<int> allRoom;
	std::mutex lastRoomId_mutex;
public:
	SystemManager();
	virtual ~SystemManager();

	void setUserId(int userId);
	int getUserId();
	
	int getLastRoom();
	void addRoom(int roomId);
	void removeRoom(int roomId);
	void clearRoom();

	static SystemManager* getInstance();
};

} /* namespace SFS */

#endif /* SFSCLIENT_CORE_SYSTEMMANAGER_H_ */
