package com.paypalreactnative

import android.os.Build
import android.view.LayoutInflater
import android.widget.LinearLayout
import android.util.Log
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.ThemedReactContext
import com.paypal.checkout.approve.OnApprove
import com.paypal.checkout.error.OnError

import com.paypal.checkout.paymentbutton.*

import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.paypal.checkout.createorder.*
import com.paypal.checkout.order.*

class RNPaypalButtonView: LinearLayout {
    private var context: ThemedReactContext
    // button config
    private var color: PayPalButtonColor = PayPalButtonColor.GOLD
    private var label: PayPalButtonLabel = PayPalButtonLabel.PAYPAL
    private var size: PaymentButtonSize = PaymentButtonSize.MEDIUM
    private var shape: PaymentButtonShape = PaymentButtonShape.ROUNDED
    // order config
    private var amountValue: String = "0.0"
    private var currencyCode: CurrencyCode = CurrencyCode.EUR
    private var referenceId: String? = null
    private var invoiceId: String? = null
    //shipping config
    private var address: String? = null
    private var city: String? = null
    private var postalCode: String? = null
    private var countryCode: String = "FR"

    // paypal button
    private lateinit var paypalButton: PaymentButtonContainer;

    @RequiresApi(Build.VERSION_CODES.M)
    constructor(context: ThemedReactContext) : super(context) {
        this.context = context
    }

    @RequiresApi(Build.VERSION_CODES.M)
    fun setupButtonView() {
        // val inflater = LayoutInflater.from(context)
        // this.paypalButton = inflater.inflate(R.layout.paypal_layout, null, false)

        this.paypalButton = PaymentButtonContainer(context);

        this.paypalButton.paypalButtonColor = this.color
        this.paypalButton.paypalButtonLabel = this.label
        this.paypalButton.paypalButtonSize = this.size
        this.paypalButton.paypalButtonShape = this.shape
        this.paypalButton.paypalButtonEnabled = true

        // this.paypalButton.onEk =
        // { buttonEligibilityStatus: PaymentButtonEligibilityStatus ->
        //     Log.v("PaypalButton", "OnEligibilityStatusChanged")
        //     Log.d("PaypalButton", "Button eligibility status: $buttonEligibilityStatus")
        // }


        this.paypalButton.setup(
            createOrder = CreateOrder { createOrderActions ->
                // val order =
                //     Order(
                //         OrderIntent.AUTHORIZE,
                //         AppContext(userAction = UserAction.PAY_NOW, shippingPreference = ShippingPreference.SET_PROVIDED_ADDRESS),
                //         listOf(
                //             PurchaseUnit(
                //                 referenceId = this.referenceId,
                //                 invoiceId = this.invoiceId,
                //                 amount = Amount(currencyCode = this.currencyCode, value = this.amountValue),
                //                 shipping = Shipping(Address(addressLine1 = this.address, adminArea2 = this.city, postalCode = this.postalCode, countryCode = this.countryCode))
                //             )
                //         )
                //     )
                val order = OrderRequest.Builder()
                    .appContext(AppContext(userAction = UserAction.PAY_NOW, shippingPreference = ShippingPreference.SET_PROVIDED_ADDRESS))
                    .intent(OrderIntent.AUTHORIZE)
                    .purchaseUnitList(
                            listOf(
                                    PurchaseUnit.Builder()
                                            .referenceId(this.referenceId)
                                            .invoiceId(this.invoiceId)
                                            .amount(
                                                Amount.Builder()
                                                    .value(this.amountValue)
                                                    .currencyCode(this.currencyCode)
                                                    .build()
                                            )
                                            .shipping(
                                                Shipping.Builder()
                                                    .address(
                                                        Address.Builder()
                                                        .addressLine1(this.address)
                                                        .adminArea2(this.city)
                                                        .postalCode(this.postalCode)
                                                        .countryCode(this.countryCode)
                                                        .build()
                                                    )
                                                    .build()
                                            )
                                            .build()
                            )
                    )
                    .build()

                createOrderActions.create(order)
            },
            onApprove = OnApprove { approval ->
                onApproveNativeEvent(approval.data.orderId)
            },
            onError = OnError { errorInfo ->
                // Unexpected error returned by the android sdk when closing the paypal subview
                if (errorInfo.error.localizedMessage !== "Return URL is null") {
                  onErrorNativeEvent(errorInfo.error.localizedMessage)
                }
            }
        );

        addView(this.paypalButton);
    }

    @RequiresApi(Build.VERSION_CODES.M)
    fun setButtonColor(color: String?) {
        when (color) {
            "black" -> this.color = PayPalButtonColor.BLACK
            "gold" -> this.color = PayPalButtonColor.GOLD
            "silver" -> this.color = PayPalButtonColor.SILVER
            "white" -> this.color = PayPalButtonColor.WHITE
            else -> {
                this.color = PayPalButtonColor.BLUE
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    fun setLabel(label: String?) {
        when (label) {
            "payWith" -> this.label = PayPalButtonLabel.PAY
            "buyNow" -> this.label = PayPalButtonLabel.BUY_NOW
            "checkout" -> this.label = PayPalButtonLabel.CHECKOUT
            else -> {
                this.label = PayPalButtonLabel.PAYPAL
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    fun setSize(size: String?) {
        when (size) {
            "full" -> this.size = PaymentButtonSize.LARGE
            "expanded" -> this.size = PaymentButtonSize.LARGE
            "collapsed" -> this.size = PaymentButtonSize.MEDIUM
            "mini" -> this.size = PaymentButtonSize.SMALL
            else -> {
                this.size = PaymentButtonSize.MEDIUM
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    fun setShape(shape: String?) {
        when (shape) {
            "rounded" -> this.shape = PaymentButtonShape.PILL
            "softEdges" -> this.shape = PaymentButtonShape.ROUNDED
            "hardEdges" -> this.shape = PaymentButtonShape.RECTANGLE
            else -> {
                this.shape = PaymentButtonShape.ROUNDED
            }
        }
    }

    fun setAmountValue(amount: String?) {
        if (amount != null) {
            this.amountValue = amount
        }
    }

    fun setCurrencyCode(currencyCode: String?) {
        if (currencyCode != null) {
            this.currencyCode = CurrencyCode.valueOf(currencyCode)
        }
    }

    fun setReferenceId(referenceId: String?) {
        this.referenceId = referenceId
    }

    fun setInvoiceId(invoiceId: String?) {
      this.invoiceId = invoiceId
    }

    fun setAddress(address: String?) {
        this.address = address
    }

    fun setCity(city: String?) {
        this.city = city
    }

    fun setPostalCode(postalCode: String?) {
        this.postalCode = postalCode
    }

    fun setCountryCode(countryCode: String?) {
        if (countryCode != null) {
            this.countryCode = countryCode
        }
    }

    fun onApproveNativeEvent(paypalOrderId: String?) {
        val event: WritableMap = Arguments.createMap()
        event.putString("orderId", paypalOrderId)

        this.context
            .getJSModule(RCTEventEmitter::class.java)
            .receiveEvent(getId(), "onApproveNativeEvent", event)
    }

    fun onErrorNativeEvent(error: String?) {
        val event: WritableMap = Arguments.createMap()
        event.putString("error", error)

        this.context
            .getJSModule(RCTEventEmitter::class.java)
            .receiveEvent(getId(), "onErrorNativeEvent", event)
    }
}
