import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAllProducts } from '../../lib/shopify';
import { addItemToCart } from '../../store/cartSlice';
import { openCartDrawer } from '../../store/uiSlice';
import { Plus } from 'lucide-react';

const FALLBACK_BARS = [
  {
    id: 'gid://shopify/Product/15397342281802',
    title: 'उटणं',
    subTitle: 'Utanē',
    handle: 'उटणं-utane',
    price: 149,
    variantId: 'gid://shopify/ProductVariant/67603874218058',
    image: 'https://cdn.shopify.com/s/files/1/0726/9738/0938/files/WhatsAppImage2026-10-02at12.37.30PM.jpg?v=1790924931',
  },
  {
    id: 'gid://shopify/Product/15398501646410',
    title: 'निखार',
    subTitle: 'Nikhār',
    handle: 'nikhar',
    price: 149,
    variantId: 'gid://shopify/ProductVariant/67609374523466',
    image: 'https://cdn.shopify.com/s/files/1/0726/9738/0938/files/WhatsAppImage2026-10-02at12.37.29PM_2425bd51-65d2-40d7-9e91-723f4a28a545.jpg?v=1791005890',
  },
  {
    id: 'gid://shopify/Product/15398503317578',
    title: 'निर्मळ',
    subTitle: 'Nirmaḷ',
    handle: 'nirmal',
    price: 149,
    variantId: 'gid://shopify/ProductVariant/67609377701962',
    image: 'https://cdn.shopify.com/s/files/1/0726/9738/0938/files/WhatsAppImage2026-10-02at12.37.28PM_1_61a1aba3-3dde-49ba-b2f1-24e0cbea4584.jpg?v=1791006294',
  },
  {
    id: 'gid://shopify/Product/15398503579722',
    title: 'कांती',
    subTitle: 'Kānti',
    handle: 'kanti',
    price: 149,
    variantId: 'gid://shopify/ProductVariant/67609377964106',
    image: 'https://cdn.shopify.com/s/files/1/0726/9738/0938/files/WhatsAppImage2026-10-02at12.37.30PM_38a265b4-6943-44b3-b18b-f587f818a0b9.jpg?v=1791006294',
  },
];

function CuratedBars() {
  const dispatch = useDispatch();
  const [bars, setBars] = useState(FALLBACK_BARS);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAllProducts(10)
      .then((res) => {
        if (!isMounted) return;
        const edges = res?.data?.products?.edges || [];
        if (edges.length > 0) {
          // Map fetched products to our 4 target bars
          const mapped = FALLBACK_BARS.map((fallback) => {
            const match = edges.find((e) => {
              const node = e.node;
              return (
                node.handle === fallback.handle ||
                node.id === fallback.id ||
                node.title.toLowerCase().includes(fallback.subTitle.toLowerCase()) ||
                node.title.includes(fallback.title)
              );
            });
            if (match) {
              const node = match.node;
              return {
                ...fallback,
                id: node.id,
                handle: node.handle,
                price: parseFloat(node.priceRange?.minVariantPrice?.amount || fallback.price),
                image: node.images?.edges?.[0]?.node?.url || fallback.image,
                variantId: node.variants?.edges?.[0]?.node?.id || fallback.variantId,
              };
            }
            return fallback;
          });
          setBars(mapped);
        }
      })
      .catch(() => {
        // Fallback already pre-populated
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickAdd = async (e, bar) => {
    e.preventDefault();
    e.stopPropagation();
    if (!bar.variantId) return;
    try {
      setAddingId(bar.id);
      await dispatch(addItemToCart({ variantId: bar.variantId, quantity: 1 })).unwrap();
      dispatch(openCartDrawer());
    } catch (err) {
      console.error('Failed to add item:', err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section id="the-four-soaps" className="pt-2 pb-8 sm:py-10 bg-[#fcf9f8]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label matching wireframe */}
        <div className="text-center mb-4 sm:mb-6">
          <p className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#8c7462] uppercase">
            THE FOUR SOAPS
          </p>
        </div>

        {/* 2-Column Grid on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {bars.map((bar) => (
            <Link
              key={bar.id}
              to={`/shop/${bar.handle}`}
              className="group flex flex-col bg-[#f7f4ef]/80 rounded-2xl p-2.5 sm:p-3 border border-[#e8dfd5] hover:border-[#4a2e10]/60 transition-all duration-300"
            >
              {/* Product Image Box */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#eee7df] mb-2.5">
                <img
                  src={bar.image}
                  alt={bar.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                
                {/* Floating Add Button */}
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(e, bar)}
                  disabled={addingId === bar.id}
                  className="absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#4a2e10] text-[#fcf9f8] flex items-center justify-center shadow-md hover:bg-[#38220b] active:scale-95 transition-all"
                  aria-label={`Add ${bar.title} to bag`}
                >
                  {addingId === bar.id ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus size={15} strokeWidth={2.5} />
                  )}
                </button>
              </div>

              {/* Product Info - Minimalist clean matching wireframe */}
              <div className="px-1 pb-1">
                <div className="flex items-baseline justify-between gap-1">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#4a2e10] leading-tight">
                    {bar.title}
                  </h3>
                  <span className="text-xs sm:text-sm font-semibold text-[#4a2e10]">
                    ₹{bar.price}
                  </span>
                </div>
                {bar.subTitle && (
                  <p className="text-[11px] font-sans text-[#8c7462] tracking-wide mt-0.5">
                    {bar.subTitle}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CuratedBars;
