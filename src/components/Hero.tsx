import { Sparkles, ArrowDown, Star, Zap, Gift } from 'lucide-react';

type Props = {
  onStartSurvey: () => void;
};

export default function Hero({ onStartSurvey }: Props) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-rose-50 via-white to-orange-50">
      {/* Floating decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.8s' }} />
      </div>

      {/* Floating emoji decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <span className="absolute top-32 left-[15%] text-6xl animate-float opacity-60" style={{ animationDelay: '0s' }}>⚡</span>
        <span className="absolute top-40 right-[12%] text-5xl animate-float opacity-60" style={{ animationDelay: '1s' }}>🔥</span>
        <span className="absolute bottom-40 left-[18%] text-5xl animate-float opacity-60" style={{ animationDelay: '0.5s' }}>💫</span>
        <span className="absolute bottom-32 right-[20%] text-6xl animate-float opacity-60" style={{ animationDelay: '1.8s' }}>⚡</span>
        <span className="absolute top-1/2 left-[8%] text-4xl animate-float opacity-50" style={{ animationDelay: '2s' }}>✨</span>
        <span className="absolute top-1/4 right-[8%] text-4xl animate-float opacity-50" style={{ animationDelay: '1.3s' }}>⭐</span>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 border border-rose-200 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span className="text-rose-600 text-sm font-medium">Anime Merch Survey & Stall</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 mb-4 leading-tight">
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            A.K.A. Anime Stall
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Take the quick survey, browse our merch, and get a chance to win a
          free anime goods hamper! Refer friends for more chances to win.
        </p>

        {/* Hamper highlight banner */}
        <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-100 to-rose-100 border border-amber-300 rounded-2xl mb-8 animate-fade-in shadow-lg shadow-amber-500/10">
          <Gift className="w-6 h-6 text-amber-600" />
          <span className="text-sm sm:text-base font-semibold text-slate-700">
            Fill the survey & win a <span className="text-amber-600">FREE Anime Goods Hamper!</span>
          </span>
        </div>

        {/* Quick start survey button */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <button
            onClick={onStartSurvey}
            className="px-10 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg"
          >
            <Zap className="w-6 h-6" />
            Start the Survey!
          </button>
          <p className="text-sm text-slate-400 flex items-center gap-1">
            Takes less than a minute
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
          {[
            { icon: Star, label: 'Quick Survey', color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200' },
            { icon: Sparkles, label: 'Browse Merch', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' },
            { icon: Zap, label: 'Refer & Win Hamper', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
          ].map((feat, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${feat.bg} border animate-fade-in`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <feat.icon className={`w-4 h-4 ${feat.color}`} />
              <span className={`text-sm font-medium ${feat.color}`}>{feat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
