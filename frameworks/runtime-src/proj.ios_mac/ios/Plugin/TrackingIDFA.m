//
//  TrackingIDFA.m
//  GameBai2
//
//  Created by Balua on 7/11/17.
//
//

#import "TrackingIDFA.h"

@implementation TrackingIDFA


+ (NSString *)identifierForAdvertising
{
    if([[ASIdentifierManager sharedManager] isAdvertisingTrackingEnabled])
    {
        NSUUID *IDFA = [[ASIdentifierManager sharedManager] advertisingIdentifier];
        return [IDFA UUIDString];
    }
    
    return @"";
}

+ (NSString *)getFacebookIDTracking{
    NSString *path = [[NSBundle mainBundle] pathForResource:@"Info" ofType:@"plist"];
    NSDictionary *dict = [NSDictionary dictionaryWithContentsOfFile:path];
    return [dict objectForKey:@"FacebookAppID"];
}

@end
