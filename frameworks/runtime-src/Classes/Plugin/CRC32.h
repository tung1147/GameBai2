
#ifndef _QUYETND_CRC32_H
#define _QUYETND_CRC32_H

#include <stdint.h>

namespace quyetnd{
namespace hash{

uint32_t crc32(uint32_t crc, const char *buf, size_t size);

}
}

#endif