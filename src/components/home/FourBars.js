import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../lib/shopify';

const FALLBACK_BARS = [
  {
    title: 'उटणं',
    subTitle: 'Utanē · The ritual bar',
    desc: 'Warm, dark and sweet. Closer to an attar than to a soap.',
    price: 149,
    handle: 'उटणं-utane',
    accent: '#B5651D',
    image: 'https://cdn.shopify.com/s/files/1/0726/9738/0938/files/WhatsAppImage2026-10-02at12.37.30PM.jpg?v=1790924931',
  },
  {
    title: 'निखार',
    subTitle: 'Nikhār · The glow bar',
    desc: 'Bright and fruity, then a warm resin note underneath.',
    price: 149,
    handle: 'nikhar',
    accent: '#A63A1E',
    image: 'https://cdn.shopify.com/s/files/1/0726/9738/0938/files/WhatsAppImage2026-10-02at12.37.29PM_2425bd51-65d2-40d7-9e91-723f4a28a545.jpg?v=1791005890',
  },
  {
    title: 'निर्मळ',
    subTitle: 'Nirmaḷ · Our signature',
    desc: 'Deep, woody, clean. Wet earth after the first rain.',
    price: 149,
    handle: 'nirmal',
    accent: '#1B4332',
    image: 'https://cdn.shopify.com/s/files/1/0726/9738/0938/files/WhatsAppImage2026-10-02at12.37.28PM_1_61a1aba3-3dde-49ba-b2f1-24e0cbea4584.jpg?v=1791006294',
  },
  {
    title: 'कांती',
    subTitle: 'Kānti · With niacinamide',
    desc: 'Soft creamy coconut, then something cool and mineral.',
    price: 149,
    handle: 'kanti',
    accent: '#8DA0AE',
    image: 'https://cdn.shopify.com/s/files/1/0726/9738/0938/files/WhatsAppImage2026-10-02at12.37.30PM_38a265b4-6943-44b3-b18b-f587f818a0b9.jpg?v=1791006294',
  },
];

function FourBars() {
  const [bars, setBars] = useState(FALLBACK_BARS);

  useEffect(() => {
    let isMounted = true;
    getAllProducts(10)
      .then((res) => {
        if (!isMounted) return;
        const edges = res?.data?.products?.edges || [];
        if (edges.length > 0) {
          const mapped = FALLBACK_BARS.map((fallback) => {
            const match = edges.find((e) => {
              const node = e.node;
              return (
                node.handle === fallback.handle ||
                node.title.includes(fallback.title)
              );
            });
            if (match) {
              const node = match.node;
              return {
                ...fallback,
                price: parseFloat(node.priceRange?.minVariantPrice?.amount || fallback.price),
                image: node.images?.edges?.[0]?.node?.url || fallback.image,
              };
            }
            return fallback;
          });
          setBars(mapped);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToDiscovery = (e) => {
    e.preventDefault();
    const el = document.getElementById('discovery-set');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="shop" className="bg-[#EFE4D5] border-t border-[#E3D6C4]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-14 sm:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-semibold text-[#3B2314] tracking-[-0.012em]">
            Four bars. Four fragrances.
          </h2>
          <button
            type="button"
            onClick={scrollToDiscovery}
            className="text-sm sm:text-[15px] text-[#4E3626] border-b border-[#C2AE95] pb-0.5 hover:text-[#3B2314] transition-colors"
          >
            Not sure? Try all four — ₹499
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bars.map((bar) => (
            <Link
              key={bar.handle}
              to={`/shop/${bar.handle}`}
              className="group flex flex-col bg-[#F5EDE0] border border-[#E3D6C4] rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Colored Accent Strip */}
              <span className="h-[5px] w-full" style={{ backgroundColor: bar.accent }} />

              {/* Product Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#eee7df]">
                <img
                  src={bar.image}
                  alt={bar.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-sans text-2xl sm:text-[26px] font-bold text-[#3B2314] leading-tight mb-1">
                    {bar.title}
                  </h3>
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#6B4F35] mb-2.5">
                    {bar.subTitle}
                  </p>
                  <p className="font-serif text-sm sm:text-[14.5px] leading-[1.52] text-[#4E3626]">
                    {bar.desc}
                  </p>
                </div>
                <div className="pt-3 flex items-center justify-between font-serif text-base font-semibold text-[#3B2314] border-t border-[#E3D6C4]/60">
                  <span>₹{bar.price}</span>
                  <span className="text-xs uppercase tracking-wider text-[#6B4F35] group-hover:text-[#3B2314] transition-colors">
                    View bar →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FourBars;
