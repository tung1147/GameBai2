/*
 * SFSLogger.h
 *
 *  Created on: May 31, 2016
 *      Author: Quyet Nguyen
 */

#ifndef SFSCLIENT_LOGGER_SFSLOGGER_H_
#define SFSCLIENT_LOGGER_SFSLOGGER_H_

#define SFS_PRINT_DEBUG 1

namespace SFS{
	void log(const char * format, ...);
	void log_to_console(const char* log);
	void log_hex(const char* buf, int len);
}

#endif /* SFSCLIENT_LOGGER_SFSLOGGER_H_ */
