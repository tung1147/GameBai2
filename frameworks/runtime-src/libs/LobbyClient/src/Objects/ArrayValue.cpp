/*
 * ArrayValue.cpp
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#include "ArrayValue.h"
#include "DictValue.h"
#include "PrimitiveValue.h"
#include "../Logger/Logger.h"

namespace quyetnd {
namespace data{

ArrayValue::ArrayValue() {
	// TODO Auto-generated constructor stub
	valueType = ValueType::TypeArray;
}

void ArrayValue::writeToBuffer(quyetnd::data::ValueWriter* writer){
	writer->writeArray(data.size());
	if (data.size() > 0){
		for (int i = 0; i < data.size(); i++){
			data[i]->writeToBuffer(writer);
		}
	}	
}

ArrayValue::~ArrayValue() {
	// TODO Auto-generated destructor stub
	this->clear();
}

ArrayValue* ArrayValue::create(){
	auto value = new ArrayValue();
	value->autorelease();
	return value;
}
#ifdef LOBBY_LOGGER
void ArrayValue::printToOutStream(std::ostringstream& outStream, int padding){
	outStream << "[Array](" << data.size() << ")" << std::endl;
	refreshLogBuffer(outStream);

	this->printPadding(outStream, padding);
	outStream << "{" << std::endl;
	for (int i=0; i < data.size(); i++){
		this->printPadding(outStream, padding + 1);
		data[i]->printToOutStream(outStream, padding + 1);
		outStream << std::endl;
		refreshLogBuffer(outStream);
	}
	this->printPadding(outStream, padding);
	outStream << "}";
}
#endif
void ArrayValue::toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator){
	value.SetArray();
	for (int i = 0; i < data.size(); i++){
		rapidjson::Value obj;
		data[i]->toValue(obj, allocator);
		value.PushBack(obj, allocator);
	}
}

void ArrayValue::addItem(Value* item){
	data.push_back(item);
	item->retain();
}

Value* ArrayValue::getItem(int index){
	return data[index];
}

int ArrayValue::size(){
	return data.size();
}

void ArrayValue::clear(){
	for (int i = 0; i < data.size(); i++){
		data[i]->release();
	}
	data.clear();
}

void ArrayValue::addBool(bool value){
	auto item = new PrimitiveValue();
	item->setBool(value);
	this->addItem(item);
	item->release();
}

void ArrayValue::addFloat(float value){
	auto item = new PrimitiveValue();
	item->setFloat(value);
	this->addItem(item);
	item->release();
}

void ArrayValue::addDouble(double value){
	auto item = new PrimitiveValue();
	item->setDouble(value);
	this->addItem(item);
	item->release();
}

void ArrayValue::addInt(int64_t value){
	auto item = new PrimitiveValue();
	item->setInt(value);
	this->addItem(item);
	item->release();
}

void ArrayValue::addUInt(uint64_t value){
	auto item = new PrimitiveValue();
	item->setUInt(value);
	this->addItem(item);
	item->release();
}

void ArrayValue::addString(const std::string& value){
	auto item = new StringValue();
	item->setString(value);
	this->addItem(item);
	item->release();
}


DictValue* ArrayValue::addDict(DictValue* value){
	if (value){
		this->addItem(value);
	}
	else{
		value = new DictValue();
		this->addItem(value);
		value->release();
	}
	return value;
}

ArrayValue* ArrayValue::addArray(ArrayValue* value){
	if (value){
		this->addItem(value);
	}
	else{
		value = new ArrayValue();
		this->addItem(value);
		value->release();
	}
	return value;
}

bool ArrayValue::getBool(int index){
	return ((PrimitiveValue*)getItem(index))->getBool();
}

float ArrayValue::getFloat(int index){
	return ((PrimitiveValue*)getItem(index))->getFloat();
}

double ArrayValue::getDouble(int index){
	return ((PrimitiveValue*)getItem(index))->getDouble();
}

int64_t ArrayValue::getInt(int index){
	return ((PrimitiveValue*)getItem(index))->getInt();
}

uint64_t ArrayValue::getUInt(int index){
	return ((PrimitiveValue*)getItem(index))->getUInt();
}

std::string ArrayValue::getString(int index){
	return ((StringValue*)getItem(index))->getString();
}

DictValue* ArrayValue::getDict(int index){
	return ((DictValue*)getItem(index));
}

ArrayValue* ArrayValue::getArray(int index){
	return ((ArrayValue*)getItem(index));
}

}
} /* namespace quyetnd */
