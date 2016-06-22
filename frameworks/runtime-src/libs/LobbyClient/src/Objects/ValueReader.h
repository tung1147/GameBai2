/*
 * ValueReader.h
 *
 *  Created on: Jun 10, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBYCLIENT_OBJECTS_VALUEREADER_H_
#define LOBBYCLIENT_OBJECTS_VALUEREADER_H_
#include <vector>
#include <cstdint>
#include <string>
#include <stack>
#include "Value.h"

namespace quyetnd {
namespace data {

class ValueReadArrayBuffer{
public:
	int type;
	int size;
	std::vector<Value*> arr;
public:
	ValueReadArrayBuffer(int size);
	virtual ~ValueReadArrayBuffer();
};

class ValueReaderDelegate{
public:
	virtual void onRecvMessage(Value* value) = 0;
};

class ValueReader {
	ValueReaderDelegate* _delegate;

	std::vector<char> dataBuffer;
	//int dataIndex;

//	void eraseBufferData(int size);
	int processData(const char* buffer, int& dataSize);

	uint8_t		read_ui8(const char* p);
	uint16_t	read_ui16(const char* p);
	uint32_t	read_ui32(const char* p);
	uint64_t	read_ui64(const char* p);
	int8_t		read_i8(const char* p);
	int16_t		read_i16(const char* p);
	int32_t		read_i32(const char* p);
	int64_t		read_i64(const char* p);
	float		read_float(const char* p);
	double		read_double(const char* p);

	void onReadNil();
	void onReadBool(bool b);

	void onReadInt(int64_t i64);
	void onReadUnsignedInt(uint64_t i64);

	void onReadFloat(float f);
	void onReadDouble(double d);

	void onReadString(const char* str, uint32_t size);
	void onReadBin(const char* str, uint32_t size);

	void onReadMap(uint32_t size);
	void onReadArray(uint32_t size);

	std::stack<ValueReadArrayBuffer*> mStack;
	void onFinishedReadObject(Value* object);
public:
	ValueReader();
	virtual ~ValueReader();

	virtual void setDelegate(ValueReaderDelegate* mDelegate);

	void addData(const char* data, int size);
	void addData(const std::vector<char> data);
};

}
} /* namespace quyetnd */

#endif /* LOBBYCLIENT_OBJECTS_VALUEREADER_H_ */
