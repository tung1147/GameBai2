/*
 * DictValue.cpp
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#include "DictValue.h"
#include "ArrayValue.h"
#include "PrimitiveValue.h"

namespace quyetnd {
namespace data{

DictValue::DictValue() {
	// TODO Auto-generated constructor stub
	valueType = ValueType::TypeDict;
}

DictValue::~DictValue() {
	// TODO Auto-generated destructor stub
	this->clear();
}

DictValue* DictValue::create(){
	auto value = new DictValue(); 
	value->autorelease();
	return value;
}

void DictValue::writeToBuffer(quyetnd::data::ValueWriter* writer){
	writer->writeMap(data.size());
	if (data.size() > 0){
		for (auto it = data.begin(); it != data.end(); it++){
			writer->writeString(it->first);
			it->second->writeToBuffer(writer);
		}
	}	
}

#ifdef LOBBY_LOGGER
void DictValue::printToOutStream(std::ostringstream& outStream, int padding){
	outStream << "[Dict](" << data.size() << ")" << std::endl;
	refreshLogBuffer(outStream);

	this->printPadding(outStream, padding);
	outStream << "{" << std::endl;
	for (auto it = data.begin(); it != data.end(); it++){
		this->printPadding(outStream, padding + 1);
		outStream << it->first << ":";
		it->second->printToOutStream(outStream, padding + 1);
		outStream << std::endl;
		refreshLogBuffer(outStream);
	}
	this->printPadding(outStream, padding);
	outStream << "}" ;
}
#endif

void DictValue::toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator){
	value.SetObject();
	for (auto it = data.begin(); it != data.end(); it++){
		rapidjson::Value key(it->first, allocator);

		rapidjson::Value obj;
		it->second->toValue(obj, allocator);

		value.AddMember(key, obj, allocator);
	}
}

void DictValue::addItem(const std::string& key, Value* item){
	auto it = data.find(key);
	if (it != data.end()){
		it->second->release();
		data.erase(it);
	}

	data.insert(std::make_pair(key, item));
	item->retain();
}

Value* DictValue::getItem(const std::string& key){
	auto it = data.find(key);
	if (it != data.end()){
		return it->second;
	}
	return 0;
}

bool DictValue::isExistKey(const std::string& key){
	auto it = data.find(key);
	if (it != data.end()){
		return true;
	}
	return false;
}

void DictValue::clear(){
	for (auto it = data.begin(); it != data.end(); it++){
		it->second->release();
	}
	data.clear();
}

int DictValue::size(){
	return data.size();
}


bool DictValue::getBool(const std::string& key, bool defaultValue){
	auto item = this->getItem(key);
	if (item){
		return ((PrimitiveValue*)item)->getBool();
	}
	return defaultValue;
}

float DictValue::getFloat(const std::string& key, float defaultValue){
	auto item = this->getItem(key);
	if (item){
		return ((PrimitiveValue*)item)->getFloat();
	}
	return defaultValue;
}

double DictValue::getDouble(const std::string& key, double defaultValue){
	auto item = this->getItem(key);
	if (item){
		return ((PrimitiveValue*)item)->getDouble();
	}
	return defaultValue;
}

int64_t DictValue::getInt(const std::string& key, int64_t defaultValue){
	auto item = this->getItem(key);
	if (item){
		return ((PrimitiveValue*)item)->getInt();
	}
	return defaultValue;
}


uint64_t DictValue::getUInt(const std::string& key, uint64_t defaultValue){
	auto item = this->getItem(key);
	if (item){
		return ((PrimitiveValue*)item)->getUInt();
	}
	return defaultValue;
}

const std::string& DictValue::getString(const std::string& key, const std::string& defaultValue){
	auto item = this->getItem(key);
	if (item){
		return ((StringValue*)item)->getString();
	}
	return defaultValue;
}

DictValue* DictValue::getDict(const std::string& key, DictValue* defaultValue){
	auto item = this->getItem(key);
	if (item){
		return ((DictValue*)item);
	}
	return defaultValue;
}

ArrayValue* DictValue::getArray(const std::string& key, ArrayValue* defaultValue){
	auto item = this->getItem(key);
	if (item){
		return ((ArrayValue*)item);
	}
	return defaultValue;
}

void DictValue::setBool(const std::string& key, bool value){
	auto item = new PrimitiveValue();
	item->setBool(value);
	this->addItem(key, item);
	item->release();
}

void DictValue::setFloat(const std::string& key, float value){
	auto item = new PrimitiveValue();
	item->setFloat(value);
	this->addItem(key, item);
	item->release();
}

void DictValue::setDouble(const std::string& key, double value){
	auto item = new PrimitiveValue();
	item->setDouble(value);
	this->addItem(key, item);
	item->release();
}

void DictValue::setInt(const std::string& key, int64_t value){
	auto item = new PrimitiveValue();
	item->setInt(value);
	this->addItem(key, item);
	item->release();
}

void DictValue::setUInt(const std::string& key, uint64_t value){
	auto item = new PrimitiveValue();
	item->setUInt(value);
	this->addItem(key, item);
	item->release();
}

void DictValue::setString(const std::string& key, const std::string& value){
	auto item = new StringValue();
	item->setString(value);
	this->addItem(key, item);
	item->release();
}

DictValue* DictValue::setDict(const std::string& key, DictValue* value){
	if (value){
		this->addItem(key, value);
	}
	else{
		value = new DictValue();
		this->addItem(key, value);
		value->release();
	}
	return value;
}

ArrayValue* DictValue::setArray(const std::string& key, ArrayValue* value){
	if (value){
		this->addItem(key, value);
	}
	else{
		value = new ArrayValue();
		this->addItem(key, value);
		value->release();
	}
	return value;
}

}
} /* namespace quyetnd */
