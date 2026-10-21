import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, Check } from 'lucide-react';
import { closeCartDrawer } from '../../store/uiSlice';
import { updateItemQuantity, removeItemFromCart, addItemToCart } from '../../store/cartSlice';

const BARS = [
  { id: 'utane', name: 'Utanē', marathi: 'उटणं', variantId: 'gid://shopify/ProductVariant/67603874218058' },
  { id: 'nikhar', name: 'Nikhār', marathi: 'निखार', variantId: 'gid://shopify/ProductVariant/67609374523466' },
  { id: 'nirmal', name: 'Nirmaḷ', marathi: 'निर्मळ', variantId: 'gid://shopify/ProductVariant/67609377701962' },
  { id: 'kanti', name: 'Kānti', marathi: 'कांती', variantId: 'gid://shopify/ProductVariant/67609377964106' },
];

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount));
};

function CartDrawer() {
  const dispatch = useDispatch();
  const cartDrawerOpen = useSelector((state) => state.ui.cartDrawerOpen);
  const cart = useSelector((state) => state.cart.cart);
  const loading = useSelector((state) => state.cart.loading);

  const handleUpdateQuantity = (lineId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateItemQuantity({ lineId, quantity }));
  };

  const handleRemoveItem = (lineId) => {
    dispatch(removeItemFromCart(lineId));
  };

  const cartLines = cart?.lines?.edges || [];
  const rawSubtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || 0);
  const checkoutUrl = cart?.checkoutUrl;

  // Total quantity of bars across all line items
  const totalCartQty = cartLines.reduce((sum, { node: line }) => sum + (line.quantity || 1), 0);

  // Bundle Offer Calculation:
  // - 3 bars: ₹399 (Original ₹447, Save ₹48)
  // - 4 bars: ₹499 (Original ₹596, Save ₹97)
  // - >4 bars: ₹499 + (qty - 4) * 149
  // - 2 bars: ₹298
  // - 1 bar: ₹149
  let originalSubtotal = rawSubtotal > 0 ? rawSubtotal : totalCartQty * 149;
  let finalSubtotal = originalSubtotal;
  let savings = 0;
  let offerBadge = null;
  let upsellNudge = null;

  if (totalCartQty === 3) {
    finalSubtotal = 399;
    originalSubtotal = Math.max(originalSubtotal, 447);
    savings = originalSubtotal - 399;
    offerBadge = 'Trio Offer Applied (3 for ₹399)';
  } else if (totalCartQty === 4) {
    finalSubtotal = 499;
    originalSubtotal = Math.max(originalSubtotal, 596);
    savings = originalSubtotal - 499;
    offerBadge = 'Complete Pack Offer Applied (4 for ₹499)';
  } else if (totalCartQty > 4) {
    finalSubtotal = 499 + (totalCartQty - 4) * 149;
    savings = Math.max(0, originalSubtotal - finalSubtotal);
    if (savings > 0) {
      offerBadge = `Pack Offer Applied (Save ₹${savings})`;
    }
  } else if (totalCartQty === 2) {
    finalSubtotal = 298;
    upsellNudge = 'Add 1 more bar to unlock the Trio for ₹399 (Save ₹48)!';
  } else if (totalCartQty === 1) {
    finalSubtotal = 149;
    upsellNudge = 'Add 2 more bars to get 3 for ₹399 (Save ₹48 + Free Shipping)!';
  }

  // Find missing bar for quick 1-click add when 3 bars are in cart
  const missingBar = BARS.find((b) => !cartLines.some(({ node: line }) => line.merchandise?.id === b.variantId));

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-sm transition-opacity ${
        cartDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => dispatch(closeCartDrawer())} />

      <div className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-surface shadow-2xl transition-transform duration-500 ${
        cartDrawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
            <h2 className="font-serif text-xl text-primary">Your Cart</h2>
            <button onClick={() => dispatch(closeCartDrawer())} className="p-2 text-on-surface">
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cartLines.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="font-serif text-lg text-primary mb-2">Your cart is empty</p>
                <p className="text-on-surface-variant text-sm mb-6">Add some heritage skincare</p>
                <Link to="/shop" onClick={() => dispatch(closeCartDrawer())} className="btn-primary text-sm">
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cartLines.map(({ node: line }) => {
                  const merchandise = line.merchandise;
                  const product = merchandise?.product;
                  const image = product?.featuredImage;
                  const total = line.cost?.totalAmount;

                  return (
                    <div key={line.id} className="flex gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-surface-high rounded-lg overflow-hidden">
                        {image?.url ? (
                          <img src={image.url} alt={image.altText || product?.title} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-surface-dim" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/shop/${product?.handle}`} onClick={() => dispatch(closeCartDrawer())}
                          className="font-serif text-sm text-primary hover:text-gold transition-colors line-clamp-1">
                          {product?.title}
                        </Link>
                        <p className="text-xs text-on-surface-variant mt-0.5">{merchandise?.title}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-outline-variant rounded">
                            <button onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)} disabled={loading || line.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center hover:bg-surface-high transition-colors disabled:opacity-50">
                              <Minus size={12} />
                            </button>
                            <span className="w-7 text-center text-xs font-medium">{line.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)} disabled={loading}
                              className="w-7 h-7 flex items-center justify-center hover:bg-surface-high transition-colors disabled:opacity-50">
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-primary">{formatINR(total?.amount)}</span>
                            <button onClick={() => handleRemoveItem(line.id)} disabled={loading}
                              className="p-1 text-on-surface-variant hover:text-error transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartLines.length > 0 && (
            <div className="px-6 py-5 border-t border-outline-variant bg-surface-low space-y-3">
              {/* Offer Applied Banner */}
              {offerBadge && (
                <div className="bg-[#1B4332]/10 border border-[#1B4332]/25 rounded-[2px] px-3.5 py-2 flex items-center justify-between text-xs text-[#1B4332] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Check size={14} strokeWidth={2.5} />
                    {offerBadge}
                  </span>
                  <span className="font-bold">Save ₹{savings}</span>
                </div>
              )}

              {/* Quick Upsell to 4th bar if 3 are in cart */}
              {totalCartQty === 3 && missingBar && (
                <div className="bg-[#F5EDE0] rounded-[2px] p-2.5 px-3 flex items-center justify-between text-xs text-[#3B2314] border border-[#DECDBB]">
                  <span className="text-[12px]">Add <strong>{missingBar.name}</strong> for ₹100 to make it all 4</span>
                  <button
                    type="button"
                    onClick={() => dispatch(addItemToCart({ variantId: missingBar.variantId, quantity: 1 }))}
                    disabled={loading}
                    className="bg-[#3B2314] text-[#F5EDE0] px-2.5 py-1 rounded text-[10.5px] font-bold uppercase tracking-wider hover:bg-[#2A180D] transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              )}

              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant font-medium">Subtotal</span>
                <div className="flex items-baseline gap-2">
                  {savings > 0 && (
                    <span className="line-through text-xs sm:text-sm text-on-surface-variant/70">
                      ₹{Math.round(originalSubtotal)}
                    </span>
                  )}
                  <span className="font-serif text-xl font-bold text-primary">
                    ₹{finalSubtotal}
                  </span>
                </div>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Shipping</span>
                <span className="text-[#1B4332] font-semibold">
                  {totalCartQty >= 3 ? 'Free' : 'Free above ₹499'}
                </span>
              </div>

              {/* Nudge if 1 or 2 bars */}
              {upsellNudge && (
                <p className="text-[11.5px] text-[#6B4F35] bg-[#F5EDE0] px-3 py-1.5 rounded-[2px] text-center font-serif">
                  ✨ {upsellNudge}
                </p>
              )}

              {/* Checkout Button */}
              {checkoutUrl ? (
                <a 
                  href={`${checkoutUrl}${checkoutUrl.includes('?') ? '&' : '?'}return_to=${encodeURIComponent(window.location.origin + '/shop')}`} 
                  className="btn-primary w-full block text-center py-3.5 text-xs sm:text-sm font-bold tracking-[0.14em] uppercase"
                >
                  Checkout — ₹{finalSubtotal}
                </a>
              ) : (
                <button className="btn-primary w-full opacity-50 cursor-not-allowed py-3.5 text-xs sm:text-sm font-bold tracking-[0.14em] uppercase">
                  Checkout — ₹{finalSubtotal}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CartDrawer;
