/*
 * EsArray.cpp
 *
 *  Created on: Jan 21, 2016
 *      Author: QuyetNguyen
 */

#include "EsArray.h"
#include "EsPrimitive.h"
#include "EsObject.h"

namespace es {

EsArray::EsArray(){
	type = es::EsObjectIndicatorType::EsObjectType_EsObjectArray;
}

EsArray::~EsArray(){
	for (int i = 0; i < mData.size(); i++){
		delete mData[i];
	}
	mData.clear();
}

void EsArray::writeToBuffer(EsMessageWriter* writer){
	writer->writeLength(mData.size());
	for (int i = 0; i < mData.size(); i++){
		mData[i]->writeToBuffer(writer);
	}
}

void EsArray::readFromBuffer(EsMessageReader* reader){
	int size = reader->nextLength();
	mData.reserve(size);
	for (int i = 0; i < size;i++){
		EsEntity* obj = 0;
		switch (type)
		{
			case EsObjectType_IntegerArray:{
				obj = new EsPrimitive();
				obj->type = EsObjectType_Integer;
				break;
			}
			case EsObjectType_DoubleArray:{
				obj = new EsPrimitive();
				obj->type = EsObjectType_Double;
				break;
			}
			case EsObjectType_FloatArray:{
				obj = new EsPrimitive();
				obj->type = EsObjectType_Float;
				break;
			}
			case EsObjectType_BoolArray:{
				obj = new EsPrimitive();
				obj->type = EsObjectType_Bool;
				break;
			}
			case EsObjectType_ByteArray:{
				obj = new EsPrimitive();
				obj->type = EsObjectType_Byte;
				break;
			}
			case EsObjectType_LongArray:{
				obj = new EsPrimitive();
				obj->type = EsObjectType_Long;
				break;
			}
			case EsObjectType_ShortArray:{
				obj = new EsPrimitive();
				obj->type = EsObjectType_Short;
				break;
			}
			case EsObjectType_StringArray:{
				obj = new EsString();
				break;
			}
			case EsObjectType_EsObjectArray:{
				obj = new EsObject();
				break;
			}			
		}
		if (obj){
			obj->readFromBuffer(reader);
			mData.push_back(obj);
		}
	}	
}

#ifdef ES_LOGGER
void EsArray::printDebugToBuffer(std::ostringstream &outStream, int padding){
	switch (type)
	{
		case EsObjectType_IntegerArray:{
			outStream << "[IntArray](" << mData.size() << ") ";
			for (int i = 0; i < mData.size(); i++){
				outStream << ((EsPrimitive*)mData[i])->getInt() << " ";
				outStream << "\n";
			}
			break;
		}
		case EsObjectType_DoubleArray:{
			outStream << "[DoubleArray](" << mData.size() << ") ";
			for (int i = 0; i < mData.size(); i++){
				outStream << ((EsPrimitive*)mData[i])->getDouble() << " ";
				outStream << "\n";
			}
			break;
		}
		case EsObjectType_FloatArray:{
			outStream << "[FloatArray](" << mData.size() << ") ";
			for (int i = 0; i < mData.size(); i++){
				outStream << ((EsPrimitive*)mData[i])->getFloat() << " ";
				outStream << "\n";
			}
			break;
		}
		case EsObjectType_BoolArray:{
			outStream << "[BoolArray](" << mData.size() << ") ";
			for (int i = 0; i < mData.size(); i++){
				outStream << (((EsPrimitive*)mData[i])->getBool() ? "TRUE":"FALSE") << " ";
				outStream << "\n";
			}
			break;
		}
		case EsObjectType_ByteArray:{
			outStream << "[ByteArray](" << mData.size() << ") ";
			for (int i = 0; i < mData.size(); i++){
				outStream << ((int)((EsPrimitive*)mData[i])->getByte()) << " ";
				outStream << "\n";
			}
			break;
		}
		case EsObjectType_LongArray:{
			outStream << "[LongArray](" << mData.size() << ") ";
			for (int i = 0; i < mData.size(); i++){
				outStream << ((EsPrimitive*)mData[i])->getLong() << " ";
				outStream << "\n";
			}
			break;
		}
		case EsObjectType_ShortArray:{
			outStream << "[ShortArray](" << mData.size() << ") ";
			for (int i = 0; i < mData.size(); i++){
				outStream << ((EsPrimitive*)mData[i])->getShort() << " ";
				outStream << "\n";
			}
			break;
		}
		case EsObjectType_StringArray:{
			outStream << "[StringArray](" << mData.size() << ") ";
			for (int i = 0; i < mData.size(); i++){
				outStream << ((EsString*)mData[i])->getString() << " ";
				outStream << "\n";
			}
			break;
		}
		case EsObjectType_EsObjectArray:{
			outStream << "[EsArray](" << mData.size() << ")[\n";
			for (int i = 0; i < mData.size(); i++){
				((EsObject*)mData[i])->printDebugToBuffer(outStream, padding + 1);
				outStream << "\n";
			}
			this->printPadding(outStream, padding);
			outStream << "]";
			break;
		}
	}
}
#endif

void EsArray::toJson(rapidjson::Value& value, rapidjson::Document::AllocatorType &allocator){
	value.SetArray();
	for (int i = 0; i < mData.size(); i++){
		rapidjson::Value childValue;
		mData[i]->toJson(childValue, allocator);
		value.PushBack(childValue, allocator);
	}
}

EsEntity* EsArray::getEntity(int index){
	return mData[index];
}

void EsArray::addEntity(EsEntity* data){
	mData.push_back(data);
}

bool EsArray::getBool(int index){
	return ((EsPrimitive*)getEntity(index))->getBool();
}

int8_t EsArray::getByte(int index){
	return ((EsPrimitive*)getEntity(index))->getByte();
}

int16_t EsArray::getShort(int index){
	return ((EsPrimitive*)getEntity(index))->getShort();
}

int32_t EsArray::getInt(int index){
	return ((EsPrimitive*)getEntity(index))->getInt();
}

int64_t EsArray::getLong(int index){
	return ((EsPrimitive*)getEntity(index))->getLong();
}

float EsArray::getFloat(int index){
	return ((EsPrimitive*)getEntity(index))->getFloat();
}

double EsArray::getDouble(int index){
	return ((EsPrimitive*)getEntity(index))->getDouble();
}

const std::string& EsArray::getString(int index){
	return ((EsString*)getEntity(index))->getString();
}

EsObject* EsArray::getEsObject(int index){
	return ((EsObject*)getEntity(index));
}

void EsArray::setBoolArray(const std::vector<bool>& data){
	type = es::EsObjectIndicatorType::EsObjectType_BoolArray;
	for (int i = 0; data.size(); i++){
		auto obj = new EsPrimitive();
		obj->setBool(data[i]);
		this->addEntity(obj);
	}
}

void EsArray::setByteArray(const std::vector<int8_t>& data){
	type = es::EsObjectIndicatorType::EsObjectType_ByteArray;
	for (int i = 0; data.size(); i++){
		auto obj = new EsPrimitive();
		obj->setByte(data[i]);
		this->addEntity(obj);
	}
}

void EsArray::setShortArray(const std::vector<int16_t>& data){
	type = es::EsObjectIndicatorType::EsObjectType_ShortArray;
	for (int i = 0; data.size(); i++){
		auto obj = new EsPrimitive();
		obj->setShort(data[i]);
		this->addEntity(obj);
	}
}

void EsArray::setIntArray(const std::vector<int32_t>& data){
	type = es::EsObjectIndicatorType::EsObjectType_IntegerArray;
	for (int i = 0; data.size(); i++){
		auto obj = new EsPrimitive();
		obj->setInt(data[i]);
		this->addEntity(obj);
	}
}

void EsArray::setLongArray(const std::vector<int64_t>& data){
	type = es::EsObjectIndicatorType::EsObjectType_LongArray;
	for (int i = 0; data.size(); i++){
		auto obj = new EsPrimitive();
		obj->setLong(data[i]);
		this->addEntity(obj);
	}
}

void EsArray::setFloatArray(const std::vector<float>& data){
	type = es::EsObjectIndicatorType::EsObjectType_FloatArray;
	for (int i = 0; data.size(); i++){
		auto obj = new EsPrimitive();
		obj->setFloat(data[i]);
		this->addEntity(obj);
	}
}

void EsArray::setDoubleArray(const std::vector<double>& data){
	type = es::EsObjectIndicatorType::EsObjectType_DoubleArray;
	for (int i = 0; data.size(); i++){
		auto obj = new EsPrimitive();
		obj->setDouble(data[i]);
		this->addEntity(obj);
	}
}

void EsArray::setStringArray(const std::vector<std::string>& data){
	type = es::EsObjectIndicatorType::EsObjectType_StringArray;
	for (int i = 0; data.size(); i++){
		auto obj = new EsString();
		obj->setString(data[i]);
		this->addEntity(obj);
	}
}

void EsArray::push(EsObject* esObject){
	this->addEntity(esObject);
}

} /* namespace es */
