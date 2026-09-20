import { useState } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';

type Props = {
  onNavigate: (section: string) => void;
};

export default function Navbar({ onNavigate }: Props) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Survey', section: 'survey' },
    { label: 'Browse', section: 'inventory' },
    { label: 'Custom Request', section: 'custom-request' },
    { label: 'Refer & Win', section: 'refer' },
    { label: 'Mini Game', section: 'game' },
  ];

  const handleClick = (section: string) => {
    onNavigate(section);
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleClick('hero')}
            className="flex items-center gap-2 font-bold text-lg group"
          >
            <Sparkles className="w-6 h-6 text-rose-500 group-hover:rotate-12 transition-transform" />
            <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
              A.K.A. Anime Stall
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.section}
                onClick={() => handleClick(link.section)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden text-slate-700 p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <button
                key={link.section}
                onClick={() => handleClick(link.section)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
