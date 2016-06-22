/*
 * EsObject.cpp
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#include "EsObject.h"

#include "thrift/ThriftFlattenedEsObject_types.h"
#include "thrift/ThriftFlattenedEsObjectRO_types.h"
#include "../ElectroLogger.h"

namespace es {

EsObject::EsObject() {
	// TODO Auto-generated constructor stub
	//mData
}

EsObject::~EsObject() {
	// TODO Auto-generated destructor stub
	for (auto it = mData.begin(); it != mData.end(); it++) {
        switch (it->second->type) {
            case EsObjectType_Integer:
            {
                delete ((int32_t*) it->second->data);
                break;
            }
            case EsObjectType_String:
            {
                delete ((std::string*) it->second->data);
                break;
            }
            case EsObjectType_Double:
            {
                delete ((double*) it->second->data);
                break;
            }
            case EsObjectType_Float:
            {
                delete ((float*) it->second->data);
                break;
            }
            case EsObjectType_Bool:
            {
                delete ((bool*) it->second->data);
                break;
            }
            case EsObjectType_Byte:
            {
                delete ((int8_t*) it->second->data);
                break;
            }
            case EsObjectType_Charactor:
            {
                break;
            }
            case EsObjectType_Long:
            {
                delete ((int64_t*) it->second->data);
                break;
            }
            case EsObjectType_Short:
            {
                delete ((int16_t*) it->second->data);
                break;
            }
            case EsObjectType_EsObject:
            {
                delete ((EsObject*) it->second->data);
                break;
            }
            case EsObjectType_EsObjectArray:
            {
                auto arr = (std::vector<EsObject*>*) (it->second->data);
                for(int i=0;i<arr->size();i++){
                    delete arr->at(i);
                }
                delete arr;
                break;
            }
            case EsObjectType_IntegerArray:
            {
                delete ((std::vector<int32_t>*) it->second->data);
                break;
            }
            case EsObjectType_StringArray:
            {
                delete ((std::vector<std::string>*) it->second->data);
                break;
            }
            case EsObjectType_DoubleArray:
            {
                delete ((std::vector<double>*) it->second->data);
                break;
            }
            case EsObjectType_FloatArray:
            {
                delete ((std::vector<float>*) it->second->data);
                break;
            }
            case EsObjectType_BoolArray:
            {
                delete ((std::vector<bool>*) it->second->data);
                break;
            }
            case EsObjectType_ByteArray:
            {
                delete ((std::vector<int8_t>*) it->second->data);
                break;
            }
            case EsObjectType_CharactorArray:
            {
        
                break;
            }
            case EsObjectType_ShortArray:
            {
                delete ((std::vector<int16_t>*) it->second->data);
                break;
            }
            case EsObjectType_LongArray:
            {
                delete ((std::vector<int64_t>*) it->second->data);
                break;
            }
            case EsObjectType_Number:
            {
                break;
            }
            case EsObjectType_NumberArray:
            {
                break;
            }
                
        }
        
        delete it->second;
	}
    
    mData.clear();
}

void EsObject::initFromReader(EsMessageReader* reader) {
	char flag = reader->nextByte();

	int length = reader->nextLength();
	for (int i = 0; i < length; i++) {
		int type = (int) reader->nextByte();
		std::string key = reader->nextString();
		switch (type) {
		case EsObjectType_Integer: {
			readInt(reader, key);
			break;
		}
		case EsObjectType_String: {
			readString(reader, key);
			break;
		}
		case EsObjectType_Double: {
			readDouble(reader, key);
			break;
		}
		case EsObjectType_Float: {
			readFloat(reader, key);
			break;
		}
		case EsObjectType_Bool: {
			readBool(reader, key);
			break;
		}
		case EsObjectType_Byte: {
			readByte(reader, key);
			break;
		}
		case EsObjectType_Charactor: {

			es::log("not support EsObjectType_Charactor");
			break;
		}
		case EsObjectType_Long: {
			readLong(reader, key);
			break;
		}
		case EsObjectType_Short: {
			readShort(reader, key);
			break;
		}
		case EsObjectType_EsObject: {
			readEsObject(reader, key);
			break;
		}
		case EsObjectType_EsObjectArray: {
			readEsObjectArray(reader, key);
			break;
		}
		case EsObjectType_IntegerArray: {
			readIntArray(reader, key);
			break;
		}
		case EsObjectType_StringArray: {
			readStringArray(reader, key);
			break;
		}
		case EsObjectType_DoubleArray: {
			readDoubleArray(reader, key);
			break;
		}
		case EsObjectType_FloatArray: {
			readFloatArray(reader, key);
			break;
		}
		case EsObjectType_BoolArray: {
			readBoolArray(reader, key);
			break;
		}
		case EsObjectType_ByteArray: {
			readByteArray(reader, key);
			break;
		}
		case EsObjectType_CharactorArray: {
			es::log("not support EsObjectType_CharactorArray");
			break;
		}
		case EsObjectType_LongArray: {
			readLongArray(reader, key);
			break;
		}
		case EsObjectType_ShortArray: {
			readShortArray(reader, key);
			break;
		}
		case EsObjectType_Number: {
			es::log("not support EsObjectType_Number");
			break;
		}
		case EsObjectType_NumberArray: {
			//cocos2d::log
			es::log("not support EsObjectType_NumberArray");
			break;
		}
		}
	}
}

void EsObject::initWithBytes(char* bytes, int len, bool isFlag) {
	if (len <= 0) {
		es::log("esobject init from buffer = 0");
		return;
	}

	EsMessageReader reader(bytes, len);
	this->initFromReader(&reader);
}

void EsObject::initFromFlattenedEsObject(void* thrift) {
	auto obj = (ThriftFlattenedEsObject*) thrift;
	auto data = obj->encodedEntries;
	this->initWithBytes((char*) data.data(), data.size());
}

void EsObject::initFromFlattenedEsObjectRO(void* thrift) {
	auto obj = (ThriftFlattenedEsObjectRO*) thrift;
	auto data = obj->encodedEntries;
	this->initWithBytes((char*) data.data(), data.size());
}

void EsObject::initWithBytes(const std::vector<uint8_t>& bytes) {
	this->initWithBytes((char*) bytes.data(), bytes.size());
}

void EsObject::writeToBuffer(EsMessageWriter* writer) {
	//flag
	char flag = 0x00;
	writer->writeByte(flag);

	int length = mData.size();
	writer->writeLength(length);

	for (auto it = mData.begin(); it != mData.end(); it++) {
		int type = it->second->type;
		writer->writeByte((int8_t) type);
		writer->writeString(it->first);

		switch (type) {
		case EsObjectType_Integer: {
			writeInt(writer, it->second->data);
			break;
		}
		case EsObjectType_String: {
			writeString(writer, it->second->data);
			break;
		}
		case EsObjectType_Double: {
			writeDouble(writer, it->second->data);
			break;
		}
		case EsObjectType_Float: {
			writeFloat(writer, it->second->data);
			break;
		}
		case EsObjectType_Bool: {
			writeBool(writer, it->second->data);
			break;
		}
		case EsObjectType_Byte: {
			writeByte(writer, it->second->data);
			break;
		}
		case EsObjectType_Charactor: {
			es::log("not support EsObjectType_Charactor");
			break;
		}
		case EsObjectType_Long: {
			writeLong(writer, it->second->data);
			break;
		}
		case EsObjectType_Short: {
			writeShort(writer, it->second->data);
			break;
		}
		case EsObjectType_EsObject: {
			writeEsObject(writer, it->second->data);
			break;
		}
		case EsObjectType_EsObjectArray: {
			writeEsObjectArray(writer, it->second->data);
			break;
		}
		case EsObjectType_IntegerArray: {
			writeIntArray(writer, it->second->data);
			break;
		}
		case EsObjectType_StringArray: {
			writeStringArray(writer, it->second->data);
			break;
		}
		case EsObjectType_DoubleArray: {
			writeDoubleArray(writer, it->second->data);
			break;
		}
		case EsObjectType_FloatArray: {
			writeFloatArray(writer, it->second->data);
			break;
		}
		case EsObjectType_BoolArray: {
			writeBoolArray(writer, it->second->data);
			break;
		}
		case EsObjectType_ByteArray: {
			writeByteArray(writer, it->second->data);
			break;
		}
		case EsObjectType_CharactorArray: {
			es::log("not support EsObjectType_CharactorArray");
			break;
		}
		case EsObjectType_LongArray: {
			writeLongArray(writer, it->second->data);
			break;
		}
		case EsObjectType_ShortArray: {
			writeShortArray(writer, it->second->data);
			break;
		}
		case EsObjectType_Number: {
			es::log("not support EsObjectType_Number");
			break;
		}
		case EsObjectType_NumberArray: {
			es::log("not support EsObjectType_NumberArray");
			break;
		}
		}
	}
}

void EsObject::writeToFlattenedEsObject(void* obj) {
	es::EsMessageWriter writer;
	this->writeToBuffer(&writer);
	auto buffer = writer.getBuffer();

	auto thrift = (es::ThriftFlattenedEsObject*) obj;
	thrift->encodedEntries.insert(thrift->encodedEntries.end(), buffer.begin(),
			buffer.end());
	thrift->__isset.encodedEntries = true;
}

void EsObject::writeToFlattenedEsObjectRO(void* obj) {
	es::EsMessageWriter writer;
	this->writeToBuffer(&writer);
	auto buffer = writer.getBuffer();

	auto thrift = (es::ThriftFlattenedEsObjectRO*) obj;
	thrift->encodedEntries.insert(thrift->encodedEntries.end(), buffer.begin(),
			buffer.end());
	thrift->__isset.encodedEntries = true;
}

void EsObject::deleteEsData(EsObjectData* data) {
	if (data->type == EsObjectType_EsObjectArray) {
		auto arr = (std::vector<EsObject*>*) data->data;
		for (int i = 0; i < arr->size(); i++) {
			delete arr->at(i);
		}
		arr->clear();
	}

	switch (data->type) {
		case EsObjectType_Integer:
		{
			delete ((int32_t*)data->data);
			break;
		}
		case EsObjectType_String:
		{
			delete ((std::string*) data->data);
			break;
		}
		case EsObjectType_Double:
		{
			delete ((double*)data->data);
			break;
		}
		case EsObjectType_Float:
		{
			delete ((float*)data->data);
			break;
		}
		case EsObjectType_Bool:
		{
			delete ((bool*)data->data);
			break;
		}
		case EsObjectType_Byte:
		{
			delete ((int8_t*)data->data);
			break;
		}
		case EsObjectType_Charactor:
		{
			break;
		}
		case EsObjectType_Long:
		{
			delete ((int64_t*)data->data);
			break;
		}
		case EsObjectType_Short:
		{
			delete ((int16_t*)data->data);
			break;
		}
		case EsObjectType_EsObject:
		{
			delete ((EsObject*)data->data);
			break;
		}
		case EsObjectType_EsObjectArray:
		{
			auto arr = (std::vector<EsObject*>*) (data->data);
			for (int i = 0; i < arr->size(); i++){
				delete arr->at(i);
			}
			delete arr;
			break;
		}
		case EsObjectType_IntegerArray:
		{
			delete ((std::vector<int32_t>*) data->data);
			break;
		}
		case EsObjectType_StringArray:
		{
			delete ((std::vector<std::string>*) data->data);
			break;
		}
		case EsObjectType_DoubleArray:
		{
			delete ((std::vector<double>*) data->data);
			break;
		}
		case EsObjectType_FloatArray:
		{
			delete ((std::vector<float>*) data->data);
			break;
		}
		case EsObjectType_BoolArray:
		{
			delete ((std::vector<bool>*) data->data);
			break;
		}
		case EsObjectType_ByteArray:
		{
			delete ((std::vector<int8_t>*) data->data);
			break;
		}
		case EsObjectType_CharactorArray:
		{

			break;
		}
		case EsObjectType_ShortArray:
		{
			delete ((std::vector<int16_t>*) data->data);
			break;
		}
		case EsObjectType_LongArray:
		{
			delete ((std::vector<int64_t>*) data->data);
			break;
		}
		case EsObjectType_Number:
		{
			break;
		}
		case EsObjectType_NumberArray:
		{
			break;
		}
	}
//	delete data->data;
	delete data;
}

bool EsObject::keyExist(const std::string& key) {
	auto it = mData.find(key);
	return (it != mData.end());
}

bool EsObject::getBool(const std::string &key, bool defaultValue) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		return defaultValue;
	}

	if (it->second->type != EsObjectType_Bool) {
		es::log("object with key: %s cannot cast Boolean", key.c_str());
		return defaultValue;
	}

	bool pret = *((bool*) (it->second->data));
	return pret;
}

int8_t EsObject::getByte(const std::string &key, int8_t defaultValue) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		return defaultValue;
	}

	if (it->second->type != EsObjectType_Byte) {
		es::log("object with key: %s cannot cast Byte", key.c_str());
		return defaultValue;
	}

	int8_t pret = *((int8_t*) (it->second->data));
	return pret;
}

int16_t EsObject::getShort(const std::string &key, int16_t defaultValue) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		return defaultValue;
	}

	if (it->second->type != EsObjectType_Short) {
		es::log("object with key: %s cannot cast Short", key.c_str());
		return defaultValue;
	}

	int16_t pret = *((int16_t*) (it->second->data));
	return pret;
}

int32_t EsObject::getInt(const std::string &key, int32_t defaultValue) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		return defaultValue;
	}

	if (it->second->type != EsObjectType_Integer) {
		es::log("object with key: [%s] cannot cast Integer", key.c_str());
		return defaultValue;
	}

	int32_t pret = *((int32_t*) (it->second->data));
	return pret;
}

int64_t EsObject::getLong(const std::string &key, int64_t defaultValue) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		return defaultValue;
	}

	if (it->second->type != EsObjectType_Long) {
		es::log("object with key: [%s] cannot cast to Long", key.c_str());
		return defaultValue;
	}

	int64_t pret = *((int64_t*) (it->second->data));
	return pret;
}

float EsObject::getFloat(const std::string &key, float defaultValue) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		return defaultValue;
	}

	if (it->second->type != EsObjectType_Float) {
		es::log("object with key: [%s] cannot cast to Float", key.c_str());
		return defaultValue;
	}

	int64_t pret = *((int64_t*) (it->second->data));
	return pret;
}

double EsObject::getDouble(const std::string &key, double defaultValue) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		return defaultValue;
	}

	if (it->second->type != EsObjectType_Double) {
		es::log("object with key: [%s] cannot cast to double",
				key.c_str());
		return defaultValue;
	}

	double pret = *((double*) (it->second->data));
	return pret;
}

std::string EsObject::getString(const std::string &key, const std::string &defaultValue) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		return defaultValue;
	}

	if (it->second->type != EsObjectType_String) {
		es::log("object with key: [%s] cannot cast to String",
				key.c_str());
		return defaultValue;
	}

	std::string pret = *((std::string*) (it->second->data));
	return pret;
}

const char* EsObject::getCString(const std::string &key, const char* defaultValue){
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		return defaultValue;
	}

	if (it->second->type != EsObjectType_String) {
		es::log("object with key: [%s] cannot cast to CString",
			key.c_str());
		return defaultValue;
	}

	std::string* pret = (std::string*) (it->second->data);
	return pret->data();
}

EsObject* EsObject::getEsObject(const std::string &key) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		return 0;
	}

	if (it->second->type != EsObjectType_EsObject) {
		es::log("object with key: [%s] cannot cast to EsObject",
				key.c_str());
		return 0;
	}

	EsObject* pret = ((EsObject*) (it->second->data));
	return pret;
}

//    static std::vector<bool> null_bool_vector;
//    static std::vector<int8_t>* getByteArray(const std::string &key);
//    virtual const std::vector<int16_t>* getShortArray(const std::string &key);
//    virtual const std::vector<int32_t>* getIntArray(const std::string &key);
//    virtual const std::vector<int64_t>* getLongArray(const std::string &key);
//    virtual const std::vector<float>* getFloatArray(const std::string &key);
//    virtual const std::vector<double>* getDoubleArray(const std::string &key);
//    virtual const std::vector<std::string>* getStringArray(const std::string &key);
//    virtual const std::vector<EsObject*>* getEsObjectArray(const std::string &key);

    
static std::vector<bool> empty_bool_vector;
const std::vector<bool>* EsObject::getBoolArray(const std::string &key) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
        return &empty_bool_vector;
		//return 0;
	}

	if (it->second->type != EsObjectType_BoolArray) {
		es::log("object with key: [%s] cannot cast to BoolArray", key.c_str());
        return &empty_bool_vector;
		//return 0;
	}

	return ((std::vector<bool>*) (it->second->data));
}

static std::vector<int8_t> empty_byte_vector;
const std::vector<int8_t>* EsObject::getByteArray(const std::string &key) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
        return &empty_byte_vector;
		//return 0;
	}

	if (it->second->type != EsObjectType_ByteArray) {
		es::log("object with key: [%s] cannot cast to BoolArray", key.c_str());
		//return 0;
        return &empty_byte_vector;
	}

	return ((std::vector<int8_t>*) (it->second->data));
}

static std::vector<int16_t> empty_short_vector;
const std::vector<int16_t>* EsObject::getShortArray(const std::string &key) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		//return 0;
        return &empty_short_vector;
	}

	if (it->second->type != EsObjectType_ShortArray) {
		es::log("object with key: [%s] cannot cast to ShortArray",key.c_str());
		//return 0;
        return &empty_short_vector;;
	}

	return ((std::vector<int16_t>*) (it->second->data));
}

static std::vector<int32_t> empty_int_vector;
const std::vector<int32_t>* EsObject::getIntArray(const std::string &key) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		//return 0;
        return &empty_int_vector;
	}

	if (it->second->type != EsObjectType_IntegerArray) {
		es::log("object with key: [%s] cannot cast to IntegerArray", key.c_str());
		//return 0;
        return &empty_int_vector;
	}

	return ((std::vector<int32_t>*) (it->second->data));
}

static std::vector<int64_t> empty_long_vector;
const std::vector<int64_t>* EsObject::getLongArray(const std::string &key) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		//return 0;
        return &empty_long_vector;
	}

	if (it->second->type != EsObjectType_LongArray) {
		es::log("object with key: [%s] cannot cast to LongArray", key.c_str());
		//return 0;
        return &empty_long_vector;
	}

	return ((std::vector<int64_t>*) (it->second->data));
}

static std::vector<float> empty_float_vector;
const std::vector<float>* EsObject::getFloatArray(const std::string &key) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		//return 0;
        return &empty_float_vector;
	}

	if (it->second->type != EsObjectType_FloatArray) {
		es::log("object with key: [%s] cannot cast to FloatArray", key.c_str());
		//return 0;
        return &empty_float_vector;
	}

	return ((std::vector<float>*) (it->second->data));
}

static std::vector<double> empty_double_vector;
const std::vector<double>* EsObject::getDoubleArray(const std::string &key) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		//return 0;
        return &empty_double_vector;
	}

	if (it->second->type != EsObjectType_DoubleArray) {
		es::log("object with key: [%s] cannot cast to DoubleArray", key.c_str());
		//return 0;
        return &empty_double_vector;
	}

	return ((std::vector<double>*) (it->second->data));
}

static std::vector<std::string> empty_string_vector;
const std::vector<std::string>* EsObject::getStringArray(
		const std::string &key) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		//return 0;
        return &empty_string_vector;
	}

	if (it->second->type != EsObjectType_StringArray) {
		es::log("object with key: [%s] cannot cast to StringArray", key.c_str());
		//return 0;
        return &empty_string_vector;
	}

	return ((std::vector<std::string>*) (it->second->data));
}

static std::vector<EsObject*> empty_esobject_vector;
const std::vector<EsObject*>* EsObject::getEsObjectArray(
		const std::string &key) {
	auto it = mData.find(key);
	if (it == mData.end()) {
		es::log("not exist key: %s", key.c_str());
		//return 0;
        return &empty_esobject_vector;
	}

	if (it->second->type != EsObjectType_EsObjectArray) {
		es::log("object with key: [%s] cannot cast to EsObjectArray", key.c_str());
		//return 0;
        return &empty_esobject_vector;
	}

	return ((std::vector<EsObject*>*) (it->second->data));
}

/* Setter */

