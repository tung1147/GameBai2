/*
 * EsObject.h
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_ESOBJECT_H_
#define ELECTROCLIENT_OBJECTS_ESOBJECT_H_

#include "EsEntity.h"
#include <map>

namespace es {

class EsObject : public EsEntity{
	std::map<std::string, EsEntity*> mData;

	EsEntity* getEsEntity(const std::string& key);
	virtual void setEsEntity(const std::string& key, EsEntity* entity);
public:
	EsObject();
	virtual ~EsObject();

	virtual void writeToBuffer(EsMessageWriter* writer);
	virtual void readFromBuffer(EsMessageReader* reader);
	virtual void printDebugToBuffer(std::ostringstream &outStream, int padding);
	virtual void toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator);

	bool getBool(const std::string& key, bool defaultValue = false);
	int8_t getByte(const std::string& key, int8_t defaultValue = 0);
	int16_t getShort(const std::string& key, int16_t defaultValue = 0);
	int32_t getInt(const std::string& key, int32_t defaultValue = 0);
	int64_t getLong(const std::string& key, int64_t defaultValue = 0);
	float getFloat(const std::string& key, float defaultValue = 0);
	double getDouble(const std::string& key, double defaultValue = 0);
	const std::string& getString(const std::string& key, const std::string& defaultValue = "");
	EsObject* getEsObject(const std::string& key, EsObject* defaultValue = 0);
	EsArray* getEsArray(const std::string& key, EsArray* defaultValue = 0); 

	void setBool(const std::string& key, bool value);
	void setByte(const std::string& key, int8_t value);
	void setShort(const std::string& key, int16_t value);
	void setInt(const std::string& key, int32_t value);
	void setLong(const std::string& key, int64_t value);
	void setFloat(const std::string& key, float value);
	void setDouble(const std::string& key, double value);
	void setString(const std::string& key, const std::string& value);
	EsObject* setEsObject(const std::string& key, EsObject* value = 0);
	EsArray* setEsArray(const std::string& key, EsArray* value = 0);
	//void setEsArray()
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ESOBJECT_H_ */
