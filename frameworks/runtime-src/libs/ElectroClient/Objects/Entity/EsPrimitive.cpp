/*
 * EsPrimitive.cpp
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#include "EsPrimitive.h"

namespace es {


EsPrimitive::EsPrimitive(){
	this->setInt(0);
}

EsPrimitive::~EsPrimitive(){

}

void EsPrimitive::writeToBuffer(EsMessageWriter* writer){
	switch (type)
	{
	case EsObjectType_Integer:{
		writer->writeInt(mData.intValue);
		break;
	}
	case EsObjectType_Float:{
		writer->writeFloat(mData.floatValue);
		break;
	}
	case EsObjectType_Double:{
		writer->writeDouble(mData.doubleValue);
		break;
	}	
	case EsObjectType_Bool:{
		writer->writeBool(mData.boolValue);
		break;
	}
	case EsObjectType_Byte:{
		writer->writeByte(mData.byteValue);
		break;
	}
	case EsObjectType_Long:{
		writer->writeLong(mData.longValue);
		break;
	}
	case EsObjectType_Short:{
		writer->writeShort(mData.shortValue);
		break;
	}
	}
}

void EsPrimitive::readFromBuffer(EsMessageReader* reader){
	switch (type)
	{
		case EsObjectType_Integer:{
			mData.intValue = reader->nextInt();
			break;
		}
		case EsObjectType_Double:{
			mData.doubleValue = reader->nextDouble();
			break;
		}
		case EsObjectType_Float:{
			mData.floatValue = reader->nextFloat();
			break;
		}
		case EsObjectType_Bool:{
			mData.boolValue = reader->nextBool();
			break;
		}
		case EsObjectType_Byte:{
			mData.byteValue = reader->nextByte(); 
			break;
		}
		case EsObjectType_Long:{
			mData.longValue = reader->nextLong();
			break;
		}
		case EsObjectType_Short:{
			mData.shortValue = reader->nextShort();
			break;
		}
	}
}

void EsPrimitive::toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator){
	switch (type)
	{
		case EsObjectType_Bool:{
			value.SetBool(mData.boolValue);
			break;
		}
		case EsObjectType_Integer:{
			value.SetInt(mData.intValue);
			break;
		}
		case EsObjectType_Double:{
			value.SetDouble(mData.doubleValue);
			break;
		}
		case EsObjectType_Float:{
			value.SetDouble(mData.floatValue);
			break;
		}
		case EsObjectType_Byte:{
			value.SetInt(mData.byteValue);
			break;
		}
		case EsObjectType_Long:{
			value.SetInt64(mData.longValue);
			break;;
		}
		case EsObjectType_Short:{
			value.SetInt(mData.shortValue);
			break;
		}
	}
}

#ifdef ES_LOGGER
void EsPrimitive::printDebugToBuffer(std::ostringstream &outStream, int padding){
	switch (type)
	{	
		case EsObjectType_Bool:{
			outStream << "[bool] " << (mData.boolValue ? "TRUE" : "FALSE");
			break;
		}
		case EsObjectType_Integer:{
			outStream << "[int] " << mData.intValue;
			break;
		}
		case EsObjectType_Double:{
			outStream << "[double] " << mData.doubleValue;
			break;
		}
		case EsObjectType_Float:{
			outStream << "[float] " << mData.floatValue;
			break;
		}
		case EsObjectType_Byte:{
			outStream << "[byte] " << (int)mData.byteValue;
			break;
		}
		case EsObjectType_Long:{
			outStream << "[long] " << mData.longValue;
			break;
		}
		case EsObjectType_Short:{
			outStream << "[short] " << mData.shortValue;
			break;
		}
	}
}
#endif

bool EsPrimitive::getBool(){
	return mData.boolValue;
}

int8_t EsPrimitive::getByte(){
	return mData.byteValue;
}

int16_t EsPrimitive::getShort(){
	return mData.shortValue;
}

int32_t EsPrimitive::getInt(){
	return mData.intValue;
}

int64_t EsPrimitive::getLong(){
	return mData.longValue;
}

float EsPrimitive::getFloat(){
	return mData.floatValue;
}

double EsPrimitive::getDouble(){
	return mData.doubleValue;
}

void EsPrimitive::setBool(bool value){
	type = es::EsObjectIndicatorType::EsObjectType_Bool;
	mData.boolValue = value;
}

void EsPrimitive::setByte(int8_t value){
	type = es::EsObjectIndicatorType::EsObjectType_Byte;
	mData.byteValue = value;
}

void EsPrimitive::setShort(int16_t value){
	type = es::EsObjectIndicatorType::EsObjectType_Short;
	mData.shortValue = value;
}

void EsPrimitive::setInt(int32_t value){
	type = es::EsObjectIndicatorType::EsObjectType_Integer;
	mData.intValue = value;
}

void EsPrimitive::setLong(int64_t value){
	type = es::EsObjectIndicatorType::EsObjectType_Long;
	mData.longValue = value;
}

void EsPrimitive::setFloat(float value){
	type = es::EsObjectIndicatorType::EsObjectType_Float;
	mData.floatValue = value;
}

void EsPrimitive::setDouble(double value){
	type = es::EsObjectIndicatorType::EsObjectType_Double;
	mData.doubleValue = value;
}
	
/****/

EsString::EsString(){
	type = es::EsObjectIndicatorType::EsObjectType_String;
	mData = "";
}

EsString::~EsString(){

}

void EsString::writeToBuffer(EsMessageWriter* writer){
	writer->writeString(mData);
}

void EsString::toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator){
	value.SetString(mData, allocator);
}

void EsString::readFromBuffer(EsMessageReader* reader){
	mData = reader->nextString();
}

#ifdef ES_LOGGER
void EsString::printDebugToBuffer(std::ostringstream &outStream, int padding){
	outStream << "[string] " << mData;
}
#endif

void EsString::setString(const std::string& data){
	mData = data;
}

const std::string& EsString::getString(){
	return mData;
}
   
} /* namespace es */
