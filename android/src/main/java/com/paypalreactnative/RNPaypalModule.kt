package com.paypalreactnative

import android.app.Application
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import androidx.annotation.RequiresApi
import com.paypal.checkout.PayPalCheckout
import com.paypal.checkout.config.*
import com.paypal.checkout.createorder.CurrencyCode
import com.paypal.checkout.createorder.UserAction

class RNPaypalModule: ReactContextBaseJavaModule {
    var context: ReactApplicationContext;

    constructor(context: ReactApplicationContext): super(context) {
        this.context = context
    }

  companion object {
    @RequiresApi(Build.VERSION_CODES.M)
    fun setup(application: Application, clientId: String, returnUrl: String, env: String) {
      val environment = if (env === "production") Environment.LIVE else Environment.SANDBOX;
      val config = CheckoutConfig(application = application, clientId = clientId, environment = environment, returnUrl = returnUrl, currencyCode = CurrencyCode.EUR, userAction = UserAction.PAY_NOW)
      PayPalCheckout.setConfig(config)
    }
  }

    @Override
    override fun getName(): String {
        return "RNPaypal"
    }
}
