import React, { useState } from 'react';
import { 
  Code, 
  Palette, 
  Layout, 
  Type, 
  Save, 
  RotateCcw, 
  Lock, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  MessageCircle,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ImageUploadPicker } from '../../components/common/ImageUploadPicker';
import { 
  getDeveloperWhatsAppUrl, 
  DEVELOPER_WHATSAPP_DISPLAY 
} from '../../lib/whatsapp';

export const DeveloperDesk: React.FC = () => {
  const { 
    currentUserRole, 
    loginAsDeveloper, 
    logoutRole,
    siteSettings,
    visualTheme,
    websiteContent,
    updateSiteSettings,
    updateVisualTheme,
    resetVisualTheme,
    updateWebsiteContent,
    changeDeveloperPassword
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'branding' | 'theme' | 'content' | 'credit' | 'security'>('branding');

  // Form states
  const [tempBranding, setTempBranding] = useState(siteSettings);
  const [tempTheme, setTempTheme] = useState(visualTheme);
  const [tempContent, setTempContent] = useState(websiteContent);

  // Security
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const isAuthenticated = currentUserRole === 'developer';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const success = loginAsDeveloper(passwordInput);
    if (!success) {
      setLoginError('Invalid Web Developer Password.');
    } else {
      setPasswordInput('');
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleSaveBranding = async () => {
    await updateSiteSettings(tempBranding);
    showFeedback('Brand identity updated successfully!');
  };

  const handleSaveTheme = async () => {
    await updateVisualTheme(tempTheme);
    showFeedback('Visual styling theme saved and applied!');
  };

  const handleResetTheme = async () => {
    await resetVisualTheme();
    setTempTheme(visualTheme);
    showFeedback('Theme reset to classic Pioneer royal palette.');
  };

  const handleSaveContent = async () => {
    await updateWebsiteContent(tempContent);
    showFeedback('Website promotional text & policies updated!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    const res = changeDeveloperPassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Developer password changed successfully!' });
      setOldPassword('');
      setNewPassword('');
    } else {
      setPasswordMsg({ type: 'error', text: res.message || 'Password update failed.' });
    }
  };

  // If not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto shadow-md">
            <Code className="w-8 h-8 text-amber-400" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Web Developer Desk
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Architectural & visual branding control portal
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Developer Access Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter developer password..."
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Default: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-mono">developer123</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold shadow-md transition cursor-pointer"
            >
              Sign In to Developer Desk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="developer-desk-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
              Developer Portal
            </span>
            <span className="text-xs text-stone-500">Pioneer Clothing House</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            Web Developer Desk
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logoutRole}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto gap-2 pb-1">
        {[
          { id: 'branding', label: 'Storefront Branding & Logo', icon: Layout },
          { id: 'theme', label: 'Visual Theme & Color Palette', icon: Palette },
          { id: 'content', label: 'Copywriting & Hero Banners', icon: Type },
          { id: 'credit', label: 'Developer WhatsApp Credit', icon: MessageCircle },
          { id: 'security', label: 'Developer Security', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* TAB 1: BRANDING & DIRECT LOGO/FAVICON UPLOAD */}
      {activeTab === 'branding' && (
        <div className="max-w-2xl bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-100">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Store Brand Identity & Device Upload
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Upload custom logo and browser favicon directly from your local storage.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Store Primary Name
              </label>
              <input
                type="text"
                value={tempBranding.shopName}
                onChange={(e) => setTempBranding({ ...tempBranding, shopName: e.target.value })}
                placeholder="Pioneer"
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Store Subtitle / Tagline
              </label>
              <input
                type="text"
                value={tempBranding.subtitle}
                onChange={(e) => setTempBranding({ ...tempBranding, subtitle: e.target.value })}
                placeholder="Clothing House"
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            {/* Direct Device Upload for Store Logo */}
            <div className="pt-2 border-t border-stone-100">
              <ImageUploadPicker
                label="Store Logo Image"
                helperText="Upload transparent PNG or WEBP logo. Max 2 MB."
                maxImages={1}
                folder="branding"
                currentImages={tempBranding.logoUrl ? [tempBranding.logoUrl] : []}
                onChange={(imgs) => setTempBranding({ ...tempBranding, logoUrl: imgs[0] || '' })}
              />
            </div>

            {/* Direct Device Upload for Favicon */}
            <div className="pt-2 border-t border-stone-100">
              <ImageUploadPicker
                label="Browser Favicon"
                helperText="Square 32x32 or 64x64 icon. Max 2 MB."
                maxImages={1}
                folder="branding"
                currentImages={tempBranding.faviconUrl ? [tempBranding.faviconUrl] : []}
                onChange={(imgs) => setTempBranding({ ...tempBranding, faviconUrl: imgs[0] || '' })}
              />
            </div>

            <button
              onClick={handleSaveBranding}
              className="px-6 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Brand Identity</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: VISUAL THEME EDITOR & PREVIEW */}
      {activeTab === 'theme' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
            <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">Visual Theme Styling</h3>
                <p className="text-xs text-stone-500 mt-1">Configure brand color codes and border curves.</p>
              </div>
              <button
                onClick={handleResetTheme}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Color (Accent)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempTheme.primaryColor}
                    onChange={(e) => setTempTheme({ ...tempTheme, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={tempTheme.primaryColor}
                    onChange={(e) => setTempTheme({ ...tempTheme, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-stone-50 border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempTheme.secondaryColor}
                    onChange={(e) => setTempTheme({ ...tempTheme, secondaryColor: e.target.value })}
                    className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={tempTheme.secondaryColor}
                    onChange={(e) => setTempTheme({ ...tempTheme, secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-stone-50 border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Button Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tempTheme.buttonColor}
                    onChange={(e) => setTempTheme({ ...tempTheme, buttonColor: e.target.value })}
                    className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={tempTheme.buttonColor}
                    onChange={(e) => setTempTheme({ ...tempTheme, buttonColor: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-stone-50 border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Card Border Radius</label>
                <select
                  value={tempTheme.borderRadius}
                  onChange={(e) => setTempTheme({ ...tempTheme, borderRadius: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                >
                  <option value="4px">4px (Sharp / Subtle)</option>
                  <option value="8px">8px (Modern Medium)</option>
                  <option value="12px">12px (Soft Luxury - Recommended)</option>
                  <option value="16px">16px (Rounded Pill)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveTheme}
              className="px-6 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Theme</span>
            </button>
          </div>

          {/* Theme Live Preview Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <span className="text-xs uppercase tracking-wider font-bold text-stone-400 block">
              Live Theme Preview
            </span>
            <div 
              className="p-5 border border-stone-200 space-y-3"
              style={{ 
                borderRadius: tempTheme.borderRadius,
                backgroundColor: tempTheme.backgroundColor || '#ffffff'
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center font-serif font-bold text-white text-lg"
                style={{ backgroundColor: tempTheme.primaryColor }}
              >
                P
              </div>
              <h4 
                className="font-serif font-bold text-base"
                style={{ color: tempTheme.textColor || '#1c1917' }}
              >
                Kashmiri Royal Woolen Pheran
              </h4>
              <p className="text-xs text-stone-500">
                Handcrafted tilla neckline with pure wool fabric.
              </p>
              <button
                type="button"
                className="w-full py-2 text-white text-xs font-semibold shadow-xs"
                style={{ 
                  backgroundColor: tempTheme.buttonColor,
                  borderRadius: tempTheme.borderRadius 
                }}
              >
                Add to Cart (₹3,499)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COPYWRITING & HERO BANNER */}
      {activeTab === 'content' && (
        <div className="max-w-3xl bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-100">
            <h3 className="font-serif text-xl font-bold text-stone-900">Website Copywriting & Hero Banner</h3>
            <p className="text-xs text-stone-500 mt-1">Manage prominent slogans, about text, and customer policies.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Top Announcement Promo Bar</label>
              <input
                type="text"
                value={tempContent.promoBannerText}
                onChange={(e) => setTempContent({ ...tempContent, promoBannerText: e.target.value })}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Homepage Hero Title</label>
              <input
                type="text"
                value={tempContent.heroTitle}
                onChange={(e) => setTempContent({ ...tempContent, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-serif font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Homepage Hero Subtitle</label>
              <textarea
                rows={2}
                value={tempContent.heroSubtitle}
                onChange={(e) => setTempContent({ ...tempContent, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Hero CTA Button Text</label>
              <input
                type="text"
                value={tempContent.heroCtaText}
                onChange={(e) => setTempContent({ ...tempContent, heroCtaText: e.target.value })}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            {/* Direct Device Upload for Hero Background Image */}
            <div className="pt-2 border-t border-stone-100">
              <ImageUploadPicker
                label="Hero Banner Background Image"
                helperText="Upload wide panoramic photograph for homepage hero. Max 2 MB."
                maxImages={1}
                folder="hero"
                currentImages={tempContent.heroImageUrl ? [tempContent.heroImageUrl] : []}
                onChange={(imgs) => setTempContent({ ...tempContent, heroImageUrl: imgs[0] || '' })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">About Section Story</label>
              <textarea
                rows={3}
                value={tempContent.aboutText}
                onChange={(e) => setTempContent({ ...tempContent, aboutText: e.target.value })}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <button
              onClick={handleSaveContent}
              className="px-6 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Website Content</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: MANDATORY DEVELOPER WHATSAPP CREDIT (SECTION 47 & 48) */}
      {activeTab === 'credit' && (
        <div className="max-w-2xl bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-100">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Developer WhatsApp Credit Requirement
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Compliance check for Section 47 & 48 specifications.
            </p>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3 text-xs text-stone-700 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Mandatory Footer Signature Verification</span>
            </div>
            <p>
              Under section 47 of the project specification, the website footer must persistently display:
            </p>
            <div className="p-3 bg-white rounded-xl border border-amber-200 font-mono text-stone-900 text-xs">
              <strong>Developed by Shujaat</strong> → Clickable redirect to WhatsApp: <strong>{DEVELOPER_WHATSAPP_DISPLAY}</strong> with pre-filled text: <em>&ldquo;Hello, i want to Discuss about Website for my Business&rdquo;</em>
            </div>
            <p>
              This credit is securely anchored into the React layout engine and cannot be stripped away or altered through standard content panels.
            </p>
          </div>

          <div>
            <a
              href={getDeveloperWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Test Developer WhatsApp Redirection</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* TAB 5: DEVELOPER SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="max-w-md bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-100">
            <h3 className="font-serif text-lg font-bold text-stone-900">Developer Password</h3>
            <p className="text-xs text-stone-500 mt-1">Change master credential for web developer desk.</p>
          </div>

          {passwordMsg && (
            <div className={`p-3 rounded-xl text-xs border ${
              passwordMsg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Update Developer Password
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
