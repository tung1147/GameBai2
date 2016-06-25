//
//  InAppPurchare.h
//  GameBaiVip
//
//  Created by Mac on 3/1/16.
//
//

#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>


@interface InAppPurchare : NSObject
{
    NSArray *arrSkpayment;   
}
//@property (nonatomic,readonly) bool isCanPurchar;

+ (InAppPurchare *)getInApp;
- (InAppPurchare *)initInApp;
- (void) fetchAvailableProducts:( NSArray*)proDuct;
- (SKProduct *) getItem:(NSString*) itemId;
- (void) buyItem:(SKProduct *)productSK;


@end
