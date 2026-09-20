import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-rose-500" />
          <span className="text-lg font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
            A.K.A. Anime Stall
          </span>
        </div>
        <p className="text-slate-500 text-sm mb-4 max-w-2xl mx-auto">
          Your go-to anime merchandise destination. Browse, request, and win.
          Sharing the love of anime one pack at a time.
        </p>
        <div className="flex items-center justify-center gap-1 text-slate-400 text-sm">
          Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for anime fans
        </div>
      </div>
    </footer>
  );
}
