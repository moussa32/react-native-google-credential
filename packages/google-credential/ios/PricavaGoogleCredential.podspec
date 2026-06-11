Pod::Spec.new do |s|
  s.name           = "PricavaGoogleCredential"
  s.version        = "1.0.0"
  s.summary        = "React Native Google credential sign-in."
  s.description    = "React Native TurboModule support for Android Credential Manager, GoogleSignIn on iOS, and Google Identity Services on web."
  s.author         = "Pricava"
  s.homepage       = "https://pricava.com"
  s.license        = "UNLICENSED"
  s.platforms      = { :ios => "15.1" }
  s.source         = { :path => "." }
  s.source_files   = "*.{h,m,mm}"
  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "YES",
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++20"
  }

  s.dependency "GoogleSignIn", "~> 9.0"

  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end
