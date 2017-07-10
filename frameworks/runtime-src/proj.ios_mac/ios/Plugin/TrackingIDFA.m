//
//  TrackingIDFA.m
//  GameBai2
//
//  Created by Balua on 7/10/17.
//
//

#import "TrackingIDFA.h"

@implementation TrackingIDFA

+ (NSString *)identifierForAdvertising
{
    if([[ASIdentifierManager sharedManager] isAdvertisingTrackingEnabled])
    {
        NSUUID *IDFA = [[ASIdentifierManager sharedManager] advertisingIdentifier];
        NSLog(@"IDFA:%@", [IDFA UUIDString]);
        return [IDFA UUIDString];
    }
    
    return @"";
}

@end
