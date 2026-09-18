import React, { useState, useEffect } from 'react';
import { Truck, RotateCcw, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PoliciesPageProps {
  initialTab?: 'delivery' | 'returns' | 'terms' | 'privacy';
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ initialTab = 'delivery' }) => {
  const { websiteContent, deliverySettings } = useStore();
  const [activeTab, setActiveTab] = useState<'delivery' | 'returns' | 'terms' | 'privacy'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs = [
    { id: 'delivery', label: 'Delivery Policy', icon: Truck },
    { id: 'returns', label: 'Return & Exchange Policy', icon: RotateCcw },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
  ] as const;

  return (
    <div id="policies-page" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-900 font-bold block">
          Customer Care & Transparency
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Store Policies & Customer Terms
        </h1>
        <p className="text-xs text-stone-500">
          Pioneer Clothing House, Circular Road, Near Mazban Hotel, Pulwama - 192121
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto justify-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-amber-800 text-amber-900 bg-amber-50/50'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Policy Content Body */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-2xs text-stone-700 text-sm leading-relaxed space-y-6">
        
        {activeTab === 'delivery' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900">Delivery & Shipping Policy</h2>
            <div className="space-y-3">
              <p>
                {websiteContent.deliveryPolicy || 
                  'Pioneer Clothing House delivers throughout Pulwama, the Kashmir Valley, and across India. Orders are processed from our Circular Road, Pulwama boutique within 24 to 48 hours.'}
              </p>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Delivery Highlights:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                  <li>Local Pulwama Deliveries: Dispatched same-day or next-day.</li>
                  <li>Cash on Delivery (COD): Available within {deliverySettings.codRadiusKm} km of our Circular Road store.</li>
                  <li>Free Delivery: Orders over ₹{deliverySettings.freeDeliveryThreshold} qualify for standard free delivery.</li>
                  <li>Pan-India Shipping: Dispatched via trusted courier partners with tracking updates provided over WhatsApp.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900">Return & Exchange Policy</h2>
            <div className="space-y-3">
              <p>
                {websiteContent.returnPolicy || 
                  'We offer a 7-day hassle-free exchange policy on unworn clothing items with original tags and packaging intact. Sizing adjustments or replacements can be arranged through our Pulwama store.'}
              </p>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Exchange Terms:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                  <li>Time Window: Request exchange within 7 days of receiving your parcel.</li>
                  <li>Condition: Apparel must be unwashed, unworn, and retain all labels and tilla/embroidery protections.</li>
                  <li>In-Store Exchange: You may bring any item directly to our store near Mazban Hotel, Pulwama for immediate size trials.</li>
                  <li>Custom / Altered Pherans: Tailored or custom-fitted garments are non-refundable.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900">Terms & Conditions</h2>
            <div className="space-y-3">
              <p>
                {websiteContent.termsConditions || 
                  'By placing an order with Pioneer Clothing House, you agree that product photographs accurately represent hand-embroidered artisanal garments, though minor weaving and color variations may naturally occur due to authentic handcrafting techniques.'}
              </p>
              <p className="text-xs text-stone-600">
                All prices are displayed in Indian Rupees (INR ₹). Orders placed via UPI require payment verification before parcel dispatch. For COD orders, correct payment must be tendered on arrival.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900">Privacy Policy</h2>
            <div className="space-y-3">
              <p>
                {websiteContent.privacyPolicy || 
                  'We respect your privacy. Customer names, mobile numbers, delivery addresses, and order histories are collected strictly to execute orders, coordinate deliveries, and provide WhatsApp status updates.'}
              </p>
              <p className="text-xs text-stone-600">
                We never sell, rent, or lease your private contact information to third-party advertisers. All transaction data is securely stored.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
