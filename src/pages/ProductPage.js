import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductByHandle } from '../lib/shopify';
import ProductGallery from '../components/product/ProductGallery';
import ProductDetails from '../components/product/ProductDetails';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { ArrowLeft, Star } from 'lucide-react';

function ProductPage() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await getProductByHandle(handle);
        const data = response.data?.product;
        if (!data) throw new Error('Product not found');
        setProduct(data);
        
        // Update recently viewed
        const recent = JSON.parse(localStorage.getItem('recent_products') || '[]');
        const updatedRecent = [data, ...recent.filter(p => p.id !== data.id)].slice(0, 5);
        localStorage.setItem('recent_products', JSON.stringify(updatedRecent));
        setRecentlyViewed(updatedRecent);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [handle]);

  if (loading) return <div className="pt-24 min-h-screen flex items-center justify-center"><LoadingSpinner size="xl" /></div>;
  if (error) return <div className="pt-24 min-h-screen"><ErrorMessage message={error} onRetry={() => window.location.reload()} /></div>;
  if (!product) return <div className="pt-24 min-h-screen flex items-center justify-center"><p className="text-on-surface-variant">Product not found</p></div>;

  return (
    <div className="pt-20 sm:pt-24 bg-surface min-h-screen">
      <div className="px-5 sm:px-10 lg:px-20 py-6 sm:py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} />
          </div>
          <div>
            <ProductDetails product={product} />
          </div>
        </div>

        {/* Community Love Section */}
        <div className="mt-16 sm:mt-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl text-primary mb-1">Community Love</h2>
              <p className="text-sm text-on-surface-variant">Real stories from our patrons</p>
            </div>
            <Link to="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { text: 'The texture is so luxurious. My skin has not looked this radiant in years. A truly heritage product.', author: 'Aarya V.', verified: true },
              { text: 'Obsessed with the sandalwood scent. Feels like a spa at home.', author: 'Priya M.', verified: true },
            ].map((review, i) => (
              <div key={i} className="bg-surface-low rounded-xl p-5">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} className="text-gold fill-gold" />)}
                </div>
                <p className="text-sm text-primary leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-medium">{review.author[0]}</div>
                  <div>
                    <p className="text-xs font-medium text-primary">{review.author}</p>
                    {review.verified && <p className="text-[10px] text-on-surface-variant">Verified Buyer</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Inquiries */}
        <div className="mt-16 sm:mt-24 max-w-2xl">
          <h2 className="font-serif text-2xl text-primary mb-8">Common Inquiries</h2>
          <div className="space-y-6">
            {[
              { q: 'Is it suitable for oily skin?', a: 'Yes. Kumkumadi is a non-comedogenic oil that actually helps balance sebum production while providing nutrition.' },
              { q: 'When can I see results?', a: 'Most users report a visible glow within 7-10 days of consistent nightly application.' },
            ].map((faq, i) => (
              <div key={i}>
                <h3 className="label-sm text-primary mb-2">{faq.q}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 1 && (
          <div className="mt-16 sm:mt-24">
            <h2 className="font-serif text-2xl text-primary mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {recentlyViewed.filter(p => p.id !== product.id).slice(0, 4).map(p => {
                const image = p.images?.edges?.[0]?.node;
                const price = p.priceRange?.minVariantPrice?.amount;
                const compare = p.compareAtPriceRange?.minVariantPrice?.amount;
                
                return (
                  <Link to={`/shop/${p.handle}`} key={p.id} className="product-card group relative block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-surface-high">
                      {image?.url && (
                        <img src={image.url} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                      )}
                    </div>
                    <div className="p-3 px-0 sm:px-3">
                      <h3 className="font-serif text-sm text-primary group-hover:text-gold transition-colors line-clamp-1">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-primary">₹{price}</span>
                        {compare && parseFloat(compare) > parseFloat(price) && (
                          <span className="text-xs text-on-surface-variant line-through">₹{compare}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
