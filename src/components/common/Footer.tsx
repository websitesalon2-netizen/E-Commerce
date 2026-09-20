import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Clock, ShieldCheck, Code } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteSettings } = useStore();

  return (
    <footer className="w-full max-w-full bg-stone-900 text-stone-300 pt-12 pb-28 lg:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Store Intro */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded bg-amber-900 flex items-center justify-center text-amber-400 font-serif font-bold text-lg">
                P
              </div>
              <span className="font-serif font-bold text-lg text-white">
                {siteSettings?.storeName || 'Zenith Apparel & Footwear'}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              Authentic Kashmiri traditional wear, hand-crafted suits, premium wool shawls, and contemporary winter fashion in Shalina, Budgam.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Explore Collections
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('#/shop?category=traditional')} className="hover:text-amber-400 transition-colors">
                  Pure Wool & Sozni Shawls
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/shop?category=mens')} className="hover:text-amber-400 transition-colors">
                  Men's Formal Suits & Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/shop?category=womens')} className="hover:text-amber-400 transition-colors">
                  Women's Velvet & Silk Suits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/shop?category=jackets')} className="hover:text-amber-400 transition-colors">
                  Winter Jackets & Heavy Coats
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/shop?category=kids')} className="hover:text-amber-400 transition-colors">
                  Kids Winter Wear
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Portal Links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Customer Care & Desks
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('#/policies?tab=delivery')} className="hover:text-amber-400 transition-colors">
                  Delivery & Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/policies?tab=returns')} className="hover:text-amber-400 transition-colors">
                  Exchange & Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('#/find-us')} className="hover:text-amber-400 transition-colors">
                  Find Us in Shalina
                </button>
              </li>
              {/* STAFF & DEVELOPER ACCESS LINKS */}
              <li className="pt-2 border-t border-stone-800 flex flex-col gap-1.5">
                <button 
                  onClick={() => onNavigate('#/manager')} 
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium text-xs transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Manager Desk Access
                </button>
                <button 
                  onClick={() => onNavigate('#/developer')} 
                  className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-200 font-medium text-xs transition-colors"
                >
                  <Code className="w-3.5 h-3.5 text-amber-500" />
                  Developer Desk Access
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours & Address */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Store Hours (Shalina)
            </h3>
            <div className="text-sm text-stone-400 space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span>Mon - Sat</span>
                <span>09:30 - 20:30</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>10:00 - 19:00</span>
              </div>
            </div>
            <p className="text-xs text-stone-500">
              {siteSettings?.address || 'Shalina, Budgam, J&K, India - 192121.'}
            </p>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Developer Credit */}
        <div className="border-t border-stone-800 pt-6 mt-6 text-center text-xs text-stone-400 space-y-2">
          <p>© 2026 Zenith Apparel & Footwear Clothing House. All rights reserved. Prices in INR (₹).</p>
          
          {/* DEVELOPER CREDIT WITH ROUTE TRIGGER */}
          <p className="text-stone-400 font-medium tracking-wide text-xs pt-1">
            Website Developed by{' '}
            <button 
              onClick={() => onNavigate('#/developer')}
              className="text-amber-400 hover:text-amber-300 font-bold underline decoration-amber-500 transition-colors"
            >
              Shujaat
            </button>
          </p>
        </div>

      </div>
    </footer>
  );
};
