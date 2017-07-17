//
//  TrackingIDFA.h
//  GameBai2
//
//  Created by Balua on 7/11/17.
//
//

#import <Foundation/Foundation.h>
#import <AdSupport/ASIdentifierManager.h>
@interface TrackingIDFA : NSObject{}


+ (NSString *)identifierForAdvertising;
- (NSString *)getFacebookIDTracking;
@end
