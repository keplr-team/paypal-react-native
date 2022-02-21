#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <React/RCTUtils.h>

@interface RCT_EXTERN_MODULE(RNPaypal, NSObject)
RCT_EXTERN_METHOD(setup:(NSString*)clientID returnUrl:(NSString*)returnUrl isLive:(BOOL)isLive resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
@end

@interface RCT_EXTERN_MODULE(RNPaypalButtonManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(variant, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(order, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(shipping, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(onApprove, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock);
@end
