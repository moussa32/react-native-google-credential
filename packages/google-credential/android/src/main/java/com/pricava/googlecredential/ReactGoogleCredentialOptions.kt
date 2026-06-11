package com.pricava.googlecredential

import com.facebook.react.bridge.ReadableMap

internal data class ReactGoogleCredentialOptions(
  val webClientId: String,
  val iosClientId: String? = null,
  val nonce: String? = null,
  val androidFlow: String = "sign-in-button",
  val androidAccountFilter: String = "authorized-first",
  val androidAutoSelect: Boolean = true,
  val webAutoSelect: Boolean = true,
  val webUseFedCm: Boolean = true
) {
  companion object {
    fun fromMap(options: ReadableMap): ReactGoogleCredentialOptions {
      return ReactGoogleCredentialOptions(
        webClientId = options.getString("webClientId") ?: "",
        iosClientId = options.optionalString("iosClientId"),
        nonce = options.optionalString("nonce"),
        androidFlow = options.optionalString("androidFlow") ?: "sign-in-button",
        androidAccountFilter = options.optionalString("androidAccountFilter") ?: "authorized-first",
        androidAutoSelect = options.optionalBoolean("androidAutoSelect") ?: true,
        webAutoSelect = options.optionalBoolean("webAutoSelect") ?: true,
        webUseFedCm = options.optionalBoolean("webUseFedCm") ?: true
      )
    }
  }
}

private fun ReadableMap.optionalString(key: String): String? {
  if (!hasKey(key) || isNull(key)) {
    return null
  }

  return getString(key)?.takeIf { it.isNotBlank() }
}

private fun ReadableMap.optionalBoolean(key: String): Boolean? {
  if (!hasKey(key) || isNull(key)) {
    return null
  }

  return getBoolean(key)
}
