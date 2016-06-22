/*
 * JoinRoomRequest.h
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_REQUEST_JOINROOMREQUEST_H_
#define SFSCLIENT_REQUEST_JOINROOMREQUEST_H_
#include "BaseRequest.h"

namespace SFS {
namespace Request{

class JoinRoomRequest : public BaseRequest{
public:
	int roomId;
	std::string roomName;
	std::string roomPass;
	int roomIdToLeave;
	bool asSpectator;
public:
	JoinRoomRequest();
	virtual ~JoinRoomRequest();
	virtual void toByteArray(std::vector<char> &bytes);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_REQUEST_JOINROOMREQUEST_H_ */
