/*
 * Value.cpp
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#include "Value.h"
#include "PrimitiveValue.h"
#include "ArrayValue.h"
#include "DictValue.h"
#include <iomanip>
#include "../Logger/Logger.h"

namespace quyetnd {
namespace data{
	
Value::Value() {
	// TODO Auto-generated constructor stub
	valueType = ValueType::TypeNULL;
}

Value::~Value() {
	// TODO Auto-generated destructor stub
//	quyetnd::log("delete Value[%d]", valueType);
}

void Value::writeToBuffer(quyetnd::data::ValueWriter* writer){
	writer->writeNil();
}

void Value::writeJson(std::ostringstream& str){
	str << "null";
}

void Value::printDebug(){
#ifdef LOBBY_LOGGER
	std::ostringstream outputStream;
	this->printToOutStream(outputStream, 0);
	refreshLogBuffer(outputStream);
#endif
}

void Value::refreshLogBuffer(std::ostringstream& outStream){
#ifdef LOBBY_LOGGER
	quyetnd::log_to_console(outStream.str().c_str());
	outStream.str("");
	outStream.clear();
#endif
}

void Value::printToOutStream(std::ostringstream& outStream, int padding){
	outStream << "[NULL]";
}

void Value::printPadding(std::ostringstream& outStream, int padding){
	for (int i = 0; i < padding; i++){
#if defined(ANDROID)
		outStream << "  ";
#else
		outStream << "\t";
#endif	
	}
}

std::string Value::toJSON(){
	std::ostringstream stringStream;
	stringStream << std::setprecision(17);
	this->writeJson(stringStream);
	return stringStream.str();
}

}
} /* namespace quyetnd */
