import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

function CheckoutSuccessPage() {
  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center px-4 py-16 max-w-md mx-auto">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-success" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-primary mb-3">Order Confirmed!</h1>
        <p className="text-on-surface-variant mb-2">Thank you for your purchase. Your skincare ritual begins now.</p>
        <p className="text-sm text-on-surface-variant mb-8">A confirmation email has been sent to your inbox.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/shop" className="btn-primary inline-flex items-center justify-center gap-2">
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
          <Link to="/" className="btn-secondary inline-flex items-center justify-center gap-2">
            Back to Home <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccessPage;
