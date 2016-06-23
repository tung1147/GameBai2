/*
 * StreamReader.cpp
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#include "BufferArray.h"
namespace SFS{
inline void __reverse_bytes(char* bytes, int len){
	char* temp = new char[len];
	memcpy(temp, bytes, len);
	for (int i = 0, j = len - 1; i < len; i++, j--){
		bytes[i] = temp[j];
	}

	delete temp;
}

StreamReader::StreamReader(const char* data, int size, bool isOwner){
	_data = 0;
	_isOwner = true;
	_index = 0;

	if (data){
		_isOwner = isOwner;
		_size = size;

		if (_isOwner){
			_data = new char(_size);
			memcpy(_data, data, size);
		}
		else{
			_data = (char*)data;
		}
	}	
}

StreamReader::~StreamReader() {
	// TODO Auto-generated destructor stub
	if (_data && _isOwner){
		delete[] _data;
		_data = 0;
	}
}
//
void StreamReader::ReadBytes(int count, char* data){
	if (_data){
		memcpy(data, _data + _index, count);
		_index += count;
	}
}

/*reader*/
char StreamReader::NextByte(){
	char c;
	ReadBytes(1, &c);
	return c;
}

bool StreamReader::NextBool(){
	char c;
	ReadBytes(1, &c);
	return c;
}

int16_t StreamReader::NextShort(){
	int16_t pret;
	ReadBytes(2, (char*)&pret);
	__reverse_bytes((char*)&pret, 2);
	return pret;
}

int32_t StreamReader::NextInt(){
	int32_t pret;
	ReadBytes(4, (char*)&pret);
	__reverse_bytes((char*)&pret, 4);
	return pret;
}

int64_t StreamReader::NextLong(){
	int64_t pret;
	ReadBytes(8, (char*)&pret);
	__reverse_bytes((char*)&pret, 8);
	return pret;
}

float StreamReader::NextFloat(){
	float pret;
	ReadBytes(4, (char*)&pret);
	__reverse_bytes((char*)&pret, 4);
	return pret;
}

double StreamReader::NextDouble(){
	double pret;
	ReadBytes(8, (char*)&pret);
	__reverse_bytes((char*)&pret, 8);
	return pret;
}

std::string StreamReader::NextString(){
	int size = NextShort();
	char* buffer = new char[size];
	ReadBytes(size, buffer);
	std::string str(buffer, buffer + size);
	delete buffer;
	return str;
}

/*writer*/
StreamWriter::StreamWriter(){

}

StreamWriter::~StreamWriter(){

}

const std::vector<char>& StreamWriter::getBuffer(){
	return _data;
}

void StreamWriter::clear(){
	_data.clear();
}


//int StreamWriter::size(){
//	return _data.size(); 
//}
//
//void StreamWriter::writeToBuffer(std::vector<char> &buffer){
//	buffer.insert(buffer.end(), _data.begin(), _data.end());
//}

void StreamWriter::WriteBytes(const char* data, int size){
	_data.insert(_data.end(), data, data + size);
}

void StreamWriter::WriteByte(char c){
	WriteBytes((const char*) &c, 1);
}

void StreamWriter::WriteBool(bool b){
	WriteBytes((const char*)&b, 1);
}

void StreamWriter::WriteShort(int16_t i16){
	__reverse_bytes((char*)&i16, 2);
	WriteBytes((const char*)&i16, 2);
}

void StreamWriter::WriteInt(int32_t i32){
	__reverse_bytes((char*)&i32, 4);
	WriteBytes((const char*)&i32, 4);
}

void StreamWriter::WriteLong(int64_t i64){
	__reverse_bytes((char*)&i64, 8);
	WriteBytes((const char*)&i64, 8);
}

void StreamWriter::WriteFloat(float f){
	__reverse_bytes((char*)&f, 4);
	WriteBytes((const char*)&f, 4);
}

void StreamWriter::WriteDouble(double d){
	__reverse_bytes((char*)&d, 8);
	WriteBytes((const char*)&d, 8);
}

void StreamWriter::WriteString(const std::string& str){
	WriteShort(str.size());
	WriteBytes(str.data(), str.length());
}

}
