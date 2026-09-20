import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenCart: () => void;
  onSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenCart,
  onSearchQuery,
}) => {
  const { cart, siteSettings, businessHours } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchQuery(searchInput.trim());
    }
  };

  const navLinks = [
    { label: 'Home', route: '#/' },
    { label: 'Shop', route: '#/shop' },
    { label: 'Kashmiri Traditional', route: '#/shop?category=traditional' },
    { label: 'Shawls & Stoles', route: '#/shop?category=shawls' },
    { label: 'About Us', route: '#/about' },
    { label: 'Contact', route: '#/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-white border-b border-stone-200 shadow-sm">
      {/* Top Banner Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 w-full max-w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 text-center sm:text-left">
          <div className="flex items-center gap-1.5 text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{siteSettings?.address || 'Shalina, Budgam, J&K, India'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Orders: OPEN
            </span>
            <span className="text-stone-400">
              {businessHours?.openingTime || '09:30'} - {businessHours?.closingTime || '20:30'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => onNavigate('#/')}>
            <div className="w-10 h-10 rounded-lg bg-amber-900 flex items-center justify-center text-amber-400 font-serif font-bold text-xl shadow-md">
              P
            </div>
            <div>
              <h1 className="font-serif text-lg md:text-xl font-bold text-stone-900 tracking-tight leading-none">
                {siteSettings?.storeName || 'Zenith Apparel & Footwear'}
              </h1>
              <p className="text-[10px] tracking-widest text-stone-500 uppercase font-medium mt-0.5">
                CLOTHING HOUSE
              </p>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <input
              type="text"
              placeholder="Search pherans, shawls, suits..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-stone-100 text-stone-900 text-sm rounded-full pl-4 pr-10 py-2 border border-stone-200 focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-900">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => onNavigate(link.route)}
                className={`transition-colors hover:text-amber-900 ${
                  currentRoute === link.route ? 'text-amber-900 font-semibold' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions: Search, Cart Button, & 3-Line Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon (Mobile) */}
            <button
              onClick={() => onNavigate('#/shop')}
              className="md:hidden p-2 text-stone-700 hover:text-amber-900 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-stone-700 hover:text-amber-900 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-800 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 3-LINE HAMBURGER MENU BUTTON (ALWAYS VISIBLE ON MOBILE) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-800 hover:text-amber-900 hover:bg-stone-100 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-stone-900" />
              ) : (
                <Menu className="w-6 h-6 text-stone-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 shadow-xl w-full max-w-full">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="mb-4 relative">
            <input
              type="text"
              placeholder="Search items..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-stone-100 text-stone-900 text-sm rounded-lg pl-3 pr-10 py-2 border border-stone-200"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => {
                  onNavigate(link.route);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  currentRoute === link.route
                    ? 'bg-amber-50 text-amber-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
