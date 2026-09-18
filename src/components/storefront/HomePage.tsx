import React from 'react';
import { 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Award, 
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../storefront/ProductCard';
import { FindUsSection } from '../storefront/FindUsSection';
import { Product } from '../../types';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
  onQuickAdd,
}) => {
  const { 
    products, 
    categories, 
    siteSettings, 
    websiteContent, 
    deliverySettings 
  } = useStore();

  const featuredProducts = products.filter(p => p.featured && p.isAvailable).slice(0, 4);
  const newArrivals = products.filter(p => p.newArrival && p.isAvailable).slice(0, 4);

  return (
    <div id="home-page" className="space-y-16">
      
      {/* Hero Banner Section */}
      <section 
        id="hero-banner-section" 
        className="relative bg-stone-900 text-white min-h-[520px] lg:min-h-[600px] flex items-center overflow-hidden"
      >
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={websiteContent.heroImageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=85'}
            alt="Pioneer Clothing House Hero Collection"
            className="w-full h-full object-cover object-center opacity-40 scale-102 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/40" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 w-full">
          <div className="max-w-2xl space-y-6">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{siteSettings.shopName} {siteSettings.subtitle} • Pulwama</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              {websiteContent.heroTitle || 'Elegance Woven for Every Season'}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed">
              {websiteContent.heroSubtitle || 'Discover authentic Kashmiri woolen pherans, hand-embroidered tilla collections, fine shawls, and tailored men’s suits at Pulwama’s premier fashion destination.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                id="hero-shop-now-btn"
                onClick={() => onNavigate('#/shop')}
                className="px-8 py-3.5 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold shadow-lg transition flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>{websiteContent.heroCtaText || 'Explore Collection'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-find-us-btn"
                onClick={() => onNavigate('#/find-us')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-sm font-semibold backdrop-blur-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Visit Pulwama Store</span>
              </button>
            </div>

            {/* Fast Stats */}
            <div className="pt-6 border-t border-stone-800 flex items-center gap-8 text-xs text-stone-400">
              <div>
                <span className="block font-bold text-white text-base">100%</span>
                <span>Authentic Kashmiri Craft</span>
              </div>
              <div className="border-l border-stone-800 pl-8">
                <span className="block font-bold text-white text-base">₹0</span>
                <span>Delivery Over ₹{deliverySettings.freeDeliveryThreshold}</span>
              </div>
              <div className="border-l border-stone-800 pl-8">
                <span className="block font-bold text-white text-base">{deliverySettings.codRadiusKm} km</span>
                <span>COD Radius Pulwama</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Guarantee Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Pan-India Delivery</h4>
              <p className="text-[11px] text-stone-500">Free delivery on ₹{deliverySettings.freeDeliveryThreshold}+</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Fine Wool & Fabrics</h4>
              <p className="text-[11px] text-stone-500">Kashmiri tilla & sozni artistry</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">Verified UPI & COD</h4>
              <p className="text-[11px] text-stone-500">Secure contactless ordering</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">7-Day Easy Exchange</h4>
              <p className="text-[11px] text-stone-500">Hassle-free size replacement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-900 font-bold block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Shop by Apparel Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('#/shop')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-700 cursor-pointer"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.filter(c => c.isActive).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`#/shop?category=${encodeURIComponent(cat.name)}`)}
              className="group cursor-pointer bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col text-center p-3"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 mb-3">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xs font-bold text-stone-900 group-hover:text-amber-900 transition line-clamp-2">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-900 font-bold block mb-1">
                Handpicked Favorites
              </span>
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                Featured Apparel
              </h2>
            </div>
            <button
              onClick={() => onNavigate('#/shop?filter=featured')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-700 cursor-pointer"
            >
              <span>Explore All Featured</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals Banner Promo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg border border-amber-800/40">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
              New Season Arrival
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold">
              Winter & Festive Collections Are Here
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              Experience the unmatched warmth of pure Kashmiri wool pherans, heavy corduroy winter jackets, and embroidered bridal velvet suits. Available for immediate dispatch or in-store pickup in Pulwama.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('#/shop?filter=newArrival')}
                className="px-6 py-3 bg-white text-stone-900 hover:bg-amber-100 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                Shop New Arrivals
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-900 font-bold block mb-1">
                Fresh from Loom & Workshop
              </span>
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => onNavigate('#/shop')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-700 cursor-pointer"
            >
              <span>View Full Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </section>
      )}

      {/* About Section Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-stone-200/90 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-900 font-bold block">
              Our Legacy
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              {websiteContent.aboutTitle || 'About Pioneer Clothing House'}
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              {websiteContent.aboutText || 'Established at Circular Road, Near Mazban Hotel in the heart of Pulwama, Pioneer Clothing House represents an unwavering commitment to quality fabric, authentic craftsmanship, and honest prices. From heirloom Kashmiri woolen pherans to contemporary formal suits and festive attire, we dress you with pride and warmth.'}
            </p>
            <div className="pt-2 flex gap-4">
              <button
                onClick={() => onNavigate('#/about')}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Read More About Us
              </button>
              <button
                onClick={() => onNavigate('#/find-us')}
                className="px-5 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Store Location Map
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 aspect-4/3 rounded-xl overflow-hidden bg-stone-100 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
              alt="Pioneer Clothing House Traditional Craft"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mandatory Section 31: Find Us / Google Maps Section */}
      <FindUsSection />

    </div>
  );
};
