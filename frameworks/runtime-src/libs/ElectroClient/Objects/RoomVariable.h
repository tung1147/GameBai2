/*
 * RoomVariable.h
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_ROOMVARIABLE_H_
#define ELECTROCLIENT_OBJECTS_ROOMVARIABLE_H_
#include <string>
#include "EsObject.h"

namespace es {

class RoomVariable {
public:
	bool persistent;
	std::string name;
	EsObject* value;
	bool locked;
public:
	RoomVariable();
	virtual ~RoomVariable();

	void initFromThrift(void* thrift);
	void toThrift(void* thrift);
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ROOMVARIABLE_H_ */
