/*
 * ValueReader.cpp
 *
 *  Created on: Jun 10, 2016
 *      Author: Quyet Nguyen
 */

#include "ValueReader.h"
#include "PrimitiveValue.h"
#include "ArrayValue.h"
#include "DictValue.h"
//#include "../Logger/Logger.h"

namespace quyetnd {
namespace data {

ValueReadArrayBuffer::ValueReadArrayBuffer(int size){
	this->size = size;
	arr.reserve(size);
}

ValueReadArrayBuffer::~ValueReadArrayBuffer(){
	for (int i = 0; i < arr.size(); i++){
		arr[i]->release();
	}
	arr.clear();
}

/****/

ValueReader::ValueReader() {
	// TODO Auto-generated constructor stub
	dataBuffer.reserve(16 * 1024); //16KB buffer
	_delegate = 0;
}

ValueReader::~ValueReader() {
	// TODO Auto-generated destructor stub
	while (!mStack.empty()){
		auto item = mStack.top();
		delete item;
		mStack.pop();
	}
}

void ValueReader::setDelegate(ValueReaderDelegate* mDelegate){
	_delegate = mDelegate;
}

void ValueReader::addData(const char* data, int size){
	dataBuffer.insert(dataBuffer.end(), data, data + size);

	auto buffer = dataBuffer.data();
	int dataSize = dataBuffer.size();
	while (true){
		auto n = processData(buffer, dataSize);
		if (n <= 0){
			break;
		}

		buffer += n;
		dataSize -= n;
	}
	

	int lastIndex = dataBuffer.size() - dataSize;
	dataBuffer.erase(dataBuffer.begin(), dataBuffer.begin() + lastIndex);
}

void ValueReader::addData(const std::vector<char> data){
	this->addData(data.data(), data.size());
}

/****/
inline void __swap_bytes(char* bytes, int size){
	for (int i = 0, j = size - 1; i < j; i++, j--){
		char c = bytes[i];
		bytes[i] = bytes[j];
		bytes[j] = c;
	}
}

uint8_t	ValueReader::read_ui8(const char* p){
	return (uint8_t)p[0];
}

uint16_t ValueReader::read_ui16(const char* p){
	uint16_t pret;
	memcpy(&pret, p, 2);
	__swap_bytes((char*)&pret, 2);
	return pret;
}

uint32_t ValueReader::read_ui32(const char* p){
	uint32_t pret;
	memcpy(&pret, p, 4);
	__swap_bytes((char*)&pret, 4);
	return pret;
}

uint64_t ValueReader::read_ui64(const char* p){
	uint64_t pret;
	memcpy(&pret, p, 8);
	__swap_bytes((char*)&pret, 8);
	return pret;
}

int8_t	ValueReader::read_i8(const char* p){
	return (int8_t)p[0];
}

int16_t	ValueReader::read_i16(const char* p){
	int16_t pret;
	memcpy(&pret, p, 2);
	__swap_bytes((char*)&pret, 2);
	return pret;
}

int32_t	ValueReader::read_i32(const char* p){
	int32_t pret;
	memcpy(&pret, p, 4);
	__swap_bytes((char*)&pret, 4);
	return pret;
}

int64_t	ValueReader::read_i64(const char* p){
	int64_t pret;
	memcpy(&pret, p, 8);
	__swap_bytes((char*)&pret, 8);
	return pret;
}

float	ValueReader::read_float(const char* p){
	float pret;
	memcpy(&pret, p, 4);
	__swap_bytes((char*)&pret, 4);
	return pret;
}

double	ValueReader::read_double(const char* p){
	double pret;
	memcpy(&pret, p, 8);
	__swap_bytes((char*)&pret, 8);
	return pret;
}

int ValueReader::processData(const char* buffer, int& dataSize){
	if (dataSize <= 0){
		return 0;
	}
	const unsigned char type = (const unsigned char)buffer[0];

	if (0x00 <= type && type <= 0x7f){
		// positive fixnum
		this->onReadUnsignedInt(type);
		return 1;
	}
	else if (0xe0 <= type && type <= 0xff){
		// negative fixnum
		this->onReadInt(type);
		return 1;
	}
	else if (0x80 <= type && type <= 0x8f){
		// fixmap
		unsigned char n = (type & 0x0f);
		this->onReadMap(n);
		return 1;
	}
	else if (0x90 <= type && type <= 0x9f){
		//fixarray
		unsigned char n = (type & 0x0f);
		this->onReadArray(n);
		return 1;
	}
	else if (0xa0 <= type && type <= 0xbf){
		//fixstr
		unsigned char n = (type & 0x1f);// (type & ~0xe0);
		if (dataSize >= n + 1){
			this->onReadString(buffer + 1, n);
			return (n + 1);
		}
		return 0;
	}
	else if (type == 0xc0){
		//nil
		this->onReadNil();
		return 1;
	}
	else if (0xc2 <= type && type <= 0xc3){
		//bool
		bool b = type & 1;
		this->onReadBool(b);
		return 1;
	}
	else if (type == 0xd9){
		//str 8
		if (dataSize >= 2){
			uint8_t n = read_ui8(buffer + 1);
			if (dataSize >= n + 2){
				this->onReadString(buffer + 2, n);
				return (n + 2);
			}
		}
		return 0;
	}
	else if (type == 0xda){
		//str 16
		if (dataSize >= 3){
			uint16_t n = read_ui16(buffer + 1);
			if (dataSize >= n + 3){
				this->onReadString(buffer + 3, n);
				return (n + 3);
			}
		}
		return 0;
	}
	else if (type == 0xdb){
		//str 32
		if (dataSize >= 5){
			uint32_t n = read_ui32(buffer + 1);
			if (dataSize >= n + 5){
				this->onReadString(buffer + 5, n);
				return (n + 5);
			}
		}
		return 0;
	}
	else if (type == 0xd0){
		//int 8
		if (dataSize >= 2){
			int8_t uintData = read_i8(buffer + 1);
			this->onReadInt(uintData);
			return 2;
		}
		return 0;
	}
	else if (type == 0xd1){
		//int 16
		if (dataSize >= 3){
			int16_t uintData = read_i16(buffer + 1);
			this->onReadInt(uintData);
			return 3;
		}
		return 0;
	}
	else if (type == 0xd2){
		//int 32
		if (dataSize >= 5){
			int64_t uintData = read_i32(buffer + 1);
			this->onReadInt(uintData);
			return 5;
		}
		return 0;
	}
	else if (type == 0xd3){
		//int 64
		if (dataSize >= 9){
			int64_t uintData = read_i64(buffer + 1);
			this->onReadInt(uintData);
			return 9;
		}
		return 0;
	}	
	else if (type == 0xcc){
		//uint 8
		if (dataSize >= 2){
			uint8_t uintData = read_ui8(buffer + 1);
			this->onReadUnsignedInt(uintData);
			return 2;
		}
		return 0;
	}
	else if (type == 0xcd){
		//uint 16
		if (dataSize >= 3){
			uint16_t uintData = read_ui16(buffer + 1);
			this->onReadUnsignedInt(uintData);
			return 3;
		}
		return 0;
	}
	else if (type == 0xce){
		//uint 32
		if (dataSize >= 5){
			uint32_t uintData = read_ui32(buffer + 1);
			this->onReadUnsignedInt(uintData);
			return 5;
		}
		return 0;
	}
	else if (type == 0xcf){
		//uint 64
		if (dataSize >= 9){
			uint64_t uintData = read_ui64(buffer + 1);
			this->onReadUnsignedInt(uintData);
			return 9;
		}
		return 0;
	}
	else if (type == 0xca){
		//float 32
		if (dataSize >= 5){
			float f = read_float(buffer + 1);
			this->onReadFloat(f);
			return 5;
		}
		return 0;
	}
	else if (type == 0xcb){
		//float 64
		if (dataSize >= 9){
			double d = read_double(buffer + 1);
			this->onReadFloat(d);
			return 9;
		}
		return 0;
	}
	else if (type == 0xc4){
		//bin 8
		if (dataSize >= 2){
			int n = read_ui8(buffer + 1);
			if (dataSize >= n + 2){
				this->onReadBin(buffer + 2, n);
				return (n + 2);
			}
		}
		return 0;
	}
	else if (type == 0xc5){
		//bin 16
		if (dataSize >= 3){
			int n = read_ui16(buffer + 1);
			if (dataSize >= n + 3){
				this->onReadBin(buffer + 3, n);
				return (n + 3);
			}
		}
		return 0;
	}
	else if (type == 0xc6){
		//bin 32
		if (dataSize >= 5){
			int n = read_ui32(buffer + 1);
			if (dataSize >= n + 5){
				this->onReadBin(buffer + 5, n);
				return (n + 5);
			}
		}
		return 0;
	}
	else if (type == 0xdc){
		//array 16
		if (dataSize >= 3){
			uint16_t n = read_ui16(buffer + 1);
			this->onReadArray(n);
			return 3;
		}
		return 0;
	}
	else if (type == 0xdd){
		//array 32
		if (dataSize >= 5){
			uint32_t n = read_ui32(buffer + 1);
			this->onReadArray(n);
			return 5;
		}
		return 0;
	}
	else if (type == 0xde){
		//map 16
		if (dataSize >= 3){
			uint16_t n = read_ui16(buffer + 1);
			this->onReadMap(n);
			return 3;
		}
		return 0;
	}
	else if (type == 0xdf){
		//map 32
		if (dataSize >= 5){
			uint32_t n = read_ui32(buffer + 1);
			this->onReadMap(n);
			return 5;
		}
		return 0;
	}
	else if (type == 0xd4){
		//fixext 1
		return 0;
	}

	else if (type == 0xd5){
		//fixext 2
		return 0;
	}
	else if (type == 0xd6){
		//fixext 4
		return 0;
	}
	else if (type == 0xd7){
		//fixext 8
		return 0;
	}
	else if (type == 0xd8){
		//fixext 16
		return 0;
	}
	else if (type == 0xc7){
		//ext 8
		return 0;
	}
	else if (type == 0xc8){
		//ext 16
		return 0;
	}
	else if (type == 0xc9){
		//ext 32
		return 0;
	}
	return 0;
}


void ValueReader::onFinishedReadObject(Value* object){
	if (mStack.empty()){
		//call obj
		if (_delegate){
			_delegate->onRecvMessage(object);
		}
		else{
			object->release();
		}
	}
	else{
		auto item = mStack.top();
		item->arr.push_back(object);
		if (item->arr.size() == item->size){
			Value* newValue = 0;
			if (item->type == ValueType::TypeDict){ //dict
				//quyetnd::log("finishMap : %d", item->size);

				auto dict = new DictValue();
				for (int i = 0; i < item->size; i += 2){
					auto key = item->arr[i];
					auto value = item->arr[i + 1];
					dict->addItem(((StringValue*)key)->getString(), value);
				}
				newValue = dict;
			}
			else{ //arr
				//quyetnd::log("finish arr : %d", item->size);

				auto arr = new ArrayValue();
				for (int i = 0; i < item->size; i++){
					arr->addItem(item->arr[i]);
				}
				newValue = arr;
			}

			delete item;
			mStack.pop();
			this->onFinishedReadObject(newValue);
		}
	}
}

void ValueReader::onReadNil(){
//	quyetnd::log("onReadNil");
	this->onFinishedReadObject(new Value());
}

void ValueReader::onReadBool(bool b){
//	quyetnd::log("onReadBool : %d", b);

	PrimitiveValue* value = new PrimitiveValue();
	value->setBool(b);
	this->onFinishedReadObject(value);
}

void ValueReader::onReadInt(int64_t i64){
//	quyetnd::log("onReadInt : %d", i64);

	PrimitiveValue* value = new PrimitiveValue();
	value->setInt(i64);
	this->onFinishedReadObject(value);
}

void ValueReader::onReadUnsignedInt(uint64_t i64){
//	quyetnd::log("onReadUInt: %d", i64);

	PrimitiveValue* value = new PrimitiveValue();
	value->setUInt(i64);
	this->onFinishedReadObject(value);
}

void ValueReader::onReadFloat(float f){
//	quyetnd::log("onReadDouble : %f", f);
	PrimitiveValue* value = new PrimitiveValue();
	value->setFloat(f);
	this->onFinishedReadObject(value);
}

void ValueReader::onReadDouble(double d){
//	quyetnd::log("onReadDouble : %f", d);
	PrimitiveValue* value = new PrimitiveValue();
	value->setDouble(d);
	this->onFinishedReadObject(value);
}

void ValueReader::onReadString(const char* str, uint32_t size){
	StringValue* value = new StringValue();
	value->setData(str, size);

//	quyetnd::log("str : %s -- %d", value->getString().c_str(), size);
	this->onFinishedReadObject(value);
}

void ValueReader::onReadBin(const char* str, uint32_t size){
	StringValue* value = new StringValue();
	value->setData(str, size);
//	quyetnd::log("bin : %s", value->getString().c_str());
	this->onFinishedReadObject(value);
}

void ValueReader::onReadMap(uint32_t size){
	if (size == 0){
		DictValue* value = new DictValue();
		this->onFinishedReadObject(value);
	}
	else{
//		quyetnd::log("map : %d", size);
		ValueReadArrayBuffer* arr = new ValueReadArrayBuffer(size * 2);
		arr->type = ValueType::TypeDict;
		mStack.push(arr);
	}	
}

void ValueReader::onReadArray(uint32_t size){
	if (size == 0){
		ArrayValue* value = new ArrayValue();
		this->onFinishedReadObject(value);
	}
	else{
//		quyetnd::log("array : %d", size);
		ValueReadArrayBuffer* arr = new ValueReadArrayBuffer(size);
		arr->type = ValueType::TypeArray;
		mStack.push(arr);
	}
}

}
} /* namespace quyetnd */
