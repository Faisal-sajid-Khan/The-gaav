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

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await getProductByHandle(handle);
        const data = response.data?.product;
        if (!data) throw new Error('Product not found');
        setProduct(data);
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

      </div>
    </div>
  );
}

export default ProductPage;
