/*
 * SFSArray.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "SFSArray.h"
#include "SFSObject.h"
#include "SFSPrimitive.h"

namespace SFS{
namespace Entity{

inline void __sfsarray_print_padding(int padding, std::ostringstream& os){
	for (int i = 0; i < padding; i++){
		os << " ";
	}
}

SFSArray::SFSArray() {
	// TODO Auto-generated constructor stub
	dataType = SFSDataType::SFSDATATYPE_SFS_ARRAY;
}

SFSArray::~SFSArray() {
	// TODO Auto-generated destructor stub
	for (int i = 0; i < mData.size(); i++){
		mData[i]->release();
	}
	mData.clear();
}

void SFSArray::toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator){
	value.SetArray();
	for (int i = 0; i < mData.size(); i++){
		rapidjson::Value obj;
		mData[i]->toValue(obj, allocator);
		value.PushBack(obj, allocator);
	}
}

SFSArray* SFSArray::create(){
	auto arr = new SFSArray();
	arr->autoRelease();
	return arr;
}

#ifdef SFS_LOGGER
void SFSArray::printDebug(std::ostringstream& os, int padding){
	switch (dataType)
	{
	case SFSDATATYPE_BOOL_ARRAY:{
		os << "(bool_array)[" << mData.size() <<"] : ";
		for (int i = 0; i < mData.size(); i++){
			os << ((SFSPrimitive*)mData[i])->getBool() << " ";
		}
		break;
	}
	case SFSDATATYPE_BYTE_ARRAY:{
		os << "(byte_array)[" << mData.size() << "] : ";
		for (int i = 0; i < mData.size(); i++){
			os << (int)(((SFSPrimitive*)mData[i])->getByte()) << " ";
		}
		break;
	}
	case SFSDATATYPE_SHORT_ARRAY:{
		os << "(short_array)[" << mData.size() << "] : ";
		for (int i = 0; i < mData.size(); i++){
			os << ((SFSPrimitive*)mData[i])->getShort() << " ";
		}
		break;
	}
	case SFSDATATYPE_INT_ARRAY:{
		os << "(int_array)[" << mData.size() << "] : ";
		for (int i = 0; i < mData.size(); i++){
			os << ((SFSPrimitive*)mData[i])->getInt() << " ";
		}
		break;
	}
	case SFSDATATYPE_LONG_ARRAY:{
		os << "(long_array)[" << mData.size() << "] : ";
		for (int i = 0; i < mData.size(); i++){
			os << ((SFSPrimitive*)mData[i])->getLong() << " ";
		}
		break;
	}
	case SFSDATATYPE_FLOAT_ARRAY:{
		os << "(float_array)[" << mData.size() << "] : ";
		for (int i = 0; i < mData.size(); i++){
			os << ((SFSPrimitive*)mData[i])->getFloat() << " ";
		}
		break;
	}
	case SFSDATATYPE_DOUBLE_ARRAY:{
		os << "(double_array)[" << mData.size() << "] : ";
		for (int i = 0; i < mData.size(); i++){
			os << ((SFSPrimitive*)mData[i])->getDouble() << " ";
		}
		break;
	}
	case SFSDATATYPE_STRING_ARRAY:{
		os << "(string_array)[" << mData.size() << "]" << std::endl;
		__sfsarray_print_padding(padding, os);
		os << "{" << std::endl;

		for (int i = 0; i < mData.size(); i++){
			__sfsarray_print_padding(padding + 3, os);
			os << ((SFSString*)mData[i])->getString() << std::endl;
		}
		__sfsarray_print_padding(padding, os);
		os << "}";
		break;
	}
	case SFSDATATYPE_SFS_ARRAY:{
		__sfsarray_print_padding(padding, os);
		os << "(sfs_array)[" << mData.size() << "]" << std::endl;
		__sfsarray_print_padding(padding, os);
		os << "{" << std::endl;

		for (int i = 0; i < mData.size(); i++){
			if (mData[i]->dataType != SFS::Entity::SFSDataType::SFSDATATYPE_SFS_ARRAY
				&& mData[i]->dataType != SFS::Entity::SFSDataType::SFSDATATYPE_SFS_OBJECT){
				__sfsarray_print_padding(padding + 3, os);
			}
			mData[i]->printDebug(os, padding + 3);
			os << std::endl;
		}

		__sfsarray_print_padding(padding, os);
		os << "}";
		break;
	}
		
	}
}
#endif

void SFSArray::writeToBuffer(StreamWriter* writer){
	writer->WriteByte(dataType);
	//writer->WriteShort(mData.size());
    if(dataType == SFSDATATYPE_BYTE_ARRAY){
        writer->WriteInt(mData.size());
    }
    else{
        writer->WriteShort(mData.size());
    }
    
	switch (dataType){
		case SFSDATATYPE_BOOL_ARRAY:{
			for (int i = 0; i < mData.size(); i++){
				writer->WriteBool(this->getBool(i));
			}

			break;
		}
		case SFSDATATYPE_BYTE_ARRAY:{
			for (int i = 0; i < mData.size(); i++){
				writer->WriteByte(this->getByte(i));
			}

			break;
		}
		case SFSDATATYPE_SHORT_ARRAY:{
			for (int i = 0; i < mData.size(); i++){
				writer->WriteShort(this->getShort(i));
			}

			break;
		}
		case SFSDATATYPE_INT_ARRAY:{
			for (int i = 0; i < mData.size(); i++){
				writer->WriteInt(this->getInt(i));
			}

			break;
		}
		case SFSDATATYPE_LONG_ARRAY:{
			for (int i = 0; i < mData.size(); i++){
				writer->WriteLong(this->getLong(i));
			}

			break;
		}
		case SFSDATATYPE_FLOAT_ARRAY:{
			for (int i = 0; i < mData.size(); i++){
				writer->WriteFloat(this->getFloat(i));
			}

			break;
		}
		case SFSDATATYPE_DOUBLE_ARRAY:{
			for (int i = 0; i < mData.size(); i++){
				writer->WriteDouble(this->getDouble(i));
			}

			break;
		}
		case SFSDATATYPE_STRING_ARRAY:{
			for (int i = 0; i < mData.size(); i++){
				writer->WriteString(this->getString(i));
			}

			break;
		}
		case SFSDATATYPE_SFS_ARRAY:{
			for (int i = 0; i < mData.size(); i++){
				mData[i]->writeToBuffer(writer);
			}

			break;
		}
	}
}

void SFSArray::initWithReader(StreamReader* reader){
    int size = 0;
    if(dataType == SFSDATATYPE_BYTE_ARRAY){
        size = reader->NextInt();
    }
    else{
        size = reader->NextShort();
    }
	switch (dataType){
		case SFSDATATYPE_BOOL_ARRAY:{
			for (int i = 0; i < size; i++){
				auto item = new SFSPrimitive();
				item->setBool(reader->NextBool());
				this->addItem(item);
				item->release();
			}
			
			break;
		}
		case SFSDATATYPE_BYTE_ARRAY:{
			for (int i = 0; i < size; i++){
				auto item = new SFSPrimitive();
				item->setByte(reader->NextByte());
				this->addItem(item);
				item->release();
			}

			break;
		}
		case SFSDATATYPE_SHORT_ARRAY:{
			for (int i = 0; i < size; i++){
				auto item = new SFSPrimitive();
				item->setShort(reader->NextShort());
				this->addItem(item);
				item->release();
			}

			break;
		}
		case SFSDATATYPE_INT_ARRAY:{
			for (int i = 0; i < size; i++){
				auto item = new SFSPrimitive();
				item->setInt(reader->NextInt());
				this->addItem(item);
				item->release();
			}

			break;
		}
		case SFSDATATYPE_LONG_ARRAY:{
			for (int i = 0; i < size; i++){
				auto item = new SFSPrimitive();
				item->setLong(reader->NextLong());
				this->addItem(item);
				item->release();
			}

			break;
		}
		case SFSDATATYPE_FLOAT_ARRAY:{
			for (int i = 0; i < size; i++){
				auto item = new SFSPrimitive();
				item->setFloat(reader->NextFloat());
				this->addItem(item);
				item->release();
			}

			break;
		}
		case SFSDATATYPE_DOUBLE_ARRAY:{
			for (int i = 0; i < size; i++){
				auto item = new SFSPrimitive();
				item->setDouble(reader->NextDouble());
				this->addItem(item);
				item->release();
			}

			break;
		}
		case SFSDATATYPE_STRING_ARRAY:{
			for (int i = 0; i < size; i++){
				auto item = new SFSString();
				item->setString(reader->NextString());
				this->addItem(item);
				item->release();
			}

			break;
		}
		case SFSDATATYPE_SFS_ARRAY:{
			for (int i = 0; i < size; i++){
				auto item = createSFSEntityWithReader(reader);
				this->addItem(item);
			}

			break;
		}
	} 
}

void SFSArray::addItem(SFSEntity* data){
	mData.push_back(data);
	data->retain();
}

SFSEntity* SFSArray::getItem(int index){
	return mData[index];
}

int SFSArray::size(){
	return mData.size();
}

//std::vector<bool> SFSArray::getBoolArray(){
//	std::vector<bool> pret;
//	for (int i = 0; i < mData.size(); i++){
//		pret.push_back(((SFSPrimitive*)mData[i])->getBool());
//	}
//	return pret;
//}
//
//std::vector<char> SFSArray::getByteArray(){
//	std::vector<char> pret;
//	for (int i = 0; i < mData.size(); i++){
//		pret.push_back(((SFSPrimitive*)mData[i])->getInt());
//	}
//	return pret;
//}
//
//std::vector<int16_t> SFSArray::getShortArray(){
//	std::vector<int16_t> pret;
//	for (int i = 0; i < mData.size(); i++){
//		pret.push_back(((SFSPrimitive*)mData[i])->getShort());
//	}
//	return pret;
//}
//
//std::vector<int32_t> SFSArray::getIntArray(){
//	std::vector<int32_t> pret;
//	for (int i = 0; i < mData.size(); i++){
//		pret.push_back(((SFSPrimitive*)mData[i])->getInt());
//	}
//	return pret;
//}
//
//std::vector<int64_t> SFSArray::getLongArray(){
//	std::vector<int64_t> pret;
//	for (int i = 0; i < mData.size(); i++){
//		pret.push_back(((SFSPrimitive*)mData[i])->getLong());
//	}
//	return pret;
//}
//
//std::vector<float> SFSArray::getFloatArray(){
//	std::vector<float> pret;
//	for (int i = 0; i < mData.size(); i++){
//		pret.push_back(((SFSPrimitive*)mData[i])->getFloat());
//	}
//	return pret;
//}
//
//std::vector<double> SFSArray::getDoubleArray(){
//	std::vector<double> pret;
//	for (int i = 0; i < mData.size(); i++){
//		pret.push_back(((SFSPrimitive*)mData[i])->getDouble());
//	}
//	return pret;
//}
//
//std::vector<std::string> SFSArray::getStringArray(){
//	std::vector<std::string> pret;
//	for (int i = 0; i < mData.size(); i++){
//		pret.push_back(((SFSString*)mData[i])->getString());
//	}
//	return pret;
//}
//
//void SFSArray::setBoolArray(const std::vector<bool>& arr){
//	dataType = SFSDataType::SFSDATATYPE_BOOL_ARRAY;
//	for (int i = 0; i < arr.size(); i++){
//		auto item = new SFSPrimitive();
//		item->setBool(arr[i]);
//		this->addItem(item);
//		item->release();
//	}
//}
//
//void SFSArray::setByteArray(const std::vector<char>& arr){
//	dataType = SFSDataType::SFSDATATYPE_BYTE_ARRAY;
//	for (int i = 0; i < arr.size(); i++){
//		auto item = new SFSPrimitive();
//		item->setByte(arr[i]);
//		this->addItem(item);
//		item->release();
//	}
//}
//
//void SFSArray::setShortArray(const std::vector<int16_t>& arr){
//	dataType = SFSDataType::SFSDATATYPE_SHORT_ARRAY;
//	for (int i = 0; i < arr.size(); i++){
//		auto item = new SFSPrimitive();
//		item->setShort(arr[i]);
//		this->addItem(item);
//		item->release();
//	}
//}
//
//void SFSArray::setIntArray(const std::vector<int32_t>& arr){
//	dataType = SFSDataType::SFSDATATYPE_INT_ARRAY;
//	for (int i = 0; i < arr.size(); i++){
//		auto item = new SFSPrimitive();
//		item->setInt(arr[i]);
//		this->addItem(item);
//		item->release();
//	}
//}
//
//void SFSArray::setLongArray(const std::vector<int64_t>& arr){
//	dataType = SFSDataType::SFSDATATYPE_LONG_ARRAY;
//	for (int i = 0; i < arr.size(); i++){
//		auto item = new SFSPrimitive();
//		item->setLong(arr[i]);
//		this->addItem(item);
//		item->release();
//	}
//}
//
//void SFSArray::setFloatArray(const std::vector<float>& arr){
//	dataType = SFSDataType::SFSDATATYPE_FLOAT_ARRAY;
//	for (int i = 0; i < arr.size(); i++){
//		auto item = new SFSPrimitive();
//		item->setFloat(arr[i]);
//		this->addItem(item);
//		item->release();
//	}
//}
//
//void SFSArray::setDoubleArray(const  std::vector<double>& arr){
//	dataType = SFSDataType::SFSDATATYPE_DOUBLE_ARRAY;
//	for (int i = 0; i < arr.size(); i++){
//		auto item = new SFSPrimitive();
//		item->setDouble(arr[i]);
//		this->addItem(item);
//		item->release();
//	}
//}
//
//void SFSArray::setStringArray(const std::vector<std::string>& arr){
//	dataType = SFSDataType::SFSDATATYPE_STRING_ARRAY;
//	for (int i = 0; i < arr.size(); i++){
//		auto item = new SFSString();
//		item->setString(arr[i]);
//		this->addItem(item);
//		item->release();
//	}
//}

bool SFSArray::getBool(int index){
	return ((SFSPrimitive*)getItem(index))->getBool();
}

char SFSArray::getByte(int index){
	return ((SFSPrimitive*)getItem(index))->getByte();
}

int16_t SFSArray::getShort(int index){
	return ((SFSPrimitive*)getItem(index))->getShort();
}

int32_t SFSArray::getInt(int index){
	return ((SFSPrimitive*)getItem(index))->getInt();
}

int64_t SFSArray::getLong(int index){
	return ((SFSPrimitive*)getItem(index))->getLong();
}

float SFSArray::getFloat(int index){
	return ((SFSPrimitive*)getItem(index))->getFloat();
}

double SFSArray::getDouble(int index){
	return ((SFSPrimitive*)getItem(index))->getDouble();
}

std::string SFSArray::getString(int index){
	return ((SFSString*)getItem(index))->getString();
}

SFSObject* SFSArray::getSFSObject(int index){
	return (SFSObject*) getItem(index);
}

SFSArray* SFSArray::getSFSArray(int index){
	return (SFSArray*)getItem(index);
}

void SFSArray::addBool(bool b){
	auto item = new SFSPrimitive();
	item->setBool(b);
	this->addItem(item);
	item->release();
}

void SFSArray::addByte(char c){
	auto item = new SFSPrimitive();
	item->setByte(c);
	this->addItem(item);
	item->release();
}

void SFSArray::addShort(int16_t i16){
	auto item = new SFSPrimitive();
	item->setShort(i16);
	this->addItem(item);
	item->release();
}

void SFSArray::addInt(int32_t i32){
	auto item = new SFSPrimitive();
	item->setInt(i32);
	this->addItem(item);
	item->release();
}

void SFSArray::addLong(int64_t i64){
	auto item = new SFSPrimitive();
	item->setLong(i64);
	this->addItem(item);
	item->release();
}

void SFSArray::addFloat(float f){
	auto item = new SFSPrimitive();
	item->setFloat(f);
	this->addItem(item);
	item->release();
}

void SFSArray::addDouble(double d){
	auto item = new SFSPrimitive();
	item->setDouble(d);
	this->addItem(item);
	item->release();
}

void SFSArray::addString(const std::string& str){
	auto item = new SFSString();
	item->setString(str);
	this->addItem(item);
	item->release();
}

SFSObject* SFSArray::addSFSObject(SFSObject* obj){
	if (!obj){
		obj = new SFSObject();
		this->addItem(obj);
		obj->release();
	}
	else{
		this->addItem(obj);
	}
	return obj;
}

SFSArray* SFSArray::addSFSArray(SFSArray* arr){
	if (!arr){
		arr = new SFSArray();
		this->addItem(arr);
		arr->release();
	}
	else{
		this->addItem(arr);
	}
	return arr;
}


}
}

