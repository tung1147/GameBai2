/*
 * WorkerManager.h
 *
 *  Created on: Jun 27, 2016
 *      Author: Quyet Nguyen
 */

#ifndef GAMELAUCHER_WORKERMANAGER_H_
#define GAMELAUCHER_WORKERMANAGER_H_

#include <string>
#include <vector>
#include <map>
#include <mutex>
#include <queue>
#include <thread>
#include <functional>
#include <condition_variable>

typedef std::function <void()> LaucherAction;

class WorkerTicket{
private:
	std::mutex _count_mutex;
	int _count;
	int _success;
public:
	std::function<void(bool)> finishedCallback;
public:
	WorkerTicket(int count);
	virtual ~WorkerTicket();
	void done(bool sucess = true);
	static WorkerTicket* create(int count);
};

class WorkerManager{
	std::queue<LaucherAction> _actions;
	std::mutex _actionsMutex;
	std::condition_variable _actions_condition_variable;

	LaucherAction takeAction();
	void runActionThread();
public:
	WorkerManager();
	virtual ~WorkerManager();

	void start(int thread);
	void stop();

	void pushAction(const LaucherAction& action);

	static WorkerManager* getInstance();
};

#endif /* GAMELAUCHER_WORKERMANAGER_H_ */
