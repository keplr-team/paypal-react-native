package com.paypalreactnative

import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.bridge.ReadableMap


class RNPaypalButtonViewManager: SimpleViewManager<RNPaypalButtonView> {
    var reactContext: ReactApplicationContext

    constructor(reactContext: ReactApplicationContext) {
        this.reactContext = reactContext
    }

    override fun getName(): String {
        return "RNPaypalButton"
    }

    @RequiresApi(Build.VERSION_CODES.M)
    override fun createViewInstance(reactContext: ThemedReactContext): RNPaypalButtonView {
        return RNPaypalButtonView(reactContext)
    }

    @RequiresApi(Build.VERSION_CODES.M)
    override fun onAfterUpdateTransaction(view: RNPaypalButtonView) {
        super.onAfterUpdateTransaction(view)

        view.setupButtonView()
    }

    private fun getValOr(map: ReadableMap, key: String, default: String? = ""): String? {
        return if (map.hasKey(key)) map.getString(key) else default
    }

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactProp(name = "variant")
    fun setVariant(view: RNPaypalButtonView, variant: ReadableMap) {
        val color = getValOr(variant, "color")
        val label = getValOr(variant, "label")
        val size = getValOr(variant, "size")
        val shape = getValOr(variant, "shape")

        view.setButtonColor(color)
        view.setLabel(label)
        view.setSize(size)
        view.setShape(shape)
    }

    @ReactProp(name = "order")
    fun setOrder(view: RNPaypalButtonView, order: ReadableMap) {
        val referenceId = getValOr(order, "referenceId")
        val invoiceId = getValOr(order, "invoiceId")
        val amount = getValOr(order, "amount")
        val currency = getValOr(order, "currency")

        view.setReferenceId(referenceId)
        view.setInvoiceId(invoiceId)
        view.setAmountValue(amount)
        view.setCurrencyCode(currency)
    }

    @ReactProp(name = "shipping")
    fun setShipping(view: RNPaypalButtonView, shipping: ReadableMap) {
        val address = getValOr(shipping, "address")
        val city = getValOr(shipping, "city")
        val postalCode = getValOr(shipping, "postalCode")
        val countryCode = getValOr(shipping, "countryCode")

        view.setAddress(address)
        view.setCity(city)
        view.setPostalCode(postalCode)
        view.setCountryCode(countryCode)
    }

    override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any>? {
        return MapBuilder.builder<String, Any>()
                .put("onApproveNativeEvent",
                        MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onApprove")))
                .put("onErrorNativeEvent",
                        MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onError")))
                .build()
    }
}