void EsObject::setBool(const std::string &key, bool b) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newData = new EsObjectData();
	newData->type = EsObjectType_Bool;
	newData->data = new bool(b);
	mData.insert(std::make_pair(key, newData));
}

void EsObject::setByte(const std::string &key, int8_t b) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newData = new EsObjectData();
	newData->type = EsObjectType_Byte;
	newData->data = new int8_t(b);
	mData.insert(std::make_pair(key, newData));
}

void EsObject::setShort(const std::string &key, int16_t i) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newData = new EsObjectData();
	newData->type = EsObjectType_Short;
	newData->data = new int16_t(i);
	mData.insert(std::make_pair(key, newData));
}

void EsObject::setInt(const std::string &key, int32_t i) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newData = new EsObjectData();
	newData->type = EsObjectType_Integer;
	newData->data = new int32_t(i);
	mData.insert(std::make_pair(key, newData));
}

void EsObject::setLong(const std::string &key, int64_t i) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newData = new EsObjectData();
	newData->type = EsObjectType_Long;
	newData->data = new int64_t(i);
	mData.insert(std::make_pair(key, newData));
}

void EsObject::setFloat(const std::string &key, float f) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newData = new EsObjectData();
	newData->type = EsObjectType_Float;
	newData->data = new float(f);
	mData.insert(std::make_pair(key, newData));
}

