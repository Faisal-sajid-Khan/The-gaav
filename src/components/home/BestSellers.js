import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAllProducts } from '../../lib/shopify';
import { addItemToCart } from '../../store/cartSlice';
import { openCartDrawer } from '../../store/uiSlice';
import LoadingSpinner from '../ui/LoadingSpinner';
import { ArrowRight } from 'lucide-react';

const FALLBACK_BESTSELLERS = [
  {
    id: 'saffron-glow-elixir',
    title: 'Saffron Glow Elixir',
    handle: 'saffron-glow-elixir',
    type: 'HERBAL FACE OIL',
    price: '1,850',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=800&fit=crop',
  },
  {
    id: 'neem-tulsi-bar',
    title: 'Neem & Tulsi Bar',
    handle: 'neem-tulsi-bar',
    type: 'COLD-PRESSED SOAP',
    price: '450',
    image: 'https://images.unsplash.com/photo-1607006482172-3ba7b6e921d2?w=600&h=800&fit=crop',
  },
];

function BestSellers() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await getAllProducts(6);
        const edges = response.data?.products?.edges || [];
        setProducts(edges);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleAdd = async (e, variantId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variantId) return;
    try {
      setAdding(variantId);
      await dispatch(addItemToCart({ variantId, quantity: 1 })).unwrap();
      dispatch(openCartDrawer());
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(null);
    }
  };

  if (loading) return <section className="px-6 py-12"><LoadingSpinner /></section>;

  const hasShopifyProducts = products.length > 0;

  return (
    <section className="py-12 sm:py-16 bg-[#fcf9f8]">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-6 sm:mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#4a2e10] font-bold mb-1">
            Best Sellers
          </h2>
          <p className="text-xs sm:text-sm text-[#7a6452]">
            Our most loved heritage blends.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {hasShopifyProducts ? (
            products.map(({ node: p }) => {
              const image = p.images?.edges?.[0]?.node?.url;
              const variant = p.variants?.edges?.[0]?.node;
              const price = parseFloat(p.priceRange?.minVariantPrice?.amount || 0);
              const compare = parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount || 0);
              const discount = compare > price ? Math.round(((compare - price) / compare) * 100) : 0;
              const type = p.productType || 'HERITAGE BLEND';

              return (
                <Link 
                  to={`/shop/${p.handle}`} 
                  key={p.id} 
                  className="group block bg-[#f7f4ef] rounded-2xl overflow-hidden border border-[#e8dfd5] p-3 sm:p-4 hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#eee7df] mb-3">
                    {image ? (
                      <img src={image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-[#e3d8cd]" />
                    )}
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#4a2e10] group-hover:text-[#8c6239] transition-colors line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-[10px] font-bold tracking-[0.15em] text-[#8c7462] uppercase mt-0.5">
                        {type}
                      </p>
                      <div className="flex items-center flex-wrap gap-1.5 mt-1">
                        <p className="text-xs sm:text-sm font-bold text-[#4a2e10]">
                          ₹{Number(price).toLocaleString('en-IN')}
                        </p>
                        {discount > 0 && (
                          <>
                            <p className="text-[10px] text-[#8c7462] line-through">
                              ₹{Number(compare).toLocaleString('en-IN')}
                            </p>
                            <p className="text-[9px] font-bold bg-[#4a2e10]/10 text-[#4a2e10] px-1 py-0.5 rounded">
                              {discount}% OFF
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleAdd(e, variant?.id)}
                      disabled={adding === variant?.id}
                      className="w-8 h-8 rounded-full bg-[#4a2e10] text-[#fcf9f8] flex items-center justify-center shrink-0 hover:bg-[#38220b] transition-all shadow-sm"
                      aria-label="Add to Cart"
                    >
                      {adding === variant?.id ? (
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ArrowRight size={14} />
                      )}
                    </button>
                  </div>
                </Link>
              );
            })
          ) : (
            FALLBACK_BESTSELLERS.map((p) => (
              <Link 
                to={`/shop/${p.handle}`} 
                key={p.id} 
                className="group block bg-[#f7f4ef] rounded-2xl overflow-hidden border border-[#e8dfd5] p-3 sm:p-4 hover:shadow-md transition-all"
              >
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#eee7df] mb-3">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#4a2e10] group-hover:text-[#8c6239] transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#8c7462] uppercase mt-0.5">
                      {p.type}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-[#4a2e10] mt-1">
                      ₹{p.price}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#4a2e10] text-[#fcf9f8] flex items-center justify-center shrink-0 hover:bg-[#38220b] transition-all shadow-sm">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
