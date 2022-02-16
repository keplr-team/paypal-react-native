package com.paypalreactnative

import android.os.Build
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

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun setup(clientId: String, returnUrl: String, isLive: Boolean) {
        val environment = if (isLive) Environment.LIVE else Environment.SANDBOX;
        val config = CheckoutConfig(this.context.currentActivity!!.application, clientId, environment, returnUrl, CurrencyCode.EUR, UserAction.PAY_NOW);
        PayPalCheckout.setConfig(config)
    }

    @Override
    override fun getName(): String {
        return "RNPaypal"
    }
}
