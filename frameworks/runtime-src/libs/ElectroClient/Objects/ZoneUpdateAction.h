/*
 * ZoneUpdateAction.h
 *
 *  Created on: Feb 24, 2016
 *      Author: Quyet Nguyen
 */

#ifndef ELECTROCLIENT_OBJECTS_ZONEUPDATEACTION_H_
#define ELECTROCLIENT_OBJECTS_ZONEUPDATEACTION_H_

namespace es {
	namespace type {
		enum ZoneUpdateAction{
			AddRoom = 1,
			DeleteRoom = 2,
			UpdateRoom = 3
		};
	}
} /* namespace es */

#endif /* ELECTROCLIENT_OBJECTS_ZONEUPDATEACTION_H_ */
