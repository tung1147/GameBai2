/*
 * UserListEntry.h
 *
 *  Created on: Jan 25, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_USERLISTENTRY_H_
#define ELECTROCLIENT_OBJECTS_USERLISTENTRY_H_
#include "UserVariable.h"
#include <vector>

namespace es{
class UserListEntry {
public:
	std::string  userName;
	std::vector<UserVariable*> userVariables;
	bool sendingVideo;
	std::string videoStreamName;
	bool roomOperator;
public:
	UserListEntry();
	virtual ~UserListEntry();
	virtual void toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator);

	void initFromThrift(void* thrift);
	void toThrift(void* thrift);
};
}

#endif /* ELECTROCLIENT_OBJECTS_USERLISTENTRY_H_ */
