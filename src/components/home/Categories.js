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

  if (loading) return <section className="px-6 py-12"><LoadingSpinner /></section>;

  // If no collections exist in backend, do not display hardcoded fallback cards
  if (!collections || collections.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-[#fcf9f8]">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#4a2e10] font-bold mb-3">
            Categories
          </h2>
          <p className="text-sm text-[#7a6452]">No categories added in backend yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-[#fcf9f8]">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#4a2e10] font-bold">
            Categories
          </h2>
          <Link 
            to="/shop" 
            className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#7a6452] hover:text-[#4a2e10] transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Categories Grid / Scroll - Only Backend Collections */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {collections.map((c) => {
            // Priority: collection banner image -> first product image
            const img = c.image?.url || c.products?.edges?.[0]?.node?.images?.edges?.[0]?.node?.url;

            return (
              <Link 
                key={c.id} 
                to={`/collection/${c.handle}`}
                className="group shrink-0 w-[160px] sm:w-[220px] lg:w-[280px] snap-start flex flex-col items-center"
              >
                <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#eee7df] relative shadow-sm group-hover:shadow-md transition-shadow">
                  {img ? (
                    <img 
                      src={img} 
                      alt={c.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      loading="lazy" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#eae5dd] text-[#7a6452] font-serif text-sm px-4 text-center">
                      {c.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <h3 className="mt-3 font-sans text-xs sm:text-sm font-bold tracking-[0.15em] text-[#4a2e10] uppercase group-hover:text-[#8c6239] transition-colors text-center line-clamp-1">
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
