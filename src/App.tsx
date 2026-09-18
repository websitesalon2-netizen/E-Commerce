import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { CartDrawer } from './components/storefront/CartDrawer';
import { ProductDetailsModal } from './components/storefront/ProductDetailsModal';
import { OfflineBanner } from './components/common/OfflineBanner';
import { HomePage } from './components/storefront/HomePage';
import { ShopPage } from './components/storefront/ShopPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmedPage } from './pages/OrderConfirmedPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FindUsSection } from './components/storefront/FindUsSection';
import { ManagerDesk } from './pages/manager/ManagerDesk';
import { DeveloperDesk } from './pages/developer/DeveloperDesk';
import { Product } from './types';

export default function App() {
  // Hash-based client routing with automatic path-to-hash detection
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const h = window.location.hash;
    if (h && h.startsWith('#/')) return h;

    // Check if pathname contains a recognized route (e.g. from a shared direct link)
    try {
      const p = window.location.pathname.replace(/^\/+/, '').split('/')[0];
      const known = ['shop', 'checkout', 'order-confirmed', 'policies', 'about', 'contact', 'find-us', 'manager', 'developer'];
      if (p && known.includes(p.toLowerCase())) {
        return `#/${p.toLowerCase()}${window.location.search}`;
      }
    } catch {
      // Ignore
    }

    return '#/';
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  useEffect(() => {
    // If no valid hash exists, set default or current route hash without reloading
    if (!window.location.hash || !window.location.hash.startsWith('#/')) {
      window.location.hash = currentRoute;
    }

    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentRoute((hash && hash.startsWith('#/')) ? hash : '#/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentRoute]);

  const navigateTo = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse route parameters with normalization
  const getRouteInfo = () => {
    const hash = currentRoute;
    const [pathPart, queryPart] = hash.split('?');
    const params = new URLSearchParams(queryPart || '');

    // Normalize path by stripping trailing slashes (e.g. '#/shop/' -> '#/shop')
    const normalizedPath = (pathPart || '#/').replace(/\/+$/, '') || '#/';

    return {
      path: normalizedPath,
      category: params.get('category') || undefined,
      filter: params.get('filter') || undefined,
      tab: (params.get('tab') as 'delivery' | 'returns' | 'terms' | 'privacy') || undefined,
      orderId: params.get('orderId') || undefined,
    };
  };

  const routeInfo = getRouteInfo();

  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 selection:bg-amber-900 selection:text-white antialiased">
        
        {/* Offline Network Warning */}
        <OfflineBanner />

        {/* Global Navigation Header */}
        <Header
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          onOpenCart={() => setIsCartOpen(true)}
          onSearchQuery={(q) => {
            setGlobalSearchQuery(q);
            navigateTo('#/shop');
          }}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 pb-16 lg:pb-0">
          {/* Fallback to HomePage if route doesn't match any known page */}
          {(routeInfo.path === '#/' ||
            (routeInfo.path !== '#/shop' &&
             routeInfo.path !== '#/checkout' &&
             routeInfo.path !== '#/order-confirmed' &&
             routeInfo.path !== '#/policies' &&
             routeInfo.path !== '#/about' &&
             routeInfo.path !== '#/contact' &&
             routeInfo.path !== '#/find-us' &&
             routeInfo.path !== '#/manager' &&
             routeInfo.path !== '#/developer')) && (
            <HomePage
              onNavigate={navigateTo}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={(p) => setSelectedProduct(p)}
            />
          )}

          {routeInfo.path === '#/shop' && (
            <ShopPage
              key={`shop-${routeInfo.category || 'all'}-${routeInfo.filter || 'all'}-${globalSearchQuery}`}
              initialCategory={
                routeInfo.category === 'traditional'
                  ? 'Kashmiri Pherans & Traditional'
                  : routeInfo.category === 'shawls'
                  ? 'Shawls & Stoles'
                  : routeInfo.category === 'mens'
                  ? "Men's Wear"
                  : routeInfo.category === 'womens'
                  ? "Women's Collection"
                  : routeInfo.category === 'jackets'
                  ? 'Jackets & Winter Wear'
                  : routeInfo.category === 'kids'
                  ? 'Kids Wear'
                  : routeInfo.category
              }
              initialQuery={globalSearchQuery}
              initialFilter={routeInfo.filter}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={(p) => setSelectedProduct(p)}
            />
          )}

          {routeInfo.path === '#/checkout' && (
            <CheckoutPage
              onBackToShop={() => navigateTo('#/shop')}
              onOrderSuccess={(orderNum) => {
                setConfirmedOrderId(orderNum);
                navigateTo(`#/order-confirmed?orderId=${orderNum}`);
              }}
            />
          )}

          {routeInfo.path === '#/order-confirmed' && (
            <OrderConfirmedPage
              orderNumber={routeInfo.orderId || confirmedOrderId || 'PION-RECENT'}
              onNavigateHome={() => navigateTo('#/')}
              onNavigateShop={() => navigateTo('#/shop')}
            />
          )}

          {routeInfo.path === '#/policies' && (
            <PoliciesPage initialTab={routeInfo.tab} />
          )}

          {routeInfo.path === '#/about' && (
            <AboutPage onNavigateShop={() => navigateTo('#/shop')} />
          )}

          {routeInfo.path === '#/contact' && (
            <ContactPage />
          )}

          {routeInfo.path === '#/find-us' && (
            <div className="py-10">
              <FindUsSection />
            </div>
          )}

          {routeInfo.path === '#/manager' && (
            <ManagerDesk />
          )}

          {routeInfo.path === '#/developer' && (
            <DeveloperDesk />
          )}
        </main>

        {/* Global Footer (with Section 47 Mandatory Developer Credit) */}
        <Footer onNavigate={navigateTo} />

        {/* Slide-over Shopping Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onNavigateToCheckout={() => navigateTo('#/checkout')}
          onContinueShopping={() => navigateTo('#/shop')}
        />

        {/* Product Details & Variant Selector Modal */}
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenCart={() => {
            setSelectedProduct(null);
            setIsCartOpen(true);
          }}
        />

        {/* Floating Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          onOpenCart={() => setIsCartOpen(true)}
        />

      </div>
    </StoreProvider>
  );
}
