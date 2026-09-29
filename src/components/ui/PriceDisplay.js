import React from 'react';
function PriceDisplay({ price, compareAtPrice, currency = 'USD', className = '' }) {
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price);
  const discount = hasDiscount ? Math.round(((parseFloat(compareAtPrice) - parseFloat(price)) / parseFloat(compareAtPrice)) * 100) : 0;
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className="font-medium text-primary">₹{price}</span>
      {hasDiscount && (
        <>
          <span className="text-sm text-on-surface-variant line-through">₹{compareAtPrice}</span>
          <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">{discount}% OFF</span>
        </>
      )}
    </div>
  );
}
export default PriceDisplay;
