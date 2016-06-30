/*
 * CustomAction.h
 *
 *  Created on: Jun 30, 2016
 *      Author: Quyet Nguyen
 */

#ifndef ACTION_CUSTOMACTION_H_
#define ACTION_CUSTOMACTION_H_

#include "cocos2d.h"
USING_NS_CC;

namespace quyetnd{

class CustomAction : public ActionInterval{
	bool _onStop;
	bool _onUpdate;
	bool _onStartWithTarget;
public:
	CustomAction();
	virtual ~CustomAction();
	void initCustomAction();

	virtual void stop();
	virtual void update(float time);
	virtual void startWithTarget(Node *target);
};

} /* namespace quyetnd */

#endif /* ACTION_CUSTOMACTION_H_ */
