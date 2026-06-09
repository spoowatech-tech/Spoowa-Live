import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, PackageCheck, Check, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { AnnouncementBar, Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { setCartAddress, getCartShippingOptions, addShippingMethod, initiatePaymentSession, completeCart } from '@/services/api';
import toast from 'react-hot-toast';

const emptyAddress = {
  first_name: '',
  last_name: '',
  phone: '',
  address_1: '',
  address_2: '',
  city: '',
  province: '',
  postal_code: '',
  country_code: 'in',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, items, formatPrice, fetchCart, clearCartState } = useCart();

  const [step, setStep] = useState('address');
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [addressError, setAddressError] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!cart || items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const cartId = cart.id;
  const subtotal = cart.item_subtotal || 0;
  const shippingTotal = cart.shipping_total || 0;
  const total = cart.total || 0;
  const discountTotal = cart.discount_total || 0;

  const validateAddress = () => {
    if (!addressForm.first_name.trim()) return 'First name is required.';
    if (!addressForm.last_name.trim()) return 'Last name is required.';
    if (!addressForm.phone.trim()) return 'Phone number is required.';
    if (!addressForm.address_1.trim()) return 'Address is required.';
    if (!addressForm.city.trim()) return 'City is required.';
    if (!addressForm.province.trim()) return 'State/Province is required.';
    if (!addressForm.postal_code.trim()) return 'Postal code is required.';
    return '';
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const error = validateAddress();
    if (error) return setAddressError(error);
    setAddressError('');

    try {
      await setCartAddress(cartId, addressForm);
      await fetchCart();
      
      // Fetch shipping options
      try {
        const shippingData = await getCartShippingOptions(cartId);
        setShippingOptions(shippingData.shipping_options || []);
      } catch (err) {
        console.warn('No shipping options available:', err);
      }

      setStep('payment');
      toast.success('Address saved!');
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    }
  };

  const handleSelectShipping = async (optionId) => {
    try {
      await addShippingMethod(cartId, optionId);
      setSelectedShipping(optionId);
      await fetchCart();
    } catch (err) {
      toast.error(err.message || 'Failed to set shipping method');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Initialize payment session (use system provider for manual/COD)
      try {
        await initiatePaymentSession(cartId, 'pp_system_default');
      } catch (err) {
        // Payment session might already exist or provider not found
        console.warn('Payment session init:', err.message);
      }

      // Complete the cart → creates an order
      const result = await completeCart(cartId);
      
      if (result.type === 'order') {
        clearCartState();
        toast.success('Order placed successfully! 🎉');
        navigate('/shop');
      } else {
        toast.error('Could not complete the order. Please try again.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const activeSectionClasses = 'rounded-2xl border border-[#F4B000]/15 bg-white p-6 shadow-sm sm:p-8';

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body">
      <AnnouncementBar />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-[#2B1D12] font-display sm:text-4xl">Secure Checkout</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">Complete your order swiftly and securely</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Left Column: Steps */}
          <section className="space-y-4 lg:col-span-2">
            
            {/* Collapsed address header (when on payment step) */}
            {step === 'payment' && (
              <div
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex justify-between items-center cursor-pointer hover:border-[#F4B000]/50 transition"
                onClick={() => setStep('address')}
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-[#FFF8E8] text-[#F4B000] flex justify-center items-center">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Address</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#2B1D12]">
                      {addressForm.first_name} {addressForm.last_name}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {addressForm.address_1}, {addressForm.city}, {addressForm.province} {addressForm.postal_code}
                    </p>
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
                  
                  <form onSubmit={handleSaveAddress} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      className="checkout-input"
                      placeholder="First Name *"
                      value={addressForm.first_name}
                      onChange={(e) => setAddressForm({ ...addressForm, first_name: e.target.value })}
                      required
                    />
                    <input
                      className="checkout-input"
                      placeholder="Last Name *"
                      value={addressForm.last_name}
                      onChange={(e) => setAddressForm({ ...addressForm, last_name: e.target.value })}
                      required
                    />
                    <input
                      className="checkout-input"
                      placeholder="Phone *"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') })}
                      required
                    />
                    <input
                      className="checkout-input"
                      placeholder="Postal Code *"
                      value={addressForm.postal_code}
                      onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      required
                    />
                    <input
                      className="checkout-input"
                      placeholder="City *"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      required
                    />
                    <input
                      className="checkout-input"
                      placeholder="State *"
                      value={addressForm.province}
                      onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                      required
                    />
                    <textarea
                      className="checkout-input sm:col-span-2 min-h-[80px] py-3"
                      placeholder="Full Address *"
                      value={addressForm.address_1}
                      onChange={(e) => setAddressForm({ ...addressForm, address_1: e.target.value })}
                      required
                    />
                    <input
                      className="checkout-input sm:col-span-2"
                      placeholder="Landmark (Optional)"
                      value={addressForm.address_2}
                      onChange={(e) => setAddressForm({ ...addressForm, address_2: e.target.value })}
                    />
                    <button
                      type="submit"
                      className="sm:col-span-2 rounded-xl bg-gray-900 py-3.5 text-sm font-extrabold text-white hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                      Continue to Payment <ArrowRight className="h-4 w-4" />
                    </button>
                    {addressError && (
                      <p className="sm:col-span-2 text-sm text-red-500 font-bold">{addressError}</p>
                    )}
                  </form>
                </>
              )}

              {/* STEP 2: PAYMENT */}
              {step === 'payment' && (
                <>
                  <h2 className="flex items-center gap-2 text-2xl font-black text-[#2B1D12] border-b border-gray-100 pb-4 mb-6">
                    <CreditCard className="text-[#F4B000]" /> Review & Pay
                  </h2>

                  {/* Order items summary */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Items ({items.length})</h3>
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3 p-3 border border-gray-100 rounded-xl">
                        <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center overflow-hidden shrink-0">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="h-14 object-contain" />
                          ) : (
                            <PackageCheck className="h-6 w-6 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-extrabold text-[#2B1D12] line-clamp-1">{item.title || item.product_title}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-black text-[#F4B000] mt-1">{formatPrice(item.total || item.unit_price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping options */}
                  {shippingOptions.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Shipping Method</h3>
                      <div className="space-y-2">
                        {shippingOptions.map(option => (
                          <label
                            key={option.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                              selectedShipping === option.id
                                ? 'border-[#F4B000] bg-[#FFF8E8]'
                                : 'border-gray-200 bg-white hover:border-[#F4B000]/40'
                            }`}
                          >
                            <input
                              type="radio"
                              checked={selectedShipping === option.id}
                              onChange={() => handleSelectShipping(option.id)}
                              className="text-[#F4B000] focus:ring-[#F4B000]"
                            />
                            <span className="text-sm font-extrabold text-[#2B1D12]">{option.name}</span>
                            {option.amount != null && (
                              <span className="ml-auto text-sm font-bold text-gray-600">
                                {option.amount === 0 ? 'FREE' : formatPrice(option.amount)}
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Place Order */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl btn-gold py-4 text-sm font-extrabold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                    <ShieldCheck size={14} /> Your payment information is secure
                  </p>
                </>
              )}
            </div>
          </section>

          {/* Right Column: Price Summary Sidebar */}
          <section className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
              <h3 className="text-lg font-black text-[#2B1D12] mb-5">Price Details</h3>
              
              <div className="space-y-3 text-sm font-medium text-gray-600 border-b border-gray-100 pb-5 mb-5">
                <div className="flex justify-between">
                  <span>Price ({items.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Discount</span>
                    <span>- {formatPrice(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={shippingTotal === 0 ? "text-green-600 font-bold" : ""}>
                    {shippingTotal === 0 ? 'FREE' : formatPrice(shippingTotal)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-black text-[#2B1D12] mb-6">
                <span>Total Amount</span>
                <span className="text-[#F4B000]">{formatPrice(total)}</span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 justify-center">
                <ShieldCheck size={14} /> 100% SECURE TRANSACTIONS
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style>{`
        .checkout-input {
          height: 48px; border-radius: 12px; border: 1px solid #e5e7eb; background: #fff; padding: 0 16px;
          font-size: 14px; color: #2B1D12; font-weight: 600; outline: none; transition: all 0.2s;
        }
        .checkout-input:focus { border-color: #F4B000; box-shadow: 0 0 0 3px rgba(244, 176, 0, 0.15); }
        .checkout-input::placeholder { color: #9ca3af; font-weight: 500; }
      `}</style>
    </div>
  );
}
