/*
 * PublicMessageRequest.h
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_REQUEST_PUBLICMESSAGEREQUEST_H_
#define SFSCLIENT_REQUEST_PUBLICMESSAGEREQUEST_H_
#include "BaseRequest.h"

namespace SFS {
namespace Request{

class PublicMessageRequest : public BaseRequest{
	SFS::Entity::SFSObject* params;

public:
	std::string message;
	int roomId;
public:
	PublicMessageRequest();
	virtual ~PublicMessageRequest();
	virtual void toByteArray(std::vector<char> &bytes);

	void setParams(SFS::Entity::SFSObject* params);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_REQUEST_PUBLICMESSAGEREQUEST_H_ */