void EsObject::setDouble(const std::string &key, double d) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newData = new EsObjectData();
	newData->type = EsObjectType_Double;
	newData->data = new double(d);
	mData.insert(std::make_pair(key, newData));
}

void EsObject::setString(const std::string &key, const std::string& str) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newData = new EsObjectData();
	newData->type = EsObjectType_String;
	newData->data = new std::string(str);
	mData.insert(std::make_pair(key, newData));
}

void EsObject::setEsObject(const std::string &key, EsObject* obj) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newData = new EsObjectData();
	newData->type = EsObjectType_EsObject;
	newData->data = obj;
	mData.insert(std::make_pair(key, newData));
}

void EsObject::setBoolArray(const std::string &key,
		const std::vector<bool>& arr) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newObj = new std::vector<bool>();
	auto newData = new EsObjectData();
	newData->type = EsObjectType_BoolArray;
	newData->data = newObj;
	mData.insert(std::make_pair(key, newData));

	for (int i = 0; i < arr.size(); i++) {
		newObj->push_back(arr[i]);
	}
}

void EsObject::setByteArray(const std::string &key,
		const std::vector<char>& arr) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newObj = new std::vector<char>();
	auto newData = new EsObjectData();
	newData->type = EsObjectType_ByteArray;
	newData->data = newObj;
	mData.insert(std::make_pair(key, newData));

	for (int i = 0; i < arr.size(); i++) {
		newObj->push_back(arr[i]);
	}
}

