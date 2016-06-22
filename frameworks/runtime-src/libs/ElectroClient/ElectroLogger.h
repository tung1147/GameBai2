/*
 * ElectroLogger.h
 *
 *  Created on: Jan 29, 2016
 *      Author: QuyetNguyen
 */

#ifndef ELECTROCLIENT_ELECTROLOGGER_H_
#define ELECTROCLIENT_ELECTROLOGGER_H_


namespace es{
	void log(const char * format, ...);
    void log_to_console(const char* log);
    void log_hex(const char* buf, int len);
}/* namespace es */

#endif /* ELECTROCLIENT_ELECTROLOGGER_H_ */
