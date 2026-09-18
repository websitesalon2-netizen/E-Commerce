import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { sanitizeWhatsAppNumber } from '../lib/whatsapp';
import { FindUsSection } from '../components/storefront/FindUsSection';

export const ContactPage: React.FC = () => {
  const { contactSettings, businessHours, websiteContent } = useStore();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    // Build WhatsApp message to store
    const fullText = `*New Customer Inquiry:*\n*Name:* ${name}\n*Mobile:* ${mobile || 'N/A'}\n*Subject:* ${subject || 'General Inquiry'}\n*Message:* ${message}`;
    const url = `https://wa.me/${sanitizeWhatsAppNumber(contactSettings.whatsapp)}?text=${encodeURIComponent(fullText)}`;
    
    window.open(url, '_blank');
    setSubmitted(true);
  };

  return (
    <div id="contact-page" className="space-y-16 py-10">
      
      {/* Header */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-amber-900 font-bold block">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
          {websiteContent.contactHeading || 'Contact Pioneer Clothing House'}
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          {websiteContent.contactDescription || 'Have questions about sizing, bridal collections, or online order delivery in Pulwama? Reach out to us directly or visit our boutique.'}
        </p>
      </section>

      {/* Contact Cards & Form Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Cards: Contact Info & Hours */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Direct Communication
              </h3>

              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Store Address</span>
                    <p className="mt-0.5">{contactSettings.address}</p>
                    <p className="text-stone-400">PIN 192121 • Pulwama, J&K</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Phone Line</span>
                    <a href={`tel:${contactSettings.phone}`} className="text-amber-900 font-semibold hover:underline block mt-0.5">
                      {contactSettings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">WhatsApp Support</span>
                    <a 
                      href={`https://wa.me/${sanitizeWhatsAppNumber(contactSettings.whatsapp)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-semibold hover:underline block mt-0.5"
                    >
                      +91 {contactSettings.whatsapp}
                    </a>
                  </div>
                </div>

                {contactSettings.email && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 block text-sm">Email</span>
                      <a href={`mailto:${contactSettings.email}`} className="text-stone-700 hover:underline block mt-0.5">
                        {contactSettings.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Operating Hours Box */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-3">
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-800" />
                <span>Store Timings</span>
              </h3>
              <div className="space-y-1.5 text-xs text-stone-600 divide-y divide-stone-100">
                <div className="flex justify-between py-1">
                  <span>Mon – Sat:</span>
                  <span className="font-semibold text-stone-800">{businessHours.monday.openingTime} – {businessHours.monday.closingTime}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Sunday:</span>
                  <span className="font-semibold text-stone-800">
                    {businessHours.sunday.open ? `${businessHours.sunday.openingTime} – ${businessHours.sunday.closingTime}` : 'Closed'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Send an Inquiry to Store
            </h3>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-emerald-950">Inquiry Sent!</h4>
                <p className="text-xs text-emerald-800">
                  Your message has been initiated via WhatsApp. Our team will review your request promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-emerald-900 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Zahid Ahmad"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="96222 29622"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Kashmiri Pheran Custom Sizing or Wedding Order"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you are looking for..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message via WhatsApp</span>
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* Find Us Section */}
      <FindUsSection />

    </div>
  );
};
