/*
 * BaseRequest.h
 *
 *  Created on: Jan 28, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_BASEREQUEST_H_
#define ELECTROCLIENT_OBJECTS_BASEREQUEST_H_

#include "../BaseMessage.h"

namespace es {

class BaseRequest : public BaseMessage{
public:
	BaseRequest();
	virtual ~BaseRequest();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_BASEREQUEST_H_ */
