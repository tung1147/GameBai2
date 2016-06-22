/*
 * Logger.h
 *
 *  Created on: Jun 4, 2016
 *      Author: Quyet Nguyen
 */

#ifndef LOBBYCLIENT_LOGGER_LOGGER_H_
#define LOBBYCLIENT_LOGGER_LOGGER_H_

#define LOBBY_LOGGER 1

namespace quyetnd {
	void log(const char * format, ...);
	void log_to_console(const char* log);
	void log_hex(const char* buf, int len);

} /* namespace quyetnd */

#endif /* LOBBYCLIENT_LOGGER_LOGGER_H_ */
