/*
 * SFSArray.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_ENTITIES_SFSARRAY_H_
#define SFSCLIENT_ENTITIES_SFSARRAY_H_
#include "SFSEntity.h"

namespace SFS{
namespace Entity{

class SFSObject;
class SFSArray : public SFSEntity{
	friend SFSObject;
protected:
	std::vector<SFSEntity*> mData;
public:
	SFSArray();
	virtual ~SFSArray();
	virtual void toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator);
	static SFSArray* create();
	
	virtual void writeToBuffer(StreamWriter* writer);
	virtual void initWithReader(StreamReader* reader);
#ifdef SFS_LOGGER
	virtual void printDebug(std::ostringstream& os, int padding);
#endif

	int size();
	SFSEntity* getItem(int index);
	void addItem(SFSEntity* data);

	bool getBool(int index);
	char getByte(int index);
	int16_t getShort(int index);
	int32_t getInt(int index);
	int64_t getLong(int index);
	float getFloat(int index);
	double getDouble(int index);
	std::string getString(int index);
	SFSObject* getSFSObject(int index);
	SFSArray* getSFSArray(int index);

	void addBool(bool b);
	void addByte(char c);
	void addShort(int16_t i16);
	void addInt(int32_t i32);
	void addLong(int64_t i64);
	void addFloat(float f);
	void addDouble(double d);
	void addString(const std::string& str);
	SFSObject* addSFSObject(SFSObject* obj = 0);
	SFSArray* addSFSArray(SFSArray* arr = 0);
};

}
}
#endif /* SFSCLIENT_ENTITIES_SFSARRAY_H_ */
