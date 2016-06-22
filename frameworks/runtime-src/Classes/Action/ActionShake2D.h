/*
 * ActionShake2D.h
 *
 *  Created on: Oct 30, 2015
 *      Author: QuyetNguyen
 */

#ifndef COMMON_ACTIONSHAKE2D_H_
#define COMMON_ACTIONSHAKE2D_H_

#include "cocos2d.h"
USING_NS_CC;

namespace quyetnd{
	
class ActionShake2D : public ActionInterval{
protected:
	Point _initPoint;
	Point _shakeStrength;
public:
	ActionShake2D();
	virtual ~ActionShake2D();
	void initWithDuration(float duration, const Point& strength);
	
	virtual void update(float t);
	virtual void startWithTarget(Node *target);
	virtual void stop();

	static ActionShake2D* create(float duration, const Point& strength);
};

}
#endif /* COMMON_ACTIONSHAKE2D_H_ */
