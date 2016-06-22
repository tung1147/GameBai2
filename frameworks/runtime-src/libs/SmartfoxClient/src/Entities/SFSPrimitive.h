/*
 * SFSPrimitive.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_ENTITIES_SFSPRIMITIVE_H_
#define SFSCLIENT_ENTITIES_SFSPRIMITIVE_H_
#include "SFSEntity.h"

namespace SFS {
namespace Entity{

class SFSPrimitive : public SFSEntity{
	union {
		bool boolValue;
		char byteValue;
		int16_t i16Value;
		int32_t i32Value;
		int64_t i64Value;
		float floatValue;
		double doubleValue;
	} mData;
public:
	SFSPrimitive();
	virtual ~SFSPrimitive();
	virtual void writeToJSON(std::ostringstream& stream);
	virtual void writeToBuffer(StreamWriter* writer);
	virtual void initWithReader(StreamReader* reader);
	virtual void printDebug(std::ostringstream& os, int padding);

	bool getBool();
	char getByte();
	int16_t getShort();
	int32_t getInt();
	int64_t getLong();
	float getFloat();
	double getDouble();

	void setBool(bool b);
	void setByte(char c);
	void setShort(int16_t i16);
	void setInt(int32_t i32);
	void setLong(int64_t i64);
	void setFloat(float f);
	void setDouble(double d);
};

class SFSString : public SFSEntity{
protected:
	std::string mData;
public:
	SFSString();
	virtual ~SFSString();
	virtual void writeToJSON(std::ostringstream& stream);
	virtual void writeToBuffer(StreamWriter* writer);
	virtual void initWithReader(StreamReader* reader);
	virtual void printDebug(std::ostringstream& os, int padding);

	std::string getString();
	void setString(const std::string& data);
};

}
} /* namespace SFS */

#endif /* SFSCLIENT_ENTITIES_SFSPRIMITIVE_H_ */
