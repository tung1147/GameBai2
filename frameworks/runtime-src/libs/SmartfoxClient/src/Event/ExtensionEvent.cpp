/*
 * ExtensionEvent.cpp
 *
 *  Created on: Jun 2, 2016
 *      Author: Quyet Nguyen
 */

#include "ExtensionEvent.h"

namespace SFS {
namespace Event{

ExtensionEvent::ExtensionEvent() {
	// TODO Auto-generated constructor stub
	cmd = "";
}

ExtensionEvent::~ExtensionEvent() {
	// TODO Auto-generated destructor stub
}

void ExtensionEvent::printDebug(){
	BaseEvent::printDebug();
	BaseEvent::printDebugContent();
}

void ExtensionEvent::initWithSFSObject(SFS::Entity::SFSObject* object){
	BaseEvent::initWithSFSObject(object);
	if (contents){
		cmd = contents->getString("c");
	}
}

}
} /* namespace SFS */
