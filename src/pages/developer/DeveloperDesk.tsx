import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Globe, 
  MapPin, 
  Save, 
  Code, 
  Sliders, 
  CheckCircle,
  AlertCircle,
  Palette
} from 'lucide-react';

export const DeveloperDesk: React.FC = () => {
  const store = useStore();

  const [devPassword, setDevPassword] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Dynamic Form States with fallbacks
  const [siteForm, setSiteForm] = useState({ ...(store.siteSettings || {}) });
  const [contactForm, setContactForm] = useState({ ...(store.contactSettings || {}) });
  const [hoursForm, setHoursForm] = useState({ ...(store.businessHours || {}) });
  const [themeForm, setThemeForm] = useState({ ...(store.themeSettings || {}) });
  const [contentForm, setContentForm] = useState({ ...(store.websiteContent || {}) });

  if (store.currentUserRole !== 'developer') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-100 px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-stone-200 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Developer Desk</h2>
          <p className="text-stone-600 text-sm mb-6">Enter system key to unlock full site customization settings.</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (store.loginDeveloper && !store.loginDeveloper(devPassword)) {
              alert('Invalid Developer Access Key!');
            }
          }}>
            <input 
              type="password"
              placeholder="Developer Access Key"
              value={devPassword}
              onChange={(e) => setDevPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-amber-800 outline-none"
            />
            <button 
              type="submit"
              className="w-full bg-amber-900 text-amber-100 font-semibold py-2.5 rounded-lg hover:bg-amber-800 transition-colors"
            >
              Unlock Desk
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleSaveAll = async () => {
    try {
      setSaveStatus('Saving changes...');

      // Helper to strip undefined values so Firestore calls never crash
      const sanitize = (obj: any) => {
        if (!obj) return {};
        const clean: any = {};
        Object.keys(obj).forEach((key) => {
          if (obj[key] !== undefined) {
            clean[key] = obj[key];
          }
        });
        return clean;
      };

      const tasks: Promise<any>[] = [];

      if (store.updateSiteSettings) tasks.push(store.updateSiteSettings(sanitize(siteForm)));
      if (store.updateContactSettings) tasks.push(store.updateContactSettings(sanitize(contactForm)));
      if (store.updateBusinessHours) tasks.push(store.updateBusinessHours(sanitize(hoursForm)));
      if (store.updateThemeSettings) tasks.push(store.updateThemeSettings(sanitize(themeForm)));
      if (store.updateWebsiteContent) tasks.push(store.updateWebsiteContent(sanitize(contentForm)));

      const results = await Promise.allSettled(tasks);
      const failures = results.filter((r) => r.status === 'rejected');

      if (failures.length > 0) {
        console.error('Firestore save rejections:', failures);
        setSaveStatus('Failed to save some settings. Check browser console.');
        return;
      }

      // Dynamic favicon update in browser DOM
      if (siteForm.faviconUrl) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'shortcut icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = siteForm.faviconUrl;
      }

      setSaveStatus('All site configurations saved successfully!');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err) {
      console.error('Developer Desk Save Error:', err);
      setSaveStatus('Failed to save settings.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'faviconUrl') => {
    const file = e.target.files?.[0];
    if (!file || !store.uploadImage) return;

    try {
      const url = await store.uploadImage(file, 'branding');
      setSiteForm(prev => ({ ...prev, [field]: url }));
    } catch (err) {
      alert('Failed to upload image.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full uppercase">Full System Access</span>
            <h1 className="text-3xl font-serif font-bold text-stone-900">Developer Desk</h1>
          </div>
          <p className="text-stone-600 text-sm mt-1">Override store names, logos, text, headers, colors, addresses, and credits across the site.</p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-colors shrink-0"
        >
          <Save className="w-5 h-5" />
          Save Global Changes
        </button>
      </div>

      {saveStatus && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium ${
          saveStatus.includes('successfully') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
        }`}>
          {saveStatus.includes('successfully') ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
          {saveStatus}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Section 1: Store Identity */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
            <Globe className="w-5 h-5 text-amber-800" />
            1. Store Identity & Header
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Store Name</label>
            <input 
              type="text" 
              value={siteForm.shopName || siteForm.storeName || ''} 
              onChange={e => setSiteForm({ ...siteForm, shopName: e.target.value, storeName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Store Tagline / Subtitle</label>
            <input 
              type="text" 
              value={siteForm.subtitle || siteForm.tagline || ''} 
              onChange={e => setSiteForm({ ...siteForm, subtitle: e.target.value, tagline: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Header Top Announcement Bar</label>
            <input 
              type="text" 
              value={siteForm.announcementText || ''} 
              onChange={e => setSiteForm({ ...siteForm, announcementText: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Logo URL</label>
              <input 
                type="text" 
                value={siteForm.logoUrl || ''} 
                onChange={e => setSiteForm({ ...siteForm, logoUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
              />
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'logoUrl')} className="text-xs text-stone-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Favicon URL</label>
              <input 
                type="text" 
                value={siteForm.faviconUrl || ''} 
                onChange={e => setSiteForm({ ...siteForm, faviconUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
              />
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'faviconUrl')} className="text-xs text-stone-500" />
            </div>
          </div>
        </div>

        {/* Section 2: Website Text */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
            <Sliders className="w-5 h-5 text-amber-800" />
            2. Hero & Copywriting Text
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Hero Title</label>
            <input 
              type="text" 
              value={contentForm.heroTitle || ''} 
              onChange={e => setContentForm({ ...contentForm, heroTitle: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Hero Subtitle</label>
            <textarea 
              rows={3}
              value={contentForm.heroSubtitle || ''} 
              onChange={e => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">About Us Story Text</label>
            <textarea 
              rows={4}
              value={contentForm.aboutText || contentForm.aboutStory || ''} 
              onChange={e => setContentForm({ ...contentForm, aboutText: e.target.value, aboutStory: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Section 3: Address & Contact */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
            <MapPin className="w-5 h-5 text-amber-800" />
            3. Address & Contact Details
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Physical Address</label>
            <input 
              type="text" 
              value={contactForm.address || siteForm.address || ''} 
              onChange={e => {
                setContactForm({ ...contactForm, address: e.target.value });
                setSiteForm({ ...siteForm, address: e.target.value });
              }}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Phone Number</label>
              <input 
                type="text" 
                value={contactForm.phone || ''} 
                onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">WhatsApp Number</label>
              <input 
                type="text" 
                value={contactForm.whatsapp || ''} 
                onChange={e => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Developer Credit & Colors */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
            <Palette className="w-5 h-5 text-amber-800" />
            4. Footer Credits & Custom CSS
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Developer Credit Name</label>
            <input 
              type="text" 
              value={siteForm.developerCreditName || 'Shujaat'} 
              onChange={e => setSiteForm({ ...siteForm, developerCreditName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Custom CSS Stylesheet Injection</label>
            <textarea 
              rows={4}
              value={siteForm.customCss || ''} 
              onChange={e => setSiteForm({ ...siteForm, customCss: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-xs font-mono bg-stone-900 text-emerald-400"
              placeholder="/* Enter raw CSS rules here */"
            />
          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveAll}
          className="flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Global Changes
        </button>
      </div>

    </div>
  );
};
