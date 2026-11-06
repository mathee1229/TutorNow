import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Video, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Star, 
  AlertCircle,
  ShieldCheck,
  Calendar,
  User as UserIcon,
  HelpCircle,
  ArrowRight,
  Check,
  Sparkles
} from 'lucide-react';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { user } = useAuthStore();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [completingLesson, setCompletingLesson] = useState(false);

  // Card Form State
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'payhere'
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.fullName || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const [cardError, setCardError] = useState('');
  const [cardSuccessMsg, setCardSuccessMsg] = useState('');

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const data = await apiRequest(`/payments/booking/${id}`);
        setBooking(data);
        if (user?.fullName && !cardHolder) {
          setCardHolder(user.fullName);
        }
      } catch (err) {
        setError(err.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [id, user]);

  // Card Brand Detection
  const getCardBrand = (number) => {
    const clean = number.replace(/\s+/g, '');
    if (/^4/.test(clean)) return 'VISA';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MASTERCARD';
    if (/^3[47]/.test(clean)) return 'AMEX';
    return 'CARD';
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (cardError) setCardError('');
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardExpiry(raw);
    if (cardError) setCardError('');
  };

  const fillSampleCard = (brand = 'VISA') => {
    if (brand === 'VISA') {
      setCardNumber('4532 8920 1234 5678');
    } else {
      setCardNumber('5425 2334 8901 2345');
    }
    setCardHolder(user?.fullName || 'Sandun Jayawardena');
    setCardExpiry('08/28');
    setCardCvv('789');
    setCardError('');
  };

  const handleCardPayment = async (e) => {
    if (e) e.preventDefault();
    setCardError('');

    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) {
      setCardError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardHolder.trim()) {
      setCardError('Please enter the name on your card.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setCardError('Please enter a valid expiry date in MM/YY format.');
      return;
    }
    const [month, year] = cardExpiry.split('/').map(Number);
    if (month < 1 || month > 12) {
      setCardError('Expiry month must be between 01 and 12.');
      return;
    }
    if (cardCvv.length < 3) {
      setCardError('Please enter a valid 3-digit CVV/CVC code.');
      return;
    }

    setProcessingPayment(true);
    try {
      const updated = await apiRequest(`/payments/simulate-escrow/${id}`, { method: 'POST' });
      setCardSuccessMsg('Card authorized successfully! Funds deposited into safe Escrow.');
      setTimeout(() => {
        setBooking(updated);
        setCardSuccessMsg('');
      }, 900);
    } catch (err) {
      setCardError(err.message || 'Payment processing failed. Please check card details.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleSimulatePayment = async () => {
    setProcessingPayment(true);
    try {
      const updated = await apiRequest(`/payments/simulate-escrow/${id}`, { method: 'POST' });
      setBooking(updated);
    } catch (err) {
      alert(err.message || 'Payment simulation failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!window.confirm('Confirm that the lesson was delivered to your satisfaction? This will release 90% payout to the tutor.')) return;
    setCompletingLesson(true);
    try {
      const updated = await apiRequest(`/payments/complete/${id}`, { method: 'POST' });
      setBooking(updated);
      setShowReviewModal(true);
    } catch (err) {
      alert(err.message || 'Failed to release escrow funds');
    } finally {
      setCompletingLesson(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: parseInt(id),
          rating,
          feedbackText
        })
      });
      setReviewSubmitted(true);
      setTimeout(() => setShowReviewModal(false), 1500);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-neon-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500 mt-3">Loading booking & escrow status...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Booking Error</h2>
        <p className="text-xs text-gray-500">{error}</p>
      </div>
    );
  }

  const isStudent = user && user.id === booking.studentId;
  // eslint-disable-next-line no-unused-vars
  const _isTutor = user && user.id === booking.tutorId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-orange-50 text-neon-orange border border-orange-200 rounded-md text-xs font-bold">
                Booking #{booking.id}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                booking.paymentStatus === 'ESCROW_HELD' ? 'bg-emerald-100 text-emerald-800' :
                booking.paymentStatus === 'RELEASED_TO_TUTOR' ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                <Lock className="w-3 h-3" />
                {booking.paymentStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              {booking.subject}: {booking.lessonTopic}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Student: <strong>{booking.studentName}</strong> • Tutor: <strong>{booking.tutorName}</strong>
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-gray-100 sm:pl-6">
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Fee</p>
            <p className="text-2xl font-black text-gray-900">
              LKR {booking.agreedPrice?.toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Tutor Payout: LKR {booking.tutorPayout?.toLocaleString()} (90%)
            </p>
          </div>
        </div>

        {/* Escrow Visual Progress Tracker */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            Escrow Payment Pipeline
          </h3>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <div className={`p-3 rounded-xl border ${
              booking.paymentStatus === 'PENDING' ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}>
              1. Awaiting Escrow
            </div>
            <div className={`p-3 rounded-xl border ${
              booking.paymentStatus === 'ESCROW_HELD' ? 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200' :
              booking.paymentStatus === 'RELEASED_TO_TUTOR' ? 'bg-gray-50 border-gray-200 text-gray-500' :
              'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              2. Funds Held in Escrow
            </div>
            <div className={`p-3 rounded-xl border ${
              booking.paymentStatus === 'RELEASED_TO_TUTOR' ? 'bg-blue-50 border-blue-400 text-blue-800 ring-2 ring-blue-200' :
              'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              3. Payout Released (90%)
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Payment Action Box (Student Only) */}
      {booking.paymentStatus === 'PENDING' && isStudent && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-soft overflow-hidden">
          
          {/* Header & Escrow Shield Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-6 sm:p-8 border-b border-amber-200/60">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-gray-900">100% Escrow Protection Guarantee</h3>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Secure</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 max-w-xl leading-relaxed">
                    Your card will be authorized and funds held in safe escrow. The tutor receives payment only after you attend the lesson and confirm satisfaction.
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-amber-200/60 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Escrow Deposit</span>
                <p className="text-xl font-black text-gray-900">
                  LKR {booking.agreedPrice?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Payment Method Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-neon-orange text-white shadow-brand'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Credit / Debit Card (Visa, Mastercard, AMEX)
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('payhere')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  paymentMethod === 'payhere'
                    ? 'bg-neon-orange text-white shadow-brand'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Lock className="w-4 h-4" />
                PayHere Gateway / Mobile Wallets
              </button>
            </div>

            {/* Success message banner */}
            {cardSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{cardSuccessMsg}</span>
              </div>
            )}

            {/* Error message banner */}
            {cardError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-red-700 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{cardError}</span>
              </div>
            )}

            {/* ================= METHOD 1: CREDIT / DEBIT CARD FORM ================= */}
            {paymentMethod === 'card' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Card Preview */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="w-full max-w-sm h-52 rounded-3xl p-6 text-white bg-gradient-to-tr from-gray-900 via-slate-800 to-gray-950 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-gray-700/50">
                    <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-44 h-44 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
                    
                    {/* Card Top Row: Chip & Brand */}
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 to-amber-500 border border-amber-200/50 shadow-sm flex items-center justify-center">
                          <div className="w-6 h-4 border border-amber-900/30 rounded-sm" />
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Debit / Credit</span>
                      </div>
                      
                      <div className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs font-black tracking-widest border border-white/20">
                        {getCardBrand(cardNumber)}
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="relative z-10 tracking-widest text-lg sm:text-xl font-mono font-bold text-gray-100">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    {/* Card Bottom Row: Holder & Expiry */}
                    <div className="flex justify-between items-end relative z-10 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-semibold">Card Holder</span>
                        <p className="font-bold tracking-wider uppercase text-sm truncate max-w-[180px]">
                          {cardHolder || 'STUDENT NAME'}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-semibold">Expires</span>
                        <p className="font-mono font-bold text-sm">
                          {cardExpiry || 'MM/YY'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Fill Test Helper */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-medium">Quick Test:</span>
                    <button
                      type="button"
                      onClick={() => fillSampleCard('VISA')}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-orange-50 text-[11px] font-bold text-gray-700 hover:text-neon-orange border border-gray-200 transition-colors"
                    >
                      Fill Visa Card
                    </button>
                    <button
                      type="button"
                      onClick={() => fillSampleCard('MASTERCARD')}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-orange-50 text-[11px] font-bold text-gray-700 hover:text-neon-orange border border-gray-200 transition-colors"
                    >
                      Fill Mastercard
                    </button>
                  </div>
                </div>

                {/* Card Input Form */}
                <form onSubmit={handleCardPayment} className="lg:col-span-7 space-y-4">
                  
                  {/* Card Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4532 •••• •••• 5678"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full pl-10 pr-16 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-neon-orange focus:bg-white transition-colors"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                        {getCardBrand(cardNumber)}
                      </span>
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sandun Jayawardena"
                        value={cardHolder}
                        onChange={(e) => {
                          setCardHolder(e.target.value);
                          if (cardError) setCardError('');
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-neon-orange focus:bg-white transition-colors uppercase"
                      />
                    </div>
                  </div>

                  {/* Expiry and CVV Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-neon-orange focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-gray-700">
                          Security CVV
                        </label>
                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          3 digits on back
                        </span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => {
                            setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                            if (cardError) setCardError('');
                          }}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:border-neon-orange focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Card Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="rounded border-gray-300 text-neon-orange focus:ring-neon-orange"
                    />
                    <span className="text-xs text-gray-600 font-medium">
                      Save card securely for 1-click booking checkout
                    </span>
                  </label>

                  {/* Order Summary Line */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Lesson Tuition Fee:</span>
                      <span className="font-bold text-gray-900">LKR {booking.agreedPrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Escrow Safeguard Fee:</span>
                      <span className="font-bold text-emerald-600">FREE (0.00)</span>
                    </div>
                    <div className="flex justify-between text-gray-900 font-black pt-2 border-t border-gray-200 text-sm">
                      <span>Total to Deposit:</span>
                      <span className="text-neon-orange">LKR {booking.agreedPrice?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Authorize & Deposit Button */}
                  <button
                    type="submit"
                    disabled={processingPayment}
                    className="w-full bg-neon-orange hover:bg-neon-hover text-white text-sm font-bold py-3.5 rounded-xl shadow-brand transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    {processingPayment
                      ? 'Authorizing Card & Locking Escrow...'
                      : `Authorize & Deposit LKR ${booking.agreedPrice?.toLocaleString()} into Escrow`}
                  </button>

                  <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5 pt-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    Encrypted with 256-Bit Bank-Grade SSL. 100% money-back escrow protection.
                  </p>
                </form>

              </div>
            )}

            {/* ================= METHOD 2: PAYHERE GATEWAY TAB ================= */}
            {paymentMethod === 'payhere' && (
              <div className="bg-orange-50/50 border border-orange-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 text-neon-orange rounded-xl shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">PayHere Sri Lanka Payment Gateway</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Pay using Dialog Genie, Frimi, Sampath Vishwa, Commercial Bank, HNB, or direct NetBanking.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={processingPayment}
                    className="w-full sm:w-auto bg-neon-orange hover:bg-neon-hover text-white text-xs font-bold px-6 py-3 rounded-xl shadow-brand transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    {processingPayment ? 'Connecting Gateway...' : `Launch PayHere Gateway (LKR ${booking.agreedPrice?.toLocaleString()})`}
                  </button>
                  <span className="text-xs text-gray-500">Fast sandbox payment simulation for testing</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Class Delivery Interface */}
      {booking.paymentStatus !== 'PENDING' && (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-soft space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Class Delivery & Details</h3>
            <p className="text-xs text-gray-500">Live communication and session resources</p>
          </div>

          {booking.deliveryMode === 'ONLINE' ? (
            <div className={`rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border ${
              booking.meetingLink?.includes('zoom.us')
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 border-blue-200'
                : 'bg-blue-50/60 border-blue-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  booking.meetingLink?.includes('zoom.us') ? 'bg-[#0B5CFF] text-white' : 'bg-blue-600 text-white'
                }`}>
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm">
                      {booking.meetingLink?.includes('zoom.us') ? 'Zoom Workplace Live Session' : 'Online Live Classroom'}
                    </h4>
                    {booking.meetingLink?.includes('zoom.us') && (
                      <span className="px-2 py-0.5 bg-[#0B5CFF]/10 text-[#0B5CFF] text-[10px] font-black rounded-md tracking-wider">
                        ZOOM
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {booking.meetingLink?.includes('zoom.us')
                      ? 'Automated Zoom Workplace meeting generated for this lesson. Click below to launch in Zoom app or browser.'
                      : 'Click below to open the dedicated private video conference with screen share and digital whiteboard.'}
                  </p>
                </div>
              </div>

              {booking.meetingLink ? (
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href={booking.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 sm:flex-initial text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                      booking.meetingLink?.includes('zoom.us')
                        ? 'bg-[#0B5CFF] hover:bg-[#004BD6]'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {booking.meetingLink?.includes('zoom.us') ? 'Launch Zoom Meeting' : 'Join Live Room'}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <span className="text-xs text-gray-400">Meeting link preparing...</span>
              )}
            </div>
          ) : (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">Physical Meetup Address (Now Revealed)</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Escrow has been funded; student location is now unmasked for in-person travel.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs space-y-1">
                <p className="font-bold text-gray-900">Destination Address:</p>
                <p className="text-gray-700 font-medium">{booking.fullAddress}</p>
                <p className="text-gray-500 pt-1 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  Student Contact: {booking.studentPhone || '077-XXXXXXX'}
                </p>
              </div>
            </div>
          )}

          {/* Completion Trigger (Student Release) */}
          {booking.paymentStatus === 'ESCROW_HELD' && isStudent && (
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Did the lesson finish successfully?</h4>
                <p className="text-xs text-gray-500">Confirming completion triggers the 90% payout release to the tutor.</p>
              </div>

              <button
                onClick={handleCompleteLesson}
                disabled={completingLesson}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                {completingLesson ? 'Releasing Payout...' : 'Confirm Lesson Completed & Release Funds'}
              </button>
            </div>
          )}

          {booking.paymentStatus === 'RELEASED_TO_TUTOR' && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Session Complete & Tutor Payout Settled
              </span>
              <button
                onClick={() => setShowReviewModal(true)}
                className="text-neon-orange font-bold hover:underline"
              >
                Leave / Update Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* Review & Rating Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 text-center">
              Rate Your Tutoring Experience
            </h3>
            <p className="text-xs text-gray-500 text-center mt-1">
              Help maintain top-tier tutor quality on TutorNow
            </p>

            {reviewSubmitted ? (
              <div className="my-6 p-4 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Thank you! Your review has been published.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-5 space-y-4">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setRating(val)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-8 h-8 ${val <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Did the tutor clarify the doubt well? Was the lesson structured?"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500"
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-neon-orange hover:bg-neon-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-brand"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
