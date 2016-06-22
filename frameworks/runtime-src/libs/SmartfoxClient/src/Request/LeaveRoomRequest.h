/*
 * LeaveRoomRequest.h
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_REQUEST_LEAVEROOMREQUEST_H_
#define SFSCLIENT_REQUEST_LEAVEROOMREQUEST_H_
#include "BaseRequest.h"

namespace SFS {
namespace Request{

class LeaveRoomRequest : public BaseRequest{
public:
	int roomId;
public:
	LeaveRoomRequest();
	virtual ~LeaveRoomRequest();
	virtual void toByteArray(std::vector<char> &bytes);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_REQUEST_LEAVEROOMREQUEST_H_ */