void EsObject::setShortArray(const std::string &key,
		const std::vector<int16_t>& arr) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newObj = new std::vector<int16_t>();
	auto newData = new EsObjectData();
	newData->type = EsObjectType_ShortArray;
	newData->data = newObj;
	mData.insert(std::make_pair(key, newData));

	for (int i = 0; i < arr.size(); i++) {
		newObj->push_back(arr[i]);
	}
}

void EsObject::setIntArray(const std::string &key,
		const std::vector<int32_t>& arr) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newObj = new std::vector<int32_t>();
	auto newData = new EsObjectData();
	newData->type = EsObjectType_IntegerArray;
	newData->data = newObj;
	mData.insert(std::make_pair(key, newData));

	for (int i = 0; i < arr.size(); i++) {
		newObj->push_back(arr[i]);
	}
}

void EsObject::setLongArray(const std::string &key,
		const std::vector<int64_t>& arr) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newObj = new std::vector<int64_t>();
	auto newData = new EsObjectData();
	newData->type = EsObjectType_LongArray;
	newData->data = newObj;
	mData.insert(std::make_pair(key, newData));

	for (int i = 0; i < arr.size(); i++) {
		newObj->push_back(arr[i]);
	}
}

void EsObject::setFloatArray(const std::string &key,
		const std::vector<float>& arr) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newObj = new std::vector<float>();
	auto newData = new EsObjectData();
	newData->type = EsObjectType_FloatArray;
	newData->data = newObj;
	mData.insert(std::make_pair(key, newData));

	for (int i = 0; i < arr.size(); i++) {
		newObj->push_back(arr[i]);
	}
}

