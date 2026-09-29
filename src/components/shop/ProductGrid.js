import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../store/cartSlice';
import { openCartDrawer } from '../../store/uiSlice';
import { Plus, SlidersHorizontal } from 'lucide-react';

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-surface-high rounded-xl mb-3" />
            <div className="h-4 bg-surface-high rounded w-3/4 mb-2" />
            <div className="h-3 bg-surface-high rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-on-surface-variant">{products.length} products</p>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg text-sm text-on-surface">
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-surface border border-outline-variant rounded-lg px-3 py-2 pr-8 text-sm text-on-surface cursor-pointer outline-none">
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low</option>
            <option value="price-high">Price: High</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-on-surface-variant text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {sorted.map(({ node: p }) => {
            const image = p.images?.edges?.[0]?.node;
            const variant = p.variants?.edges?.[0]?.node;
            const price = p.priceRange?.minVariantPrice?.amount;
            const compare = p.compareAtPriceRange?.minVariantPrice?.amount;

            return (
              <Link to={`/shop/${p.handle}`} key={p.id} className="product-card group relative block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl">
                  {image?.url ? (
                    <img src={image.url} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-surface-high" />
                  )}
                  <button 
                    onClick={(e) => handleAdd(e, variant?.id)}
                    disabled={adding === variant?.id || !variant?.availableForSale}
                    className="absolute bottom-3 right-3 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    {adding === variant?.id ? (
                      <span className="w-3 h-3 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                  </button>
                  {p.tags?.includes('Ayurvedic') && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-gold/90 text-on-primary text-[10px] font-semibold rounded">AYURVEDIC</span>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-gold text-xs">★</span>
                    <span className="text-xs text-on-surface-variant">{p.tags?.find(t => t.includes('.')) || '4.9'}</span>
                    <span className="text-xs text-on-surface-variant">({p.tags?.find(t => t.includes('reviews')) || '124'})</span>
                  </div>
                  <h3 className="font-serif text-sm text-primary group-hover:text-gold transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-primary">{price ? formatINR(price) : '₹0.00'}</span>
                    {compare && parseFloat(compare) > parseFloat(price) && (
                      <span className="text-xs text-on-surface-variant line-through">{formatINR(compare)}</span>
                    )}
                  </div>
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
