import { useState } from 'react';
import { supabase, type Referral } from '@/lib/supabase';
import { Gift, User, Phone, Mail, MapPin, School, CheckCircle, Users, Trophy, Sparkles, Star } from 'lucide-react';

const HAMPER_IMAGE = 'https://images.pexels.com/photos/1666069/pexels-photo-1666069.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function ReferSection() {
  const [form, setForm] = useState({
    referrer_name: '', referrer_phone: '', referrer_email: '',
    friend_name: '', friend_phone: '', friend_email: '',
    city: '', college_name: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.referrer_name.trim() || !form.referrer_phone.trim() || !form.friend_name.trim() || !form.friend_phone.trim() || !form.city.trim()) {
      setError("Please fill in your name, phone, city, and your friend's name and phone.");
      return;
    }

    setSubmitting(true);
    setError('');

    const referral: Referral = {
      referrer_name: form.referrer_name.trim(),
      referrer_phone: form.referrer_phone.trim(),
      referrer_email: form.referrer_email.trim(),
      friend_name: form.friend_name.trim(),
      friend_phone: form.friend_phone.trim(),
      friend_email: form.friend_email.trim(),
      city: form.city.trim(),
      college_name: form.college_name.trim(),
    };

    const { error: insertError } = await supabase.from('referrals').insert(referral);

    if (insertError) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    } else {
      setSuccess(true);
    }
  };

  const resetForm = () => {
    setForm({
      referrer_name: '', referrer_phone: '', referrer_email: '',
      friend_name: '', friend_phone: '', friend_email: '',
      city: '', college_name: '',
    });
    setSuccess(false);
    setError('');
  };

  return (
    <section id="refer" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 mb-4">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">Win Free Stuff!</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Refer &{' '}
            <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
              Win
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Refer a friend and both of you get a chance to win a{' '}
            <span className="text-amber-600 font-semibold">FREE Anime Goods Hamper</span>!
            The more friends you refer, the higher your chances.
          </p>
        </div>

        {/* Big Hamper Showcase */}
        <div className="relative mb-10 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/20 border border-amber-200">
          <div className="relative h-64 sm:h-80">
            <img
              src={HAMPER_IMAGE}
              alt="Anime Goods Hamper"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/90 backdrop-blur mb-3">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-bold">Grand Prize</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Free Anime Goods Hamper
              </h3>
              <p className="text-white/80 text-sm sm:text-base">
                A curated box of anime merch - figures, keychains, posters, stickers & more!
              </p>
            </div>
          </div>
        </div>

        {/* What's inside the hamper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { icon: '🎁', label: 'Surprise Figures' },
            { icon: '🔑', label: 'Keychains' },
            { icon: '🖼️', label: 'Posters' },
            { icon: '✨', label: 'Stickers' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200 rounded-2xl p-4 text-center hover:scale-105 transition-transform"
            >
              <div className="text-3xl mb-1">{item.icon}</div>
              <p className="text-sm font-medium text-slate-700">{item.label}</p>
            </div>
          ))}
        </div>

        {success ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl shadow-amber-500/10 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 border border-green-200 mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Referral Submitted!</h4>
            <p className="text-slate-500 mb-6">
              Awesome, {form.referrer_name}! You've referred{' '}
              <span className="text-amber-600 font-medium">{form.friend_name}</span>.
              Both of you are now in the running for the free hamper.
              We'll contact you at{' '}
              <span className="text-rose-500 font-medium">{form.referrer_phone}</span> if you win!
            </p>
            <button onClick={resetForm}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform inline-flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Refer Another Friend
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl shadow-amber-500/5 max-w-2xl mx-auto">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" />
                Your Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Your Name *" value={form.referrer_name}
                  onChange={(e) => setForm({ ...form, referrer_name: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
                <input type="tel" placeholder="Your Phone *" value={form.referrer_phone}
                  onChange={(e) => setForm({ ...form, referrer_phone: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
                <input type="email" placeholder="Your Email (optional)" value={form.referrer_email}
                  onChange={(e) => setForm({ ...form, referrer_email: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all" />
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

            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-500" />
                Friend's Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Friend's Name *" value={form.friend_name}
                  onChange={(e) => setForm({ ...form, friend_name: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all" />
                <input type="tel" placeholder="Friend's Phone *" value={form.friend_phone}
                  onChange={(e) => setForm({ ...form, friend_phone: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all" />
                <input type="email" placeholder="Friend's Email (optional)" value={form.friend_email}
                  onChange={(e) => setForm({ ...form, friend_email: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all" />
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
                <><Gift className="w-5 h-5" /> Refer & Enter the Draw!</>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
