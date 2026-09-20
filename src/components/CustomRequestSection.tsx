import { useState } from 'react';
import { supabase, type CustomRequest } from '@/lib/supabase';
import { PackageSearch, User, Phone, Mail, MapPin, School, CheckCircle, Sparkles } from 'lucide-react';

export default function CustomRequestSection() {
  const [form, setForm] = useState({
    item_description: '', anime_series: '', category: '', expected_price: '', quantity: '',
    requester_name: '', requester_phone: '', requester_email: '', city: '', college_name: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.item_description.trim() || !form.requester_name.trim() || !form.requester_phone.trim() || !form.city.trim()) {
      setError('Please fill in the item description, your name, phone number, and city.');
      return;
    }

    setSubmitting(true);
    setError('');

    const request: CustomRequest = {
      item_description: form.item_description.trim(),
      anime_series: form.anime_series.trim(),
      category: form.category.trim(),
      expected_price: form.expected_price ? parseFloat(form.expected_price) : 0,
      quantity: form.quantity.trim(),
      requester_name: form.requester_name.trim(),
      requester_phone: form.requester_phone.trim(),
      requester_email: form.requester_email.trim(),
      city: form.city.trim(),
      college_name: form.college_name.trim(),
    };

    const { error: insertError } = await supabase.from('custom_requests').insert(request);

    if (insertError) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    } else {
      setSuccess(true);
    }
  };

  const resetForm = () => {
    setForm({
      item_description: '', anime_series: '', category: '', expected_price: '', quantity: '',
      requester_name: '', requester_phone: '', requester_email: '', city: '', college_name: '',
    });
    setSuccess(false);
    setError('');
  };

  return (
    <section id="custom-request" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rose-50/30 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 mb-4">
            <PackageSearch className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">Can't find what you want?</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Custom{' '}
            <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
              Request
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            If something you want isn't in our inventory, tell us what you're looking for!
            We'll check with our wholesalers and try to get you the best deal.
          </p>
        </div>

        {success ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl shadow-amber-500/10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 border border-green-200 mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Request Submitted!</h4>
            <p className="text-slate-500 mb-6">
              Thanks, {form.requester_name}! We've received your request for{' '}
              <span className="text-amber-600 font-medium">{form.item_description}</span>.
              Our team will check with wholesalers and contact you at{' '}
              <span className="text-rose-500 font-medium">{form.requester_phone}</span> soon!
            </p>
            <button onClick={resetForm}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform">
              Submit Another Request
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-amber-500/5">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                What are you looking for?
              </p>

              <textarea placeholder="Describe the anime product you want... (e.g., 'Naruto Shippuden figurine set of 7 characters')"
                value={form.item_description}
                onChange={(e) => setForm({ ...form, item_description: e.target.value })} rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all resize-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Anime series (e.g., Naruto, One Piece)" value={form.anime_series}
                  onChange={(e) => setForm({ ...form, anime_series: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
                <input type="text" placeholder="Category (e.g., Figures, Manga, Clothing)" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
                <input type="number" placeholder="Expected price (₹)" value={form.expected_price}
                  onChange={(e) => setForm({ ...form, expected_price: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
                <input type="text" placeholder="Quantity (e.g., 1 piece, 5 pieces)" value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              <p className="text-sm font-semibold text-slate-700">Your contact details:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Your Name *" value={form.requester_name}
                    onChange={(e) => setForm({ ...form, requester_name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="tel" placeholder="Phone Number *" value={form.requester_phone}
                    onChange={(e) => setForm({ ...form, requester_phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" placeholder="Email (optional)" value={form.requester_email}
                    onChange={(e) => setForm({ ...form, requester_email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Your City *" value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
                </div>
                <div className="relative sm:col-span-2">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="College Name (optional)" value={form.college_name}
                    onChange={(e) => setForm({ ...form, college_name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
            )}

            <button onClick={handleSubmit} disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {submitting ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><PackageSearch className="w-5 h-5" /> Submit Request</>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
