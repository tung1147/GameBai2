//
//  cMediate.m
//  GameBaiVip
//
//  Created by Mac on 3/1/16.
//
//

#include "cMediate.h"
#include "UICKeyChainStore.h"
#include "InAppPurchare.h"
#import <StoreKit/StoreKit.h>

void c_to_objCCallSupport(const char* numSupport)
{
  NSString *phNo = [NSString stringWithCString: numSupport encoding:NSUTF8StringEncoding];
    NSURL *phoneUrl = [NSURL URLWithString:[NSString  stringWithFormat:@"telprompt:%@",phNo]];
    
    if ([[UIApplication sharedApplication] canOpenURL:phoneUrl]) {
        [[UIApplication sharedApplication] openURL:phoneUrl];
    } else
    {
      UIAlertView  *calert = [[UIAlertView alloc]initWithTitle:@"Alert" message:@"Call facility is not available!!!" delegate:nil cancelButtonTitle:@"ok" otherButtonTitles:nil, nil];
    [calert show];
    }
}

const char* c_to_objC_getUUID(const char* keyUUID)
{   

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


void c_to_objCinitStore(const std::vector<std::string>& listProDuct)
{
    NSMutableArray *produc = [[NSMutableArray alloc] init];
    for (int i = 0; i< listProDuct.size(); i++) {
        
         NSString *bundleIDC = [NSString stringWithCString:listProDuct.at(i).c_str() encoding:NSUTF8StringEncoding];
        [produc addObject:bundleIDC];
        
    }
    [[InAppPurchare getInApp] fetchAvailableProducts:produc];
  
}

void c_to_objBuyItem(const std::string& item)
{
    NSString *nitem = [NSString stringWithCString:item.c_str() encoding:NSUTF8StringEncoding];

    SKProduct *validProduct   =    [[InAppPurchare getInApp] getItem:nitem ];
    if (validProduct == NULL) {
       obj_to_c_buyAppSuccess(-1,"");
    }
    else
    {
        [[InAppPurchare getInApp] buyItem:validProduct];
    }
}

const char* c_to_obj_getVersion()
{

   return [[[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"] UTF8String];
}

const char* c_to_obj_getBundle()
{
    
    return [[[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleIdentifier"] UTF8String];
}

//@implementation cMediate
//
//@end
