/*
 * SFSObject.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "SFSObject.h"
#include "SFSArray.h"
#include "SFSPrimitive.h"
#include "../Logger/SFSLogger.h"

namespace SFS{
namespace Entity{

SFSObject::SFSObject() {
	// TODO Auto-generated constructor stub
	dataType = SFSDataType::SFSDATATYPE_SFS_OBJECT;
}

SFSObject::~SFSObject() {
	// TODO Auto-generated destructor stub
	for (auto it = mData.begin(); it != mData.end(); it++){
		it->second->release();
	}
	mData.clear();
}

void SFSObject::toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator){
	value.SetObject();
	for (auto it = mData.begin(); it != mData.end(); it++){
		rapidjson::Value key(it->first, allocator);

		rapidjson::Value obj;
		it->second->toValue(obj, allocator);
		value.AddMember(key, obj, allocator);
	}
}

int SFSObject::size(){
	return mData.size();
}

void SFSObject::writeToBuffer(StreamWriter* writer){
	//write type
	SFSEntity::writeToBuffer(writer);
	writer->WriteShort(mData.size());

	for (auto it = mData.begin(); it != mData.end(); it++){
		//write key
		writer->WriteString(it->first);

		//write type
/*		if (it->second->dataType != SFSDataType::SFSDATATYPE_SFS_OBJECT &&
			it->second->dataType != SFSDataType::SFSDATATYPE_SFS_ARRAY){
			writer->WriteByte(it->second->dataType);
		}	*/	

		//write data
		it->second->writeToBuffer(writer);
	}
}

void SFSObject::initWithReader(StreamReader* reader){
	int size = reader->NextShort();
	for (int i = 0; i < size; i++){
		std::string key = reader->NextString();
		auto item = this->createSFSEntityWithReader(reader);
		this->setItem(key, item);
		item->release();
	}
}

#ifdef SFS_LOGGER
void SFSObject::printDebug(std::ostringstream& os, int padding){
	os << "(SFSObject)" << std::endl;

	std::string strPadding = "";
	for (int i = 0; i < padding; i++){
		strPadding += " ";
	}
	os << strPadding << "{" << std::endl;

	//print padding
	for (auto it = mData.begin(); it != mData.end(); it++){
		for (int i = 0; i < padding + 3; i++){
			os << " ";
		}
		os << it->first << ":";
		if (it->second->dataType == SFS::Entity::SFSDataType::SFSDATATYPE_SFS_ARRAY){
			os << std::endl;
		}
		it->second->printDebug(os, padding + it->first.size() + 4);
		os << std::endl;
	}

	os << strPadding << "}";
}
#endif

bool SFSObject::isExistKey(const std::string& key){
	auto it = mData.find(key);
	if (it == mData.end()){
		return false;
	}
	return true;
}

SFSEntity* SFSObject::getItem(const std::string& key){
	auto it = mData.find(key);
	if (it != mData.end()){
		return it->second;
	}
	return 0;
}

void SFSObject::setItem(const std::string& key, SFSEntity* data){
	auto it = mData.find(key);
	if (it != mData.end()){
		it->second->release();
		mData.erase(it);
	}

	mData.insert(std::make_pair(key, data));
	data->retain();
}

bool SFSObject::getBool(const std::string& key, bool defaultValue){
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_BOOL){
		return ((SFSPrimitive*)item)->getBool();
	}	
	return defaultValue;
}

char SFSObject::getByte(const std::string& key, char defaultValue){
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_BYTE){
		return ((SFSPrimitive*)item)->getByte();
	}
	return defaultValue;
}

int16_t SFSObject::getShort(const std::string& key, int16_t defaultValue){
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_SHORT){
		return ((SFSPrimitive*)item)->getShort();
	}
	return defaultValue;
}

int32_t SFSObject::getInt(const std::string& key, int32_t defaultValue){
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_INT){
		return ((SFSPrimitive*)item)->getInt();
	}
	return defaultValue;
}

int64_t SFSObject::getLong(const std::string& key, int64_t defaultValue){
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_LONG){
		return ((SFSPrimitive*)item)->getLong();
	}
	return defaultValue;
}

float SFSObject::getFloat(const std::string& key, float defaultValue){
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_FLOAT){
		return ((SFSPrimitive*)item)->getFloat();
	}
	return defaultValue;
}

