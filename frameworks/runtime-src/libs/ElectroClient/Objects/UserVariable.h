/*
 * UserVariable.h
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_USERVARIABLE_H_
#define ELECTROCLIENT_OBJECTS_USERVARIABLE_H_

#include <string>
#include "EsObject.h"

namespace es{

class UserVariable {
public:
	std::string name;
	EsObject* value;
public:
	UserVariable();
	virtual ~UserVariable();

	void initFromThrift(void* thrift);
	void toThrift(void* thrift);
};

}

#endif /* ELECTROCLIENT_OBJECTS_USERVARIABLE_H_ */