void EsObject::setDoubleArray(const std::string &key,
		const std::vector<double>& arr) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newObj = new std::vector<double>();
	auto newData = new EsObjectData();
	newData->type = EsObjectType_DoubleArray;
	newData->data = newObj;
	mData.insert(std::make_pair(key, newData));

	for (int i = 0; i < arr.size(); i++) {
		newObj->push_back(arr[i]);
	}
}

void EsObject::setStringArray(const std::string &key,
		const std::vector<std::string>& arr) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newObj = new std::vector<std::string>();
	auto newData = new EsObjectData();
	newData->type = EsObjectType_StringArray;
	newData->data = newObj;
	mData.insert(std::make_pair(key, newData));

	for (int i = 0; i < arr.size(); i++) {
		newObj->push_back(arr[i]);
	}
}

void EsObject::setEsObjectArray(const std::string &key,
		const std::vector<EsObject*>& arr) {
	auto it = mData.find(key);
	if (it != mData.end()) {
		es::log("key %s exist -> delete", key.c_str());
		this->deleteEsData(it->second);
		mData.erase(it);
	}

	auto newData = new EsObjectData();
	newData->type = EsObjectType_EsObjectArray;
	newData->data = new std::vector<EsObject*>();
	mData.insert(std::make_pair(key, newData));

	for (int i = 0; i < arr.size(); i++) {
		((std::vector<EsObject*>*)newData->data)->push_back(arr[i]);
	}
}

