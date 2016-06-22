/*
 * EsObject.h
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_ESOBJECT_H_
#define ELECTROCLIENT_OBJECTS_ESOBJECT_H_

#include <vector>
#include <string>
#include <map>
#include <cstdint>
#include "EsMessageStreamer.h"
#include <sstream>

namespace es {
struct EsObjectData{
	int type;
	void* data;
};

class EsObject {
	std::map<std::string, EsObjectData*> mData;

	void deleteEsData(EsObjectData* data);
	void initFromReader(EsMessageReader* reader);
public:
	EsObject();
	virtual ~EsObject();

	void initWithBytes(const std::vector<uint8_t>& bytes);
	void initWithBytes(char* bytes, int len, bool isFlag = true);
	void initFromFlattenedEsObject(void* thrift);
	void initFromFlattenedEsObjectRO(void* thrift);

	void writeToBuffer(EsMessageWriter* writer);
	void writeToFlattenedEsObject(void* obj);
	void writeToFlattenedEsObjectRO(void* obj);

	bool keyExist(const std::string& key);

	virtual bool getBool(const std::string &key, bool defaultValue = false);
	virtual int8_t getByte(const std::string &key, int8_t defaultValue = 0);
	virtual int16_t getShort(const std::string &key, int16_t defaultValue = 0);
	virtual int32_t getInt(const std::string &key, int32_t defaultValue = 0);
	virtual int64_t getLong(const std::string &key, int64_t defaultValue = 0);
	virtual float getFloat(const std::string &key, float defaultValue = 0.0f);
	virtual double getDouble(const std::string &key, double defautValue = 0.0);
	virtual std::string getString(const std::string &key, const std::string &defaultValue = "");
	virtual const char* getCString(const std::string &key, const char* defaultValue = "");
	virtual EsObject* getEsObject(const std::string &key);
	virtual const std::vector<bool>* getBoolArray(const std::string &key);
	virtual const std::vector<int8_t>* getByteArray(const std::string &key);
	virtual const std::vector<int16_t>* getShortArray(const std::string &key);
	virtual const std::vector<int32_t>* getIntArray(const std::string &key);
	virtual const std::vector<int64_t>* getLongArray(const std::string &key);
	virtual const std::vector<float>* getFloatArray(const std::string &key);
	virtual const std::vector<double>* getDoubleArray(const std::string &key);
	virtual const std::vector<std::string>* getStringArray(const std::string &key);
	virtual const std::vector<EsObject*>* getEsObjectArray(const std::string &key);


	virtual void setBool(const std::string &key, bool b);
	virtual void setByte(const std::string &key, int8_t b);
	virtual void setShort(const std::string &key, int16_t i);
	virtual void setInt(const std::string &key, int32_t i);
	virtual void setLong(const std::string &key, int64_t i);
	virtual void setFloat(const std::string &key, float f);
	virtual void setDouble(const std::string &key, double d);
	virtual void setString(const std::string &key, const std::string& str);
	virtual void setEsObject(const std::string &key, EsObject* obj);

	virtual void setBoolArray(const std::string &key, const std::vector<bool>& arr);
	virtual void setByteArray(const std::string &key, const std::vector<char>& arr);
	virtual void setShortArray(const std::string &key, const std::vector<int16_t>& arr);
	virtual void setIntArray(const std::string &key, const std::vector<int32_t>& arr);
	virtual void setLongArray(const std::string &key, const std::vector<int64_t>& arr);
	virtual void setFloatArray(const std::string &key, const std::vector<float>& arr);
	virtual void setDoubleArray(const std::string &key, const std::vector<double>& arr);
	virtual void setStringArray(const std::string &key, const std::vector<std::string>& arr);
	virtual void setEsObjectArray(const std::string &key, const std::vector<EsObject*>& arr);

	virtual void printDebug();
	virtual void printDebug(std::ostringstream &outStream, int padding = 0);
private:
	//read
	virtual void readBool(EsMessageReader* reader, const std::string& key);
	virtual void readByte(EsMessageReader* reader, const std::string& key);
	virtual void readShort(EsMessageReader* reader, const std::string& key);
	virtual void readInt(EsMessageReader* reader, const std::string& key);
	virtual void readLong(EsMessageReader* reader, const std::string& key);
	virtual void readFloat(EsMessageReader* reader, const std::string& key);
	virtual void readDouble(EsMessageReader* reader, const std::string& key);
	virtual void readString(EsMessageReader* reader, const std::string& key);
	virtual void readEsObject(EsMessageReader* reader, const std::string& key);
	virtual void readBoolArray(EsMessageReader* reader, const std::string& key);
	virtual void readByteArray(EsMessageReader* reader, const std::string& key);
	virtual void readShortArray(EsMessageReader* reader, const std::string& key);
	virtual void readIntArray(EsMessageReader* reader, const std::string& key);
	virtual void readLongArray(EsMessageReader* reader, const std::string& key);
	virtual void readFloatArray(EsMessageReader* reader, const std::string& key);
	virtual void readDoubleArray(EsMessageReader* reader, const std::string& key);
	virtual void readStringArray(EsMessageReader* reader, const std::string& key);
	virtual void readEsObjectArray(EsMessageReader* reader, const std::string& key);

	//write
	virtual void writeBool(EsMessageWriter* writer, void* data);
	virtual void writeByte(EsMessageWriter* writer, void* data);
	virtual void writeShort(EsMessageWriter* writer, void* data);
	virtual void writeInt(EsMessageWriter* writer, void* data);
	virtual void writeLong(EsMessageWriter* writer, void* data);
	virtual void writeFloat(EsMessageWriter* writer, void* data);
	virtual void writeDouble(EsMessageWriter* writer, void* data);
	virtual void writeString(EsMessageWriter* writer, void* data);
	virtual void writeEsObject(EsMessageWriter* writer, void* data);
	virtual void writeBoolArray(EsMessageWriter* writer, void* data);
	virtual void writeByteArray(EsMessageWriter* writer, void* data);
	virtual void writeShortArray(EsMessageWriter* writer, void* data);
	virtual void writeIntArray(EsMessageWriter* writer, void* data);
	virtual void writeLongArray(EsMessageWriter* writer, void* data);
	virtual void writeFloatArray(EsMessageWriter* writer, void* data);
	virtual void writeDoubleArray(EsMessageWriter* writer, void* data);
	virtual void writeStringArray(EsMessageWriter* writer, void* data);
	virtual void writeEsObjectArray(EsMessageWriter* writer, void* data);
};

} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ESOBJECT_H_ */
