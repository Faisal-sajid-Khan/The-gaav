import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../store/cartSlice';
import { openCartDrawer } from '../../store/uiSlice';
import trioImg from '../../assets/trio-wrapped.jpg';
import { ShoppingBag, Check } from 'lucide-react';

// The 3 bar variants to bundle
const TRIO_VARIANTS = [
  { variantId: 'gid://shopify/ProductVariant/67603874218058', quantity: 1 }, // Utanē
  { variantId: 'gid://shopify/ProductVariant/67609374523466', quantity: 1 }, // Nikhār
  { variantId: 'gid://shopify/ProductVariant/67609377701962', quantity: 1 }, // Nirmaḷ
];

function TrioBundle() {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddBundle = async (e) => {
    e.preventDefault();
    if (adding) return;
    try {
      setAdding(true);
      // Add each of the 3 soap bars to the cart
      for (const item of TRIO_VARIANTS) {
        await dispatch(addItemToCart(item)).unwrap();
      }
      setAdded(true);
      dispatch(openCartDrawer());
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error('Failed to add bundle:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-[#fcf9f8] border-t border-[#e8dfd5]/60">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Trio Card matching the wireframe */}
          <div className="bg-[#f7f4ef] rounded-3xl p-4 sm:p-5 border border-[#e8dfd5] shadow-sm flex flex-col items-center text-center">
            
            {/* Visual Box with 'Trio, wrapped' */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#eee7df] mb-5 group">
              <img
                src={trioImg}
                alt="Trio, wrapped"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end justify-center pb-3">
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#fcf9f8] uppercase bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  Trio, wrapped
                </span>
              </div>
            </div>

            {/* Headline */}
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4a2e10] mb-1.5">
              Three bars. Three stories.
            </h3>

            {/* Price Line */}
            <p className="font-sans text-xs sm:text-sm text-[#7a6452] font-semibold tracking-wide mb-5">
              ₹399 • ₹133 a bar
            </p>

            {/* Add to bag button */}
            <button
              type="button"
              onClick={handleAddBundle}
              disabled={adding}
              className="w-full py-3.5 px-6 rounded-full bg-[#4a2e10] text-[#fcf9f8] font-bold text-xs sm:text-sm tracking-[0.14em] uppercase hover:bg-[#38220b] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
            >
              {adding ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding Trio...</span>
                </>
              ) : added ? (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  <span>Added to bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} strokeWidth={2} />
                  <span>Add to bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrioBundle;