/* read */

void EsObject::readBool(EsMessageReader* reader, const std::string& key) {
	bool b = reader->nextBool();
	setBool(key, b);
}

void EsObject::readByte(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextByte();
	setByte(key, data);
}

void EsObject::readShort(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextShort();
	setShort(key, data);
}

void EsObject::readInt(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextInt();
	setInt(key, data);
}

void EsObject::readLong(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextLong();
	setLong(key, data);
}

void EsObject::readFloat(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextFloat();
	setFloat(key, data);
}

void EsObject::readDouble(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextDouble();
	setDouble(key, data);
}

void EsObject::readString(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextString();
	setString(key, data);
}

void EsObject::readEsObject(EsMessageReader* reader, const std::string& key) {
	EsObject* obj = new EsObject();
	obj->initFromReader(reader);
	setEsObject(key, obj);
}

void EsObject::readBoolArray(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextBoolArray();
	setBoolArray(key, data);
}

void EsObject::readByteArray(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextByteArray();
	setByteArray(key, data);
}

void EsObject::readShortArray(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextShortArray();
	setShortArray(key, data);
}

void EsObject::readIntArray(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextIntArray();
	setIntArray(key, data);
}

void EsObject::readLongArray(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextLongArray();
	setLongArray(key, data);
}

void EsObject::readFloatArray(EsMessageReader* reader, const std::string& key) {
	auto data = reader->nextFloatArray();
	setFloatArray(key, data);
}

