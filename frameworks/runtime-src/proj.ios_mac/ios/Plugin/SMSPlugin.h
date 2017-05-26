#ifndef _sms_plugin_h_
#define _sms_plugin_h_

#import <Foundation/Foundation.h>
#import <MessageUI/MessageUI.h>

@interface SMSPlugin : NSObject <MFMessageComposeViewControllerDelegate>{
    UIViewController* controller;
}

+ (SMSPlugin*) getInstance;
- (BOOL) showSMS:(NSString*) numberPhone withMessager:(NSString*)content;
- (id) initWithView:(UIViewController*) view;
@end


#endif /* _sms_plugin_h_ */
