import { useState } from 'react';
import { supabase, type SurveyResponse } from '@/lib/supabase';
import { ClipboardList, Star, CheckCircle, Heart, ThumbsUp, MapPin, Phone, Mail, User, ArrowRight, AlertCircle, Gift } from 'lucide-react';

export default function SurveySection() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    favorite_anime: '',
    favorite_character: '',
    favorite_merch_type: '',
    spending_range: '',
    would_recommend: true,
    feedback: '',
    respondent_name: '',
    respondent_phone: '',
    respondent_email: '',
    city: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [error, setError] = useState('');

  const merchTypes = ['Figures', 'Posters', 'Keychains', 'Stickers', 'Acrylic Standees', 'Party Games', 'Lighters', 'Figure Sets'];
  const spendingRanges = ['Under ₹100', '₹100 - ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Above ₹2000'];

  const nextStep = () => {
    if (step === 0 && !form.favorite_anime.trim()) {
      setError('Please tell us your favorite anime!');
      return;
    }
    setError('');
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!form.respondent_name.trim() || !form.respondent_phone.trim() || !form.city.trim()) {
      setError('Please fill in your name, phone number, and city.');
      return;
    }

    setSubmitting(true);
    setError('');

    // Check if this phone or email already submitted a survey
    let checkQuery = supabase
      .from('survey_responses')
      .select('id')
      .eq('respondent_phone', form.respondent_phone.trim());

    if (form.respondent_email.trim()) {
      checkQuery = supabase
        .from('survey_responses')
        .select('id')
        .or(`respondent_phone.eq.${form.respondent_phone.trim()},respondent_email.eq.${form.respondent_email.trim()}`);
    }

    const { data: existing, error: checkError } = await checkQuery.maybeSingle();

    if (checkError) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
      return;
    }

    if (existing) {
      setAlreadySubmitted(true);
      setSubmitting(false);
      return;
    }

    const response: SurveyResponse = {
      respondent_name: form.respondent_name.trim(),
      respondent_phone: form.respondent_phone.trim(),
      respondent_email: form.respondent_email.trim(),
      city: form.city.trim(),
      favorite_anime: form.favorite_anime.trim(),
      favorite_character: form.favorite_character.trim(),
      favorite_merch_type: form.favorite_merch_type,
      spending_range: form.spending_range,
      would_recommend: form.would_recommend,
      feedback: form.feedback.trim(),
    };

    const { error: insertError } = await supabase.from('survey_responses').insert(response);

    if (insertError) {
      // Could be a unique constraint violation from a race condition
      if (insertError.code === '23505') {
        setAlreadySubmitted(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
      setSubmitting(false);
    } else {
      setSuccess(true);
    }
  };

  const resetForm = () => {
    setForm({
      favorite_anime: '', favorite_character: '', favorite_merch_type: '',
      spending_range: '', would_recommend: true, feedback: '',
      respondent_name: '', respondent_phone: '', respondent_email: '', city: '',
    });
    setStep(0);
    setSuccess(false);
    setAlreadySubmitted(false);
    setError('');
  };

  const steps = ['Anime', 'Preferences', 'Contact'];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <section id="survey" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-rose-50/50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 border border-rose-200 mb-4">
            <ClipboardList className="w-4 h-4 text-rose-500" />
            <span className="text-rose-600 text-sm font-medium">Quick & Fun</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Anime{' '}
            <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
              Survey
            </span>
          </h2>
          <p className="text-slate-500">
            Fill the survey and get a chance to win a free anime goods hamper!
          </p>
        </div>

        {alreadySubmitted ? (
          <div className="bg-white border border-amber-200 rounded-3xl p-8 text-center shadow-xl shadow-rose-500/10 animate-pop">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 border border-amber-200 mb-4">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-2">Already Submitted!</h4>
            <p className="text-slate-500 mb-6">
              Looks like you've already filled the survey with this phone number or email.
              You can only submit once, but you can still refer friends for more chances to win the hamper!
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('refer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Go to Refer & Win
            </button>
          </div>
        ) : success ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl shadow-rose-500/10 animate-pop">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 border border-green-200 mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-2">Thanks, {form.respondent_name}!</h4>
            <p className="text-slate-500 mb-4">
              We love that your favorite anime is{' '}
              <span className="text-rose-500 font-semibold">{form.favorite_anime}</span>!
              Your feedback helps us bring the best merch to {form.city}.
            </p>
            <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-slate-600">
                You're now entered into the <span className="font-bold text-amber-600">Free Anime Goods Hamper</span> draw!
                Refer friends below to increase your chances of winning.
              </p>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('refer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Refer Friends & Win Hamper
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-rose-500/5 overflow-hidden">
            {/* Progress bar */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-2">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i <= step ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-sm font-medium hidden sm:block ${i <= step ? 'text-slate-900' : 'text-slate-400'}`}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              {/* Step 0: Anime */}
              {step === 0 && (
                <div className="space-y-5 animate-slide-up">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      What's your favorite anime? *
                    </label>
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g., One Piece, Naruto, Demon Slayer..."
                      value={form.favorite_anime}
                      onChange={(e) => setForm({ ...form, favorite_anime: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      Who's your favorite character?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Luffy, Itachi, Gojo..."
                      value={form.favorite_character}
                      onChange={(e) => setForm({ ...form, favorite_character: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Step 1: Preferences */}
              {step === 1 && (
                <div className="space-y-5 animate-slide-up">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">What type of merch do you like most?</label>
                    <div className="flex flex-wrap gap-2">
                      {merchTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setForm({ ...form, favorite_merch_type: type })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                            form.favorite_merch_type === type
                              ? 'bg-rose-500 border-rose-500 text-white scale-105'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-rose-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">How much do you usually spend on anime merch?</label>
                    <div className="flex flex-wrap gap-2">
                      {spendingRanges.map((range) => (
                        <button
                          key={range}
                          onClick={() => setForm({ ...form, spending_range: range })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                            form.spending_range === range
                              ? 'bg-orange-500 border-orange-500 text-white scale-105'
                              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-orange-300'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-rose-500" />
                      Would you recommend A.K.A. Anime Stall to your friends?
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setForm({ ...form, would_recommend: true })}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                          form.would_recommend
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-green-300'
                        }`}
                      >
                        Yes, definitely!
                      </button>
                      <button
                        onClick={() => setForm({ ...form, would_recommend: false })}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                          !form.would_recommend
                            ? 'bg-slate-500 border-slate-500 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        Maybe later
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">Any other feedback? (optional)</label>
                    <textarea
                      placeholder="Tell us what you'd love to see..."
                      value={form.feedback}
                      onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contact */}
              {step === 2 && (
                <div className="space-y-4 animate-slide-up">
                  <p className="text-sm font-semibold text-slate-700">Your contact details (one survey per person):</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={form.respondent_name}
                        onChange={(e) => setForm({ ...form, respondent_name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        value={form.respondent_phone}
                        onChange={(e) => setForm({ ...form, respondent_phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="Email (optional)"
                        value={form.respondent_email}
                        onChange={(e) => setForm({ ...form, respondent_email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Your City *"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-2">
                {step > 0 && !success && (
                  <button
                    onClick={() => { setStep((s) => s - 1); setError(''); }}
                    className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Back
                  </button>
                )}
                {step < 2 && (
                  <button
                    onClick={nextStep}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
                {step === 2 && (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Submit & Enter Draw
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
