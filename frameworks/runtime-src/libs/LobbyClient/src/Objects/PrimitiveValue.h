/*
 * PrimitiveValue.h
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBYCLIENT_OBJECTS_PRIMITIVEVALUE_H_
#define LOBBYCLIENT_OBJECTS_PRIMITIVEVALUE_H_
#include "Value.h"

namespace quyetnd {
namespace data{

class PrimitiveValue : public Value{
	union
	{
		bool boolValue;
		float floatValue;
		double doubleValue;
		int64_t i64Value;
		uint64_t ui64Value;
	} data;

	virtual void printToOutStream(std::ostringstream& outStream, int padding);
	virtual void toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator);
public:
	PrimitiveValue();
	virtual ~PrimitiveValue();
	virtual void writeToBuffer(quyetnd::data::ValueWriter* writer);
	virtual void writeJson(std::ostringstream& str);

	void setBool(bool b);
	void setFloat(float f);
	void setDouble(double d);
	void setInt(int64_t i64);
	void setUInt(uint64_t ui64);

	bool getBool();
	float getFloat();
	double getDouble();
	int64_t getInt();
	uint64_t getUInt();
};

class StringValue : public Value{
protected:
	std::string data;
	virtual void printToOutStream(std::ostringstream& outStream, int padding);
	virtual void toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator);
public:
	StringValue();
	virtual ~StringValue();
	virtual void writeToBuffer(quyetnd::data::ValueWriter* writer);
	virtual void writeJson(std::ostringstream& str);

	void setString(const std::string& str);
	void setData(const char* data, int size);
	const std::string& getString();
};

}
} /* namespace quyetnd */

#endif /* LOBBYCLIENT_OBJECTS_PRIMITIVEVALUE_H_ */
