/*
 * EsObject.cpp
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#include "EsObject.h"
#include "EsArray.h"
#include "EsPrimitive.h"
#include "../../ElectroLogger.h"

namespace es {

EsObject::EsObject(){
	type = es::EsObjectIndicatorType::EsObjectType_EsObject;
}

EsObject::~EsObject(){
	for (auto it = mData.begin(); it != mData.end(); it++){
		delete it->second;
	}
	mData.clear();
}

void EsObject::writeToBuffer(EsMessageWriter* writer){
	char flag = 0x00;
	writer->writeByte(flag);

	int length = mData.size();
	writer->writeLength(length);

	for (auto it = mData.begin(); it != mData.end(); it++){
		int type = it->second->type;
		writer->writeByte((int8_t)type);
		writer->writeString(it->first);
		it->second->writeToBuffer(writer);
	}
}

void EsObject::toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator){
	value.SetObject();
	for (auto it = mData.begin(); it != mData.end(); it++){
		rapidjson::Value key(it->first, allocator);

		rapidjson::Value childValue;
		it->second->toJson(childValue, allocator);
		
		value.AddMember(key, childValue, allocator);
	}
}

void EsObject::readFromBuffer(EsMessageReader* reader){
	char flag = reader->nextByte();
	int length = reader->nextLength();
	for (int i = 0; i < length; i++){
		int type = (int)reader->nextByte();
		std::string key = reader->nextString();
		EsEntity* obj = 0;
		switch (type)
		{
			case EsObjectType_Integer:	
			case EsObjectType_Double:
			case EsObjectType_Float:
			case EsObjectType_Bool:
			case EsObjectType_Byte:
			case EsObjectType_Long:
			case EsObjectType_Short:{
				obj = new EsPrimitive();
				break;
			}

			case EsObjectType_String:{
				obj = new EsString();
				break;
			}
			case EsObjectType_EsObject:{
				obj = new EsObject();
				break;
			}
		
			case EsObjectType_IntegerArray:
			case EsObjectType_StringArray:
			case EsObjectType_EsObjectArray:
			case EsObjectType_DoubleArray:
			case EsObjectType_FloatArray:
			case EsObjectType_BoolArray:
			case EsObjectType_ByteArray:
			case EsObjectType_LongArray:
			case EsObjectType_ShortArray:{
				obj = new EsArray();
				break;
			}

			case EsObjectType_Charactor:{
#ifdef ES_LOGGER
				es::log("not support EsObjectType_Charactor");
#endif
				break;
			}
			case EsObjectType_CharactorArray:{
#ifdef ES_LOGGER
				es::log("not support EsObjectType_CharactorArray");
#endif
				break;
			}
			case EsObjectType_Number:{
#ifdef ES_LOGGER
				es::log("not support EsObjectType_Number");
#endif
				break;
			}
			case EsObjectType_NumberArray:{
#ifdef ES_LOGGER
				es::log("not support EsObjectType_NumberArray");
#endif
				break;
			}
		}
		if (obj){
            obj->type = type;
			obj->readFromBuffer(reader);
			mData.insert(std::make_pair(key, obj));
		}

	}
}

#ifdef ES_LOGGER
void EsObject::printDebugToBuffer(std::ostringstream &outStream, int padding){
	//outStream << "\n";

	//_print_padding(outStream, padding);
	outStream << "[EsObject]{\n";

	for (auto it = mData.begin(); it != mData.end(); it++){
		this->printPadding(outStream, padding + 1);
		outStream << it->first << ":";
		it->second->printDebugToBuffer(outStream, padding + 1);
		outStream << "\n";
	}

	this->printPadding(outStream, padding);
	outStream << "}";//\n";
}
#endif

EsEntity* EsObject::getEsEntity(const std::string& key){
	auto it = mData.find(key);
	if (it != mData.end()){
		return it->second;
	}
	return 0;
}

void EsObject::setEsEntity(const std::string& key, EsEntity* entity){
	auto it = mData.find(key);
	if (it != mData.end()){
		mData.erase(it);
	}
	mData.insert(std::make_pair(key, entity));
}

bool EsObject::getBool(const std::string& key, bool defaultValue){
	auto obj = this->getEsEntity(key);
	if (obj){
		if (obj->type == es::EsObjectIndicatorType::EsObjectType_Bool){
			return ((EsPrimitive*)obj)->getBool();
		}
	}
	return defaultValue;
}

int8_t EsObject::getByte(const std::string& key, int8_t defaultValue){
	auto obj = this->getEsEntity(key);
	if (obj){
		if (obj->type == es::EsObjectIndicatorType::EsObjectType_Byte){
			return ((EsPrimitive*)obj)->getByte();
		}
	}
	return defaultValue;
}

int16_t EsObject::getShort(const std::string& key, int16_t defaultValue){
	auto obj = this->getEsEntity(key);
	if (obj){
		if (obj->type == es::EsObjectIndicatorType::EsObjectType_Short){
			return ((EsPrimitive*)obj)->getShort();
		}
	}
	return defaultValue;
}

int32_t EsObject::getInt(const std::string& key, int32_t defaultValue){
	auto obj = this->getEsEntity(key);
	if (obj){
		if (obj->type == es::EsObjectIndicatorType::EsObjectType_Integer){
			return ((EsPrimitive*)obj)->getInt();
		}
	}
	return defaultValue;
}

int64_t EsObject::getLong(const std::string& key, int64_t defaultValue){
	auto obj = this->getEsEntity(key);
	if (obj){
		if (obj->type == es::EsObjectIndicatorType::EsObjectType_Long){
			return ((EsPrimitive*)obj)->getLong();
		}
	}
	return defaultValue;
}

float EsObject::getFloat(const std::string& key, float defaultValue){
	auto obj = this->getEsEntity(key);
	if (obj){
		if (obj->type == es::EsObjectIndicatorType::EsObjectType_Float){
			return ((EsPrimitive*)obj)->getFloat();
		}
	}
	return defaultValue;
}

double EsObject::getDouble(const std::string& key, double defaultValue){
	auto obj = this->getEsEntity(key);
	if (obj){
		if (obj->type == es::EsObjectIndicatorType::EsObjectType_Double){
			return ((EsPrimitive*)obj)->getDouble();
		}
	}
	return defaultValue;
}

const std::string& EsObject::getString(const std::string& key, const std::string& defaultValue){
	auto obj = this->getEsEntity(key);
	if (obj){
		if (obj->type == es::EsObjectIndicatorType::EsObjectType_String){
			return ((EsString*)obj)->getString();
		}
	}
	return defaultValue;
}

EsObject* EsObject::getEsObject(const std::string& key, EsObject* defaultValue){
	auto obj = this->getEsEntity(key);
	if (obj){
		return ((EsObject*)obj);
	}
	return defaultValue;
}

EsArray* EsObject::getEsArray(const std::string& key, EsArray* defaultValue){
	auto obj = this->getEsEntity(key);
	if (obj){
		return ((EsArray*)obj);
	}
	return defaultValue;
}

void EsObject::setBool(const std::string& key, bool value){
	auto obj = new EsPrimitive();
	obj->setBool(value);
	this->setEsEntity(key, obj);
}

void EsObject::setByte(const std::string& key, int8_t value){
	auto obj = new EsPrimitive();
	obj->setByte(value);
	this->setEsEntity(key, obj);
}

void EsObject::setShort(const std::string& key, int16_t value){
	auto obj = new EsPrimitive();
	obj->setShort(value);
	this->setEsEntity(key, obj);
}

void EsObject::setInt(const std::string& key, int32_t value){
	auto obj = new EsPrimitive();
	obj->setInt(value);
	this->setEsEntity(key, obj);
}

void EsObject::setLong(const std::string& key, int64_t value){
	auto obj = new EsPrimitive();
	obj->setLong(value);
	this->setEsEntity(key, obj);
}

void EsObject::setFloat(const std::string& key, float value){
	auto obj = new EsPrimitive();
	obj->setFloat(value);
	this->setEsEntity(key, obj);
}

void EsObject::setDouble(const std::string& key, double value){
	auto obj = new EsPrimitive();
	obj->setDouble(value);
	this->setEsEntity(key, obj);
}

void EsObject::setString(const std::string& key, const std::string& value){
	auto obj = new EsString();
	obj->setString(value);
	this->setEsEntity(key, obj);
}

EsObject* EsObject::setEsObject(const std::string& key, EsObject* value){
	if (!value){
		value = new EsObject();
	}
	this->setEsEntity(key, value);
	return value;
}

EsArray* EsObject::setEsArray(const std::string& key, EsArray* value){
	if (!value){
		value = new EsArray();
	}
	this->setEsEntity(key, value);
	return value;
}

} /* namespace es */
