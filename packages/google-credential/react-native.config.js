module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: "./android",
        packageImportPath:
          "import com.pricava.googlecredential.PricavaGoogleCredentialPackage;",
        packageInstance: "new PricavaGoogleCredentialPackage()",
      },
      ios: {
        podspecPath: "./ios/PricavaGoogleCredential.podspec",
      },
    },
  },
};
