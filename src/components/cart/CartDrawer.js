import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { closeCartDrawer } from '../../store/uiSlice';
import { updateItemQuantity, removeItemFromCart } from '../../store/cartSlice';

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
  const subtotal = cart?.cost?.subtotalAmount?.amount || '0.00';
  const total = cart?.cost?.totalAmount?.amount || '0.00';
  const currency = cart?.cost?.subtotalAmount?.currencyCode || 'INR';
  const checkoutUrl = cart?.checkoutUrl;

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
            <div className="px-6 py-5 border-t border-outline-variant bg-surface-low">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-on-surface-variant">Subtotal</span>
                <span className="font-serif text-lg text-primary">{formatINR(subtotal)}</span>
              </div>
              <p className="text-xs text-on-surface-variant mb-4">Shipping calculated at checkout</p>
              {checkoutUrl ? (
                <a 
                  href={`${checkoutUrl}${checkoutUrl.includes('?') ? '&' : '?'}return_to=${encodeURIComponent(window.location.origin + '/shop')}`} 
                  className="btn-primary w-full block text-center"
                >
                  Checkout
                </a>
              ) : (
                <button className="btn-primary w-full opacity-50 cursor-not-allowed">Checkout</button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CartDrawer;
