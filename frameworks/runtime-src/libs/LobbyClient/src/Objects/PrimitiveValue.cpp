/*
 * PrimitiveValue.cpp
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#include "PrimitiveValue.h"

namespace quyetnd {
namespace data{

PrimitiveValue::PrimitiveValue() {
	// TODO Auto-generated constructor stub
	this->setUInt(0);
}

PrimitiveValue::~PrimitiveValue() {
	// TODO Auto-generated destructor stub
}

void PrimitiveValue::writeToBuffer(quyetnd::data::ValueWriter* writer){
	switch (valueType){
		case ValueType::TypeBool:{
			writer->writeBool(data.boolValue);
			break;
		}
		case ValueType::TypeFloat:{
			writer->writeFloat(data.floatValue);
			break;
		}
		case ValueType::TypeDouble:{
			writer->writeDouble(data.doubleValue);
			break;
		}
		case ValueType::TypeInt:{
			writer->writeInt(data.i64Value);
			break;
		}
		case ValueType::TypeUInt:{
			writer->writeUint(data.ui64Value);
			break;
		}
	}
}

void PrimitiveValue::writeJson(std::ostringstream& str){
	switch (valueType){
	case ValueType::TypeBool:{
		if (data.boolValue){
			str << "true";
		}
		else{
			str << "false";
		}
		break;
	}
	case ValueType::TypeFloat:{
		str << data.floatValue;
		break;
	}
	case ValueType::TypeDouble:{
		str << data.doubleValue;
		break;
	}
	case ValueType::TypeInt:{
		str << data.i64Value;
		break;
	}
	case ValueType::TypeUInt:{
		str << data.ui64Value;
		break;
	}
	}
}

void PrimitiveValue::printToOutStream(std::ostringstream& outStream, int padding){
	switch (valueType)
	{
	case ValueType::TypeBool:{
		outStream << "[Bool] " << data.boolValue;
		break;
	}
	case ValueType::TypeFloat:{
		outStream << "[Float] " << data.floatValue;
		break;
	}
	case ValueType::TypeDouble:{
		outStream << "[Double]" << data.doubleValue;
		break;
	}
	case ValueType::TypeInt:{
		outStream << "[Int] " << data.i64Value;
		break;
	}
	case ValueType::TypeUInt:{
		outStream << "[UInt] " << data.ui64Value;
		break;
	}
	default:
		outStream << "[NULL]";
		break;
	}
}

void PrimitiveValue::setBool(bool b){
	valueType = ValueType::TypeBool;
	data.boolValue = b;
}

void PrimitiveValue::setFloat(float f){
	valueType = ValueType::TypeFloat;
	data.floatValue = f;
}

void PrimitiveValue::setDouble(double d){
	valueType = ValueType::TypeDouble;
	data.doubleValue = d;
}

void PrimitiveValue::setInt(int64_t i64){
	valueType = ValueType::TypeInt;
	data.i64Value = i64;
}

void PrimitiveValue::setUInt(uint64_t ui64){
	valueType = ValueType::TypeUInt;
	data.ui64Value = ui64;
}

bool PrimitiveValue::getBool(){
	return data.boolValue;
}

float PrimitiveValue::getFloat(){
	return data.floatValue;
}

double PrimitiveValue::getDouble(){
	return data.doubleValue;
}

int64_t PrimitiveValue::getInt(){
	return data.i64Value;
}

uint64_t PrimitiveValue::getUInt(){
	return data.ui64Value;
}

/**/
StringValue::StringValue(){
	valueType = ValueType::TypeString;
	data = "";
}

StringValue::~StringValue(){

}

void StringValue::writeToBuffer(quyetnd::data::ValueWriter* writer){
	writer->writeString(data);
}

void StringValue::writeJson(std::ostringstream& str){
	str << "\"" << data << "\"";
}

void StringValue::printToOutStream(std::ostringstream& outStream, int padding){
	outStream << "[String] " << data;
}

void StringValue::setString(const std::string& str){
	data = str;
}

void StringValue::setData(const char* buffer, int size){
	//data = std::string(buffer, size);
	data.assign(buffer, buffer + size);
}

const std::string& StringValue::getString(){
	return data;
}

}
} /* namespace quyetnd */