double SFSObject::getDouble(const std::string& key, double defaultValue){
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_DOUBLE){
		return ((SFSPrimitive*)item)->getDouble();
	}
	return defaultValue;
}

std::string SFSObject::getString(const std::string& key, const std::string& defaultValue){
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_STRING){
		return ((SFSString*)item)->getString();
	}
	return defaultValue;
}

SFSObject* SFSObject::getSFSObject(const std::string& key, SFSObject* defaultValue){
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_SFS_OBJECT){
		return ((SFSObject*)item);
	}
	return defaultValue;
}

std::vector<bool> SFSObject::getBoolArray(const std::string& key){
	std::vector<bool> pret;
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_BOOL_ARRAY){
		SFSArray* arr = (SFSArray*)item;
		for (int i = 0; i < arr->size(); i++){
			pret.push_back(arr->getBool(i));
		};
	}
	return pret;
}

std::vector<char> SFSObject::getByteArray(const std::string& key){
	std::vector<char> pret;
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_BYTE_ARRAY){
		SFSArray* arr = (SFSArray*)item;
		for (int i = 0; i < arr->size(); i++){
			pret.push_back(arr->getByte(i));
		};
	}
	return pret;
}

std::vector<int16_t> SFSObject::getShortArray(const std::string& key){
	std::vector<int16_t> pret;
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_SHORT_ARRAY){
		SFSArray* arr = (SFSArray*)item;
		for (int i = 0; i < arr->size(); i++){
			pret.push_back(arr->getShort(i));
		};
	}
	
	return pret;
}

std::vector<int32_t> SFSObject::getIntArray(const std::string& key){
	std::vector<int32_t> pret;
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_INT_ARRAY){
		SFSArray* arr = (SFSArray*) item;
		for (int i = 0; i < arr->size(); i++){
			pret.push_back(arr->getInt(i));
		};
	}
	return pret;
}

std::vector<int64_t> SFSObject::getLongArray(const std::string& key){
	std::vector<int64_t> pret;
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_LONG_ARRAY){
		SFSArray* arr = (SFSArray*)item;
		for (int i = 0; i < arr->size(); i++){
			pret.push_back(arr->getLong(i));
		};
	}
	return pret;
}

std::vector<float> SFSObject::getFloatArray(const std::string& key){
	std::vector<float> pret;
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_FLOAT_ARRAY){
		SFSArray* arr = (SFSArray*)item;
		for (int i = 0; i < arr->size(); i++){
			pret.push_back(arr->getFloat(i));
		};
	}
	return pret;
}

std::vector<double> SFSObject::getDoubleArray(const std::string& key){
	std::vector<double> pret;
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_DOUBLE_ARRAY){
		SFSArray* arr = (SFSArray*)item;
		for (int i = 0; i < arr->size(); i++){
			pret.push_back(arr->getDouble(i));
		};
	}
	return pret;
}

std::vector<std::string> SFSObject::getStringArray(const std::string& key){
	std::vector<std::string> pret;
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_STRING_ARRAY){
		SFSArray* arr = (SFSArray*)item;
		for (int i = 0; i < arr->size(); i++){
			pret.push_back(arr->getString(i));
		};
	}
	return pret;
}

SFSArray* SFSObject::getSFSArray(const std::string& key){
	auto item = getItem(key);
	if (item && item->dataType == SFSDataType::SFSDATATYPE_SFS_ARRAY){
		return ((SFSArray*)(item));
	}
	return 0;
}

/****/
void SFSObject::setBool(const std::string& key, bool value){
	auto item = new SFSPrimitive();
	item->setBool(value);
	this->setItem(key, item);
	item->release();
}

void SFSObject::setByte(const std::string& key, char value){
	auto item = new SFSPrimitive();
	item->setByte(value);
	this->setItem(key, item);
	item->release();
}

void SFSObject::setShort(const std::string& key, int16_t value){
	auto item = new SFSPrimitive();
	item->setShort(value);
	this->setItem(key, item);
	item->release();
}

void SFSObject::setInt(const std::string& key, int32_t value){
	auto item = new SFSPrimitive();
	item->setInt(value);
	this->setItem(key, item);
	item->release();
}

void SFSObject::setLong(const std::string& key, int64_t value){
	auto item = new SFSPrimitive();
	item->setLong(value);
	this->setItem(key, item);
	item->release();
}

