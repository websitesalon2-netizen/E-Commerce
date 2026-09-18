import React, { useState } from 'react';
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
  ChevronRight
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
    currentUserRole 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

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
    { label: 'Home', route: '#/' },
    { label: 'Shop Catalog', route: '#/shop' },
    { label: 'Pherans & Shawls', route: '#/shop?category=traditional' },
    { label: "Men's Collection", route: '#/shop?category=mens' },
    { label: "Women's Collection", route: '#/shop?category=womens' },
    { label: 'Find Us / Maps', route: '#/find-us' },
    { label: 'About', route: '#/about' },
    { label: 'Contact', route: '#/contact' },
  ];

  return (
    <header id="main-site-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Top Utility & Announcement Bar */}
      <div id="top-announcement-bar" className="bg-stone-900 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          
          {/* Location & Contact Notice */}
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <span className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Pulwama, Circular Road, Near Mazban Hotel - 192121</span>
            </span>
            <a 
              href={`tel:${contactSettings.phone}`} 
              className="flex items-center gap-1.5 text-stone-300 hover:text-white transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{contactSettings.phone}</span>
            </a>
          </div>

          {/* Delivery & Order Status Pill */}
          <div className="flex items-center gap-3">
            {deliverySettings.onlineOrdersOpen ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online Orders: OPEN
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Online Orders: CLOSED
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          id="brand-logo-button"
          onClick={() => onNavigate('#/')} 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {siteSettings.logoUrl ? (
            <img 
              src={siteSettings.logoUrl} 
              alt={siteSettings.shopName} 
              className="h-11 w-auto object-contain rounded-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-stone-900 border border-amber-600/40 flex items-center justify-center text-amber-400 font-serif font-bold text-xl shadow-xs group-hover:bg-amber-950 transition">
              P
            </div>
          )}
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 block leading-tight group-hover:text-amber-900 transition">
              {siteSettings.shopName || 'Pioneer'}
            </span>
            <span className="text-[11px] uppercase tracking-widest text-stone-500 font-medium block">
              {siteSettings.subtitle || 'Clothing House'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route || (link.route !== '#/' && currentRoute.startsWith(link.route));
            return (
              <button
                key={link.route}
                onClick={() => onNavigate(link.route)}
                className={`py-1 transition-colors cursor-pointer relative ${
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
        <div className="flex items-center gap-2 sm:gap-3">
          
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
            className="relative flex items-center gap-2.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition shadow-xs cursor-pointer group"
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div id="search-bar-drawer" className="border-t border-stone-200 bg-stone-50 p-4 transition-all">
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
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium transition cursor-pointer"
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="lg:hidden fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            
            {/* Drawer Top */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="font-serif text-xl font-bold text-stone-900 block">
                  {siteSettings.shopName}
                </span>
                <span className="text-xs text-stone-500 uppercase tracking-wider">
                  {siteSettings.subtitle}
                </span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-800 rounded-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav Items */}
            <div className="py-4 space-y-1 flex-1">
              {navLinks.map((link) => (
                <button
                  key={link.route}
                  onClick={() => {
                    onNavigate(link.route);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-3 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-100 flex items-center justify-between cursor-pointer"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              ))}

              <div className="pt-4 border-t border-stone-200 my-4 space-y-2">
                <button
                  onClick={() => {
                    onNavigate('#/manager');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Manager Desk Login</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('#/developer');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 flex items-center gap-2 cursor-pointer"
                >
                  <span>Web Developer Desk</span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Info */}
            <div className="pt-4 border-t border-stone-200 text-xs text-stone-600 space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Pulwama, Circular Road, Near Mazban Hotel</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-700 shrink-0" />
                <a href={`tel:${contactSettings.phone}`}>{contactSettings.phone}</a>
              </p>
            </div>

          </div>

          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
