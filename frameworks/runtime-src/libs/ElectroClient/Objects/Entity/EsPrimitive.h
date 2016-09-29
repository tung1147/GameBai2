/*
 * EsPrimitive.h
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_ESPRIMITIVE_H_
#define ELECTROCLIENT_OBJECTS_ESPRIMITIVE_H_

#include "EsEntity.h"

namespace es {

class EsPrimitive : public EsEntity{
	union 
	{
		bool boolValue;
		int8_t byteValue;
		int16_t shortValue;
		int32_t intValue;
		int64_t longValue;
		float floatValue;
		double doubleValue;
	} mData;
public:
	EsPrimitive();
	virtual ~EsPrimitive();

	virtual void writeToBuffer(EsMessageWriter* writer);
	virtual void readFromBuffer(EsMessageReader* reader);
#ifdef ES_LOGGER
	virtual void printDebugToBuffer(std::ostringstream &outStream, int padding);
#endif
	virtual void toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator);

	bool getBool();
	int8_t getByte();
	int16_t getShort();
	int32_t getInt();
	int64_t getLong();
	float getFloat();
	double getDouble();

	void setBool(bool value);
	void setByte(int8_t value);
	void setShort(int16_t value);
	void setInt(int32_t value);
	void setLong(int64_t value);
	void setFloat(float value);
	void setDouble(double value);
};

class EsString :public EsEntity {
	std::string mData;
public:
	EsString();
	virtual ~EsString();

	virtual void writeToBuffer(EsMessageWriter* writer);
	virtual void readFromBuffer(EsMessageReader* reader);
#ifdef ES_LOGGER
	virtual void printDebugToBuffer(std::ostringstream &outStream, int padding);
#endif
	virtual void toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator);

	void setString(const std::string& data);
	const std::string& getString();
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ESPRIMITIVE_H_ */
