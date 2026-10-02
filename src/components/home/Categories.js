import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCollections } from '../../lib/shopify';
import LoadingSpinner from '../ui/LoadingSpinner';

function Categories() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await getAllCollections(20);
        const edges = response.data?.collections?.edges || [];
        
        // Extract node for each collection dynamically from Shopify backend
        const colList = edges.map(({ node }) => node);
        setCollections(colList);
      } catch (err) {
        console.error('Failed to fetch collections from backend:', err);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <section className="px-6 py-12 bg-surface"><LoadingSpinner /></section>;

  // If no collections exist in backend, do not display hardcoded fallback cards
  if (!collections || collections.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-surface border-y border-outline-variant/30">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold mb-3">
            Categories
          </h2>
          <p className="text-sm text-surface-dim">No categories added in backend yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-surface border-y border-outline-variant/30">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold">
            Categories
          </h2>
          <Link 
            to="/shop" 
            className="text-[11px] font-bold tracking-[0.15em] uppercase text-outline hover:text-primary transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Categories Grid / Scroll - Only Backend Collections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {collections.map((c) => {
            // Priority: collection banner image -> first product image
            const img = c.image?.url || c.products?.edges?.[0]?.node?.images?.edges?.[0]?.node?.url;

            return (
              <Link 
                key={c.id} 
                to={`/collection/${c.handle}`}
                className="group flex flex-col"
              >
                <div className="w-full aspect-square rounded-sm overflow-hidden bg-surface-container relative border border-outline-variant/30">
                  {img ? (
                    <img 
                      src={img} 
                      alt={c.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      loading="lazy" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline/50 font-sans text-sm">
                      {c.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-primary group-hover:text-primary-container transition-colors text-center line-clamp-1">
                  {c.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;