void EsObject::readDoubleArray(EsMessageReader* reader,
		const std::string& key) {
	auto data = reader->nextDoubleArray();
	setDoubleArray(key, data);
}

void EsObject::readStringArray(EsMessageReader* reader,
		const std::string& key) {
	auto data = reader->nextStringArray();
	setStringArray(key, data);
}

void EsObject::readEsObjectArray(EsMessageReader* reader,
		const std::string& key) {
	auto count = reader->nextLength();
	std::vector<EsObject*> arr;
	for (int i = 0; i < count; i++) {
		EsObject* obj = new EsObject();
		obj->initFromReader(reader);
		arr.push_back(obj);
	}

	setEsObjectArray(key, arr);
}

//

void EsObject::writeBool(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_Bool);
	writer->writeBool(*((bool*) data));
}

void EsObject::writeByte(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_Byte);
	writer->writeByte(*((int8_t*) data));
}

void EsObject::writeShort(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_Short);
	writer->writeShort(*((int16_t*) data));
}

void EsObject::writeInt(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_Integer);
	writer->writeInt(*((int32_t*) data));
}

void EsObject::writeLong(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_Long);
	writer->writeLong(*((int64_t*) data));
}

void EsObject::writeFloat(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_Float);
	writer->writeFloat(*((float*) data));
}

void EsObject::writeDouble(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_Double);
	writer->writeDouble(*((double*) data));
}

void EsObject::writeString(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_String);
	writer->writeString(*((std::string*) data));
}

void EsObject::writeEsObject(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_EsObject);
	((EsObject*) data)->writeToBuffer(writer);
}

void EsObject::writeBoolArray(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_BoolArray);
	writer->writetBoolArray(*((std::vector<bool>*) data));
}

void EsObject::writeByteArray(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_ByteArray);
	writer->writeByteArray(*((std::vector<int8_t>*) data));
}

void EsObject::writeShortArray(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_ShortArray);
	writer->writeShortArray(*((std::vector<int16_t>*) data));
}

void EsObject::writeIntArray(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_IntegerArray);
	writer->writeIntArray(*((std::vector<int32_t>*) data));
}

void EsObject::writeLongArray(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_LongArray);
	writer->writeLongArray(*((std::vector<int64_t>*) data));
}

void EsObject::writeFloatArray(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_FloatArray);
	writer->writeFloatArray(*((std::vector<float>*) data));
}

void EsObject::writeDoubleArray(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_DoubleArray);
	writer->writeDoubleArray(*((std::vector<double>*) data));
}

void EsObject::writeStringArray(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_StringArray);
	writer->writeStringArray(*((std::vector<std::string>*) data));
}

void EsObject::writeEsObjectArray(EsMessageWriter* writer, void* data) {
	//writer->writeByte((int8_t)EsObjectType_StringArray);
	auto arr = (std::vector<EsObject*>*) data;
	writer->writeLength(arr->size());
	for (int i = 0; i < arr->size(); i++) {
		arr->at(i)->writeToBuffer(writer);
	}
}

inline void _print_padding(std::ostream &outStream, int padding) {
	for (int i = 0; i < padding; i++) {
		outStream << " ";
	}
}

//inline void _print_buffer(std::ostringstream &outStream) {
//	es::log("%s", outStream.str().c_str());
//	outStream.str("");
//	outStream.clear();
//}

void EsObject::printDebug() {
	std::ostringstream outStream;
	this->printDebug(outStream, 0);
    es::log_to_console(outStream.str().c_str());
    
    //es::log("%s", outStream.str().c_str());
}

