#import "PricavaGoogleCredential.h"

#import <GoogleSignIn/GoogleSignIn.h>
#import <React/RCTUtils.h>

#include <memory>

static NSString *PricavaGoogleCredentialTrimmedString(NSString *value)
{
  if (![value isKindOfClass:NSString.class]) {
    return nil;
  }

  NSString *trimmedValue = [value stringByTrimmingCharactersInSet:NSCharacterSet.whitespaceAndNewlineCharacterSet];
  return trimmedValue.length > 0 ? trimmedValue : nil;
}

static NSString *PricavaGoogleCredentialBundledClientId(void)
{
  NSString *infoPlistClientId = PricavaGoogleCredentialTrimmedString(
      [NSBundle.mainBundle objectForInfoDictionaryKey:@"GIDClientID"]);

  if (infoPlistClientId != nil) {
    return infoPlistClientId;
  }

  NSString *path = [NSBundle.mainBundle pathForResource:@"GoogleService-Info" ofType:@"plist"];
  NSDictionary *plist = path != nil ? [NSDictionary dictionaryWithContentsOfFile:path] : nil;

  return PricavaGoogleCredentialTrimmedString(plist[@"CLIENT_ID"]);
}

static NSDictionary *PricavaGoogleCredentialResult(GIDGoogleUser *user, NSString *idToken)
{
  GIDProfileData *profile = user.profile;
  NSString *imageUrl = profile.hasImage ? [profile imageURLWithDimension:120].absoluteString : nil;

  return @{
    @"idToken": idToken,
    @"displayName": profile.name ?: NSNull.null,
    @"email": profile.email ?: NSNull.null,
    @"familyName": profile.familyName ?: NSNull.null,
    @"givenName": profile.givenName ?: NSNull.null,
    @"id": user.userID ?: profile.email ?: NSNull.null,
    @"phoneNumber": NSNull.null,
    @"profilePictureUri": imageUrl ?: NSNull.null
  };
}

@implementation PricavaGoogleCredential

RCT_EXPORT_MODULE(PricavaGoogleCredential)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)isAvailableAsync:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
{
  resolve(@YES);
}

- (void)signInAsync:(JS::NativePricavaGoogleCredential::GoogleCredentialOptionsSpec &)options
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
  NSString *webClientId = PricavaGoogleCredentialTrimmedString(options.webClientId());
  NSString *iosClientId = PricavaGoogleCredentialTrimmedString(options.iosClientId())
      ?: PricavaGoogleCredentialBundledClientId();
  NSString *nonce = PricavaGoogleCredentialTrimmedString(options.nonce());

  [self signInWithWebClientId:webClientId
                  iosClientId:iosClientId
                        nonce:nonce
                      resolve:resolve
                       reject:reject];
}

- (void)clearCredentialStateAsync:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject
{
  [GIDSignIn.sharedInstance signOut];
  resolve(nil);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativePricavaGoogleCredentialSpecJSI>(params);
}
#else
RCT_EXPORT_METHOD(isAvailableAsync:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  resolve(@YES);
}

RCT_EXPORT_METHOD(signInAsync:(NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  NSString *webClientId = PricavaGoogleCredentialTrimmedString(options[@"webClientId"]);
  NSString *iosClientId = PricavaGoogleCredentialTrimmedString(options[@"iosClientId"])
      ?: PricavaGoogleCredentialBundledClientId();
  NSString *nonce = PricavaGoogleCredentialTrimmedString(options[@"nonce"]);

  [self signInWithWebClientId:webClientId
                  iosClientId:iosClientId
                        nonce:nonce
                      resolve:resolve
                       reject:reject];
}

RCT_EXPORT_METHOD(clearCredentialStateAsync:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [GIDSignIn.sharedInstance signOut];
  resolve(nil);
}
#endif

- (void)signInWithWebClientId:(NSString *)webClientId
                  iosClientId:(NSString *)iosClientId
                        nonce:(NSString *)nonce
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
  if (webClientId == nil) {
    reject(@"ERR_GOOGLE_CREDENTIAL_MISSING_CLIENT_ID", @"Missing Google webClientId.", nil);
    return;
  }

  if (iosClientId == nil) {
    reject(
        @"ERR_GOOGLE_CREDENTIAL_MISSING_CLIENT_ID",
        @"Missing Google iosClientId. Pass it in options or bundle GoogleService-Info.plist.",
        nil);
    return;
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *presentingViewController = RCTPresentedViewController();

    if (presentingViewController == nil) {
      reject(
          @"ERR_GOOGLE_CREDENTIAL_MISSING_VIEW_CONTROLLER",
          @"No presenting view controller found for Google sign-in.",
          nil);
      return;
    }

    GIDSignIn.sharedInstance.configuration =
        [[GIDConfiguration alloc] initWithClientID:iosClientId serverClientID:webClientId];

    [GIDSignIn.sharedInstance signInWithPresentingViewController:presentingViewController
                                                           hint:nil
                                               additionalScopes:nil
                                                          nonce:nonce
                                                     completion:^(GIDSignInResult *_Nullable signInResult,
                                                                  NSError *_Nullable error) {
      if (error != nil) {
        reject(@"ERR_GOOGLE_CREDENTIAL_REQUEST", error.localizedDescription, error);
        return;
      }

      GIDGoogleUser *user = signInResult.user;

      if (user == nil) {
        reject(
            @"ERR_GOOGLE_CREDENTIAL_REQUEST",
            @"Google sign-in did not return a user.",
            nil);
        return;
      }

      NSString *idToken = user.idToken.tokenString;

      if (idToken.length == 0) {
        reject(
            @"ERR_GOOGLE_CREDENTIAL_REQUEST",
            @"Google sign-in did not return an ID token.",
            nil);
        return;
      }

      resolve(PricavaGoogleCredentialResult(user, idToken));
    }];
  });
}

@end
