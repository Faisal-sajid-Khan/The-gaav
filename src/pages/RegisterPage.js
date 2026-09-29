import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerCustomer, loginCustomer, clearError } from '../store/customerSlice';
import { ArrowRight, Loader2 } from 'lucide-react';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, accessToken } = useSelector((state) => state.customer);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // If logged in, go to account
  useEffect(() => {
    if (accessToken) {
      navigate('/account');
    }
  }, [accessToken, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Dispatch register
    const resultAction = await dispatch(registerCustomer(formData));
    
    // If successful, log them in immediately (Nike style seamless experience)
    if (registerCustomer.fulfilled.match(resultAction)) {
      dispatch(loginCustomer({ email: formData.email, password: formData.password }));
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-16 px-5 sm:px-8 bg-surface">
      <div className="w-full max-w-lg bg-white p-8 sm:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30">
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-primary font-bold mb-2">Create Account</h1>
          <p className="text-sm text-on-surface-variant">Join to track orders and save your details</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 bg-surface-container border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="First"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-[0.1em] uppercase text-outline mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 bg-surface-container border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Last"
              />
            </div>
          </div>

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
              minLength="5"
              className="w-full px-4 py-3.5 bg-surface-container border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-6 flex items-center justify-center bg-primary text-on-primary font-bold text-sm tracking-[0.1em] uppercase rounded-xl hover:bg-[#4a2e10] transition-all duration-200 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Join Now <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline-variant/30 pt-6">
          <p className="text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