void SFSObject::setFloat(const std::string& key, float value){
	auto item = new SFSPrimitive();
	item->setFloat(value);
	this->setItem(key, item);
	item->release();
}

void SFSObject::setDouble(const std::string& key, double value){
	auto item = new SFSPrimitive();
	item->setDouble(value);
	this->setItem(key, item);
	item->release();
}

void SFSObject::setString(const std::string& key, const std::string& value){
	auto item = new SFSString();
	item->setString(value);
	this->setItem(key, item);
	item->release();
}

SFSObject* SFSObject::setSFSObject(const std::string& key, SFSObject* object){
	if (object){
		this->setItem(key, object);
	}
	else{
		object = new SFSObject();
		this->setItem(key, object);
		object->release();	
	}
	return object;
}

void SFSObject::setBoolArray(const std::string& key, const std::vector<bool>& arr){
	auto item = new SFSArray();
	for (int i = 0; i < arr.size(); i++){
		item->addBool(arr[i]);
	}
	item->dataType == SFS::Entity::SFSDataType::SFSDATATYPE_BOOL_ARRAY;
	this->setItem(key, item);
	item->release();
}

void SFSObject::setByteArray(const std::string& key, const std::vector<char>& arr){
	auto item = new SFSArray();
	for (int i = 0; i < arr.size(); i++){
		item->addByte(arr[i]);
	}
	item->dataType == SFS::Entity::SFSDataType::SFSDATATYPE_BYTE_ARRAY;
	this->setItem(key, item);
	item->release();
}

void SFSObject::setShortArray(const std::string& key, const std::vector<int16_t>& arr){
	auto item = new SFSArray();
	for (int i = 0; i < arr.size(); i++){
		item->addShort(arr[i]);
	}
	item->dataType == SFS::Entity::SFSDataType::SFSDATATYPE_SHORT_ARRAY;
	this->setItem(key, item);
	item->release();
}

void SFSObject::setIntArray(const std::string& key, const std::vector<int32_t>& arr){
	auto item = new SFSArray();
	for (int i = 0; i < arr.size(); i++){
		item->addInt(arr[i]);
	}
	item->dataType == SFS::Entity::SFSDataType::SFSDATATYPE_INT_ARRAY;
	this->setItem(key, item);
	item->release();
}

void SFSObject::setLongArray(const std::string& key, const std::vector<int64_t>& arr){
	auto item = new SFSArray();
	for (int i = 0; i < arr.size(); i++){
		item->addLong(arr[i]);
	}
	item->dataType == SFS::Entity::SFSDataType::SFSDATATYPE_LONG_ARRAY;
	this->setItem(key, item);
	item->release();
}

void SFSObject::setFloatArray(const std::string& key, const std::vector<float>& arr){
	auto item = new SFSArray();
	for (int i = 0; i < arr.size(); i++){
		item->addFloat(arr[i]);
	}
	item->dataType == SFS::Entity::SFSDataType::SFSDATATYPE_FLOAT_ARRAY;
	this->setItem(key, item);
	item->release();
}

void SFSObject::setDoubleArray(const std::string& key, const std::vector<double>& arr){
	auto item = new SFSArray();
	for (int i = 0; i < arr.size(); i++){
		item->addDouble(arr[i]);
	}
	item->dataType == SFS::Entity::SFSDataType::SFSDATATYPE_DOUBLE_ARRAY;
	this->setItem(key, item);
	item->release();
}

void SFSObject::setStringArray(const std::string& key, const std::vector<std::string>& arr){
	auto item = new SFSArray();
	for (int i = 0; i < arr.size(); i++){
		item->addString(arr[i]);
	}
	item->dataType == SFS::Entity::SFSDataType::SFSDATATYPE_STRING_ARRAY;
	this->setItem(key, item);
	item->release();
}

SFSArray* SFSObject::setSFSObjectArray(const std::string& key, SFSArray* sfsArray){
	if (sfsArray){
		this->setItem(key, sfsArray);
	}
	else{
		sfsArray = new SFSArray();
		this->setItem(key, sfsArray);
		sfsArray->release();
	}
	return sfsArray;
}

SFSObject* SFSObject::create(){
	auto object = new SFSObject();
	object->autoRelease();
	return object;
}

}

}
