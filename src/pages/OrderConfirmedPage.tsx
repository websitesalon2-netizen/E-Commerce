import React from 'react';
import { 
  CheckCircle2, 
  MessageCircle, 
  ShoppingBag, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../lib/currency';
import { getOrderWhatsAppUrl } from '../lib/whatsapp';

interface OrderConfirmedPageProps {
  orderNumber: string;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
}

export const OrderConfirmedPage: React.FC<OrderConfirmedPageProps> = ({
  orderNumber,
  onNavigateHome,
  onNavigateShop,
}) => {
  const { orders, contactSettings } = useStore();

  const order = orders.find(o => o.orderNumber === orderNumber);

  const whatsappUrl = order ? getOrderWhatsAppUrl(order, contactSettings.whatsapp) : '#';

  return (
    <div id="order-confirmed-page" className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-8">
        
        {/* Success Header */}
        <div className="text-center space-y-3 pb-6 border-b border-stone-100">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold block">
            Order Successfully Placed
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Thank You for Your Order!
          </h1>

          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Your clothing order has been received by <strong>Pioneer Clothing House</strong>.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-100 rounded-full text-xs font-mono font-bold text-stone-800">
            <span>Order ID:</span>
            <span className="text-amber-900">{orderNumber}</span>
          </div>
        </div>

        {/* WhatsApp Notification Action */}
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-base font-bold text-emerald-950">
                Send Order Confirmation via WhatsApp
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Connect directly with our Pulwama store team on WhatsApp. Share your screenshot or verify sizing and delivery timing.
              </p>
            </div>
          </div>

          <a
            id="order-confirmed-whatsapp-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open Order in WhatsApp (+91 {contactSettings.whatsapp})</span>
          </a>
        </div>

        {/* Order Details Breakdown if found */}
        {order && (
          <div className="space-y-6 pt-2">
            <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-800" />
              <span>Order Summary</span>
            </h3>

            {/* Items */}
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl p-4 bg-stone-50/50">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900">{item.productName}</span>
                    <div className="text-stone-500 text-[11px] mt-0.5">
                      {item.selectedSize && <span>Size: {item.selectedSize} • </span>}
                      <span>Qty: {item.quantity} × {formatINR(item.unitPrice)}</span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">{formatINR(item.productTotal)}</span>
                </div>
              ))}

              <div className="pt-3 border-t border-stone-200 mt-2 space-y-1 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900">{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-stone-900">
                    {order.deliveryCharge === 0 ? 'FREE' : formatINR(order.deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Grand Total:</span>
                  <span className="text-base text-amber-900">{formatINR(order.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Delivery & Payment Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-800" />
                  <span>Delivery Address</span>
                </h4>
                <p className="font-medium text-stone-800">{order.customerName}</p>
                <p className="text-stone-600">{order.address}</p>
                {order.landmark && <p className="text-stone-500">Landmark: {order.landmark}</p>}
                <p className="text-stone-600">{order.city} - {order.pinCode}</p>
                <p className="text-stone-800 font-semibold pt-1">Phone: +91 {order.mobile}</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-800" />
                  <span>Payment & Status</span>
                </h4>
                <p className="text-stone-600">Payment Mode: <strong className="text-stone-900">{order.paymentMethod}</strong></p>
                <p className="text-stone-600">Payment Status: <strong className="text-amber-800">{order.paymentStatus}</strong></p>
                <p className="text-stone-600">Order Status: <strong className="text-stone-900">{order.orderStatus}</strong></p>
                <p className="text-stone-500 text-[11px] pt-1">
                  Placed on: {new Date(order.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Store Support and Navigation Actions */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href={`tel:${contactSettings.phone}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-900"
          >
            <Phone className="w-4 h-4 text-amber-800" />
            <span>Need Help? Call Store: {contactSettings.phone}</span>
          </a>

          <div className="flex gap-3">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 border border-stone-300 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-800 transition cursor-pointer"
            >
              Return Home
            </button>
            <button
              onClick={onNavigateShop}
              className="px-5 py-2 bg-stone-900 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
