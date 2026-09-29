import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCollection } from '../lib/shopify';
import ProductGrid from '../components/shop/ProductGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { ArrowLeft } from 'lucide-react';

function CollectionPage() {
  const { handle } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await getProductsByCollection(handle, 50);
        const data = response.data?.collection;
        if (!data) throw new Error('Collection not found');
        setCollection(data);
        setProducts(data.products?.edges || []);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [handle]);

  if (loading) return <div className="pt-24 min-h-screen flex items-center justify-center"><LoadingSpinner size="xl" /></div>;
  if (error) return <div className="pt-24 min-h-screen"><ErrorMessage message={error} onRetry={() => window.location.reload()} /></div>;

  return (
    <div className="pt-20 sm:pt-24">
      <div className="relative h-[40vh] sm:h-[50vh] min-h-[300px] overflow-hidden bg-inverse-surface">
        {collection?.image?.url ? (
          <img src={collection.image.url} alt={collection.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface-high" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-10 lg:px-20 py-8 sm:py-12">
          <Link to="/shop" className="inline-flex items-center gap-2 text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors mb-4 text-sm">
            <ArrowLeft size={16} /> All Products
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-inverse-on-surface mb-2">{collection?.title}</h1>
          {collection?.description && <p className="text-inverse-on-surface/70 max-w-xl text-sm">{collection.description}</p>}
        </div>
      </div>
      <div className="px-5 sm:px-10 lg:px-20 py-8 sm:py-12 bg-surface min-h-[50vh]">
        <ProductGrid products={products} loading={false} />
      </div>
    </div>
  );
}

export default CollectionPage;