void EsObject::printDebug(std::ostringstream &outStream, int padding) {
    
    _print_padding(outStream, padding);
    outStream << "[EsObject] {" << std::endl;
	//_print_buffer(outStream);

	for (auto it = mData.begin(); it != mData.end(); it++) {
		_print_padding(outStream, padding + 5);
		outStream << it->first << ":";

		int type = it->second->type;

		switch (type) {
		case EsObjectType_Integer: {
			outStream << "[int] " << *((int32_t*) it->second->data);
			break;
		}
		case EsObjectType_String: {
			outStream << "[string] " << *((std::string*) it->second->data);
			break;
		}
		case EsObjectType_Double: {
			outStream << "[double] " << *((double*) it->second->data);
			break;
		}
		case EsObjectType_Float: {
			outStream << "[float] " << *((float*) it->second->data);
			break;
		}
		case EsObjectType_Bool: {
			outStream << "[bool] " << *((bool*) it->second->data);
			break;
		}
		case EsObjectType_Byte: {
			outStream << "[byte] " << *((int8_t*) it->second->data);
			break;
		}
		case EsObjectType_Charactor: {
			outStream << "[Charactor]";
			break;
		}
		case EsObjectType_Long: {
			outStream << "[long] " << *((int64_t*) it->second->data);
			break;
		}
		case EsObjectType_Short: {
			outStream << "[short] " << *((int16_t*) it->second->data);
			break;
		}
		case EsObjectType_EsObject: {
			int a = padding + it->first.length() + 4;
			((EsObject*) it->second->data)->printDebug(outStream, a);
			break;
		}
		case EsObjectType_EsObjectArray: {
            auto arr = (std::vector<EsObject*>*) it->second->data;
            outStream << "[EsArray(" << arr->size() <<")]"<<std::endl;
			
			int a = padding + it->first.length() + 12;

			for (int i = 0; i < arr->size(); i++) {
				arr->at(i)->printDebug(outStream, a);
			}
			break;
		}
		case EsObjectType_IntegerArray: {
            auto arr = (std::vector<int>*) it->second->data;
			outStream << "[IntArray("<< arr->size() <<")] ";
			for (int i = 0; i < arr->size(); i++) {
				outStream << arr->at(i) << " ";
			}
			break;
		}
		case EsObjectType_StringArray: {
            auto arr = (std::vector<std::string>*) it->second->data;
            outStream << "[StringArray(" << arr->size() << ")] ";
			for (int i = 0; i < arr->size(); i++) {
				outStream << arr->at(i) << " ";
			}
			break;
		}
		case EsObjectType_DoubleArray: {
            auto arr = (std::vector<double>*) it->second->data;
			outStream << "[DoubleArray(" << arr->size() <<")] ";
			for (int i = 0; i < arr->size(); i++) {
				outStream << arr->at(i) << " ";
			}
			break;
		}
		case EsObjectType_FloatArray: {
            auto arr = (std::vector<float>*) it->second->data;
			outStream << "[FloatArray(" << arr->size() << ")] ";
			for (int i = 0; i < arr->size(); i++) {
				outStream << arr->at(i) << " ";
			}
			break;
		}
		case EsObjectType_BoolArray: {
            auto arr = (std::vector<bool>*) it->second->data;
			outStream << "[BoolArray(" << arr->size() << ")] ";
			for (int i = 0; i < arr->size(); i++) {
				outStream << arr->at(i) << " ";
			}
			break;
		}
		case EsObjectType_ByteArray: {
			outStream << "[ByteArray] ";
			auto arr = (std::vector<int8_t>*) it->second->data;
			for (int i = 0; i < arr->size(); i++) {
				outStream << arr->at(i) << " ";
			}
			break;
		}
		case EsObjectType_CharactorArray: {
			outStream << "[CharactorArray]";
			break;
		}
		case EsObjectType_LongArray: {
            auto arr = (std::vector<int64_t>*) it->second->data;
			outStream << "[LongArray(" << arr->size() << ")] ";
			for (int i = 0; i < arr->size(); i++) {
				outStream << arr->at(i) << " ";
			}
			break;
		}
		case EsObjectType_ShortArray: {
            auto arr = (std::vector<int16_t>*) it->second->data;
			outStream << "[ShortArray(" << arr->size() << ")] ";
			for (int i = 0; i < arr->size(); i++) {
				outStream << arr->at(i) << " ";
			}
			break;
		}
		case EsObjectType_Number: {
			outStream << "[Number]";
			break;
		}
		case EsObjectType_NumberArray: {
			outStream << "[NumberArray]";
			break;
		}
		}

        outStream << std::endl;
		//_print_buffer(outStream);
	}

	_print_padding(outStream, padding);
    outStream << "}" << std::endl;
	//_print_buffer(outStream);
}

} /* namespace es */
