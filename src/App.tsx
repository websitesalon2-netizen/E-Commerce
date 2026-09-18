import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
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
  // Hash-based client routing
  const [currentRoute, setCurrentRoute] = useState<string>(() => window.location.hash || '#/');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentRoute(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse route parameters
  const getRouteInfo = () => {
    const hash = currentRoute;
    const [pathPart, queryPart] = hash.split('?');
    const params = new URLSearchParams(queryPart || '');

    return {
      path: pathPart,
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
        <main className="flex-1">
          {routeInfo.path === '#/' && (
            <HomePage
              onNavigate={navigateTo}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={(p) => setSelectedProduct(p)}
            />
          )}

          {routeInfo.path === '#/shop' && (
            <ShopPage
              initialCategory={
                routeInfo.category === 'traditional'
                  ? 'Kashmiri Pherans & Traditional'
                  : routeInfo.category === 'shawls'
                  ? 'Pure Wool Shawls'
                  : routeInfo.category === 'mens'
                  ? "Men's Formal Suits & Shirts"
                  : routeInfo.category === 'womens'
                  ? "Women's Collection"
                  : routeInfo.category === 'jackets'
                  ? 'Jackets & Heavy Coats'
                  : routeInfo.category === 'kids'
                  ? 'Kids Winter Wear'
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

      </div>
    </StoreProvider>
  );
}
