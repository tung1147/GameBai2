//
//  InAppPurchare.m
//  GameBaiVip
//
//  Created by Mac on 3/1/16.
//
//

#import "InAppPurchare.h"
#include "cMediate.h"
@interface InAppPurchare()< SKProductsRequestDelegate,SKPaymentTransactionObserver>


@end

@implementation InAppPurchare
static InAppPurchare *shareInApp =  nil;

+ (InAppPurchare *)getInApp
{
    if (shareInApp == nil) {
        shareInApp = [[InAppPurchare alloc] initInApp];
        [shareInApp retain];
    }
 
    return shareInApp;
}
- (InAppPurchare *)initInApp
{
    self = [super init];
    if (self) {
          NSLog(@"Products start!");
        //[self  fetchAvailableProducts:proDuct];
    }
    
    return self;
}
- (void) fetchAvailableProducts:( NSArray *)proDuct
{
    NSSet *productIdentifiers = [NSSet
                                 setWithArray:proDuct];
    SKProductsRequest *productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:productIdentifiers];
    productsRequest.delegate = self;
    [productsRequest start];
    
}
- (void)purchase:(SKProduct *)product{
    SKPayment *payment = [SKPayment paymentWithProduct:product];
    
    [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
    [[SKPaymentQueue defaultQueue] addPayment:payment];
}
- (SKProduct *) getItem:(NSString*) itemId
{
    
    for (int i = 0; i< arrSkpayment.count ;i ++) {
        SKProduct *validProduct = [arrSkpayment objectAtIndex:i];
        if ([validProduct.productIdentifier isEqualToString:itemId]) {
            return validProduct;
        }
    }
    return NULL;
}

- (void) buyItem:(SKProduct *)productSK
{
    SKPayment *payment = [SKPayment paymentWithProduct:productSK];
    
    [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
    [[SKPaymentQueue defaultQueue] addPayment:payment];

}
-(void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
    SKProduct *validProduct = nil;
    int count = (int)[response.products count];
    if(count > 0){
        validProduct = [response.products objectAtIndex:0];
        arrSkpayment = [response.products copy];
        NSLog(@"Products Available!");
        
     
     
    }
    else if(!validProduct){
        NSLog(@"No products available");
     
        //this is called if your product id is not valid, this shouldn't be called unless that happens.
    }
}

- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions{
    for(SKPaymentTransaction *transaction in transactions){
        switch(transaction.transactionState){
            case SKPaymentTransactionStatePurchasing:
                NSLog(@"Transaction state -> Purchasing");
     
                //called when the user is in the process of purchasing, do not add any of your own code here.
                break;
            case SKPaymentTransactionStatePurchased:
            {
                //this is called when the user has successfully purchased the package (Cha-Ching!)
               //you can add your code for what you want to happen when the user buys the purchase here, for this tutorial we use removing ads
                [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
                NSLog(@"Transaction state -> Purchased");
                
                
//              NSString* newStr = [[NSString alloc] initWithData:transaction.transactionReceipt encoding:NSUTF8StringEncoding];
                const char* cString = [  [transaction.transactionReceipt base64EncodedStringWithOptions:0] UTF8String];
                obj_to_c_buyAppSuccess(0,cString);
          
            }
                break;
            case SKPaymentTransactionStateRestored:
            {
                NSLog(@"Transaction state -> Restored");
                //add the same code as you did from SKPaymentTransactionStatePurchased here
                NSString* newStr = [[NSString alloc] initWithData:transaction.transactionReceipt encoding:NSUTF8StringEncoding];
                [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
                const char* cString = [newStr UTF8String];
                obj_to_c_buyAppSuccess(0,cString);
            }
               
                break;
            case SKPaymentTransactionStateFailed:
            {
                //called when the transaction does not finish
                if(transaction.error.code == SKErrorPaymentCancelled){
                    NSLog(@"Transaction state -> Cancelled");
                    //the user cancelled the payment ;(
                }
                [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
                obj_to_c_buyAppSuccess(1,"");
            }
                break;
            default:
                break;
        }
    }
}



@end
