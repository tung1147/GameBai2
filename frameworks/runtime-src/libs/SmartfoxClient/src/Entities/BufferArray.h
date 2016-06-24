/*
 * BufferArray.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_CORE_BUFFERARRAY_H_
#define SFSCLIENT_CORE_BUFFERARRAY_H_
#include <vector>
#include <cstdint>
#include <string>

namespace SFS{

class StreamReader {
protected:
	char* _data;
	int _size;
	int _index;

	bool _isOwner;

	
public:
	StreamReader(const char* data, int size, bool isOwner = false);
	virtual ~StreamReader();
	void ReadBytes(int count, char* data);
//	void Uncompress();

	char NextByte();
	bool NextBool();
	int16_t NextShort();
	int32_t NextInt();
	int64_t NextLong();
	float NextFloat();
	double NextDouble();
	std::string NextString();
};

class StreamWriter {
	std::vector<char> _data;

	void WriteBytes(const char* data, int size);
	void WriteHeader(const char* data, int size);
	void WriteHeader(char header);
public:
	StreamWriter();
	virtual ~StreamWriter();

	const std::vector<char>& getBuffer();
	void clear();
	//int size();

	//void writeToBuffer(std::vector<char> &buffer);

	void WriteByte(char c);
	void WriteBool(bool b);
	void WriteShort(int16_t i16);
	void WriteInt(int32_t i32);
	void WriteLong(int64_t i64);
	void WriteFloat(float f);
	void WriteDouble(double d);
	void WriteString(const std::string& str);

	void WriteHeader();
	void Reserve(int size);
};

}
#endif /* SFSCLIENT_CORE_BUFFERARRAY_H_ */
