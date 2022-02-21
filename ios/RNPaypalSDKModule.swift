import Foundation
import PayPalCheckout

@objc(RNPaypal)
class RNPaypal: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func setup(_ clientID: NSString, returnUrl: NSString, isLive: ObjCBool, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    let config = CheckoutConfig(
        clientID: clientID as String,
        returnUrl: returnUrl as String,
        environment: isLive.boolValue ? .live : .sandbox
    )

    Checkout.set(config: config)

    resolve(nil)
  }
}

@objc(RNPaypalButtonManager)
class RNPaypalButtonManager: RCTViewManager {
  override var methodQueue: DispatchQueue! {
    return DispatchQueue.main
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func view() -> RNPaypalButton {
    return  RNPaypalButton()
  }
}

@objc(RNPaypalButton)
class RNPaypalButton : UIView {
  //  button config
  @objc var variant: NSDictionary?

  //  order config
  @objc var order: NSDictionary = NSDictionary() {
    didSet {
        if let referenceId = order["referenceId"] as? String {
          self.referenceId = referenceId
        } else {
          self.referenceId = nil
        }
        if let amount = order["amount"] as? String {
          self.amount = amount
        }
        if let currency = order["currency"] as? String {
          self.currency = currency
        }
    }
  }
  private var referenceId: String?
  private var amount: String = "0.0"
  private var currency: String = "EUR"

  // shipping config
  @objc var shipping: NSDictionary = NSDictionary() {
    didSet {
        if let address = shipping["address"] as? String {
          self.address = address
        } else {
          self.address = nil
        }
        if let city = shipping["city"] as? String {
          self.city = city
        } else {
          self.city = nil
        }
        if let postalCode = shipping["postalCode"] as? String {
          self.postalCode = postalCode
        } else {
          self.postalCode = nil
        }
        if let countryCode = order["countryCode"] as? String {
          self.countryCode = countryCode
        }
    }
  }
  private var address: String?
  private var city: String?
  private var postalCode: String?
  private var countryCode: String = "FR"

  //  callbacks
  @objc var onApprove: RCTDirectEventBlock?
  @objc var onError: RCTDirectEventBlock?

  override init(frame: CGRect) {
    super.init(frame: frame)
    self.frame = frame
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) is not been implemented");
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    self.setupCheckout()
    let paymentButton = PayPalButton.init(color: toPayPalColor(), edges: toPayPalEdges(), size: toPayPalSize(), label: toPayPalLabel())
    paymentButton.frame = self.frame
    self.insertSubview(paymentButton, at: 0)
  }

  private func createOrder(createOrderAction: CreateOrderAction) {
    let currency = PayPalCheckout.CurrencyCode.currencyCode(from: self.currency)
    if currency == nil {
      if self.onError != nil {
        self.onError!(["error": "invalid currency code"])
      }
      return
    }

    let amount = PurchaseUnit.Amount(
        currencyCode: currency!,
        value: self.amount
    )
    let orderAddress = OrderAddress.init(countryCode: self.countryCode, addressLine1: self.address, adminArea2: self.city, postalCode: self.postalCode)
    let shipping = PurchaseUnit.Shipping(
      address: orderAddress
    )
    let purchaseUnit = PurchaseUnit.init(
      amount: amount,
      referenceId: self.referenceId == nil ? nil : self.referenceId,
      shipping: shipping
    )
    let applicationContext = OrderApplicationContext.init(shippingPreference: OrderApplicationContext.ShippingPreference.setProvidedAddress, userAction: OrderApplicationContext.UserAction.payNow)
    let order = OrderRequest(intent: .authorize, purchaseUnits: [purchaseUnit], applicationContext: applicationContext)
    createOrderAction.create(order: order)
  }

  private func onOrderApprove(approval: PayPalCheckout.Approval) {
    self.onApprove!(["orderId": approval.data.ecToken])
  }

  private func setupCheckout() {
    Checkout.setCreateOrderCallback { createOrderAction in
      self.createOrder(createOrderAction: createOrderAction)
    }

    Checkout.setOnApproveCallback { approval in
      self.onOrderApprove(approval: approval)
    }

    Checkout.setOnErrorCallback { errorInfo in
      print("error reason", errorInfo.error)
      if self.onError != nil {
        self.onError!(["error": errorInfo.error.localizedDescription])
      }
    }
  }

  private func toPayPalColor() -> PayPalButton.Color {
    if let color = variant?["color"] as? String {
      switch color {
        case "black":
          return PayPalButton.Color.black
        case "gold":
          return PayPalButton.Color.gold
        case "silver":
          return PayPalButton.Color.silver
        case "white":
          return PayPalButton.Color.white
        default:
          return PayPalButton.Color.blue
      }
    } else {
      return PayPalButton.Color.blue
    }
  }

  private func toPayPalSize() -> PaymentButtonSize {
    if let size = variant?["size"] as? String {
      switch size {
        case "expanded":
          return PaymentButtonSize.expanded
        case "full":
          return PaymentButtonSize.full
        case "collapsed":
          return PaymentButtonSize.collapsed
        case "mini":
          return PaymentButtonSize.mini
        default:
          return PaymentButtonSize.full
      }
    } else {
      return PaymentButtonSize.full
    }
  }

  private func toPayPalLabel() -> PayPalButton.Label {
    if let label = variant?["label"] as? String {
      switch label {
        case "payWith":
          return PayPalButton.Label.payWith
        case "buyNow":
          return PayPalButton.Label.buyNow
        case "checkout":
          return PayPalButton.Label.checkout
        default:
          return PayPalButton.Label.none
      }
    } else {
      return PayPalButton.Label.none
    }
  }

  private func toPayPalEdges() -> PaymentButtonEdges {
    if let shape = variant?["shape"] as? String {
      switch shape {
      case "rounded":
        return PaymentButtonEdges.rounded
      case "softEdges":
        return PaymentButtonEdges.softEdges
      case "hardEdges":
        return PaymentButtonEdges.hardEdges
      default:
        return PaymentButtonEdges.softEdges
      }
    } else {
      return PaymentButtonEdges.softEdges
    }
  }
}
