/*
 * ActionShake2D.cpp
 *
 *  Created on: Oct 30, 2015
 *      Author: QuyetNguyen
 */

#include "ActionShake2D.h"
namespace quyetnd{

float _ramdom_range(float min, float max){
	return (rand_0_1() * (max - min) + min);
}

ActionShake2D::ActionShake2D() {
	// TODO Auto-generated constructor stub

}

ActionShake2D::~ActionShake2D() {
	// TODO Auto-generated destructor stub
}

void ActionShake2D::initWithDuration(float duration, const Point& strength){
	ActionInterval::initWithDuration(duration);
	_shakeStrength = strength;
}

void ActionShake2D::update(float t){
	if (_target){
		float x = _ramdom_range(-_shakeStrength.x, _shakeStrength.x);
		float y = _ramdom_range(-_shakeStrength.y, _shakeStrength.y);
		_target->setPosition(_initPoint.x + x, _initPoint.y + y);
	}
}

void ActionShake2D::startWithTarget(Node *target){
	ActionInterval::startWithTarget(target);
	_initPoint = target->getPosition();
}

void ActionShake2D::stop(){
	_target->setPosition(_initPoint);
	ActionInterval::stop();
}

ActionShake2D* ActionShake2D::create(float duration, const Point& strength){
	auto action = new ActionShake2D();
	action->initWithDuration(duration, strength);
	action->autorelease();
	return action;
}

}