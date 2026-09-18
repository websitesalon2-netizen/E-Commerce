import React from 'react';
import { MapPin, Navigation, Phone, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { sanitizeWhatsAppNumber } from '../../lib/whatsapp';

export const FindUsSection: React.FC = () => {
  const { contactSettings, businessHours } = useStore();

  const shopWhatsAppUrl = `https://wa.me/${sanitizeWhatsAppNumber(contactSettings.whatsapp)}?text=${encodeURIComponent('Hello Pioneer Clothing House, I would like directions or assistance visiting your store.')}`;

  return (
    <section id="find-us-section" className="py-16 bg-stone-100/70 border-t border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-900 font-bold block mb-2">
            Visit Our Store
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            Find Us in Pulwama
          </h2>
          <p className="text-sm text-stone-600">
            Located conveniently on Circular Road, near Mazban Hotel. Come explore our full Kashmiri traditional, bridal, and contemporary collections in person.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Card: Store Details */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Address Block */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Store Location
                  </h3>
                  <p className="text-sm text-stone-700 font-medium mt-1 leading-relaxed">
                    {contactSettings.address}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    PIN Code: {contactSettings.pinCode} • Jammu & Kashmir, India
                  </p>
                </div>
              </div>

              {/* Phone & Contact */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Call & Direct Inquiries
                  </h3>
                  <a
                    href={`tel:${contactSettings.phone}`}
                    className="text-sm text-amber-900 font-bold hover:underline block mt-1"
                  >
                    {contactSettings.phone}
                  </a>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Assistance with sizing, wedding orders, and custom tailoring
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Operating Hours
                  </h3>
                  <p className="text-sm text-stone-700 font-medium mt-1">
                    Mon – Sat: {businessHours.monday.openingTime} to {businessHours.monday.closingTime}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Sunday: {businessHours.sunday.open ? `${businessHours.sunday.openingTime} to ${businessHours.sunday.closingTime}` : 'Closed'}
                  </p>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-100">
              <a
                id="get-directions-google-maps-btn"
                href={contactSettings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-sm font-semibold text-center shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Get Directions</span>
              </a>

              <a
                href={shopWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold text-center transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right Card: Google Map Visual Container */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 shadow-xs border border-stone-200 flex flex-col overflow-hidden min-h-[340px]">
            <div className="relative flex-1 w-full rounded-xl overflow-hidden bg-stone-200 border border-stone-300">
              {/* Responsive Google Maps Iframe */}
              <iframe
                title="Pioneer Clothing House Location Map"
                src="https://maps.google.com/maps?q=Pulwama,+Circular+Road,+Near+Mazban+Hotel&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[300px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Map Float Pill */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-md border border-stone-200 text-xs font-semibold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Circular Road, Near Mazban Hotel, Pulwama</span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-xs text-stone-500 px-1">
              <span>Interactive store location map</span>
              <a
                href={contactSettings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-900 font-semibold hover:underline"
              >
                <span>Open in Google Maps App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
