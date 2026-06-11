const { IOSConfig, withInfoPlist } = require("@expo/config-plugins");

function getTrimmedEnv(name) {
  return process.env[name]?.trim() || null;
}

function getReversedGoogleClientId(clientId) {
  const suffix = ".apps.googleusercontent.com";

  if (!clientId?.endsWith(suffix)) {
    return null;
  }

  return `com.googleusercontent.apps.${clientId.slice(0, -suffix.length)}`;
}

module.exports = function withGoogleCredentialIos(config, props = {}) {
  return withInfoPlist(config, (config) => {
    const iosClientId =
      props.iosClientId?.trim?.() || getTrimmedEnv("GOOGLE_IOS_CLIENT_ID");
    const explicitUrlScheme =
      props.iosUrlScheme?.trim?.() || getTrimmedEnv("GOOGLE_IOS_URL_SCHEME");
    const urlScheme =
      explicitUrlScheme || getReversedGoogleClientId(iosClientId);

    if (iosClientId) {
      config.modResults.GIDClientID = iosClientId;
    }

    if (urlScheme && !IOSConfig.Scheme.hasScheme(urlScheme, config.modResults)) {
      config.modResults = IOSConfig.Scheme.appendScheme(
        urlScheme,
        config.modResults,
      );
    }

    return config;
  });
};
