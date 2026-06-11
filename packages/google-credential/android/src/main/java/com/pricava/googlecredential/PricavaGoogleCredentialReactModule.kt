package com.pricava.googlecredential

import android.os.Bundle
import androidx.credentials.ClearCredentialStateRequest
import androidx.credentials.CredentialOption
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetCredentialResponse
import androidx.credentials.exceptions.GetCredentialException
import androidx.credentials.exceptions.NoCredentialException
import androidx.credentials.exceptions.publickeycredential.GetPublicKeyCredentialException
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GoogleIdTokenParsingException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

@ReactModule(name = PricavaGoogleCredentialReactModule.NAME)
class PricavaGoogleCredentialReactModule(
  private val reactContext: ReactApplicationContext
) : NativePricavaGoogleCredentialSpec(reactContext) {
  private val coroutineScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

  override fun getName() = NAME

  override fun isAvailableAsync(promise: Promise) {
    promise.resolve(true)
  }

  override fun signInAsync(options: ReadableMap, promise: Promise) {
    val parsedOptions = ReactGoogleCredentialOptions.fromMap(options)

    coroutineScope.launch {
      try {
        val response = requestCredential(parsedOptions)
        promise.resolve(Arguments.fromBundle(mapCredentialResponse(response)))
      } catch (exception: NoCredentialException) {
        if (parsedOptions.androidAccountFilter == "authorized-first") {
          try {
            val fallbackOptions = parsedOptions.copy(
              androidAccountFilter = "all",
              androidAutoSelect = false
            )
            val response = requestCredential(fallbackOptions)
            promise.resolve(Arguments.fromBundle(mapCredentialResponse(response)))
          } catch (fallbackException: Exception) {
            reject(promise, fallbackException)
          }
        } else {
          reject(promise, exception)
        }
      } catch (exception: Exception) {
        reject(promise, exception)
      }
    }
  }

  override fun clearCredentialStateAsync(promise: Promise) {
    coroutineScope.launch {
      try {
        val activity = reactContext.currentActivity
          ?: throw IllegalStateException("No current activity found for Google credential sign-in.")
        val credentialManager = CredentialManager.create(activity)
        credentialManager.clearCredentialState(ClearCredentialStateRequest())
        promise.resolve(null)
      } catch (exception: Exception) {
        reject(promise, exception)
      }
    }
  }

  private suspend fun requestCredential(
    options: ReactGoogleCredentialOptions
  ): GetCredentialResponse {
    val activity = reactContext.currentActivity
      ?: throw IllegalStateException("No current activity found for Google credential sign-in.")
    val credentialManager = CredentialManager.create(activity)
    val request = GetCredentialRequest.Builder()
      .addCredentialOption(createCredentialOption(options))
      .build()

    return credentialManager.getCredential(
      context = activity,
      request = request
    )
  }

  private fun createGoogleIdOption(options: ReactGoogleCredentialOptions): GetGoogleIdOption {
    val builder = GetGoogleIdOption.Builder()
      .setFilterByAuthorizedAccounts(options.androidAccountFilter == "authorized-first")
      .setServerClientId(options.webClientId)
      .setAutoSelectEnabled(options.androidAutoSelect)

    options.nonce?.takeIf { it.isNotBlank() }?.let { builder.setNonce(it) }

    return builder.build()
  }

  private fun createSignInWithGoogleOption(
    options: ReactGoogleCredentialOptions
  ): GetSignInWithGoogleOption {
    val builder = GetSignInWithGoogleOption.Builder(options.webClientId)

    options.nonce?.takeIf { it.isNotBlank() }?.let { builder.setNonce(it) }

    return builder.build()
  }

  private fun createCredentialOption(options: ReactGoogleCredentialOptions): CredentialOption {
    return if (options.androidFlow == "sign-in-button") {
      createSignInWithGoogleOption(options)
    } else {
      createGoogleIdOption(options)
    }
  }

  private fun mapCredentialResponse(response: GetCredentialResponse): Bundle {
    val credential = response.credential

    if (credential.type != GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
      throw IllegalStateException(
        "Credential Manager returned unsupported credential type: ${credential.type}."
      )
    }

    val googleCredential = try {
      GoogleIdTokenCredential.createFrom(credential.data)
    } catch (exception: GoogleIdTokenParsingException) {
      throw IllegalStateException(
        "Credential Manager returned a Google credential that could not be parsed.",
        exception
      )
    }

    return Bundle().apply {
      putString("idToken", googleCredential.idToken)
      putString("displayName", googleCredential.displayName)
      putString("email", googleCredential.id)
      putString("familyName", googleCredential.familyName)
      putString("givenName", googleCredential.givenName)
      putString("id", googleCredential.id)
      putString("phoneNumber", googleCredential.phoneNumber)
      putString("profilePictureUri", googleCredential.profilePictureUri?.toString())
    }
  }

  private fun reject(promise: Promise, exception: Exception) {
    val code = when (exception) {
      is GetPublicKeyCredentialException -> "ERR_GOOGLE_CREDENTIAL_REQUEST"
      is GetCredentialException -> "ERR_GOOGLE_CREDENTIAL_REQUEST"
      else -> "ERR_GOOGLE_CREDENTIAL_REQUEST"
    }

    promise.reject(
      code,
      exception.localizedMessage ?: "Google credential request failed.",
      exception
    )
  }

  companion object {
    const val NAME = "PricavaGoogleCredential"
  }
}
