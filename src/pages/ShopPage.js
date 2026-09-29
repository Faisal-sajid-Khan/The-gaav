import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllProducts, getAllCollections, getProductsByCollection } from '../lib/shopify';
import ProductGrid from '../components/shop/ProductGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, collectionsRes] = await Promise.all([
          getAllProducts(50),
          getAllCollections(20)
        ]);
        setProducts(productsRes.data?.products?.edges || []);
        setCollections(collectionsRes.data?.collections?.edges || []);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const concern = params.get('concern');
    if (concern) {
      const matchingCollection = collections.find(c => c.node.title.toLowerCase() === concern.toLowerCase());
      if (matchingCollection) {
        setSelectedCollection(matchingCollection.node);
      }
    }
  }, [location.search, collections]);

  const handleSelectCollection = async (collection) => {
    setSelectedCollection(collection);
    if (collection) {
      try {
        setLoading(true);
        const res = await getProductsByCollection(collection.handle, 50);
        setProducts(res.data?.collection?.products?.edges || []);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    } else {
      try {
        setLoading(true);
        const res = await getAllProducts(50);
        setProducts(res.data?.products?.edges || []);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    }
  };

  return (
    <div className="pt-20 sm:pt-24">
      <div className="px-5 sm:px-10 lg:px-20 py-8 sm:py-12">
        <span className="label-sm text-on-surface-variant mb-2 block">Collection</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-primary mb-2">Daily Rituals</h1>
        <p className="text-sm text-on-surface-variant mb-8">Authentic skincare for your daily routine</p>

        {/* Collection pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            key="all"
            onClick={() => handleSelectCollection(null)}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full border transition-colors ${
              !selectedCollection ? 'bg-primary text-on-primary border-primary' : 'bg-transparent text-on-surface border-outline-variant hover:border-primary'
            }`}
          >
            All Products
          </button>
          {collections.map(({ node: col }) => (
            <button
              key={col.id}
              onClick={() => handleSelectCollection(col)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full border transition-colors ${
                selectedCollection?.id === col.id ? 'bg-primary text-on-primary border-primary' : 'bg-transparent text-on-surface border-outline-variant hover:border-primary'
              }`}
            >
              {col.title}
            </button>
          ))}
        </div>

        {error ? (
          <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        ) : (
          <ProductGrid products={products} loading={loading} />
        )}
      </div>
    </div>
  );
}

export default ShopPage;
