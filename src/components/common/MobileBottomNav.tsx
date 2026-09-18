import React from 'react';
import { Home, Grid, ShoppingBag, MapPin, Phone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../lib/currency';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRoute,
  onNavigate,
  onOpenCart,
}) => {
  const { cart, cartSubtotal, contactSettings } = useStore();
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isHome = currentRoute === '#/';
  const isShop = currentRoute.startsWith('#/shop');
  const isFindUs = currentRoute.startsWith('#/find-us');

  return (
    <div 
      id="mobile-bottom-navigation-bar" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1 shadow-lg pb-[env(safe-area-inset-bottom,0.25rem)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          id="mobile-nav-home-btn"
          onClick={() => onNavigate('#/')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[11px] font-medium transition cursor-pointer ${
            isHome ? 'text-amber-900 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${isHome ? 'text-amber-800 stroke-[2.5]' : 'text-stone-400'}`} />
          <span>Home</span>
        </button>

        {/* Shop / Catalog */}
        <button
          id="mobile-nav-shop-btn"
          onClick={() => onNavigate('#/shop')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[11px] font-medium transition cursor-pointer ${
            isShop ? 'text-amber-900 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Grid className={`w-5 h-5 mb-0.5 ${isShop ? 'text-amber-800 stroke-[2.5]' : 'text-stone-400'}`} />
          <span>Catalog</span>
        </button>

        {/* Store Location */}
        <button
          id="mobile-nav-location-btn"
          onClick={() => onNavigate('#/find-us')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[11px] font-medium transition cursor-pointer ${
            isFindUs ? 'text-amber-900 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className={`w-5 h-5 mb-0.5 ${isFindUs ? 'text-amber-800 stroke-[2.5]' : 'text-stone-400'}`} />
          <span>Find Us</span>
        </button>

        {/* Call Store quick touch */}
        <a
          id="mobile-nav-call-btn"
          href={`tel:${contactSettings.phone}`}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[11px] font-medium text-stone-500 hover:text-stone-800 transition cursor-pointer"
        >
          <Phone className="w-5 h-5 mb-0.5 text-stone-400" />
          <span>Call</span>
        </a>

        {/* Cart Trigger */}
        <button
          id="mobile-nav-cart-btn"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[11px] font-medium text-stone-700 hover:text-amber-900 transition cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-stone-600" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>
      </div>
    </div>
  );
};
