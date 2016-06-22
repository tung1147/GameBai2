/*
 * DataSerializer.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_CORE_DATASERIALIZER_H_
#define SFSCLIENT_CORE_DATASERIALIZER_H_
#include "BufferArray.h"
#include "../Entities/SFSObject.h"

namespace SFS{

class DataSerializer {
public:
	void encodeSFSObject(Entity::SFSObject* object, std::vector<char>& buffer);
	Entity::SFSObject* decodeSFSObject(std::vector<char>& buffer);
};
}

#endif /* SFSCLIENT_CORE_DATASERIALIZER_H_ */
