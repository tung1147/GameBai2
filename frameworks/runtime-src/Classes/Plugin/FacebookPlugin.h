/*
 * FacebookPlugin.h
 *
 *  Created on: Feb 3, 2016
 *      Author: QuyetNguyen
 */

#ifndef PLUGIN_FACEBOOKPLUGIN_H_
#define PLUGIN_FACEBOOKPLUGIN_H_
#include <string>

namespace quyetnd {

class FacebookPlugin {
public:
	FacebookPlugin();
	virtual ~FacebookPlugin();

	void showLogin();

	void onLoginFinished(int returnCode, const std::string& userId, const std::string& accessToken);

	static FacebookPlugin* getInstance();
};

} /* namespace quyetnd */

#endif /* PLUGIN_FACEBOOKPLUGIN_H_ */
