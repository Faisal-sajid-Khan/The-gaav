import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateItemQuantity, removeItemFromCart } from '../store/cartSlice';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const loading = useSelector((state) => state.cart.loading);

  const handleUpdate = (lineId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateItemQuantity({ lineId, quantity }));
  };

  const handleRemove = (lineId) => {
    dispatch(removeItemFromCart(lineId));
  };

  const cartLines = cart?.lines?.edges || [];
  const subtotal = cart?.cost?.subtotalAmount?.amount || '0.00';
  const total = cart?.cost?.totalAmount?.amount || '0.00';
  const tax = cart?.cost?.totalTaxAmount?.amount || '0.00';
  const currency = cart?.cost?.subtotalAmount?.currencyCode || 'USD';
  const checkoutUrl = cart?.checkoutUrl;

  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-surface">
      <div className="px-5 sm:px-10 lg:px-20 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl text-primary mb-2">Your Cart</h1>
          <p className="text-on-surface-variant">{cartLines.length} {cartLines.length === 1 ? 'item' : 'items'}</p>
        </div>

        {cartLines.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <ShoppingBag size={64} className="text-outline-variant mx-auto mb-4" />
            <p className="font-serif text-xl text-primary mb-2">Your cart is empty</p>
            <p className="text-on-surface-variant mb-6">Start your skincare ritual</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">Shop Now <ArrowRight size={18} /></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-4">
              {cartLines.map(({ node: line }) => {
                const merchandise = line.merchandise;
                const product = merchandise?.product;
                const image = product?.featuredImage;
                const total = line.cost?.totalAmount;
                const price = merchandise?.price;

                return (
                  <div key={line.id} className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-surface-low rounded-xl">
                    <Link to={`/shop/${product?.handle}`} className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-surface-high rounded-lg overflow-hidden">
                      {image?.url ? (
                        <img src={image.url} alt={product?.title} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-surface-dim" />
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/shop/${product?.handle}`} className="font-serif text-sm text-primary hover:text-gold transition-colors line-clamp-1">{product?.title}</Link>
                          <p className="text-xs text-on-surface-variant mt-0.5">{merchandise?.title}</p>
                        </div>
                        <button onClick={() => handleRemove(line.id)} disabled={loading} className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-end justify-between mt-3 sm:mt-4">
                        <div className="flex items-center border border-outline-variant rounded-lg">
                          <button onClick={() => handleUpdate(line.id, line.quantity - 1)} disabled={loading || line.quantity <= 1} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-surface-high transition-colors disabled:opacity-50">
                            <Minus size={14} />
                          </button>
                          <span className="w-8 sm:w-10 text-center text-sm font-medium">{line.quantity}</span>
                          <button onClick={() => handleUpdate(line.id, line.quantity + 1)} disabled={loading} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-surface-high transition-colors disabled:opacity-50">
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary">{total?.amount} {total?.currencyCode}</p>
                          <p className="text-xs text-on-surface-variant">{price?.amount} {price?.currencyCode} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-surface-low rounded-xl p-6 sm:p-8 sticky top-24">
                <h2 className="font-serif text-xl text-primary mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Subtotal</span><span className="text-primary">{subtotal} {currency}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Tax</span><span className="text-primary">{tax} {currency}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Shipping</span><span className="text-gold">Free over ₹4000</span></div>
                </div>
                <div className="border-t border-outline-variant pt-4 mb-6">
                  <div className="flex justify-between"><span className="font-medium text-primary">Total</span><span className="font-serif text-xl text-primary">{total} {currency}</span></div>
                </div>
                {checkoutUrl ? (
                  <a 
                    href={`${checkoutUrl}${checkoutUrl.includes('?') ? '&' : '?'}return_to=${encodeURIComponent(window.location.origin + '/shop')}`} 
                    className="btn-primary w-full block text-center"
                  >
                    Proceed to Checkout
                  </a>
                ) : (
                  <button className="btn-primary w-full opacity-50 cursor-not-allowed">Proceed to Checkout</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
