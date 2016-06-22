/*
 * DataSerializer.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "DataSerializer.h"
#include "BufferArray.h"
#include "../Entities/SFSObject.h"

namespace SFS{
	
	Entity::SFSObject* decodeSFSObject(std::vector<char>& buffer){
		StreamReader reader(buffer.data(), buffer.size(), false);

		SFS::Entity::SFSObject* obj = 0;

	
		return obj;
	}

	/****/
	void encodeSFSObject(Entity::SFSObject* object, std::vector<char>& buffer){

	}
}