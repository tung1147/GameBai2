//
//  iOS_native_linker.h
//  GameBai2
//
//  Created by QuyetNguyen on 9/2/16.
//
//

#ifndef iOS_native_linker_h
#define iOS_native_linker_h

#include <string>
#include <vector>

const char* c_to_objC_getUUID(const char* keyUUID);
void c_to_objC_callSupport(const char* numSupport);
const char* c_to_objC_getVersion();
const char* c_to_objC_getBundle();
void c_to_objC_setKeyChainUser(const char* userId);
void c_to_objC_initStore(const std::vector<std::string>& listProduct);
void c_to_objC_buyItem(const std::string& item);
void c_to_objC_set_iClound_no_backup_folder(const char* folderPath);

void objC_to_c_buyInAppSuccess(int returnCode, const char* token);
void objC_to_c_registedNotificationSuccess(const char* uid, const char* token);


#endif /* iOS_native_linker_h */
