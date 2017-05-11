//
//  FacebookPlugin_iOS.m
//  GameBaiVip
//
//  Created by QuyetNguyen on 3/4/16.
//
//

#import "FacebookPlugin_iOS.h"
#include "FacebookPlugin_iOS_link.h"


void _c_to_objc_showLogin(){
    dispatch_async(dispatch_get_main_queue(), ^{
        [[FacebookPlugin_iOS getInstance] showLogin];
    });
}

void _c_to_objc_logout(){
    dispatch_async(dispatch_get_main_queue(), ^{
        [[FacebookPlugin_iOS getInstance] logout];
    });
}

@implementation FacebookPlugin_iOS

static FacebookPlugin_iOS* s_FacebookPlugin_iOS = 0;
+ (FacebookPlugin_iOS*) getInstance{
    if(!s_FacebookPlugin_iOS){
        s_FacebookPlugin_iOS = [[FacebookPlugin_iOS alloc] init];
        [s_FacebookPlugin_iOS retain];
    }
    return s_FacebookPlugin_iOS;
}

- (id) initWithView:(UIViewController*) view{
    viewController = view;
    loginManager = [[FBSDKLoginManager alloc] init];
    loginID =  [[NSBundle mainBundle] objectForInfoDictionaryKey:@"FacebookAppIDLogin"];
    
    return self;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions{
    return [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation{
    return [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

- (void)applicationDidBecomeActive:(UIApplication *)application{
    [FBSDKAppEvents activateApp];
}

- (void) showLogin{
    FBSDKAccessToken* accessToken = [FBSDKAccessToken currentAccessToken];
    if(accessToken){
        NSString* accessTokenStr = [accessToken tokenString];
        NSString* userIdStr = [accessToken userID];
        dispatch_async(dispatch_get_main_queue(), ^{
             _objc_to_c_fbLogin_finished(0, [userIdStr UTF8String], [accessTokenStr UTF8String]);
        });
        [self requestGetProfile];
    }
    else{
        if(loginID){
            [FBSDKSettings setAppID:loginID];
        }
        
        [loginManager logInWithReadPermissions:@[@"public_profile"] fromViewController:viewController handler:^(FBSDKLoginManagerLoginResult *result, NSError *error){
            if (error) {
                //NSLog(@"Process error");
                dispatch_async(dispatch_get_main_queue(), ^{
                    _objc_to_c_fbLogin_finished(1, "", "");
                });
            } else if (result.isCancelled) {
                //NSLog(@"Cancelled");
                dispatch_async(dispatch_get_main_queue(), ^{
                    _objc_to_c_fbLogin_finished(-1, "", "");
                });
            } else {
               // NSLog(@"Logged in");
                NSString* accessTokenStr = [[result token] tokenString];
                NSString* userIdStr = [[result token] userID];
                dispatch_async(dispatch_get_main_queue(), ^{
                    _objc_to_c_fbLogin_finished(0, [userIdStr UTF8String], [accessTokenStr UTF8String]);
                });
                
                [self requestGetProfile];
            }
        }];
    }
}

- (void) logout{
    [loginManager logOut];
}

- (void) requestGetProfile{
    FBSDKGraphRequest* request = [[FBSDKGraphRequest alloc] initWithGraphPath:@"me" parameters:nil];
                                  
    [request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {
         if (!error) {
             NSLog(@"fetched user:%@", result);
         }
     }];
}

@end
