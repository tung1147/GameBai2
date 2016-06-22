/*
 * BaseRequest.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "BaseRequest.h"
#include "../Logger/SFSLogger.h"
#include "../Core/RequestType.h"

namespace SFS {
namespace Request{

BaseRequest::BaseRequest() {
	// TODO Auto-generated constructor stub
	contents = new SFS::Entity::SFSObject();
}

BaseRequest::~BaseRequest() {
	// TODO Auto-generated destructor stub
}

void BaseRequest::toByteArray(std::vector<char> &bytes){
	SFS::Entity::SFSObject obj;
	obj.setByte(SFS_CONTROLLER_ID, targetControler);
	obj.setShort(SFS_ACTION_ID, messageType);
	if (contents && contents->size() > 0){
		obj.setSFSObject(SFS_PARAM_ID, contents);
	}

	StreamWriter writer;
	obj.writeToBuffer(&writer);

	//add header
	bytes.push_back(_header);

	//add dataSize
	int16_t dataSize = writer.size();
	dataSize = htons(dataSize);
	bytes.insert(bytes.end(), (char*)&dataSize, ((char*)&dataSize) + 2);

	//add data
	writer.writeToBuffer(bytes);
}

void BaseRequest::printDebug(){
#ifdef SFS_PRINT_DEBUG
	SFS::log("SEND [%s]", _request_type_name(messageType));
#endif
}

}
} /* namespace SFS */
