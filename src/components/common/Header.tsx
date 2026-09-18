import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ChevronRight,
  Home,
  Grid,
  Sparkle,
  User,
  Users,
  Info,
  Layers,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../lib/currency';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenCart: () => void;
  onSearchQuery?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenCart,
  onSearchQuery,
}) => {
  const { 
    siteSettings, 
    contactSettings, 
    deliverySettings, 
    cart, 
    cartSubtotal,
    categories
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onSearchQuery) {
      onSearchQuery(searchInput.trim());
      onNavigate('#/shop');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', route: '#/', icon: Home },
    { label: 'All Collections', route: '#/shop', icon: Grid },
    { label: 'Pherans & Traditional', route: '#/shop?category=traditional', icon: Sparkle },
    { label: "Men's Collection", route: '#/shop?category=mens', icon: User },
    { label: "Women's Collection", route: '#/shop?category=womens', icon: Users },
    { label: 'Store Location & Map', route: '#/find-us', icon: MapPin },
    { label: 'About Pioneer', route: '#/about', icon: Info },
    { label: 'Contact & Inquiries', route: '#/contact', icon: Phone },
  ];

  return (
    <header id="main-site-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Top Utility & Announcement Bar */}
      <div id="top-announcement-bar" className="bg-stone-900 text-stone-300 text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
          
          {/* Location & Contact Notice */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-start text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate max-w-[230px] sm:max-w-none">Pulwama, Circular Road, Near Mazban Hotel</span>
            </span>
            <a 
              href={`tel:${contactSettings.phone}`} 
              className="hidden xs:flex items-center gap-1.5 text-stone-300 hover:text-white transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{contactSettings.phone}</span>
            </a>
          </div>

          {/* Delivery & Order Status Pill */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            {deliverySettings.onlineOrdersOpen ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Orders: OPEN
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Orders: CLOSED
              </span>
            )}

            <div className="hidden lg:flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Delivery Above ₹{deliverySettings.freeDeliveryThreshold}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          id="brand-logo-button"
          onClick={() => onNavigate('#/')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          {siteSettings.logoUrl ? (
            <img 
              src={siteSettings.logoUrl} 
              alt={siteSettings.shopName} 
              className="h-9 sm:h-11 w-auto object-contain rounded-md"
            />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-stone-900 border border-amber-600/40 flex items-center justify-center text-amber-400 font-serif font-bold text-lg sm:text-xl shadow-xs group-hover:bg-amber-950 transition">
              P
            </div>
          )}
          <div>
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-stone-900 block leading-tight group-hover:text-amber-900 transition">
              {siteSettings.shopName || 'Pioneer'}
            </span>
            <span className="text-[9px] sm:text-[11px] uppercase tracking-widest text-stone-500 font-medium block">
              {siteSettings.subtitle || 'Clothing House'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-stone-700">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => onNavigate(link.route)}
                className={`py-1 whitespace-nowrap transition-colors cursor-pointer relative ${
                  isActive 
                    ? 'text-amber-900 font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Search, Admin Desks, Cart, Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Search Trigger */}
          <button
            id="search-toggle-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            title="Search Products"
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Admin Portals Link (Manager / Developer Desk) */}
          <div className="hidden sm:flex items-center gap-1 border-l border-stone-200 pl-3">
            <button
              id="header-manager-desk-btn"
              onClick={() => onNavigate('#/manager')}
              title="Open Manager Desk"
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                currentRoute.startsWith('#/manager')
                  ? 'bg-amber-900 text-white'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Manager Desk</span>
            </button>
            
            <button
              id="header-dev-desk-btn"
              onClick={() => onNavigate('#/developer')}
              title="Open Web Developer Desk"
              className={`px-2 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                currentRoute.startsWith('#/developer')
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Dev Desk
            </button>
          </div>

          {/* Shopping Cart Button */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-2.5 sm:px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition shadow-xs cursor-pointer group"
          >
            <ShoppingBag className="w-5 h-5 text-amber-400 group-hover:scale-105 transition" />
            <div className="hidden sm:flex flex-col items-start text-left leading-none">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Cart</span>
              <span className="text-xs font-bold text-white">{formatINR(cartSubtotal)}</span>
            </div>
            {totalCartCount > 0 && (
              <span 
                id="cart-badge-count"
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-xs"
              >
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="xl:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition cursor-pointer active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div id="search-bar-drawer" className="border-t border-stone-200 bg-stone-50 p-3 sm:p-4 transition-all">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="header-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search pherans, suits, shirts, shawls, winter jackets..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-4 sm:px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Modern Slide-over Mobile Navigation Drawer rendered in document.body Portal */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div 
          id="mobile-menu-overlay" 
          className="xl:hidden fixed inset-0 z-[9999] bg-stone-950/70 backdrop-blur-xs flex justify-start mobile-overlay-animate"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100dvh', width: '100vw' }}
        >
          <div 
            id="mobile-menu-drawer"
            className="w-[85vw] max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-[10000] mobile-drawer-animate"
            style={{ height: '100dvh' }}
          >
            {/* Drawer Header */}
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-stone-800 border border-amber-600/50 flex items-center justify-center text-amber-400 font-serif font-bold text-lg">
                  P
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white leading-tight">
                    {siteSettings.shopName || 'Pioneer'}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400">
                    {siteSettings.subtitle || 'Clothing House • Pulwama'}
                  </p>
                </div>
              </div>
              <button 
                id="mobile-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer active:scale-90"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar inside drawer */}
            <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between text-xs text-amber-900 font-medium shrink-0">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Free delivery over ₹{deliverySettings.freeDeliveryThreshold}</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Open in Store
              </span>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 divide-y divide-stone-100 min-h-0">
              
              {/* Storefront Main Links */}
              <div className="space-y-1 pb-3">
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Store Navigation
                </p>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentRoute === link.route;
                  return (
                    <button
                      key={link.route}
                      onClick={() => {
                        onNavigate(link.route);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition cursor-pointer ${
                        isActive
                          ? 'bg-amber-900 text-white font-semibold shadow-xs'
                          : 'text-stone-800 hover:bg-stone-100 active:bg-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Administrative Desks */}
              <div className="pt-4 space-y-1.5 pb-3">
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Staff & Admin Desks
                </p>
                <button
                  onClick={() => {
                    onNavigate('#/manager');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition cursor-pointer ${
                    currentRoute.startsWith('#/manager')
                      ? 'bg-amber-800 text-white'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Manager Desk Login</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-700" />
                </button>

                <button
                  onClick={() => {
                    onNavigate('#/developer');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition cursor-pointer ${
                    currentRoute.startsWith('#/developer')
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-stone-500" />
                    <span>Developer Desk</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              </div>

            </div>

            {/* Drawer Footer Contact Bar */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-600 space-y-2.5 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>Circular Road, Pulwama, Near Mazban Hotel</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <a 
                  href={`tel:${contactSettings.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-semibold text-stone-800 hover:bg-stone-100"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Call Store</span>
                </a>
                <button
                  onClick={() => {
                    onNavigate('#/find-us');
                    setMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900 text-white font-medium hover:bg-amber-800"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
