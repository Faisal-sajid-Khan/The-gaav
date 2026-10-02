import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerDetails, logout, updateCustomerDetails } from '../store/customerSlice';
import { Package, User, LogOut, ChevronRight, Loader2, Edit2, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(parseFloat(amount));
};

function AccountPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken, customerData, loading } = useSelector((state) => state.customer);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'profile'
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [updateError, setUpdateError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Return/Cancel Portal State
  const [portalOrder, setPortalOrder] = useState(null);
  const [portalSuccess, setPortalSuccess] = useState(false);
  const [portalResolution, setPortalResolution] = useState('refund'); // 'refund' or 'replace'

  useEffect(() => {
    if (customerData) {
      setEditForm({
        firstName: customerData.firstName || '',
        lastName: customerData.lastName || '',
        phone: customerData.phone || '',
      });
    }
  }, [customerData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setIsUpdating(true);
    try {
      const resultAction = await dispatch(updateCustomerDetails({
        token: accessToken,
        customer: {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          phone: editForm.phone,
        }
      }));
      if (updateCustomerDetails.fulfilled.match(resultAction)) {
        setIsEditing(false);
      } else {
        setUpdateError(resultAction.payload || 'Failed to update profile');
      }
    } catch (err) {
      setUpdateError('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    } else if (!customerData) {
      dispatch(fetchCustomerDetails(accessToken));
    }
  }, [accessToken, customerData, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (loading && !customerData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!customerData) return null;

  // Temporarily hiding test orders from the frontend as requested
  const orders = []; // customerData.orders?.edges?.map(e => e.node) || [];

  return (
    <div className="bg-surface min-h-screen pt-20 sm:pt-28 pb-16">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="mb-10 sm:mb-16">
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-bold mb-3">
            My Account
          </h1>
          <p className="text-sm text-on-surface-variant">
            Welcome back, <span className="font-semibold text-primary">{customerData.firstName || 'Guest'}</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Nav */}
          <div className="w-full lg:w-64 shrink-0">
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === 'orders' 
                    ? 'bg-primary text-on-primary shadow-md shadow-primary/20' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
              >
                <Package size={18} strokeWidth={2} />
                Order History
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === 'profile' 
                    ? 'bg-primary text-on-primary shadow-md shadow-primary/20' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
              >
                <User size={18} strokeWidth={2} />
                Profile Details
              </button>
              
              <div className="hidden lg:block h-px bg-outline-variant/50 my-2" />
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold tracking-wide text-error/80 hover:bg-error/10 hover:text-error transition-all whitespace-nowrap"
              >
                <LogOut size={18} strokeWidth={2} />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-serif text-primary font-bold mb-6">Order History</h2>
                  
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-outline-variant/30 p-10 text-center shadow-sm">
                      <Package size={40} className="mx-auto text-outline mb-4" strokeWidth={1} />
                      <h3 className="text-lg font-bold text-primary mb-2">No orders yet</h3>
                      <p className="text-sm text-on-surface-variant mb-6">When you place an order, it will appear here.</p>
                      <button onClick={() => navigate('/shop')} className="px-6 py-2.5 bg-primary text-on-primary text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-primary/90 transition-colors">
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => {
                        const date = new Date(order.processedAt).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        });
                        const items = order.lineItems?.edges?.map(e => e.node) || [];
                        const statusColor = order.fulfillmentStatus === 'FULFILLED' ? 'text-success bg-success/10' : 'text-primary bg-primary/10';

                        return (
                          <div key={order.id} className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                            <div className="bg-surface-container px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/30">
                              <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-outline mb-1">Order Placed</p>
                                <p className="text-sm font-semibold text-primary">{date}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-outline mb-1">Total</p>
                                <p className="text-sm font-semibold text-primary">{formatINR(order.currentTotalPrice.amount)}</p>
                              </div>
                              <div className="flex-1 text-right">
                                <p className="text-[10px] font-bold tracking-widest uppercase text-outline mb-1">Order #</p>
                                <p className="text-sm font-semibold text-primary">{order.orderNumber}</p>
                              </div>
                            </div>
                            
                            <div className="p-6">
                              <div className="flex items-center gap-3 mb-6">
                                <span className="relative flex h-3 w-3">
                                  {order.fulfillmentStatus !== 'FULFILLED' && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                                  )}
                                  <span className={`relative inline-flex rounded-full h-3 w-3 ${order.fulfillmentStatus === 'FULFILLED' ? 'bg-success' : 'bg-gold'}`}></span>
                                </span>
                                <span className={`text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-full ${statusColor}`}>
                                  {order.fulfillmentStatus || 'PROCESSING'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {items.map((item, idx) => (
                                  <div key={idx} className="flex gap-4 items-center">
                                    <div className="w-16 h-20 bg-surface-high rounded-lg overflow-hidden shrink-0 border border-outline-variant/20">
                                      {item.variant?.image?.url ? (
                                        <img src={item.variant.image.url} alt={item.title} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full bg-surface-high" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-primary line-clamp-2">{item.title}</p>
                                      <p className="text-xs text-on-surface-variant mt-1">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-8 pt-6 border-t border-outline-variant/30 flex justify-between items-center">
                                <button 
                                  onClick={() => setPortalOrder(order)}
                                  className="text-xs font-bold tracking-widest uppercase text-outline hover:text-error transition-colors"
                                >
                                  {order.fulfillmentStatus === 'FULFILLED' ? 'Return Items' : 'Cancel Order'}
                                </button>
                                <button className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-primary hover:text-gold transition-colors">
                                  Track Order <ChevronRight size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif text-primary font-bold">Profile Details</h2>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-sm font-bold tracking-wide text-primary hover:text-gold transition-colors"
                      >
                        <Edit2 size={16} /> Edit Profile
                      </button>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-sm">
                    {isEditing ? (
                      <form onSubmit={handleUpdateProfile}>
                        {updateError && (
                          <div className="mb-6 p-4 bg-error/10 text-error rounded-xl text-sm">
                            {updateError}
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-outline mb-2">First Name</label>
                            <input 
                              type="text" 
                              value={editForm.firstName}
                              onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-outline mb-2">Last Name</label>
                            <input 
                              type="text" 
                              value={editForm.lastName}
                              onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-outline mb-2">Phone Number</label>
                            <input 
                              type="text" 
                              value={editForm.phone}
                              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                              placeholder="+91..."
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-outline mb-2">Email (Cannot be changed)</label>
                            <input 
                              type="email" 
                              value={customerData.email}
                              disabled
                              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container text-on-surface-variant outline-none"
                            />
                          </div>
                        </div>
                        <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-outline-variant/30">
                          <button 
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setUpdateError(null);
                              setEditForm({
                                firstName: customerData.firstName || '',
                                lastName: customerData.lastName || '',
                                phone: customerData.phone || '',
                              });
                            }}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide text-on-surface-variant hover:bg-surface-container transition-colors"
                          >
                            <X size={16} /> Cancel
                          </button>
                          <button 
                            type="submit"
                            disabled={isUpdating}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-70"
                          >
                            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
                            Save Changes
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-outline mb-1">Name</p>
                            <p className="text-base font-semibold text-primary">{customerData.firstName} {customerData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-outline mb-1">Email</p>
                            <p className="text-base font-semibold text-primary">{customerData.email}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-outline mb-1">Phone Number</p>
                            <p className="text-base font-semibold text-primary">{customerData.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        {customerData.defaultAddress && (
                          <div className="mt-8 pt-8 border-t border-outline-variant/30">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-outline mb-3">Default Address</p>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                              {customerData.defaultAddress.address1}<br />
                              {customerData.defaultAddress.address2 && <>{customerData.defaultAddress.address2}<br /></>}
                              {customerData.defaultAddress.city}, {customerData.defaultAddress.province} {customerData.defaultAddress.zip}<br />
                              {customerData.defaultAddress.country}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      </div>

      {/* RETURN / CANCEL PORTAL MODAL */}
      {portalOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm" onClick={() => !portalSuccess && setPortalOrder(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-surface w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
          >
            {portalSuccess ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-serif text-primary font-bold mb-3">Request Received</h3>
                <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                  Your request for Order #{portalOrder.orderNumber} has been securely submitted to our support team. You will receive an email confirmation and next steps within 24 hours.
                </p>
                <button 
                  onClick={() => { setPortalSuccess(false); setPortalOrder(null); }}
                  className="w-full py-3.5 bg-primary text-on-primary font-bold tracking-widest uppercase text-xs rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="px-6 py-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container">
                  <h3 className="font-serif text-lg text-primary font-bold">
                    {portalOrder.fulfillmentStatus === 'FULFILLED' ? 'Return or Replace Items' : 'Cancel Order'}
                  </h3>
                  <button onClick={() => { setPortalOrder(null); setPortalResolution('refund'); }} className="text-outline hover:text-primary transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6">
                  {portalOrder.fulfillmentStatus === 'FULFILLED' && (
                    <div className="mb-6">
                      <p className="text-sm font-bold text-primary mb-3">What would you like to do?</p>
                      <div className="grid grid-cols-2 gap-3">
                        <label 
                          className={`border rounded-xl p-4 cursor-pointer transition-all ${
                            portalResolution === 'replace' ? 'border-primary bg-primary/5 shadow-sm' : 'border-outline-variant/50 hover:border-outline-variant'
                          }`}
                        >
                          <input 
                            type="radio" name="resolution" className="hidden" 
                            checked={portalResolution === 'replace'} 
                            onChange={() => setPortalResolution('replace')} 
                          />
                          <p className="text-sm font-bold text-primary mb-1">Replace Item</p>
                          <p className="text-xs text-on-surface-variant">Get a replacement or exchange for another product.</p>
                        </label>
                        <label 
                          className={`border rounded-xl p-4 cursor-pointer transition-all ${
                            portalResolution === 'refund' ? 'border-primary bg-primary/5 shadow-sm' : 'border-outline-variant/50 hover:border-outline-variant'
                          }`}
                        >
                          <input 
                            type="radio" name="resolution" className="hidden" 
                            checked={portalResolution === 'refund'} 
                            onChange={() => setPortalResolution('refund')} 
                          />
                          <p className="text-sm font-bold text-primary mb-1">Return & Refund</p>
                          <p className="text-xs text-on-surface-variant">Return the item and get your money back.</p>
                        </label>
                      </div>
                    </div>
                  )}

                  <p className="text-sm font-bold text-primary mb-3">
                    Reason for {portalResolution === 'replace' ? 'replacement' : (portalOrder.fulfillmentStatus === 'FULFILLED' ? 'return' : 'cancellation')}:
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {['Changed my mind', 'Ordered by mistake', 'Received damaged product', 'Item not as expected', 'Other'].map(reason => (
                      <label key={reason} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5 border-2 border-outline-variant rounded-full group-hover:border-primary transition-colors">
                          <input type="radio" name="reason" className="peer opacity-0 absolute" defaultChecked={reason === 'Changed my mind'} />
                          <div className="w-2.5 h-2.5 bg-primary rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-sm text-primary font-medium">{reason}</span>
                      </label>
                    ))}
                  </div>

                  <div className="bg-surface-low p-4 rounded-xl mb-8 border border-outline-variant/30">
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {portalResolution === 'replace' ? (
                        <strong>Note:</strong> 
                      ) : (
                        <strong>Note:</strong> 
                      )}
                      {portalResolution === 'replace' 
                        ? ' Once approved, a pickup will be arranged and your replacement will be dispatched within 48 hours.'
                        : ' Refunds will be processed to your original payment method within 3-7 business days once the request is approved.'}
                    </p>
                  </div>

                  <button 
                    onClick={() => { setPortalSuccess(true); setTimeout(() => setPortalResolution('refund'), 500); }}
                    className="w-full py-3.5 bg-primary text-on-primary font-bold tracking-widest uppercase text-xs rounded-xl hover:bg-primary/90 transition-colors shadow-md"
                  >
                    Submit Request
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AccountPage;
