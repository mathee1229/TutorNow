import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { 
  Video, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';

export default function RequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [request, setRequest] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingBidId, setAcceptingBidId] = useState(null);

  // Tutor Proposal Form state
  const [showBidForm, setShowBidForm] = useState(false);
  const [proposedPrice, setProposedPrice] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [availableSlot, setAvailableSlot] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidError, setBidError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqData, bidsData] = await Promise.all([
        apiRequest(`/requests/${id}`),
        apiRequest(`/bids/request/${id}`).catch(() => [])
      ]);
      setRequest(reqData);
      setBids(Array.isArray(bidsData) ? bidsData : []);
      setProposedPrice(reqData.targetBudget || '');
      setAvailableSlot(reqData.preferredSlot ? reqData.preferredSlot.substring(0, 16) : '');
    } catch (err) {
      setError(err.message || 'Failed to load lesson request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAcceptBid = async (bidId) => {
    if (!window.confirm('Accept this tutor bid and create an escrow booking?')) return;
    setAcceptingBidId(bidId);

    try {
      const booking = await apiRequest(`/bids/${bidId}/accept`, {
        method: 'POST'
      });
      navigate(`/booking/${booking.id}`);
    } catch (err) {
      alert(err.message || 'Failed to accept bid');
      setAcceptingBidId(null);
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setSubmittingBid(true);
    setBidError('');

    try {
      await apiRequest(`/bids/request/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          proposedPrice: parseFloat(proposedPrice),
          coverNote,
          availableSlot: availableSlot || new Date().toISOString()
        })
      });
      setShowBidForm(false);
      loadData();
    } catch (err) {
      setBidError(err.message || 'Failed to place proposal');
    } finally {
      setSubmittingBid(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-neon-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500 mt-3">Loading lesson details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Request Not Found</h2>
        <p className="text-xs text-gray-500">{error}</p>
        <Link to="/marketplace" className="inline-block bg-neon-orange text-white text-xs font-bold px-4 py-2 rounded-xl">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = user && user.id === request.studentId;
  const hasAlreadyBid = user?.role === 'ROLE_TUTOR' && bids.some(b => b.tutorId === user.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Lesson Details Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-orange-50 text-neon-orange border border-orange-200 rounded-md text-xs font-bold">
                {request.subject}
              </span>
              <span className="text-xs font-semibold text-gray-400">
                {request.studentGrade}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                request.deliveryMode === 'ONLINE' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {request.deliveryMode === 'ONLINE' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                {request.deliveryMode}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                request.status === 'OPEN' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'
              }`}>
                {request.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              {request.lessonTopic}
            </h1>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
              <span>Requested by <strong>{request.studentName}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Slot: {new Date(request.preferredSlot).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-gray-100 sm:pl-6">
            <p className="text-xs text-gray-400 font-semibold uppercase">Target Budget</p>
            <p className="text-3xl font-black text-gray-900">
              LKR {request.targetBudget?.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Escrow Protected</p>
          </div>
        </div>

        {/* Location & Attachment information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neon-orange" /> Location Details
            </h4>
            <p className="text-gray-600">
              <strong>Area:</strong> {request.townName || 'Online Video Classroom'}
            </p>
            <p className="text-gray-500">
              <strong>Address:</strong> {request.fullAddress}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
            <h4 className="font-bold text-gray-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neon-orange" /> Attachments
            </h4>
            {request.attachmentUrls ? (
              <a
                href={request.attachmentUrls}
                target="_blank"
                rel="noreferrer"
                className="text-neon-orange font-bold hover:underline inline-block break-all"
              >
                {request.attachmentUrls}
              </a>
            ) : (
              <p className="text-gray-400 italic">No attachments provided for this request.</p>
            )}
          </div>
        </div>
      </div>

      {/* Tutor Action CTA (If logged in as Tutor & haven't bid yet) */}
      {user?.role === 'ROLE_TUTOR' && request.status === 'OPEN' && !hasAlreadyBid && (
        <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-bold text-orange-950 text-lg">Interested in tutoring this student?</h3>
            <p className="text-xs text-orange-800 mt-1">
              Submit your proposed fee and teaching approach. Student can accept immediately.
            </p>
          </div>
          <button
            onClick={() => setShowBidForm(!showBidForm)}
            className="bg-neon-orange hover:bg-neon-hover text-white text-sm font-bold px-6 py-3 rounded-xl shadow-brand transition-all shrink-0"
          >
            {showBidForm ? 'Close Proposal Form' : 'Submit Reverse Bid'}
          </button>
        </div>
      )}

      {/* Inline Proposal Form */}
      {showBidForm && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Your Proposal Details</h3>
          
          {bidError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{bidError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitProposal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Proposed Fee (LKR) *</label>
                <input
                  type="number"
                  required
                  min="500"
                  step="50"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-neon-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Available Slot *</label>
                <input
                  type="datetime-local"
                  required
                  value={availableSlot}
                  onChange={(e) => setAvailableSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Cover Note / Approach *</label>
              <textarea
                required
                rows="3"
                placeholder="Describe your lesson structure and doubts resolution methodology..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingBid}
                className="bg-neon-orange hover:bg-neon-hover text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-brand"
              >
                {submittingBid ? 'Submitting...' : 'Post Bid'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reverse Bids Comparison Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Submitted Tutor Proposals ({bids.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Compare tutor qualifications, ratings, and proposed hourly fees
            </p>
          </div>
        </div>

        {bids.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-dashed border-gray-200 text-center space-y-2">
            <Clock className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-700">No proposals received yet</p>
            <p className="text-xs text-gray-400">
              Verified tutors are notified and will place their proposals shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map(bid => (
              <div
                key={bid.id}
                className={`bg-white rounded-3xl border p-6 shadow-soft transition-all ${
                  bid.status === 'ACCEPTED' ? 'border-emerald-500 bg-emerald-50/20' : 'border-gray-200 hover:border-orange-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-neon-orange font-bold text-lg flex items-center justify-center shrink-0">
                      {bid.tutorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-base">{bid.tutorName}</h4>
                        {bid.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{bid.tutorUniversity}</p>
                      <p className="text-[11px] text-gray-400">{bid.tutorDegree}</p>
                      
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{bid.tutorRating?.toFixed(1) || '5.0'}</span>
                        <span className="text-gray-400 font-normal">({bid.totalReviews || 0} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-gray-100 sm:pl-6 w-full sm:w-auto flex sm:flex-col justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Proposed Fee</p>
                      <p className="text-2xl font-black text-gray-900">
                        LKR {bid.proposedPrice?.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-3">
                      {bid.status === 'ACCEPTED' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bid Accepted
                        </span>
                      ) : isOwner && request.status === 'OPEN' ? (
                        <button
                          onClick={() => handleAcceptBid(bid.id)}
                          disabled={acceptingBidId === bid.id}
                          className="bg-neon-orange hover:bg-neon-hover text-white text-xs font-bold px-4 py-2 rounded-xl shadow-brand transition-all flex items-center gap-1.5"
                        >
                          <UserCheck className="w-4 h-4" />
                          {acceptingBidId === bid.id ? 'Accepting...' : 'Accept & Proceed'}
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400 capitalize">
                          {bid.status.toLowerCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/70 p-4 rounded-2xl text-xs space-y-1">
                  <p className="font-semibold text-gray-700">Tutor Proposal Note:</p>
                  <p className="text-gray-600 leading-relaxed">{bid.coverNote}</p>
                  <p className="text-[11px] text-gray-400 pt-1">
                    Offered Slot: {new Date(bid.availableSlot).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
