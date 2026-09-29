import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginCustomer, clearError } from '../store/customerSlice';
import { ArrowRight, Loader2 } from 'lucide-react';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, accessToken } = useSelector((state) => state.customer);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Clear any existing errors when mounting
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already logged in
  useEffect(() => {
    if (accessToken) {
      navigate('/account');
    }
  }, [accessToken, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginCustomer(formData));
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-16 px-5 sm:px-8 bg-surface">
      <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30">
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-primary font-bold mb-2">Welcome Back</h1>
          <p className="text-sm text-on-surface-variant">Sign in to access your orders and profile</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 bg-surface-container border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 bg-surface-container border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <Link to="#" className="text-xs text-on-surface-variant hover:text-primary underline underline-offset-4">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-4 flex items-center justify-center bg-primary text-on-primary font-bold text-sm tracking-[0.1em] uppercase rounded-xl hover:bg-[#4a2e10] transition-all duration-200 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Sign In <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline-variant/30 pt-6">
          <p className="text-sm text-on-surface-variant">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
