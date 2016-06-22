//
//  FacebookPlugin_iOS_link.h
//  GameBaiVip
//
//  Created by QuyetNguyen on 3/4/16.
//
//

#ifndef FacebookPlugin_iOS_link_h
#define FacebookPlugin_iOS_link_h

void _objc_to_c_fbLogin_finished(int returnCode, const char* userId, const char* accessToken);

void _c_to_objc_showLogin();
void _c_to_objc_logout();

#endif /* FacebookPlugin_iOS_link_h */
