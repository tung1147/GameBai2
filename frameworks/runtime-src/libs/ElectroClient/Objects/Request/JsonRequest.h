/*
 * JsonRequest.h
 *
 *  Created on: Jan 28, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_JSONREQUEST_H_
#define ELECTROCLIENT_OBJECTS_JSONREQUEST_H_

#include "BaseRequest.h"

namespace es {

class JsonRequest : public BaseRequest{
public:
	std::string _json;
	int requestType;
	int requestSize;
public:
	JsonRequest();
	virtual ~JsonRequest();

	virtual void setJson(const std::string& json);
	virtual void getBytes(std::vector<char> &buffer);
	virtual void printDebug();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_JSONREQUEST_H_ */
