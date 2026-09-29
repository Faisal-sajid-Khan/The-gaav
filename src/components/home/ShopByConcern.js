import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Sparkles, Sun, Hourglass } from 'lucide-react';

const CONCERNS = [
  { id: 'dry-skin', label: 'DRY SKIN', icon: Droplets, query: 'dry' },
  { id: 'acne-prone', label: 'ACNE PRONE', icon: Sparkles, query: 'acne' },
  { id: 'pigmentation', label: 'PIGMENTATION', icon: Sun, query: 'pigmentation' },
  { id: 'aging', label: 'AGING', icon: Hourglass, query: 'aging' },
];

function ShopByConcern() {
  return (
    <section className="py-12 sm:py-16 bg-[#fcf9f8]">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#4a2e10] text-center font-bold mb-8">
          Shop by Concern
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-3xl mx-auto">
          {CONCERNS.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link 
                key={item.id} 
                to={`/shop?concern=${encodeURIComponent(item.label)}`}
                className="group flex flex-col items-center justify-center gap-3 p-6 sm:p-8 bg-[#f7f4ef] rounded-2xl border border-[#e8dfd5] hover:border-[#4a2e10] hover:bg-[#f3ede4] transition-all shadow-sm"
              >
                <IconComponent size={24} className="text-[#8c6239] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <span className="font-sans text-xs sm:text-sm font-bold tracking-[0.15em] text-[#4a2e10] text-center uppercase">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ShopByConcern;
