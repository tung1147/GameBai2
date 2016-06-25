//
//  cMediate.h
//  GameBaiVip
//
//  Created by Mac on 3/1/16.
//
//


#ifndef Mediate_h
#define Mediate_h

#include <string>
#include <vector>

const char* c_to_objC_getUUID(const char* keyUUID);
void c_to_objCCallSupport(const char* numSupport);
const char* c_to_obj_getVersion();
const char* c_to_obj_getBundle();
void c_to_objC_setKeyChainUser(const char* userId);
void c_to_objCinitStore(const std::vector<std::string>& listProduct);
void c_to_objBuyItem(const std::string& item);

void obj_to_c_buyAppSuccess(int returnCode, std::string recept);
void obj_to_c_registerNotificationSuccess(const char* uid, const char* token);
#endif