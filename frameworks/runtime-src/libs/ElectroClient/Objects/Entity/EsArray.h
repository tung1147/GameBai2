/*
 * EsArray.h
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_ESARRAY_H_
#define ELECTROCLIENT_OBJECTS_ESARRAY_H_

#include <vector>
#include "EsEntity.h"

namespace es {

class EsArray : public EsEntity {
	std::vector<EsEntity*> mData;

	
public:
	EsArray();
	virtual ~EsArray();

	EsEntity* getEntity(int index);
	void addEntity(EsEntity* data);

	virtual void writeToBuffer(EsMessageWriter* writer);
	virtual void readFromBuffer(EsMessageReader* reader);
#ifdef ES_LOGGER
	virtual void printDebugToBuffer(std::ostringstream &outStream, int padding);
#endif
	virtual void toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator);
	
	bool getBool(int index);
	int8_t getByte(int index);
	int16_t getShort(int index);
	int32_t getInt(int index);
	int64_t getLong(int index);
	float getFloat(int index);
	double getDouble(int index);
	const std::string& getString(int index);
	EsObject* getEsObject(int index);

	void setBoolArray(const std::vector<bool>& data);
	void setByteArray(const std::vector<int8_t>& data);
	void setShortArray(const std::vector<int16_t>& data);
	void setIntArray(const std::vector<int32_t>& data);
	void setLongArray(const std::vector<int64_t>& data);
	void setFloatArray(const std::vector<float>& data);
	void setDoubleArray(const std::vector<double>& data);
	void setStringArray(const std::vector<std::string>& data);

	void push(EsObject* esObject);
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ESARRAY_H_ */
