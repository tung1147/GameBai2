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
