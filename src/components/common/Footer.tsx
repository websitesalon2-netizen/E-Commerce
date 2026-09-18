import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle2,
  Heart
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { 
  getDeveloperWhatsAppUrl, 
  DEVELOPER_WHATSAPP_DISPLAY,
  sanitizeWhatsAppNumber 
} from '../../lib/whatsapp';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteSettings, contactSettings, businessHours, websiteContent } = useStore();

  const shopWhatsAppUrl = `https://wa.me/${sanitizeWhatsAppNumber(contactSettings.whatsapp)}?text=${encodeURIComponent('Hello Pioneer Clothing House, I have an inquiry regarding your clothing collection.')}`;
  const developerWhatsAppUrl = getDeveloperWhatsAppUrl();

  return (
    <footer id="main-site-footer" className="bg-stone-900 text-stone-300 pt-16 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Shop Brand & Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-600/40 flex items-center justify-center text-amber-400 font-serif font-bold text-lg">
                P
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white block">
                  {siteSettings.shopName || 'Pioneer'}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block">
                  {siteSettings.subtitle || 'Clothing House'}
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-400 leading-relaxed">
              {websiteContent.footerText || 'Premium clothing house in Pulwama, offering exquisite Kashmiri woolen pherans, hand-embroidered shawls, executive suits, and festive traditional wear.'}
            </p>

            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{contactSettings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${contactSettings.phone}`} className="hover:text-white transition">
                  {contactSettings.phone}
                </a>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                id="footer-whatsapp-chat-btn"
                href={shopWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Shop
              </a>
              <a
                id="footer-google-maps-btn"
                href={contactSettings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                Get Directions
              </a>
            </div>
          </div>

          {/* Col 2: Store Collections */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button 
                  onClick={() => onNavigate('#/shop?category=traditional')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Kashmiri Pherans & Tilla
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('#/shop?category=shawls')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Pure Wool & Sozni Shawls
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('#/shop?category=mens')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Men's Formal Suits & Shirts
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('#/shop?category=womens')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Women's Velvet & Silk Suits
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('#/shop?category=jackets')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Winter Jackets & Heavy Coats
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('#/shop?category=kids')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Kids Winter Wear
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Customer Care & Policies
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button 
                  onClick={() => onNavigate('#/policies?tab=delivery')}
                  className="hover:text-amber-400 transition cursor-pointer flex items-center gap-2"
                >
                  <Truck className="w-3.5 h-3.5 text-stone-500" />
                  <span>Delivery & Shipping Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('#/policies?tab=returns')}
                  className="hover:text-amber-400 transition cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                  <span>Exchange & Return Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('#/policies?tab=terms')}
                  className="hover:text-amber-400 transition cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('#/policies?tab=privacy')}
                  className="hover:text-amber-400 transition cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('#/find-us')}
                  className="hover:text-amber-400 transition cursor-pointer flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  <span>Find Us in Pulwama</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Business Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Store Hours (Pulwama)</span>
            </h4>
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span>Monday – Thursday</span>
                <span className="text-stone-200">
                  {businessHours.monday.open ? `${businessHours.monday.openingTime} – ${businessHours.monday.closingTime}` : 'Closed'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span>Friday</span>
                <span className="text-stone-200">
                  {businessHours.friday.open ? `${businessHours.friday.openingTime} – ${businessHours.friday.closingTime}` : 'Closed'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-800">
                <span>Saturday</span>
                <span className="text-stone-200">
                  {businessHours.saturday.open ? `${businessHours.saturday.openingTime} – ${businessHours.saturday.closingTime}` : 'Closed'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Sunday</span>
                <span className="text-stone-200">
                  {businessHours.sunday.open ? `${businessHours.sunday.openingTime} – ${businessHours.sunday.closingTime}` : 'Closed'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 pt-2">
              Circular Road, Near Mazban Hotel, Pulwama - 192121.
            </p>
          </div>

        </div>

        {/* Bottom Bar with Mandatory Developer Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} {siteSettings.shopName} {siteSettings.subtitle}. All rights reserved. Prices in INR (₹).
          </p>

          {/* Mandatory Section 47 Requirement: Developed by Shujaat */}
          <div className="flex items-center gap-1.5">
            <span>Website</span>
            <a
              id="developer-whatsapp-credit-link"
              href={developerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`Discuss website with developer on WhatsApp: ${DEVELOPER_WHATSAPP_DISPLAY}`}
              className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 underline decoration-amber-500/50 hover:decoration-amber-300 transition"
            >
              <span>Developed by Shujaat</span>
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
