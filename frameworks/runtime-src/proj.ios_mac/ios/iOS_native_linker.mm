//
//  iOS_native_linker.m
//  GameBai2
//
//  Created by QuyetNguyen on 9/2/16.
//
//

#include "iOS_native_linker.h"
#include "UICKeyChainStore.h"
#include "InAppPurchare.h"
#import <StoreKit/StoreKit.h>
#import "SMSPlugin.h"

bool c_to_objC_callSupport(const char* numSupport){
    NSString *phoneNum = [NSString stringWithCString: numSupport encoding:NSUTF8StringEncoding];
    NSURL *phoneUrl = [NSURL URLWithString:[NSString  stringWithFormat:@"telprompt:%@", phoneNum]];
    if ([[UIApplication sharedApplication] canOpenURL:phoneUrl]) {
        [[UIApplication sharedApplication] openURL:phoneUrl];
        return true;
    } else{
        NSString* message = [NSString stringWithFormat:@"Thiết bị không hỗ trợ gọi điện, vui lòng gọi %@ để được hỗ trợ", phoneNum];
        UIAlertView  *calert = [[UIAlertView alloc]initWithTitle:@"Hỗ trợ" message:message delegate:nil cancelButtonTitle:@"ok" otherButtonTitles:nil, nil];
        [calert show];
    }
    return false;
}

bool c_to_objC_showSMS(const char* phone, const char* content){
    NSString *phoneStr = [NSString stringWithCString: phone encoding:NSUTF8StringEncoding];
    NSString *contentStr = [NSString stringWithCString: content encoding:NSUTF8StringEncoding];
    
    return false;
   // return [[SMSPlugin getInstance] showSMS:phoneStr withMessager:contentStr];
}

const char* c_to_objC_getUUID(const char* keyUUID){
    
    NSString *nsUseId = [NSString stringWithCString: keyUUID encoding:NSUTF8StringEncoding];
    NSString *userUUID = [UICKeyChainStore stringForKey:nsUseId];
    if(userUUID == nil)
    {
        return 0;
    }
    return   [userUUID UTF8String]; //  makeStringCopy([userUUID UTF8String]);
}

void c_to_objC_setKeyChainUser(const char* userId)
{
    NSString* uniqueIdentifier = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    
    NSString *nsUseId = [NSString stringWithCString: userId encoding:NSUTF8StringEncoding];
    NSString *nsUUID = [NSString stringWithCString: [uniqueIdentifier UTF8String] encoding:NSUTF8StringEncoding];
    [UICKeyChainStore setString:nsUUID forKey:nsUseId];
}


void c_to_objC_initStore(const std::vector<std::string>& listProDuct){
    NSMutableArray *produc = [[NSMutableArray alloc] init];
    for (int i = 0; i< listProDuct.size(); i++) {
        
        NSString *bundleIDC = [NSString stringWithCString:listProDuct.at(i).c_str() encoding:NSUTF8StringEncoding];
        [produc addObject:bundleIDC];
        
    }
    [[InAppPurchare getInApp] fetchAvailableProducts:produc];
    
}

void c_to_objC_buyItem(const std::string& item){
    NSString *nitem = [NSString stringWithCString:item.c_str() encoding:NSUTF8StringEncoding];
    
    SKProduct *validProduct   =    [[InAppPurchare getInApp] getItem:nitem ];
    if (validProduct == NULL) {
        objC_to_c_buyInAppSuccess(-1,"");
    }
    else
    {
        [[InAppPurchare getInApp] buyItem:validProduct];
    }
}

void c_to_objC_set_iClound_no_backup_folder(const char* folderPath){
    NSString* folder = [NSString stringWithUTF8String:folderPath];
    NSURL* URL= [NSURL fileURLWithPath: folder];
    if([[NSFileManager defaultManager] fileExistsAtPath:[URL path]] == NO){
         NSLog(@"Folder %@ not found", [URL path]);
        return;
    }
    
    NSError *error = nil;
    BOOL success = [URL setResourceValue: [NSNumber numberWithBool: YES] forKey: NSURLIsExcludedFromBackupKey error: &error];
    if(success){
        NSLog(@"Excluding %@ from backup", [URL lastPathComponent]);
    }
    else{
        NSLog(@"Error excluding %@ from backup %@", [URL lastPathComponent], error);
    }
}

const char* c_to_objC_getVersion(){
    return [[[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"] UTF8String];
}

const char* c_to_objC_getBundle(){
    return [[[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleIdentifier"] UTF8String];
}

/****/
