import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Video, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Star, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Award
} from 'lucide-react';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { user } = useAuthStore();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [completingLesson, setCompletingLesson] = useState(false);

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const loadBooking = async () => {
    try {
      const data = await apiRequest(`/payments/booking/${id}`);
      setBooking(data);
    } catch (err) {
      setError(err.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

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
  const isTutor = user && user.id === booking.tutorId;

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
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-amber-950">Deposit Funds into Safe Escrow</h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Your payment will be held safely by TutorNow. The tutor will not receive money until the lesson is completed and you confirm satisfaction.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleSimulatePayment}
              disabled={processingPayment}
              className="w-full sm:w-auto bg-neon-orange hover:bg-neon-hover text-white text-xs font-bold px-6 py-3 rounded-xl shadow-brand transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {processingPayment ? 'Authorizing Payment...' : 'Deposit LKR ' + booking.agreedPrice?.toLocaleString() + ' (PayHere Sandbox)'}
            </button>
            <span className="text-xs text-gray-500">Fast 1-click test simulation for local development</span>
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
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-start gap-3">
                <Video className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-950 text-sm">Online Live Classroom</h4>
                  <p className="text-xs text-blue-800 mt-0.5">
                    Click below to open the dedicated private video conference with screen share and whiteboard.
                  </p>
                </div>
              </div>

              {booking.meetingLink ? (
                <a
                  href={booking.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  Join Live Room <ExternalLink className="w-3.5 h-3.5" />
                </a>
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
