import { useState, useEffect } from 'react';
import { supabase, type InventoryItem, type PackOption } from '@/lib/supabase';
import { Package, Search, Filter, CheckCircle } from 'lucide-react';

type Props = {
  onBuy: (item: InventoryItem, pack: PackOption) => void;
};

export default function InventoryGrid({ onBuy }: Props) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false });

    if (error) {
      setError('Could not load inventory. Please try again later.');
    } else {
      setItems((data as InventoryItem[]) || []);
    }
    setLoading(false);
  };

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))];

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.anime_series.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="inventory" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-4">
            <Package className="w-4 h-4 text-orange-500" />
            <span className="text-orange-600 text-sm font-medium">Our Collection</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Browse{' '}
            <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
              Inventory
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Pick a pack size, confirm the price, and share your details. We'll get back to you!
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or anime series..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-12 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <InventoryCard key={item.id} item={item} onBuy={onBuy} />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No items found matching your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function InventoryCard({ item, onBuy }: { item: InventoryItem; onBuy: Props['onBuy'] }) {
  const [selectedPack, setSelectedPack] = useState<PackOption | null>(null);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-rose-300 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {item.image_url && !imgError ? (
          <img
            src={item.image_url}
            alt={item.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Package className="w-12 h-12 text-slate-300" />
            <span className="text-xs text-slate-400 px-4 text-center">{item.name}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium text-rose-600 border border-rose-200">
          {item.anime_series}
        </div>
        <div className="absolute top-3 right-3 px-3 py-1 bg-green-500/90 backdrop-blur rounded-full text-xs font-medium text-white">
          In Stock
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <span className="text-xs font-medium text-orange-500 uppercase tracking-wide">{item.category}</span>
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-rose-500 transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{item.description}</p>

        {/* Pack options */}
        <div className="space-y-2 mb-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Choose a pack:</p>
          <div className="grid grid-cols-2 gap-2">
            {item.pack_options.map((pack, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPack(pack)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedPack?.pack_size === pack.pack_size
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-rose-300'
                }`}
              >
                <div className="text-xs opacity-70">{pack.pack_size}</div>
                <div className="font-bold">₹{pack.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Buy button */}
        {selectedPack ? (
          <button
            onClick={() => onBuy(item, selectedPack)}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-500/25 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            I'll buy this for ₹{selectedPack.price}
          </button>
        ) : (
          <div className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-400 font-medium rounded-xl text-center text-sm">
            Select a pack to continue
          </div>
        )}
      </div>
    </div>
  );
}
