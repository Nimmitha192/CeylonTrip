import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Thank you! Your message has been sent to the CeylonTrips team.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
          Get In Touch
        </span>
        <h1 className="font-display font-extrabold text-slate-900 text-3xl sm:text-4xl lg:text-5xl">
          Contact CeylonTrips Support
        </h1>
        <p className="text-sm text-slate-500 sm:text-base">
          Have questions regarding trip optimization, destination partnerships, or university evaluation feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
              Platform Headquarters
            </h3>

            <div className="space-y-4 text-xs text-slate-600 sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-800">Address</strong>
                  <span>Galle Face Center Road, Colombo 03, Western Province, Sri Lanka</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-ocean-50 text-ocean-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-800">Phone Support</strong>
                  <span>+94 11 234 5678 / +94 77 987 6543</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-800">Email Inquiries</strong>
                  <span>support@ceylontrips.com / contact@ceylontrips.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50 text-slate-900 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">Emergency Tourism Assistance</h4>
            <p className="text-xs text-slate-600 leading-relaxed sm:text-sm">
              Sri Lanka Tourist Police Hotline: <strong className="text-emerald-700">1912</strong> (Toll-Free within Sri Lanka). Emergency Police: <strong>119</strong>. Ambulance: <strong>1990</strong>.
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-card space-y-5"
          >
            <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
              Send Us a Message
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block sm:text-sm">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kasun Fernando"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block sm:text-sm">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="kasun@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block sm:text-sm">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Trip recommendation question or feedback"
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block sm:text-sm">Message</label>
              <textarea
                rows="4"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your travel question or suggestions..."
                className="w-full p-3.5 rounded-xl border border-emerald-500 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 sm:text-sm"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
