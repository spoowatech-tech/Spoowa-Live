import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, PackageCheck, Heart, Trash2, Check, ArrowRight, ShieldCheck, Lock, Star } from 'lucide-react';
import { AnnouncementBar, Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getAddresses, addAddress, deleteAddress, couponsAPI, ordersAPI, placeOrder as placeOrderAPI } from '@/services/api';
import toast from 'react-hot-toast';
import { formatPriceINR } from '@/lib/pricing';
import productHoney from '@/assets/product_honey.png';

const PAYMENT_OPTIONS = [
  { id: 'razorpay', label: 'Razorpay (UPI / Card / Net Banking / Wallets)' },
  { id: 'cod', label: 'Cash on Delivery (COD)' },
];

const emptyAddress = {
  fullName: '',
  mobile: '',
  pincode: '',
  city: '',
  state: '',
  fullAddress: '',
  landmark: '',
};

const getDeliveryEstimate = () => {
  const estimateDate = new Date();
  estimateDate.setDate(estimateDate.getDate() + 5);
  const dayName = estimateDate.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = estimateDate.toLocaleDateString('en-US', { month: 'short' });
  const dayOfMonth = String(estimateDate.getDate()).padStart(2, '0');
  return `Delivery by ${dayName}, ${monthName} ${dayOfMonth}`;
};

const RAZORPAY_CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
let razorpaySdkPromise = null;

const loadRazorpaySdk = () => {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpaySdkPromise) return razorpaySdkPromise;

  razorpaySdkPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = RAZORPAY_CHECKOUT_URL;
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => {
      razorpaySdkPromise = null;
      script.remove();
      resolve(false);
    };
    document.body.appendChild(script);
  }).then((isLoaded) => {
    if (!isLoaded) razorpaySdkPromise = null;
    return isLoaded;
  });

  return razorpaySdkPromise;
};

