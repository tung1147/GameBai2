/*
 * BaseMessage.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "BaseMessage.h"

namespace SFS {

BaseMessage::BaseMessage() {
	// TODO Auto-generated constructor stub
	_header = 0x00;
	targetControler = 0;
	messageType = 0;
	contents = 0;
}

BaseMessage::~BaseMessage() {
	// TODO Auto-generated destructor stub
	if (contents){
		contents->release();
		contents = 0;
	}
}

void BaseMessage::toByteArray(std::vector<char> &bytes){
	
}

} /* namespace SFS */
