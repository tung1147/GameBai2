/*
 * SFSEntity.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_ENTITIES_SFSENTITY_H_
#define SFSCLIENT_ENTITIES_SFSENTITY_H_
#include "SFSRef.h"
#include <vector>
#include <cstdint>
#include <map>
#include <sstream>
#include "BufferArray.h"
#include "rapidjson/rapidjson.h"
#include "rapidjson/document.h"

namespace SFS{
namespace Entity{

enum SFSDataType{
	SFSDATATYPE_NULL = 0,
	SFSDATATYPE_BOOL = 1,
	SFSDATATYPE_BYTE = 2,
	SFSDATATYPE_SHORT = 3,
	SFSDATATYPE_INT = 4,
	SFSDATATYPE_LONG = 5,
	SFSDATATYPE_FLOAT = 6,
	SFSDATATYPE_DOUBLE = 7,
	SFSDATATYPE_STRING = 8,
	SFSDATATYPE_BOOL_ARRAY = 9,
	SFSDATATYPE_BYTE_ARRAY = 10,
	SFSDATATYPE_SHORT_ARRAY = 11,
	SFSDATATYPE_INT_ARRAY = 12,
	SFSDATATYPE_LONG_ARRAY = 13,
	SFSDATATYPE_FLOAT_ARRAY = 14,
	SFSDATATYPE_DOUBLE_ARRAY = 15,
	SFSDATATYPE_STRING_ARRAY = 16,
	SFSDATATYPE_SFS_ARRAY = 17,
	SFSDATATYPE_SFS_OBJECT = 18,
	SFSDATATYPE_CLASS = 19
};

class SFSEntity : public SFSRef{
protected:
	static SFSEntity* createSFSEntityWithReader(StreamReader* reader);
public:
	int dataType;
public:
	SFSEntity();
	virtual ~SFSEntity();
	virtual void toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator);

	virtual void writeToBuffer(StreamWriter* writer);
	virtual void initWithReader(StreamReader* reader);	
#ifdef SFS_LOGGER
	virtual void printDebug(std::ostringstream& os, int padding = 0);
#endif
	virtual std::string toJSON();

	static SFSEntity* createEntityWithData(const char* buffer, int size);
	static SFSEntity* createFromJSON(const std::string& json);
	static SFSEntity* createFromJSON(const char* json, int size);
};

}
}
#endif /* SFSCLIENT_ENTITIES_SFSENTITY_H_ */