// ============================================================================
// Main Component
// ============================================================================

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, summary, coupon, applyCoupon, removeCoupon, fetchCart } = useCart();
  
  // Local states replacing complex external contexts
  const [step, setStep] = useState('address');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressError, setAddressError] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoadingPaymentSdk, setIsLoadingPaymentSdk] = useState(false);
  
  const [couponInput, setCouponInput] = useState(() => coupon?.code || '');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    if (!user) return;
    getAddresses().then(res => {
      setSavedAddresses(res.addresses || []);
      if (res.addresses?.length > 0) setSelectedAddress(res.addresses[0]);
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (step === 'payment' && paymentMethod === 'razorpay') {
      loadRazorpaySdk();
    }
  }, [step, paymentMethod]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Derived price breakdown matching SPOOWA pricing model
  const subtotal = summary.subtotal;
  const shipping = summary.shipping;
  const totalMrp = summary.totalMrp;
  const discountOnProducts = summary.discount;
  const rawCouponDiscount = coupon?.discountAmount || 0;
  const finalTotal = summary.finalTotal;

  // Handlers
  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
  };

  const validateAddress = () => {
    if (!addressForm.fullName.trim()) return 'Full name is required.';
    if (!/^\d{10}$/.test(addressForm.mobile.trim())) return 'Mobile number must be 10 digits.';
    if (!/^\d{6}$/.test(addressForm.pincode.trim())) return 'Pincode must be 6 digits.';
    if (!addressForm.city.trim()) return 'City is required.';
    if (!addressForm.state.trim()) return 'State is required.';
    if (addressForm.fullAddress.trim().length < 10) return 'Full address should be at least 10 characters.';
    return '';
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const error = validateAddress();
    if (error) return setAddressError(error);

    setAddressError('');
    try {
      // If editing, delete the old address first (since we don't have a PUT endpoint)
      if (editingAddressId) {
        await deleteAddress(editingAddressId);
      }

      // Map form structure to API expectations
      const apiPayload = {
        label: 'Home',
        fullName: addressForm.fullName,
        phone: addressForm.mobile,
        addressLine: addressForm.fullAddress + (addressForm.landmark ? `, Landmark: ${addressForm.landmark}` : ''),
        city: addressForm.city,
        state: addressForm.state,
        pinCode: addressForm.pincode,
        isDefault: true
      };

      const res = await addAddress(apiPayload);
      toast.success(editingAddressId ? 'Address updated successfully' : 'Address saved successfully');
      
      // The API returns { address: {...} }
      setSavedAddresses(prev => [...prev, res.address]);
      setSelectedAddress(res.address);
      setEditingAddressId(null);
      setAddressForm(emptyAddress);
    } catch (err) {
      toast.error('Failed to save address');
    }
  };

  const handleEditAddress = (address, e) => {
    e.stopPropagation();
    setEditingAddressId(address.id);
    setAddressForm({
      fullName: address.fullName || address.full_name || '',
      mobile: address.phone || address.mobile || '',
      pincode: address.pinCode || address.pin_code || '',
      city: address.city || '',
      state: address.state || '',
      fullAddress: (address.addressLine || address.address_line || '')?.split(', Landmark:')[0] || '',
      landmark: (address.addressLine || address.address_line || '')?.split(', Landmark: ')[1] || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      setSavedAddresses(prev => prev.filter(a => a.id !== id));
      if (selectedAddress?.id === id) setSelectedAddress(null);
      toast.success('Address deleted');
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setAddressError('Please select a delivery address first.');
      setStep('address');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsProcessingPayment(true);
    setAddressError('');

    try {
      let order;

      if (paymentMethod === 'razorpay') {
        setIsLoadingPaymentSdk(true);
        const sdkLoaded = await loadRazorpaySdk();
        setIsLoadingPaymentSdk(false);

        if (!sdkLoaded || !window.Razorpay) {
          throw new Error('Payment failed to load. Try COD or check adblock.');
        }

        // 1. Create Razorpay order
        const createOrderData = await ordersAPI.createRazorpayOrder(finalTotal);
        const razorpayOrder = createOrderData.order;
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key'; // Mock fallback for safety

        // 2. Open Razorpay Modal
        const paymentResult = await new Promise((resolve, reject) => {
          const razorpayInstance = new window.Razorpay({
            key: razorpayKey,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            order_id: razorpayOrder.id,
            name: 'SPOOWA',
            description: 'Order Payment',
            theme: { color: '#F4B000' }, // SPOOWA Gold
            handler: async (response) => {
              try {
                // Verify signature on backend
                await ordersAPI.verifyRazorpayPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                resolve({
                  razorpayOrderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                });
              } catch (err) {
                reject(err);
              }
            },
            modal: {
              ondismiss: () => reject(new Error('Payment cancelled by user.')),
            },
            prefill: {
              name: selectedAddress.fullName,
              contact: selectedAddress.mobile,
              email: user.email || '',
            },
          });

          razorpayInstance.on('payment.failed', (resp) => {
            reject(new Error(resp?.error?.description || 'Razorpay payment failed.'));
          });
          razorpayInstance.open();
        });

        // 3. Place Order in Backend Database
        const res = await placeOrderAPI({
          addressId: selectedAddress.id,
          couponCode: coupon?.code,
          discountAmount: coupon?.discountAmount,
          paymentMethodOverride: 'razorpay',
          paymentStatus: 'paid',
          paymentId: paymentResult.paymentId,
          razorpayOrderId: paymentResult.razorpayOrderId
        });
        order = res.order;

      } else {
        // COD Flow
        const res = await placeOrderAPI({
          addressId: selectedAddress.id,
          couponCode: coupon?.code,
          discountAmount: coupon?.discountAmount,
          paymentMethodOverride: 'cod',
          paymentStatus: 'pending'
        });
        order = res.order;
      }

      await fetchCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/'); // Redirect to home or orders page
      
    } catch (err) {
      toast.error(err.message || 'Failed to complete checkout.');
    } finally {
      setIsProcessingPayment(false);
      setIsLoadingPaymentSdk(false);
    }
  };

  const primaryAction = (() => {
    if (step === 'address') return { label: 'Continue to Order Summary', disabled: !selectedAddress, onClick: () => setStep('items') };
    if (step === 'items') return { label: 'Proceed to Payment', disabled: items.length === 0, onClick: () => setStep('payment') };
    if (step === 'payment') return { 
      label: isLoadingPaymentSdk ? 'Loading Payment...' : isProcessingPayment ? 'Processing...' : (paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'), 
      disabled: items.length === 0 || isProcessingPayment || isLoadingPaymentSdk, 
      onClick: handlePlaceOrder 
    };
    return { label: 'Continue', disabled: true, onClick: () => {} };
  })();

  const activeSectionClasses = 'rounded-2xl border border-[#F4B000]/15 bg-white p-6 shadow-sm sm:p-8';
  const checkoutItemPreview = items.slice(0, 2).map((item) => item.name).join(', ');

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-[#2B1D12] font-display sm:text-4xl">Secure Checkout</h1>
            <p className="mt-1 text-sm text-gray-500 font-medium">Complete your order swiftly and securely</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Left Column: Steps */}
          <section className="space-y-4 lg:col-span-2">
            
            {/* Step Collapsed Headers */}
            {step !== 'address' && (
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex justify-between items-center cursor-pointer hover:border-[#F4B000]/50 transition" onClick={() => setStep('address')}>
                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-[#FFF8E8] text-[#F4B000] flex justify-center items-center">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Address</p>
                    {selectedAddress ? (
                      <>
                        <p className="mt-0.5 text-sm font-semibold text-[#2B1D12]">{selectedAddress.fullName || selectedAddress.full_name}</p>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {selectedAddress.addressLine || selectedAddress.address_line}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pinCode || selectedAddress.pin_code}
                        </p>
                      </>
                    ) : (
                      <p className="mt-0.5 text-sm font-semibold text-[#2B1D12]">Delivery address needed</p>
                    )}
                  </div>
                </div>
                <button className="text-xs font-bold text-[#F4B000]">Change</button>
              </div>
            )}

            {step === 'payment' && (
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex justify-between items-center cursor-pointer hover:border-[#F4B000]/50 transition" onClick={() => setStep('items')}>
                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-[#FFF8E8] text-[#F4B000] flex justify-center items-center">
                    <PackageCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Summary</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#2B1D12]">{items.length} item(s) - ₹{finalTotal?.toFixed(2)}</p>
                    {checkoutItemPreview && (
                      <p className="mt-0.5 text-sm text-gray-500">
                        {checkoutItemPreview}
                        {items.length > 2 ? ` +${items.length - 2} more` : ''}
                      </p>
                    )}
                  </div>
                </div>
                <button className="text-xs font-bold text-[#F4B000]">Change</button>
              </div>
            )}

            {/* Active Step Content */}
            <div className={activeSectionClasses}>
              
              {/* STEP 1: ADDRESS */}
              {step === 'address' && (
                <>
                  <h2 className="flex items-center gap-2 text-2xl font-black text-[#2B1D12] border-b border-gray-100 pb-4 mb-6">
                    <MapPin className="text-[#F4B000]" /> Delivery Address
                  </h2>
                  
                  <form onSubmit={handleSaveAddress} className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="sm:col-span-2 flex justify-between items-center">
                      <p className="text-sm font-bold text-[#2B1D12]">{editingAddressId ? 'Edit Address' : 'Add a New Address'}</p>
                      {editingAddressId && (
                        <button type="button" onClick={() => { setEditingAddressId(null); setAddressForm(emptyAddress); }} className="text-xs font-bold text-gray-500 hover:text-[#2B1D12]">Cancel Edit</button>
                      )}
                    </div>
                    <input className="input-field" placeholder="Full Name" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} />
                    <input className="input-field" placeholder="Mobile Number" value={addressForm.mobile} onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value.replace(/\D/g, '') })} />
                    <input className="input-field" placeholder="Pincode" value={addressForm.pincode} onChange={async (e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setAddressForm((prev) => ({ ...prev, pincode: value }));
                      if (value.length === 6) {
                        try {
                          const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
                          const data = await response.json();
                          if (data && data[0] && data[0].Status === 'Success') {
                            const postOffice = data[0].PostOffice[0];
                            setAddressForm(prev => ({
                              ...prev,
                              city: postOffice.District || postOffice.Block || prev.city,
                              state: postOffice.State || prev.state
                            }));
                          }
                        } catch (err) {}
                      }
                    }} />
                    <input className="input-field" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} />
                    <input className="input-field" placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} />
                    <input className="input-field" placeholder="Landmark (Optional)" value={addressForm.landmark} onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })} />
                    <textarea className="input-field sm:col-span-2 min-h-[80px]" placeholder="Full Address" value={addressForm.fullAddress} onChange={(e) => setAddressForm({ ...addressForm, fullAddress: e.target.value })} />
                    <button type="submit" className="sm:col-span-2 rounded-xl bg-gray-900 py-3 text-sm font-extrabold text-white hover:bg-gray-800 transition">
                      {editingAddressId ? 'Update Address' : 'Save Address'}
                    </button>
                    {addressError && <p className="sm:col-span-2 text-sm text-red-500 font-bold">{addressError}</p>}
                  </form>

                  {/* Saved Addresses (Now below the form) */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3 mt-8 pt-8 border-t border-gray-100">
                      <p className="text-sm font-bold text-[#2B1D12]">Saved Addresses</p>
                      {savedAddresses.map((address) => {
                        const isSelected = selectedAddress?.id === address.id;
                        return (
                          <div key={address.id} className={`rounded-xl border p-4 transition-colors cursor-pointer ${isSelected ? 'border-[#F4B000] bg-[#FFF8E8]' : 'border-gray-200 bg-white hover:border-[#F4B000]/40'}`} onClick={() => setSelectedAddress(address)}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${isSelected ? 'border-[#F4B000] bg-[#F4B000]' : 'border-gray-300 bg-white'}`}>
                                  {isSelected && <Check className="h-3 w-3 text-white stroke-[3]" />}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-[#2B1D12]">{address.fullName || address.full_name}</p>
                                  <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                                    {address.addressLine || address.address_line}, {address.city}, {address.state} - {address.pinCode || address.pin_code}
                                    <br />Ph: {address.phone || address.mobile}
                                  </p>
                                </div>
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <button onClick={(e) => handleEditAddress(address, e)} className="text-xs font-bold uppercase tracking-wider text-blue-600 transition-colors hover:text-blue-800">
                                  Edit
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address.id); }} className="text-xs font-bold uppercase tracking-wider text-red-600 transition-colors hover:text-red-800">
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: ITEMS */}
              {step === 'items' && (
                <>
                  <h2 className="flex items-center gap-2 text-2xl font-black text-[#2B1D12] border-b border-gray-100 pb-4 mb-6">
                    <PackageCheck className="text-[#F4B000]" /> Order Summary
                  </h2>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.product_id} className="flex gap-4 p-4 border border-gray-100 rounded-2xl">
                        <div className={`h-20 w-20 rounded-xl bg-gradient-to-br ${item.gradient || 'from-amber-100 to-yellow-50'} flex justify-center items-center`}>
                          <img src={item.image || productHoney} alt={item.name} className="h-16 object-contain drop-shadow-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="font-extrabold text-[#2B1D12]">{item.name}</p>
                          <p className="text-xs text-gray-500 mb-2">Qty: {item.quantity}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-lg text-[#F4B000]">₹{item.price * item.quantity}</span>
                            {item.original_price > item.price && (
                              <span className="text-xs font-bold text-gray-400 line-through">₹{item.original_price * item.quantity}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* STEP 3: PAYMENT */}
              {step === 'payment' && (
                <>
                  <h2 className="flex items-center gap-2 text-2xl font-black text-[#2B1D12] border-b border-gray-100 pb-4 mb-6">
                    <CreditCard className="text-[#F4B000]" /> Payment Method
                  </h2>
                  <div className="space-y-3">
                    {PAYMENT_OPTIONS.map(option => (
                      <label key={option.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${paymentMethod === option.id ? 'border-[#F4B000] bg-[#FFF8E8]' : 'border-gray-200 bg-white hover:border-[#F4B000]/40'}`}>
                        <input type="radio" checked={paymentMethod === option.id} onChange={() => setPaymentMethod(option.id)} className="text-[#F4B000] focus:ring-[#F4B000]" />
                        <span className="text-sm font-extrabold text-[#2B1D12]">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {paymentMethod === 'cod' && (
                    <p className="mt-4 text-xs font-medium text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      You will pay securely with cash when the delivery agent brings your honey to your door.
                    </p>
                  )}
                  {paymentMethod === 'razorpay' && (
                    <p className="mt-4 text-xs font-medium text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-green-600" /> Razorpay provides a 100% secure payment gateway supporting all major UPI apps and banks.
                    </p>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Right Column: Checkout Summary Sidebar */}
          <section className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
              
              <h3 className="text-lg font-black text-[#2B1D12] mb-5">Price Details</h3>
              
              <div className="space-y-3 text-sm font-medium text-gray-600 border-b border-gray-100 pb-5 mb-5">
                <div className="flex justify-between"><span>Price ({items.length} items)</span><span>₹{totalMrp?.toFixed(2)}</span></div>
                <div className="flex justify-between text-green-600 font-bold"><span>Discount</span><span>- ₹{discountOnProducts?.toFixed(2)}</span></div>
                {rawCouponDiscount > 0 && <div className="flex justify-between text-green-600 font-bold"><span>Coupon ({coupon.code})</span><span>- ₹{rawCouponDiscount?.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span>Delivery Charges</span><span className={shipping === 0 ? "text-green-600 font-bold" : ""}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              </div>

              <div className="flex justify-between text-xl font-black text-[#2B1D12] mb-6">
                <span>Total Amount</span>
                <span className="text-[#F4B000]">₹{finalTotal?.toFixed(2)}</span>
              </div>

              <button disabled={primaryAction.disabled} onClick={primaryAction.onClick} className="flex w-full items-center justify-center gap-2 rounded-xl btn-gold py-4 text-sm font-extrabold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition">
                {primaryAction.label} <ArrowRight size={16} />
              </button>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 justify-center">
                  <ShieldCheck size={14} /> 100% SECURE TRANSACTIONS
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
      <style>{`
        .input-field {
          height: 48px; border-radius: 12px; border: 1px solid #e5e7eb; background: #fff; padding: 0 16px;
          font-size: 14px; color: #2B1D12; font-weight: 600; outline: none; transition: all 0.2s;
        }
        .input-field:focus { border-color: #F4B000; box-shadow: 0 0 0 3px rgba(244, 176, 0, 0.15); }
        .input-field::placeholder { color: #9ca3af; font-weight: 500; }
      `}</style>
    </div>
  );
}
