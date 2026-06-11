#import <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <PricavaGoogleCredentialSpec/PricavaGoogleCredentialSpec.h>

@interface PricavaGoogleCredential : NativePricavaGoogleCredentialSpecBase <NativePricavaGoogleCredentialSpec>
@end
#else
#import <React/RCTBridgeModule.h>

@interface PricavaGoogleCredential : NSObject <RCTBridgeModule>
@end
#endif
