import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../store/cartSlice';
import { openCartDrawer } from '../../store/uiSlice';
import { Check } from 'lucide-react';

const FOUR_VARIANTS = [
  { variantId: 'gid://shopify/ProductVariant/67603874218058', quantity: 1 }, // Utanē
  { variantId: 'gid://shopify/ProductVariant/67609374523466', quantity: 1 }, // Nikhār
  { variantId: 'gid://shopify/ProductVariant/67609377701962', quantity: 1 }, // Nirmaḷ
  { variantId: 'gid://shopify/ProductVariant/67609377964106', quantity: 1 }, // Kānti
];

function DiscoverySet() {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddAllFour = async () => {
    if (adding) return;
    try {
      setAdding(true);
      for (const item of FOUR_VARIANTS) {
        await dispatch(addItemToCart(item)).unwrap();
      }
      setAdded(true);
      dispatch(openCartDrawer());
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error('Error adding all four:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <section id="discovery-set" className="bg-[#3B2314] text-[#F5EDE0]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] tracking-[0.22em] uppercase font-semibold text-[#BFA98D] mb-5">
            Start here
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold leading-[1.14] tracking-[-0.018em] text-[#F5EDE0] mb-6">
            Try all four.<br />Then pick your one.
          </h2>
          <p className="font-serif text-base sm:text-lg leading-[1.62] text-[#DBCBB4] max-w-[470px] mb-9">
            Fragrance is personal, and nobody picks right from a screen. Start with all four bars, find the one that&apos;s yours, then reorder just that — or <Link to="/cart#build-your-three" className="underline underline-offset-4 decoration-[#BFA98D] hover:text-white transition-colors">build your own three</Link>.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={handleAddAllFour}
              disabled={adding}
              className="inline-flex items-center gap-3 bg-[#F5EDE0] text-[#3B2314] px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-semibold tracking-[0.13em] uppercase rounded-sm hover:bg-[#E8DDD0] active:scale-[0.98] transition-all"
            >
              {adding ? (
                <span>Adding all four...</span>
              ) : added ? (
                <>
                  <Check size={18} strokeWidth={2.5} />
                  <span>Added all four!</span>
                </>
              ) : (
                <span>Add all four — ₹499</span>
              )}
            </button>
            <span className="text-sm sm:text-[14.5px] text-[#BFA98D]">
              Free shipping · Save ₹97
            </span>
          </div>
        </div>

        {/* Right Column: Build Your Own Price Box */}
        <div className="w-full lg:w-auto lg:min-w-[420px] max-w-md">
          <div className="border border-[#5C4332] rounded-sm p-8 sm:p-9 bg-[#351e10]/40">
            <div className="text-[12px] tracking-[0.2em] uppercase font-semibold text-[#BFA98D] mb-6">
              Or build your own
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-base sm:text-[17px] text-[#F5EDE0]">Single bar</span>
                <span className="text-base sm:text-[17px] text-[#DBCBB4] font-semibold">₹149</span>
              </div>
              <div className="h-[1px] bg-[#5C4332]" />
              <Link
                to="/cart#build-your-three"
                className="flex justify-between items-baseline gap-4 group hover:opacity-90 transition-opacity cursor-pointer py-0.5"
              >
                <span className="text-base sm:text-[17px] text-[#F5EDE0] group-hover:underline underline-offset-4">Any three bars (Build your own)</span>
                <span className="text-base sm:text-[17px] text-[#DBCBB4] font-semibold group-hover:translate-x-0.5 transition-transform">₹399 →</span>
              </Link>
              <div className="h-[1px] bg-[#5C4332]" />
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-base sm:text-[17px] text-[#F5EDE0]">All four bars</span>
                <span className="text-base sm:text-[17px] text-[#DBCBB4] font-semibold">₹499</span>
              </div>
            </div>
            <Link
              to="/cart#build-your-three"
              className="mt-6 w-full py-3 px-4 bg-[#F5EDE0] text-[#3B2314] text-xs font-bold tracking-[0.14em] uppercase rounded-[2px] block text-center hover:bg-white active:scale-[0.99] transition-all shadow-sm"
            >
              Build your three — ₹399
            </Link>
            <p className="mt-5 text-xs sm:text-sm leading-[1.6] text-[#BFA98D]">
              Free shipping above ₹499. Below that, ₹50 flat. Cash on delivery available across India.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DiscoverySet;
