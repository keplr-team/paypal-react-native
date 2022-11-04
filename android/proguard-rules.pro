# Paypal
# cf : https://github.com/paypal/android-checkout-sdk/blob/main/CHANGELOG.md#required-proguard-rules-for-061
-keepclassmembers class * extends com.google.crypto.tink.shaded.protobuf.GeneratedMessageLite {
  <fields>;
}
