package com.pricava.googlecredential

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class PricavaGoogleCredentialPackage : BaseReactPackage() {
  override fun getModule(
    name: String,
    reactContext: ReactApplicationContext
  ): NativeModule? {
    return if (name == PricavaGoogleCredentialReactModule.NAME) {
      PricavaGoogleCredentialReactModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      mapOf(
        PricavaGoogleCredentialReactModule.NAME to ReactModuleInfo(
          PricavaGoogleCredentialReactModule.NAME,
          PricavaGoogleCredentialReactModule::class.java.name,
          false,
          false,
          false,
          true
        )
      )
    }
  }
}
