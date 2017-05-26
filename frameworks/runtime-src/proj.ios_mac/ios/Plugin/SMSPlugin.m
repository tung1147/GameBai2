#import <Foundation/Foundation.h>
#import "SMSPlugin.h"


@implementation SMSPlugin

static SMSPlugin* s_SMSPlugin = 0;
+ (SMSPlugin*) getInstance{
    if (!s_SMSPlugin) {
        s_SMSPlugin = [[SMSPlugin alloc] init];
        [s_SMSPlugin retain];
    }
    
    return s_SMSPlugin;
}

- (BOOL) showSMS:(NSString*) numberPhone withMessager:(NSString*)content{
    if(![MFMessageComposeViewController canSendText]) {
        
        NSString *ssss = [NSString stringWithFormat:@"Thiết bị của bạn không hỗ trợ gửi SMS. Dùng thiết bị khác để gửi tới %@. Cú pháp: %@", numberPhone, content];
        UIAlertView *warningAlert = [[UIAlertView alloc] initWithTitle:@"Thông báo" message:ssss delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [warningAlert show];
        return NO;
    }
    
    NSArray *recipents = @[numberPhone];
    
    MFMessageComposeViewController *messageController = [[MFMessageComposeViewController alloc] init];
    messageController.messageComposeDelegate = self;
    [messageController setRecipients:recipents];
    [messageController setBody:content];
    
    // Present message view controller on screen
    [controller presentViewController:messageController animated:YES completion:nil];
    return YES;
}

- (void)messageComposeViewController:(MFMessageComposeViewController *)_controller didFinishWithResult:(MessageComposeResult)result{
//    switch (result) {
//        case MessageComposeResultCancelled:
//            break;
//            
//        case MessageComposeResultFailed:
//        {
//            UIAlertView *warningAlert = [[UIAlertView alloc] initWithTitle:@"Error" message:@"Failed to send SMS!" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
//            [warningAlert show];
//            break;
//        }
//            
//        case MessageComposeResultSent:
//            break;
//            
//        default:
//            break;
//    }
    
    [_controller dismissViewControllerAnimated:YES completion:nil];
}

- (id) initWithView:(UIViewController*) view {
    controller =  view;
    return self;
}

@end
