//
//  FacebookPlugin_iOS.h
//  GameBaiVip
//
//  Created by QuyetNguyen on 3/4/16.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>

@interface FacebookPlugin_iOS : NSObject{
    UIViewController* viewController;
    FBSDKLoginManager *loginManager;
    NSString* loginID;
}

+ (FacebookPlugin_iOS*) getInstance;

- (id) initWithView:(UIViewController*) view;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation;
- (void)applicationDidBecomeActive:(UIApplication *)application;

- (void) showLogin;
- (void) logout;

@end
