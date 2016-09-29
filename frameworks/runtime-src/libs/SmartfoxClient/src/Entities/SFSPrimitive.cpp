/*
 * SFSPrimitive.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "SFSPrimitive.h"
#include <iomanip>

namespace SFS {
namespace Entity{

inline std::string _sfs_escape_json(const std::string &s) {
std::ostringstream o;
for (auto c = s.cbegin(); c != s.cend(); c++) {
	switch (*c) {
	case '"': o << "\\\""; break;
	case '\\': o << "\\\\"; break;
	case '\b': o << "\\b"; break;
	case '\f': o << "\\f"; break;
	case '\n': o << "\\n"; break;
	case '\r': o << "\\r"; break;
	case '\t': o << "\\t"; break;
	default:
		if ('\x00' <= *c && *c <= '\x1f') {
			o << "\\u"
				<< std::hex << std::setw(4) << std::setfill('0') << (int)*c;
		}
		else {
			o << *c;
		}
	}
}
return o.str();
}


SFSPrimitive::SFSPrimitive() {
	// TODO Auto-generated constructor stub

}

SFSPrimitive::~SFSPrimitive() {
	// TODO Auto-generated destructor stub
}

void SFSPrimitive::toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator){
	switch (dataType)
	{
	case SFSDATATYPE_BOOL:{
		value.SetBool(mData.boolValue);
		return;
	}
	case SFSDATATYPE_BYTE:{
		value.SetInt((int)mData.byteValue);
		return;
	}
	case SFSDATATYPE_SHORT:{
		value.SetInt((int)mData.i16Value);
		return;
	}
	case SFSDATATYPE_INT:{
		value.SetInt(mData.i32Value);
		return;
	}
	case SFSDATATYPE_LONG:{
		value.SetInt64(mData.i64Value);
		return;
	}
	case SFSDATATYPE_FLOAT:{
		value.SetFloat(mData.floatValue);
		return;
	}
	case SFSDATATYPE_DOUBLE:{
		value.SetDouble(mData.doubleValue);
		return;
	}
	}

	value.SetNull();
}

void SFSPrimitive::writeToJSON(std::ostringstream& stream){
	switch (dataType)
	{
	case SFSDATATYPE_BOOL:{
		if (mData.boolValue){
			stream << "true";
		}
		else{
			stream << "false";
		}
		break;
	}
	case SFSDATATYPE_BYTE:{
		stream << (int)mData.byteValue;
		break;
	}
	case SFSDATATYPE_SHORT:{
		stream << mData.i16Value;
		break;
	}
	case SFSDATATYPE_INT:{
		stream << mData.i32Value;
		break;
	}
	case SFSDATATYPE_LONG:{
		stream << mData.i64Value;
		break;
	}
	case SFSDATATYPE_FLOAT:{
		stream << mData.floatValue;
		break;
	}
	case SFSDATATYPE_DOUBLE:{
		stream << mData.doubleValue;
		break;
	}
	}
}

void SFSPrimitive::writeToBuffer(StreamWriter* writer){
	writer->WriteByte(dataType);
	switch (dataType)
	{
		case SFSDATATYPE_BOOL:{
			writer->WriteBool(mData.boolValue);
			break;
		}
		case SFSDATATYPE_BYTE:{
			writer->WriteByte(mData.byteValue);
			break;
		}
		case SFSDATATYPE_SHORT:{
			writer->WriteShort(mData.i16Value);
			break;
		}
		case SFSDATATYPE_INT:{
			writer->WriteInt(mData.i32Value);
			break;
		}
		case SFSDATATYPE_LONG:{
			writer->WriteLong(mData.i64Value);
			break;
		}
		case SFSDATATYPE_FLOAT:{
			writer->WriteFloat(mData.floatValue);
			break;
		}
		case SFSDATATYPE_DOUBLE:{
			writer->WriteDouble(mData.doubleValue);
			break;
		}
	}
}

void SFSPrimitive::initWithReader(StreamReader* reader){
	switch (dataType){
		case SFSDATATYPE_BOOL:{
			mData.boolValue = reader->NextBool();
			break;
		}
		case SFSDATATYPE_BYTE:{
			mData.byteValue = reader->NextByte();
			break;
		}
		case SFSDATATYPE_SHORT:{
			mData.i16Value = reader->NextShort();
			break;
		}
		case SFSDATATYPE_INT:{
			mData.i32Value = reader->NextInt();
			break;
		}
		case SFSDATATYPE_LONG:{
			mData.i64Value = reader->NextLong();
			break;
		}
		case SFSDATATYPE_FLOAT:{
			mData.floatValue = reader->NextFloat();
			break;
		}
		case SFSDATATYPE_DOUBLE:{
			mData.doubleValue = reader->NextDouble();
			break;
		}
	}
}

void SFSPrimitive::printDebug(std::ostringstream& os, int padding){
	switch (dataType){
		case SFSDATATYPE_BOOL:{
			if (mData.boolValue){
				os << "(bool) TRUE";
			}
			else{
				os << "(bool) FALSE";
			}
			
			break;
		}
		case SFSDATATYPE_BYTE:{
			os << "(byte) " << (int)mData.byteValue;
			break;
		}
		case SFSDATATYPE_SHORT:{
			os << "(short) " << mData.i16Value;
			break;
		}
		case SFSDATATYPE_INT:{
			os << "(int) " << mData.i32Value;
			break;
		}
		case SFSDATATYPE_LONG:{
			os << "(long) " << mData.i64Value;
			break;
		}
		case SFSDATATYPE_FLOAT:{
			os << "(float) " << mData.floatValue;
			break;
		}
		case SFSDATATYPE_DOUBLE:{
			os << "(double) " << mData.doubleValue;
			break;
		}
	}
}

bool SFSPrimitive::getBool(){
	return mData.boolValue;
}

char SFSPrimitive::getByte(){
	return mData.byteValue;
}

int16_t SFSPrimitive::getShort(){
	return mData.i16Value;
}

int32_t SFSPrimitive::getInt(){
	return mData.i32Value;
}

int64_t SFSPrimitive::getLong(){
	return mData.i64Value;
}

float SFSPrimitive::getFloat(){
	return mData.floatValue;
}

double SFSPrimitive::getDouble(){
	return mData.doubleValue;
}

void SFSPrimitive::setBool(bool b){
	dataType = SFSDataType::SFSDATATYPE_BOOL;
	mData.boolValue = b;
}

void SFSPrimitive::setByte(char c){
	dataType = SFSDataType::SFSDATATYPE_BYTE;
	mData.byteValue = c;
}

void SFSPrimitive::setShort(int16_t i16){
	dataType = SFSDataType::SFSDATATYPE_SHORT;
	mData.i16Value = i16;
}

void SFSPrimitive::setInt(int32_t i32){
	dataType = SFSDataType::SFSDATATYPE_INT;
	mData.i32Value = i32;
}

void SFSPrimitive::setLong(int64_t i64){
	dataType = SFSDataType::SFSDATATYPE_LONG;
	mData.i64Value = i64;
}

void SFSPrimitive::setFloat(float f){
	dataType = SFSDataType::SFSDATATYPE_FLOAT;
	mData.floatValue = f;
}

void SFSPrimitive::setDouble(double d){
	dataType = SFSDataType::SFSDATATYPE_DOUBLE;
	mData.doubleValue = d;
}

/****/
SFSString::SFSString(){
	dataType = SFSDataType::SFSDATATYPE_STRING;
	mData = "";
}

SFSString::~SFSString(){

}

void SFSString::toValue(rapidjson::Value& value, rapidjson::Document::AllocatorType& allocator){
	value.SetString(mData, allocator);
}

void SFSString::writeToJSON(std::ostringstream& stream){
	stream << "\"" << _sfs_escape_json(mData) << "\"";
}

void SFSString::writeToBuffer(StreamWriter* writer){
	writer->WriteByte(SFSDataType::SFSDATATYPE_STRING);
	writer->WriteString(mData);
}

void SFSString::initWithReader(StreamReader* reader){
	int size = reader->NextShort();
	char* buffer = new char[size];
	reader->ReadBytes(size, buffer);
	mData = std::string(buffer, buffer + size);
	delete[] buffer;
}

void SFSString::printDebug(std::ostringstream& os, int padding){
	os << "(string) " << mData;
}

std::string SFSString::getString(){
	return mData;
}

void SFSString::setString(const std::string& data){
	mData = data;
}

}
} /* namespace SFS */
