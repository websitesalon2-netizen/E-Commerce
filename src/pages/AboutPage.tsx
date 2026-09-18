import React from 'react';
import { MapPin, Phone, Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FindUsSection } from '../components/storefront/FindUsSection';

interface AboutPageProps {
  onNavigateShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateShop }) => {
  const { siteSettings, websiteContent, contactSettings } = useStore();

  return (
    <div id="about-page" className="space-y-16 py-10">
      
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-amber-900 font-bold block">
          Heritage & Craftsmanship
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
          About {siteSettings.shopName} {siteSettings.subtitle}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
          {websiteContent.aboutText || 'Established on Circular Road, Near Mazban Hotel in Pulwama, Pioneer Clothing House represents an unwavering commitment to Kashmiri artisanal traditions, premium woolen fabrics, and contemporary elegance.'}
        </p>
      </section>

      {/* Story & Image Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Rooted in Pulwama, Treasured Across Kashmir
            </h2>
            <p>
              For decades, Pioneer Clothing House has been the trusted sanctuary for families seeking authentic Kashmiri pherans, intricately hand-embroidered tilla shawls, festive groom’s suits, and bridal trousseaus.
            </p>
            <p>
              Each piece in our boutique is chosen with meticulous attention to weave density, wool purity, color fastness, and stitch refinement. We collaborate with master artisans in and around Pulwama and the greater valley to ensure time-honored Kashmiri needlework thrives with contemporary style.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xl font-bold text-stone-900 block font-serif">100% Pure</span>
                <span className="text-xs text-stone-500">Fine Wool & Pashmina Blends</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xl font-bold text-stone-900 block font-serif">Hand-Finished</span>
                <span className="text-xs text-stone-500">Authentic Tilla & Aari Embroidery</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onNavigateShop}
                className="px-6 py-3 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Browse Our Collections
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
              alt="Kashmiri Pheran Craft"
              className="rounded-2xl object-cover aspect-3/4 shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80"
              alt="Men's Formal Suits Pulwama"
              className="rounded-2xl object-cover aspect-3/4 shadow-md mt-6"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-stone-50 py-16 border-t border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              The Pioneer Promise
            </h3>
            <p className="text-xs text-stone-500 mt-1">Our guiding principles in every stitch</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-bold text-stone-900">Quality Without Compromise</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                We select premium woolen textiles and fine cotton fabrics that endure Kashmiri winters and everyday life.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-bold text-stone-900">Fair & Transparent Pricing</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Direct sourcing enables us to offer genuine boutique quality at honest, transparent rates without artificial markups.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-bold text-stone-900">Warm Customer Relationship</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Whether you visit our Pulwama showroom or order online via WhatsApp, personalized attention is always guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Find Us */}
      <FindUsSection />

    </div>
  );
};
