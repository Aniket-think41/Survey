import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SurveySection from '@/components/SurveySection';
import InventoryGrid from '@/components/InventoryGrid';
import PurchaseModal from '@/components/PurchaseModal';
import CustomRequestSection from '@/components/CustomRequestSection';
import ReferSection from '@/components/ReferSection';
import MiniGame from '@/components/MiniGame';
import Footer from '@/components/Footer';
import type { InventoryItem, PackOption } from '@/lib/supabase';

function App() {
  const [purchaseModal, setPurchaseModal] = useState<{ item: InventoryItem; pack: PackOption } | null>(null);

  const handleNavigate = useCallback((section: string) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleBuy = useCallback((item: InventoryItem, pack: PackOption) => {
    setPurchaseModal({ item, pack });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar onNavigate={handleNavigate} />
      <Hero onStartSurvey={() => handleNavigate('survey')} />
      <SurveySection />
      <InventoryGrid onBuy={handleBuy} />
      <CustomRequestSection />
      <ReferSection />
      <MiniGame />
      <Footer />

      {purchaseModal && (
        <PurchaseModal
          item={purchaseModal.item}
          pack={purchaseModal.pack}
          onClose={() => setPurchaseModal(null)}
        />
      )}
    </div>
  );
}

export default App;
