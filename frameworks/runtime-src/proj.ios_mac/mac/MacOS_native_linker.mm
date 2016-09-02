//
//  MacOS_objC_linker.m
//  GameBai2
//
//  Created by QuyetNguyen on 9/2/16.
//
//

#include "MacOS_native_linker.h"
const char* c_to_objC_getVersion(){
    return [[[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"] UTF8String];
}

const char* c_to_objC_getBundle(){
    return [[[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleIdentifier"] UTF8String];
}