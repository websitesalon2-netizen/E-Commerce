import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CreditCard, 
  QrCode, 
  Banknote, 
  AlertCircle, 
  Check, 
  ArrowLeft,
  Copy,
  Lock,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../lib/currency';
import { getOrderWhatsAppUrl } from '../lib/whatsapp';
import { OrderItem, PaymentMethod } from '../types';

interface CheckoutPageProps {
  onBackToShop: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToShop,
  onOrderSuccess,
}) => {
  const { 
    cart, 
    cartSubtotal, 
    deliveryCharge, 
    cartGrandTotal, 
    deliverySettings, 
    paymentSettings,
    contactSettings,
    placeOrder 
  } = useStore();

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsappSameAsMobile, setWhatsappSameAsMobile] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Pulwama');
  const [pinCode, setPinCode] = useState('192121');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // COD Distance Evaluation (km from Pulwama store)
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState<number>(3);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Submission & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const codAllowed = deliverySettings.codRadiusKm > 0 && estimatedDistanceKm <= deliverySettings.codRadiusKm;

  // Validation
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!fullName.trim()) errors.fullName = 'Full Name is required.';
    
    // Indian 10-digit mobile number
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile number (e.g. 9622229622).';
    }

    if (!whatsappSameAsMobile) {
      const cleanWa = whatsappNumber.replace(/\D/g, '');
      if (!cleanWa || cleanWa.length !== 10) {
        errors.whatsappNumber = 'Enter a valid 10-digit WhatsApp number.';
      }
    }

    if (!address.trim()) errors.address = 'Complete delivery address is required.';
    
    // Indian 6-digit PIN code
    const cleanPin = pinCode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errors.pinCode = 'Enter a valid 6-digit PIN code (e.g. 192121).';
    }

    if (cart.length === 0) {
      errors.cart = 'Your shopping cart is empty.';
    }

    if (paymentMethod === 'COD' && !codAllowed) {
      errors.paymentMethod = `Cash on Delivery is only available within ${deliverySettings.codRadiusKm} km of our Pulwama store.`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCopyUpi = () => {
    if (paymentSettings.upiId) {
      navigator.clipboard.writeText(paymentSettings.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!deliverySettings.onlineOrdersOpen) {
      alert(deliverySettings.orderClosedMessage || 'Online orders are currently closed.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Build Order items snapshot
      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        unitPrice: item.product.price, // Snapshot current price!
        productTotal: item.product.price * item.quantity,
        image: item.product.images?.[0],
      }));

      // 2. Determine initial payment status
      const paymentStatus = paymentMethod === 'COD' 
        ? 'COD - Pay on Delivery' 
        : 'Payment Verification Required';

      // 3. Place order in Firebase / persistent store
      const finalWhatsapp = whatsappSameAsMobile ? mobile : whatsappNumber;

      const createdOrder = await placeOrder({
        customerName: fullName.trim(),
        mobile: mobile.trim(),
        whatsapp: finalWhatsapp.trim(),
        address: address.trim(),
        landmark: landmark.trim(),
        city: city.trim() || 'Pulwama',
        pinCode: pinCode.trim(),
        deliveryInstructions: deliveryInstructions.trim(),
        notes: orderNotes.trim(),
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryCharge,
        grandTotal: cartGrandTotal,
        paymentMethod,
        paymentStatus,
        orderStatus: 'New',
        estimatedDistanceKm,
      });

      // 4. Open WhatsApp confirmation URL automatically in background or redirect
      const whatsappUrl = getOrderWhatsAppUrl(createdOrder, contactSettings.whatsapp);
      window.open(whatsappUrl, '_blank');

      // 5. Navigate to Order Confirmed Page
      onOrderSuccess(createdOrder.orderNumber);

    } catch (err) {
      console.error('Order submission error:', err);
      alert('There was an issue processing your order. Please try again or message us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your Cart is Empty</h2>
        <p className="text-sm text-stone-600">Please add items from the clothing catalog before checking out.</p>
        <button
          onClick={onBackToShop}
          className="px-6 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Back button & Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={onBackToShop}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping</span>
        </button>
      </div>

      {/* Notice if Online Orders Closed */}
      {!deliverySettings.onlineOrdersOpen && (
        <div className="mb-8 p-4 bg-red-50 border border-red-300 rounded-xl text-red-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong>Online Orders Currently Closed:</strong> {deliverySettings.orderClosedMessage}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section: Guest Customer Information */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-sans">
                  1
                </span>
                <span>Customer & Contact Details</span>
              </h2>
              <span className="text-xs text-stone-500 font-medium">Guest Checkout (No Account Needed)</span>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mohammad Tariq"
                  className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                    validationErrors.fullName ? 'border-red-400 bg-red-50/50' : 'border-stone-300'
                  }`}
                />
                {validationErrors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.fullName}</p>
                )}
              </div>

              {/* Mobile Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number (Calling) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500">
                      +91
                    </span>
                    <input
                      id="checkout-mobile"
                      type="tel"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="96222 29622"
                      className={`w-full pl-11 pr-3 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                        validationErrors.mobile ? 'border-red-400 bg-red-50/50' : 'border-stone-300'
                      }`}
                    />
                  </div>
                  {validationErrors.mobile && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.mobile}</p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-stone-700">
                      WhatsApp Number
                    </label>
                    <label className="text-[11px] text-stone-500 flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={whatsappSameAsMobile}
                        onChange={(e) => setWhatsappSameAsMobile(e.target.checked)}
                        className="rounded-xs text-amber-800"
                      />
                      <span>Same as Mobile</span>
                    </label>
                  </div>

                  {!whatsappSameAsMobile ? (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500">
                        +91
                      </span>
                      <input
                        id="checkout-whatsapp"
                        type="tel"
                        maxLength={10}
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="WhatsApp contact"
                        className="w-full pl-11 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
                      />
                    </div>
                  ) : (
                    <div className="px-3.5 py-2.5 bg-stone-100/70 border border-stone-200 rounded-lg text-xs text-stone-600 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Order updates will be sent to <strong>+91 {mobile || '...'}</strong></span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Section: Delivery Address */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-sans">
                  2
                </span>
                <span>Delivery Address (Pulwama & Pan-India)</span>
              </h2>
            </div>

            <div className="space-y-4">
              {/* Full Address */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Complete Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat No., Mohalla, Street, Colony..."
                  className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                    validationErrors.address ? 'border-red-400 bg-red-50/50' : 'border-stone-300'
                  }`}
                />
                {validationErrors.address && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.address}</p>
                )}
              </div>

              {/* Landmark, City & PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Landmark
                  </label>
                  <input
                    id="checkout-landmark"
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near Mazban Hotel / Bus Stand"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Pulwama"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-pincode"
                    type="text"
                    required
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="192121"
                    className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:bg-white focus:outline-none ${
                      validationErrors.pinCode ? 'border-red-400 bg-red-50/50' : 'border-stone-300'
                    }`}
                  />
                  {validationErrors.pinCode && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.pinCode}</p>
                  )}
                </div>
              </div>

              {/* Delivery Instructions */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  id="checkout-delivery-instructions"
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Call before arrival, leave with security"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900"
                />
              </div>

              {/* Distance from Pulwama Store (For Section 16 COD Radius evaluation) */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-800">
                    Distance from Pioneer Clothing House (Pulwama Circular Road):
                  </span>
                  <span className="font-bold text-amber-900">{estimatedDistanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={estimatedDistanceKm}
                  onChange={(e) => setEstimatedDistanceKm(Number(e.target.value))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>Inside Pulwama (1–5 km)</span>
                  <span>Surrounding Villages (5–10 km)</span>
                  <span>Outstation (10+ km)</span>
                </div>
                <p className="text-[11px] text-stone-600 pt-1">
                  {codAllowed ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Within store COD service radius ({deliverySettings.codRadiusKm} km). Cash on Delivery is available.
                    </span>
                  ) : (
                    <span className="text-amber-800 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Outside COD radius ({deliverySettings.codRadiusKm} km). Please use UPI or QR Code payment.
                    </span>
                  )}
                </p>
              </div>

            </div>
          </div>

          {/* Section: Payment Method Choice */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-sans">
                  3
                </span>
                <span>Select Payment Method</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Option 1: UPI */}
              <div
                id="payment-option-upi"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'UPI'
                    ? 'border-amber-800 bg-amber-50/50'
                    : 'border-stone-200 hover:border-stone-400 bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className={`w-5 h-5 ${paymentMethod === 'UPI' ? 'text-amber-800' : 'text-stone-500'}`} />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="accent-amber-800"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Direct UPI</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>

              {/* Option 2: QR Code */}
              <div
                id="payment-option-qr"
                onClick={() => setPaymentMethod('QR')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'QR'
                    ? 'border-amber-800 bg-amber-50/50'
                    : 'border-stone-200 hover:border-stone-400 bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <QrCode className={`w-5 h-5 ${paymentMethod === 'QR' ? 'text-amber-800' : 'text-stone-500'}`} />
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'QR'}
                    onChange={() => setPaymentMethod('QR')}
                    className="accent-amber-800"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Scan QR Code</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Scan from another device</p>
                </div>
              </div>

              {/* Option 3: COD */}
              <div
                id="payment-option-cod"
                onClick={() => {
                  if (codAllowed) setPaymentMethod('COD');
                }}
                className={`p-4 rounded-xl border-2 transition flex flex-col justify-between ${
                  !codAllowed
                    ? 'border-stone-200 bg-stone-100 opacity-60 cursor-not-allowed'
                    : paymentMethod === 'COD'
                    ? 'border-amber-800 bg-amber-50/50 cursor-pointer'
                    : 'border-stone-200 hover:border-stone-400 bg-stone-50 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className={`w-5 h-5 ${paymentMethod === 'COD' ? 'text-amber-800' : 'text-stone-500'}`} />
                  <input
                    type="radio"
                    name="paymentMethod"
                    disabled={!codAllowed}
                    checked={paymentMethod === 'COD'}
                    onChange={() => codAllowed && setPaymentMethod('COD')}
                    className="accent-amber-800"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Cash on Delivery</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {codAllowed ? `Within ${deliverySettings.codRadiusKm}km` : 'Not available outside radius'}
                  </p>
                </div>
              </div>

            </div>

            {/* Payment Details Drawer based on selection */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-900 font-bold block">
                      Shop UPI ID:
                    </span>
                    <span className="text-base font-bold text-stone-900">
                      {paymentSettings.upiId || 'pioneerclothing@upi'}
                    </span>
                    <span className="text-xs text-stone-500 block">
                      Payee: {paymentSettings.upiDisplayName || 'Pioneer Clothing House'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 rounded-lg text-xs font-semibold shadow-2xs transition self-start sm:self-auto cursor-pointer"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-600" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed border-t border-amber-200/50 pt-2">
                  {paymentSettings.upiInstructions || 'Open any UPI application (GPay, PhonePe, Paytm, BHIM), enter our UPI ID, transfer the order amount, and click Verify & Confirm below.'}
                </p>
              </div>
            )}

            {paymentMethod === 'QR' && (
              <div className="p-5 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-4 text-center">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  Scan & Pay with Any UPI App
                </span>
                
                {paymentSettings.qrCodeUrl ? (
                  <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl border border-stone-300 shadow-sm flex items-center justify-center">
                    <img 
                      src={paymentSettings.qrCodeUrl} 
                      alt="Pioneer Clothing House QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-44 h-44 mx-auto bg-white p-4 rounded-xl border border-stone-300 shadow-sm flex flex-col items-center justify-center text-stone-500">
                    <QrCode className="w-16 h-16 text-stone-400 mb-1" />
                    <span className="text-[11px] font-bold text-stone-800">{paymentSettings.upiId}</span>
                    <span className="text-[10px] text-stone-500">Pioneer Clothing House</span>
                  </div>
                )}

                <div className="max-w-sm mx-auto text-xs text-stone-600 space-y-1">
                  <p>1. Open Google Pay, PhonePe, Paytm or BHIM on your smartphone.</p>
                  <p>2. Scan this QR code and complete the payment of <strong>{formatINR(cartGrandTotal)}</strong>.</p>
                  <p>3. Click <strong>Verify & Confirm Your Order</strong> below to submit.</p>
                </div>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                <span className="font-bold block">Cash on Delivery Selected</span>
                <p>
                  Please keep exact change of <strong>{formatINR(cartGrandTotal)}</strong> ready at the time of delivery at your Pulwama address.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Order Summary & Section 20 "Verify and Confirm Your Order" */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-md space-y-6">
            
            {/* Section 20 Header */}
            <div className="pb-4 border-b border-stone-200">
              <span className="text-[11px] uppercase tracking-wider text-amber-900 font-bold block mb-0.5">
                Section 20 Requirement
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Verify and Confirm Your Order
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Please review your clothing items and delivery amounts before placing the order.
              </p>
            </div>

            {/* Itemized Order Snapshot */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-stone-100">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-start gap-3 text-xs">
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=100&q=80'}
                    alt={item.product.name}
                    className="w-12 h-14 object-cover rounded-md bg-stone-100 shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-stone-900 truncate">
                      {item.product.name}
                    </h5>
                    <div className="text-[11px] text-stone-500">
                      {item.selectedSize && <span>Size: {item.selectedSize} • </span>}
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <div className="text-xs font-semibold text-stone-800 mt-0.5">
                      {item.quantity} × {formatINR(item.product.price)}
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 shrink-0">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Charge</span>
                <span className="font-semibold text-stone-900">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  ) : (
                    formatINR(deliveryCharge)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="text-xl text-amber-900">{formatINR(cartGrandTotal)}</span>
              </div>
            </div>

            {/* Payment Verification State Summary */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">Selected Payment:</span>
                <span className="font-bold text-stone-900">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status on Placement:</span>
                <span className="font-semibold text-amber-800">
                  {paymentMethod === 'COD' ? 'COD - Pay on Delivery' : 'Payment Verification Required'}
                </span>
              </div>
            </div>

            {/* Submission Action Button */}
            <button
              id="verify-and-confirm-order-btn"
              type="submit"
              disabled={isSubmitting || !deliverySettings.onlineOrdersOpen}
              className={`w-full py-4 px-6 rounded-xl text-sm font-bold shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitting || !deliverySettings.onlineOrdersOpen
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-stone-900 hover:bg-amber-900 text-white shadow-stone-900/20 hover:shadow-amber-900/30'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Recording Order in Firebase...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Verify & Confirm Your Order</span>
                </>
              )}
            </button>

            {/* Note on WhatsApp Redirection */}
            <p className="text-[11px] text-stone-500 text-center leading-relaxed">
              Upon clicking verify & confirm, your order is secured in Firebase and an official order summary will open on <strong>WhatsApp (+91 {contactSettings.whatsapp})</strong> for immediate confirmation.
            </p>

            <div className="pt-2 flex items-center justify-center gap-4 text-xs text-stone-400 border-t border-stone-100">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                SSL Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Fast Pulwama Dispatch
              </span>
            </div>

          </div>

        </div>

      </form>

    </div>
  );
};
