import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateItemQuantity, removeItemFromCart, addItemToCart } from '../store/cartSlice';
import { Check } from 'lucide-react';
import trioWrapped from '../assets/trio-wrapped.jpg';

const BARS = [
  {
    id: 'utane',
    marathi: 'उटणं',
    name: 'Utanē',
    color: '#B5651D',
    variantId: 'gid://shopify/ProductVariant/67603874218058',
  },
  {
    id: 'nikhar',
    marathi: 'निखार',
    name: 'Nikhār',
    color: '#A63A1E',
    variantId: 'gid://shopify/ProductVariant/67609374523466',
  },
  {
    id: 'nirmal',
    marathi: 'निर्मळ',
    name: 'Nirmaḷ',
    color: '#1B4332',
    variantId: 'gid://shopify/ProductVariant/67609377701962',
  },
  {
    id: 'kanti',
    marathi: 'कांती',
    name: 'Kānti',
    color: '#8DA0AE',
    variantId: 'gid://shopify/ProductVariant/67609377964106',
  },
];

function CartPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const cart = useSelector((state) => state.cart.cart);
  const loading = useSelector((state) => state.cart.loading);

  const [selectedBars, setSelectedBars] = useState(['utane', 'nikhar', 'nirmal']);
  const [addingTrio, setAddingTrio] = useState(false);
  const [trioAdded, setTrioAdded] = useState(false);
  const [addingUpsell, setAddingUpsell] = useState(false);
  const [upsellAdded, setUpsellAdded] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);

  const isDirectBuilderRequest =
    location.hash === '#build-your-three' ||
    window.location.hash === '#build-your-three' ||
    location.pathname.includes('build-your-three');

  useEffect(() => {
    document.title = 'Cart — The Gaav';
    if (isDirectBuilderRequest || location.pathname.includes('trio')) {
      setTimeout(() => {
        const el = document.getElementById('build-your-three');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [location, isDirectBuilderRequest]);

  const cartLines = cart?.lines?.edges || [];
  const totalCartQty = cartLines.reduce((sum, { node: line }) => sum + (line.quantity || 1), 0);

  // Dynamic pricing:
  // - 3 bars: ₹399
  // - 4 bars: ₹499
  // - >4 bars: ₹499 + extra * 149
  // - 2 bars: ₹298
  // - 1 bar: ₹149
  const computedSubtotal = (() => {
    if (cartLines.length > 0) {
      if (totalCartQty === 3) return 399;
      if (totalCartQty === 4) return 499;
      if (totalCartQty > 4) return 499 + (totalCartQty - 4) * 149;
      if (totalCartQty === 2) return 298;
      if (totalCartQty === 1) return 149;
      const raw = Math.round(parseFloat(cart?.cost?.subtotalAmount?.amount || 0));
      return raw > 0 ? raw : totalCartQty * 149;
    }
    // Cart is empty -> mirror the selected pack in the picker
    if (selectedBars.length === 3) return 399;
    if (selectedBars.length === 4) return 499;
    return selectedBars.length * 149;
  })();

  const originalSubtotal = cartLines.length > 0
    ? Math.max(Math.round(parseFloat(cart?.cost?.subtotalAmount?.amount || 0)), totalCartQty * 149)
    : selectedBars.length * 149;
  const savings = Math.max(0, originalSubtotal - computedSubtotal);

  const subtotalDisplay = `₹${computedSubtotal}`;
  const totalDisplay = `₹${computedSubtotal}`;
  const checkoutUrl = cart?.checkoutUrl;

  const unselectedBar = BARS.find((b) => !selectedBars.includes(b.id));

  const toggleBar = (id) => {
    if (selectedBars.includes(id)) {
      if (selectedBars.length > 1) {
        setSelectedBars(selectedBars.filter((b) => b !== id));
      }
    } else {
      setSelectedBars([...selectedBars, id]);
    }
  };

  const isThree = selectedBars.length === 3;
  const isFour = selectedBars.length === 4;
  const bundleTitle = isFour
    ? 'All four bars'
    : isThree
    ? 'Build your three'
    : `Custom pack (${selectedBars.length} chosen)`;
  const bundlePrice = isFour ? '₹499' : isThree ? '₹399' : `₹${selectedBars.length * 149}`;
  const bundleSubtitle = isFour
    ? 'All four handcrafted bars · 4 × 100g · free shipping · Save ₹97'
    : isThree
    ? 'Any three bars · 3 × 100g · free shipping'
    : `${selectedBars.length} bars selected · pick 3 for ₹399 or 4 for ₹499`;
  const bundleButtonText = isFour
    ? 'Add All Four — ₹499'
    : isThree
    ? 'Add Trio — ₹399'
    : `Add ${selectedBars.length} Bars — ${bundlePrice}`;

  const handleUpdate = (lineId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateItemQuantity({ lineId, quantity }));
  };

  const handleRemove = (lineId) => {
    dispatch(removeItemFromCart(lineId));
  };

  const handleAddTrio = async () => {
    if (addingTrio) return;
    try {
      setAddingTrio(true);
      const chosen = BARS.filter((b) => selectedBars.includes(b.id));
      for (const bar of chosen) {
        await dispatch(addItemToCart({ variantId: bar.variantId, quantity: 1 })).unwrap();
      }
      setTrioAdded(true);
      setTimeout(() => setTrioAdded(false), 2500);
    } catch (err) {
      console.error('Failed to add bundle:', err);
    } finally {
      setAddingTrio(false);
    }
  };

  const handleAddUpsell = async () => {
    if (addingUpsell) return;
    try {
      setAddingUpsell(true);
      const targetBar = unselectedBar || BARS.find((b) => b.id === 'kanti');
      if (targetBar && !selectedBars.includes(targetBar.id)) {
        setSelectedBars((prev) => [...prev, targetBar.id]);
      }
      if (cartLines.length > 0 && targetBar) {
        await dispatch(addItemToCart({ variantId: targetBar.variantId, quantity: 1 })).unwrap();
      }
      setUpsellAdded(true);
      setTimeout(() => setUpsellAdded(false), 2500);
    } catch (err) {
      console.error('Failed to add upsell:', err);
    } finally {
      setAddingUpsell(false);
    }
  };

  const handleCheckout = async (e) => {
    if (cartLines.length > 0 && checkoutUrl) {
      return;
    }
    if (e) e.preventDefault();
    if (checkingOut || addingTrio) return;

    try {
      setCheckingOut(true);
      const chosen = BARS.filter((b) => selectedBars.includes(b.id));
      let lastCart = null;
      for (const bar of chosen) {
        const res = await dispatch(addItemToCart({ variantId: bar.variantId, quantity: 1 })).unwrap();
        lastCart = res;
      }
      const targetUrl = lastCart?.checkoutUrl || checkoutUrl;
      if (targetUrl) {
        const returnUrl = encodeURIComponent(window.location.origin + '/shop');
        const sep = targetUrl.includes('?') ? '&' : '?';
        window.location.href = `${targetUrl}${sep}return_to=${returnUrl}`;
      }
    } catch (err) {
      console.error('Failed to checkout bundle:', err);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="w-full bg-[#F5EDE0] text-[#3B2314] font-serif min-h-screen">
      {/* Main Cart Container */}
      <section className="max-w-[1240px] mx-auto px-6 sm:px-10 py-12 sm:py-16">
        <div className="flex items-baseline justify-between mb-10 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-[44px] font-semibold tracking-[-0.018em] text-[#3B2314]">
            Your cart
          </h1>
          <Link
            to="/shop"
            className="text-sm sm:text-[15.5px] text-[#4E3626] hover:text-[#3B2314] transition-colors"
          >
            ← Continue shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Left Column: Items */}
          <div className="flex-1 min-w-0 w-full">
            {cartLines.length > 0 && !isDirectBuilderRequest && !showBuilder ? (
              /* Case A: Cart has items -> show real cart lines (NO duplicate picker) */
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl sm:text-[22px] font-semibold text-[#3B2314]">
                    Items in your cart ({totalCartQty})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowBuilder(true)}
                    className="text-xs sm:text-[13px] font-bold text-[#6B4F35] hover:text-[#3B2314] uppercase tracking-wider underline cursor-pointer"
                  >
                    + Build another 3-pack (₹399)
                  </button>
                </div>

                <div className="space-y-4">
                  {cartLines.map(({ node: line }) => {
                    const product = line.merchandise?.product;
                    const image = line.merchandise?.image || product?.featuredImage;
                    const itemPrice = Math.round(parseFloat(line.cost?.totalAmount?.amount || 149));

                    return (
                      <article
                        key={line.id}
                        className="bg-[#FBF6EE] border border-[#E3D6C4] rounded-[2px] p-6 sm:p-7 flex flex-wrap sm:flex-nowrap gap-5 sm:gap-7 items-center"
                      >
                        <div className="w-[104px] h-[104px] bg-[#E8DDD0] rounded-[2px] overflow-hidden shrink-0 border border-[#DECDBB]">
                          {image?.url ? (
                            <img
                              src={image.url}
                              alt={product?.title || 'Bar'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-end p-3 font-sans text-2xl font-bold text-[#D3C0A6]">
                              गाव
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-[240px]">
                          <div className="flex justify-between items-baseline gap-4">
                            <h2 className="font-serif text-lg sm:text-[22px] font-semibold text-[#3B2314]">
                              {product?.title || 'The Gaav Bar'}
                            </h2>
                            <span className="font-serif text-base sm:text-[19px] font-semibold text-[#3B2314]">
                              ₹{itemPrice}
                            </span>
                          </div>
                          <p className="font-serif text-sm text-[#6B4F35] mt-1 mb-4">
                            {line.merchandise?.title !== 'Default Title' ? line.merchandise?.title : '100g Bar · Cold-processed'}
                          </p>

                          <div className="flex items-center gap-5">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-[#D9C8B2] rounded-[2px] bg-[#F5EDE0]">
                              <button
                                type="button"
                                onClick={() => handleUpdate(line.id, line.quantity - 1)}
                                disabled={loading || line.quantity <= 1}
                                aria-label="Decrease quantity"
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-serif text-lg text-[#3B2314] hover:bg-[#E8DDD0] transition-colors disabled:opacity-40"
                              >
                                −
                              </button>
                              <span className="w-8 sm:w-9 text-center font-serif text-[15.5px] text-[#3B2314]">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdate(line.id, line.quantity + 1)}
                                disabled={loading}
                                aria-label="Increase quantity"
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-serif text-lg text-[#3B2314] hover:bg-[#E8DDD0] transition-colors disabled:opacity-40"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemove(line.id)}
                              disabled={loading}
                              className="font-serif text-sm text-[#6B4F35] hover:text-[#3B2314] underline cursor-pointer p-0"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Case B: Cart is empty OR user explicitly wants to build a bundle */
              <div>
                {cartLines.length > 0 && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#6B4F35]">
                      Bundle Builder
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowBuilder(false)}
                      className="text-xs font-bold text-[#6B4F35] hover:text-[#3B2314] uppercase tracking-wider underline cursor-pointer"
                    >
                      ← Back to Cart Items ({totalCartQty})
                    </button>
                  </div>
                )}
                <article
                  id="build-your-three"
                  className="bg-[#FBF6EE] border border-[#E3D6C4] rounded-[2px] p-6 sm:p-8 mb-6 shadow-sm scroll-mt-24"
                >
                  <div className="flex flex-wrap sm:flex-nowrap gap-5 sm:gap-7 items-start">
                    <div className="w-[104px] h-[104px] bg-[#E8DDD0] rounded-[2px] overflow-hidden shrink-0 border border-[#DECDBB]">
                      <img
                        src={trioWrapped}
                        alt={bundleTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-[240px]">
                      <div className="flex justify-between items-baseline gap-4">
                        <h2 className="font-serif text-xl sm:text-[22px] font-semibold text-[#3B2314]">
                          {bundleTitle}
                        </h2>
                        <span className="font-serif text-lg sm:text-[19px] font-semibold text-[#3B2314]">
                          {bundlePrice}
                        </span>
                      </div>
                      <p className="font-serif text-sm sm:text-[14.5px] text-[#6B4F35] mt-2">
                        {bundleSubtitle}
                      </p>
                    </div>
                  </div>

                  {/* Bar Picker Checkboxes */}
                  <fieldset className="border-none m-0 mt-6 pt-5 border-t border-[#EADFCE]">
                    <legend className="text-[11.5px] tracking-[0.2em] uppercase font-bold text-[#6B4F35] p-0 mb-4">
                      Pick your three or four bars
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {BARS.map((bar) => {
                        const isChecked = selectedBars.includes(bar.id);
                        return (
                          <label
                            key={bar.id}
                            onClick={() => toggleBar(bar.id)}
                            className={`flex items-center gap-3 border rounded-[2px] px-4 py-3 cursor-pointer transition-all select-none ${
                              isChecked
                                ? 'bg-[#F5EDE0] border-[#3B2314]/80 shadow-xs'
                                : 'bg-[#FBF6EE] border-[#D9C8B2] hover:bg-[#F5EDE0]/60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-[17px] h-[17px] accent-[#3B2314] cursor-pointer"
                            />
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: bar.color }}
                            />
                            <span className="font-sans font-bold text-lg text-[#3B2314]">
                              {bar.marathi}
                            </span>
                            <span className="font-serif text-[13px] text-[#6B4F35]">
                              {bar.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                      <p className="font-serif text-[13.5px] text-[#6B4F35]">
                        {selectedBars.length === 3
                          ? '3 of 3 chosen · Pack of 3'
                          : selectedBars.length === 4
                          ? 'All 4 chosen · Complete Pack (Save ₹97)'
                          : `${selectedBars.length} chosen · pick 3 for ₹399 or 4 for ₹499`}
                      </p>
                      <button
                        type="button"
                        onClick={handleAddTrio}
                        disabled={addingTrio || selectedBars.length < 3}
                        className="inline-flex items-center gap-2 bg-[#3B2314] text-[#F5EDE0] px-5 py-2.5 text-xs font-bold tracking-[0.12em] uppercase rounded-[2px] hover:bg-[#2A180D] disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {addingTrio ? (
                          <span>Adding...</span>
                        ) : trioAdded ? (
                          <>
                            <Check size={14} /> Added to Cart
                          </>
                        ) : (
                          <span>{bundleButtonText}</span>
                        )}
                      </button>
                    </div>
                  </fieldset>
                </article>
              </div>
            )}

            {/* 3. Upsell Banner Card */}
            <div className="mt-6 bg-[#E8DDD0] rounded-[2px] p-6 sm:px-7 sm:py-6 flex flex-wrap items-center justify-between gap-4 border border-[#DECDBB]">
              {((cartLines.length > 0 ? totalCartQty === 3 : selectedBars.length === 3)) && unselectedBar ? (
                <>
                  <p className="font-serif text-base sm:text-[16.5px] text-[#3B2314] leading-[1.55]">
                    Add <strong>{unselectedBar.marathi} {unselectedBar.name}</strong> for ₹100 and make it all four.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddUpsell}
                    disabled={addingUpsell}
                    className="bg-[#3B2314] text-[#F5EDE0] px-6 py-3 font-sans text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase rounded-[2px] hover:bg-[#2A180D] transition-colors shrink-0 cursor-pointer"
                  >
                    {addingUpsell ? 'Adding...' : upsellAdded ? 'Added!' : 'Add it'}
                  </button>
                </>
              ) : (cartLines.length > 0 ? totalCartQty >= 4 : selectedBars.length === 4) ? (
                <div className="flex items-center gap-3 text-[#1B4332] py-1">
                  <Check size={20} strokeWidth={2.5} className="shrink-0" />
                  <p className="font-serif text-base sm:text-[16.5px] text-[#3B2314] leading-[1.55]">
                    All four handcrafted bars selected · Complete Pack for <strong>₹499</strong> (Save ₹97).
                  </p>
                </div>
              ) : (
                <p className="font-serif text-base text-[#3B2314]">
                  Pick any 3 bars for <strong>₹399</strong> or all 4 for <strong>₹499</strong> with free shipping.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary Card (as specified) */}
          <aside className="w-full lg:w-[380px] xl:w-[420px] bg-[#FBF6EE] border border-[#E3D6C4] rounded-[2px] p-7 sm:p-8 shrink-0 sticky top-24 shadow-sm">
            <h2 className="font-serif text-xl sm:text-[22px] font-semibold text-[#3B2314] mb-6">
              Order summary
            </h2>

            <div className="flex flex-col gap-3.5 text-base text-[#4E3626]">
              {savings > 0 && (
                <div className="bg-[#1B4332]/10 border border-[#1B4332]/25 rounded-[2px] px-3.5 py-2 flex items-center justify-between text-xs text-[#1B4332] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Check size={14} strokeWidth={2.5} />
                    {totalCartQty === 3 || (cartLines.length === 0 && selectedBars.length === 3)
                      ? 'Trio Offer Applied (3 for ₹399)'
                      : 'Complete Pack Applied (4 for ₹499)'}
                  </span>
                  <span className="font-bold">Save ₹{savings}</span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span>Subtotal</span>
                <div className="flex items-baseline gap-2">
                  {savings > 0 && (
                    <span className="line-through text-xs sm:text-sm text-[#6B4F35]/70">
                      ₹{originalSubtotal}
                    </span>
                  )}
                  <span>{subtotalDisplay}</span>
                </div>
              </div>
              <div className="flex justify-between gap-4">
                <span>Shipping</span>
                <span className="text-[#1B4332] font-semibold">Free</span>
              </div>
            </div>

            <div className="my-5 pt-5 border-t border-[#E3D6C4] flex justify-between items-baseline gap-4">
              <span className="font-serif text-lg font-semibold text-[#3B2314]">Total</span>
              <span className="font-serif text-2xl font-bold text-[#3B2314]">
                {totalDisplay}
              </span>
            </div>
            <p className="font-serif text-[13px] text-[#6B4F35] mb-6">
              Inclusive of all taxes
            </p>

            {/* Note on payment */}
            <div className="bg-[#F5EDE0] rounded-[2px] p-4 mb-6 border border-[#DECDBB] text-xs sm:text-[13px] text-[#4E3626] leading-relaxed flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#1B4332] shrink-0 mt-1.5" />
              <span>Payment methods (UPI, Cards, Netbanking &amp; Cash on Delivery) are selected securely on Shopify checkout.</span>
            </div>

            {/* Checkout Action Button */}
            {cartLines.length > 0 && checkoutUrl ? (
              <a
                href={`${checkoutUrl}${checkoutUrl.includes('?') ? '&' : '?'}return_to=${encodeURIComponent(window.location.origin + '/shop')}`}
                className="w-full h-14 bg-[#3B2314] text-[#F5EDE0] font-sans text-sm sm:text-base font-bold tracking-[0.14em] uppercase rounded-[2px] hover:bg-[#2A180D] active:scale-[0.99] transition-all flex items-center justify-center shadow-md block text-center"
              >
                Checkout
              </a>
            ) : (
              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkingOut || addingTrio || selectedBars.length < 3}
                className="w-full h-14 bg-[#3B2314] text-[#F5EDE0] font-sans text-sm sm:text-base font-bold tracking-[0.14em] uppercase rounded-[2px] hover:bg-[#2A180D] active:scale-[0.99] transition-all flex items-center justify-center shadow-md cursor-pointer disabled:opacity-50"
              >
                {checkingOut ? 'Proceeding to Checkout...' : 'Checkout'}
              </button>
            )}

            {/* Reassurance Badges */}
            <div className="mt-6 pt-5 border-t border-[#E3D6C4] flex flex-col gap-3 font-serif text-[13.5px] text-[#4E3626]">
              <div className="flex items-center gap-2.5">
                <Check size={16} strokeWidth={2.5} className="text-[#8B6B4A] shrink-0" />
                <span>Dispatched within 2 working days</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check size={16} strokeWidth={2.5} className="text-[#8B6B4A] shrink-0" />
                <a
                  href="https://wa.me/919834222363?text=Hi%20The%20Gaav%2C%20I%20have%20a%20question%20about%20my%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#3B2314] hover:underline"
                >
                  Questions? Message us on WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
