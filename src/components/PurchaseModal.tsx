import { useState } from 'react';
import { supabase, type InventoryItem, type PackOption, type PurchaseInterest } from '@/lib/supabase';
import { X, User, Phone, Mail, MapPin, School, CheckCircle, ShoppingBag } from 'lucide-react';

type Props = {
  item: InventoryItem;
  pack: PackOption;
  onClose: () => void;
};

export default function PurchaseModal({ item, pack, onClose }: Props) {
  const [form, setForm] = useState({
    buyer_name: '', buyer_phone: '', buyer_email: '', city: '', college_name: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.buyer_name.trim() || !form.buyer_phone.trim() || !form.city.trim()) {
      setError('Please enter your name, phone number, and city.');
      return;
    }

    setSubmitting(true);
    setError('');

    const interest: PurchaseInterest = {
      inventory_id: item.id,
      product_name: item.name,
      pack_size: pack.pack_size,
      price: pack.price,
      buyer_name: form.buyer_name.trim(),
      buyer_phone: form.buyer_phone.trim(),
      buyer_email: form.buyer_email.trim(),
      city: form.city.trim(),
      college_name: form.college_name.trim(),
      notes: form.notes.trim(),
    };

    const { error: insertError } = await supabase.from('purchase_interests').insert(interest);

    if (insertError) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-500 to-orange-500 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-white" />
            <h3 className="text-lg font-bold text-white">Confirm Your Purchase</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 border border-green-200 mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Interest Recorded!</h4>
            <p className="text-slate-500 mb-6">
              Thanks, {form.buyer_name}! We've noted your interest in{' '}
              <span className="text-rose-500 font-medium">{item.name}</span> ({pack.pack_size} for ₹{pack.price}).
              We'll contact you at <span className="text-orange-500 font-medium">{form.buyer_phone}</span> soon!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.anime_series} - {item.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div>
                  <p className="text-xs text-slate-400">Pack Size</p>
                  <p className="text-sm font-medium text-rose-600">{pack.pack_size}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Price</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                    ₹{pack.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Enter your details so we can reach out:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Your Name *" value={form.buyer_name}
                    onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="tel" placeholder="Phone Number *" value={form.buyer_phone}
                    onChange={(e) => setForm({ ...form, buyer_phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" placeholder="Email (optional)" value={form.buyer_email}
                    onChange={(e) => setForm({ ...form, buyer_email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all" />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Your City *" value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all" />
                </div>
                <div className="relative sm:col-span-2">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="College Name (optional)" value={form.college_name}
                    onChange={(e) => setForm({ ...form, college_name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all" />
                </div>
              </div>

              <textarea placeholder="Any notes or questions? (optional)" value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all resize-none" />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
            )}

            <button onClick={handleSubmit} disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {submitting ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><CheckCircle className="w-5 h-5" /> Yes, I'll buy at this price!</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
