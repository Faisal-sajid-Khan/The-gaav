import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function RecentlyViewed() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      setRecent(stored);
    } catch (e) {
      console.error('Error reading recently viewed', e);
    }
  }, []);

  if (recent.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-24 border-t border-outline-variant/30 pt-12 sm:pt-16">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold mb-1">
          Recently Viewed
        </h2>
        <p className="text-xs sm:text-sm text-outline">
          Pick up where you left off.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {recent.map((p) => {
          const price = parseFloat(p.price || 0);
          const compare = parseFloat(p.compareAtPrice || 0);
          const discount = compare > price ? Math.round(((compare - price) / compare) * 100) : 0;
          const type = p.type || 'HERITAGE BLEND';

          return (
            <Link 
              to={`/shop/${p.handle}`} 
              key={p.id} 
              className="group block bg-[#f7f4ef] rounded-2xl overflow-hidden border border-[#e8dfd5] p-3 sm:p-4 hover:shadow-md transition-all"
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#eee7df] mb-3">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-[#e3d8cd]" />
                )}
              </div>
              <div className="flex items-end justify-between gap-2">
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#4a2e10] group-hover:text-[#8c6239] transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-[10px] font-bold tracking-[0.15em] text-[#8c7462] uppercase mt-0.5">
                    {type}
                  </p>
                  <div className="flex items-center flex-wrap gap-1.5 mt-1">
                    <p className="text-xs sm:text-sm font-bold text-[#4a2e10]">
                      ₹{Number(price).toLocaleString('en-IN')}
                    </p>
                    {discount > 0 && (
                      <>
                        <p className="text-[10px] text-[#8c7462] line-through">
                          ₹{Number(compare).toLocaleString('en-IN')}
                        </p>
                        <p className="text-[9px] font-bold bg-[#4a2e10]/10 text-[#4a2e10] px-1 py-0.5 rounded">
                          {discount}% OFF
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#4a2e10] text-[#fcf9f8] flex items-center justify-center shrink-0 hover:bg-[#38220b] transition-all shadow-sm">
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default RecentlyViewed;
