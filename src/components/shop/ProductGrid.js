import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../store/cartSlice';
import { openCartDrawer } from '../../store/uiSlice';
import { Plus, SlidersHorizontal } from 'lucide-react';

import { productCopy } from '../product/productCopy';

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
};

function ProductGrid({ products, loading }) {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  const handleAdd = async (e, variantId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(variantId);
      await dispatch(addItemToCart({ variantId, quantity: 1 })).unwrap();
      dispatch(openCartDrawer());
    } catch (err) { console.error(err); }
    finally { setAdding(null); }
  };

  const sorted = [...products].sort((a, b) => {
    const priceA = parseFloat(a.node.priceRange?.minVariantPrice?.amount || 0);
    const priceB = parseFloat(b.node.priceRange?.minVariantPrice?.amount || 0);
    switch (sortBy) {
      case 'price-low': return priceA - priceB;
      case 'price-high': return priceB - priceA;
      default: return 0;
    }
  });

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] bg-surface-container rounded-sm mb-3" />
            <div className="h-4 bg-surface-container rounded w-3/4 mb-2" />
            <div className="h-3 bg-surface-container rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Handle Map to get local PDF copy
  const handleMap = {
    'utane': 'utane',
    'nikhar': 'nikhar',
    'nirmal': 'nirmal',
    'kanti': 'kanti'
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-outline">{products.length} products</p>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/50 rounded-sm text-xs font-semibold text-primary hover:bg-surface-high transition-colors">
            <SlidersHorizontal size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <div className="relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-transparent border border-outline-variant/50 rounded-sm px-3 py-1.5 pr-8 text-xs font-semibold text-primary cursor-pointer outline-none hover:bg-surface-high transition-colors">
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low</option>
              <option value="price-high">Price: High</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-outline text-sm">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sorted.map(({ node: p }) => {
            const image = p.images?.edges?.[0]?.node;
            const variant = p.variants?.edges?.[0]?.node;
            const price = p.priceRange?.minVariantPrice?.amount;
            
            const key = handleMap[p.handle?.toLowerCase()];
            const copy = key ? productCopy[key] : null;

            // Extract card ingredients from full ingredients (just taking the first few for the card if not explicitly provided, but we can hardcode it)
            const cardIngredients = {
              'utane': 'Ubtan Powder | Orange Peel | Kacholam | Vetiver | Wheatgerm',
              'nikhar': 'Papaya | Turmeric | Licorice | Wheatgerm',
              'nirmal': 'Kokum Butter | Turmeric | Neem | Coconut | Honey',
              'kanti': 'Niacinamide | Kokum Butter | Coconut | Neem'
            }[key];

            return (
              <Link to={`/shop/${p.handle}`} key={p.id} className="group relative block">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-container rounded-sm border border-outline-variant/30">
                  {image?.url ? (
                    <img src={image.url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline/40">No Image</div>
                  )}
                  
                  {/* Quick Add Button */}
                  <button 
                    onClick={(e) => handleAdd(e, variant?.id)}
                    disabled={adding === variant?.id || !variant?.availableForSale}
                    className="absolute bottom-3 right-3 w-9 h-9 bg-primary text-on-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
                    aria-label="Add to cart"
                  >
                    {adding === variant?.id ? (
                      <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus size={18} strokeWidth={2} />
                    )}
                  </button>
                </div>
                
                <div className="pt-4 pb-2 flex flex-col gap-1.5">
                  <h3 className="font-serif text-lg font-bold text-primary group-hover:text-primary-container transition-colors leading-tight">
                    {p.title}
                  </h3>
                  
                  {copy?.lidLine && (
                    <p className="text-[11px] font-semibold text-outline tracking-wider uppercase">
                      {copy.lidLine}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-primary">{price ? formatINR(price) : '₹0'}</span>
                    <span className="text-[11px] font-medium text-outline-variant border-l border-outline-variant pl-2">100 g</span>
                  </div>

                  {cardIngredients && (
                    <p className="text-[10px] text-outline mt-2 leading-relaxed">
                      {cardIngredients}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
