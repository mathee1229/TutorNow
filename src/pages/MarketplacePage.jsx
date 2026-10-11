import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { 
  Search, 
  Filter, 
  Video, 
  MapPin, 
  Clock, 
  PlusCircle, 
  DollarSign, 
  Send,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

export default function MarketplacePage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState('ALL');
  
  // Bid modal state
  const [activeBidRequest, setActiveBidRequest] = useState(null);
  const [bidPrice, setBidPrice] = useState('');
  const [bidNote, setBidNote] = useState('');
  const [bidSlot, setBidSlot] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidSuccessMsg, setBidSuccessMsg] = useState('');
  const [bidError, setBidError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/requests');
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenBidModal = (req) => {
    setActiveBidRequest(req);
    setBidPrice(req.targetBudget || '');
    setBidSlot(req.preferredSlot ? req.preferredSlot.substring(0, 16) : '');
    setBidNote('');
    setBidError('');
    setBidSuccessMsg('');
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setSubmittingBid(true);
    setBidError('');
    setBidSuccessMsg('');

    try {
      await apiRequest(`/bids/request/${activeBidRequest.id}`, {
        method: 'POST',
        body: JSON.stringify({
          proposedPrice: parseFloat(bidPrice),
          coverNote: bidNote,
          availableSlot: bidSlot || new Date().toISOString()
        })
      });

      setBidSuccessMsg('Your proposal was submitted successfully! The student will be notified.');
      setTimeout(() => {
        setActiveBidRequest(null);
        fetchRequests();
      }, 1500);
    } catch (err) {
      setBidError(err.message || 'Failed to submit proposal');
    } finally {
      setSubmittingBid(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.lessonTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.townName && req.townName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMode = selectedMode === 'ALL' || req.deliveryMode === selectedMode;

    return matchesSearch && matchesMode;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Lesson & Doubt <span className="text-neon-orange">Marketplace</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse targeted topic requests posted by students across Sri Lanka
          </p>
        </div>

        {user?.role === 'ROLE_STUDENT' && (
          <Link
            to="/post-request"
            className="inline-flex items-center gap-2 bg-neon-orange hover:bg-neon-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-brand transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Doubt
          </Link>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-soft flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by subject (e.g. Combined Maths, Physics, Chemistry) or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-neon-orange focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Mode:
          </span>
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
            {['ALL', 'ONLINE', 'PHYSICAL'].map(mode => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedMode === mode ? 'bg-white text-neon-orange shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Listing */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-neon-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500">Loading marketplace opportunities...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white py-16 px-4 rounded-2xl border border-dashed border-gray-300 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 bg-orange-50 text-neon-orange rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900">No requests match your filter</h3>
          <p className="text-xs text-gray-500">Try adjusting your search criteria or switch to another delivery mode.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(req => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:border-orange-200 hover:shadow-brand/10 shadow-soft transition-all"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-orange-50 text-neon-orange border border-orange-200">
                      {req.subject}
                    </span>
                    <span className="ml-2 text-xs font-semibold text-gray-400">
                      {req.studentGrade}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    req.deliveryMode === 'ONLINE' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {req.deliveryMode === 'ONLINE' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                    {req.deliveryMode}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug">
                    {req.lessonTopic}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    Preferred Slot: {new Date(req.preferredSlot).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  {req.deliveryMode === 'PHYSICAL' && (
                    <p className="text-xs text-emerald-700 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Area: {req.townName || 'Colombo Radius'}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">Target Budget</p>
                  <p className="text-xl font-black text-gray-900">
                    LKR {req.targetBudget?.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/request/${req.id}`}
                    className="text-xs font-bold text-gray-600 hover:text-gray-900 px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    View Details
                  </Link>

                  {user?.role === 'ROLE_TUTOR' && (
                    <button
                      onClick={() => handleOpenBidModal(req)}
                      className="bg-neon-orange hover:bg-neon-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-brand transition-all"
                    >
                      Bid / Propose
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Submitting Reverse Bid */}
      {activeBidRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveBidRequest(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-gray-900">
              Submit Reverse Bid
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Propose your custom price and slot for: <strong className="text-gray-800">{activeBidRequest.lessonTopic}</strong>
            </p>

            {bidError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bidError}</span>
              </div>
            )}

            {bidSuccessMsg && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{bidSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitBid} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Proposed Fee (LKR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">LKR</span>
                  <input
                    type="number"
                    required
                    min="500"
                    step="50"
                    value={bidPrice}
                    onChange={(e) => setBidPrice(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-neon-orange"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Student target budget: LKR {activeBidRequest.targetBudget?.toLocaleString()}. (Platform deducts 10% on release).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Available Date & Time Slot *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={bidSlot}
                  onChange={(e) => setBidSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-neon-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Cover Note / Lesson Plan *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Explain how you will resolve this topic (e.g., theory breakdown, solving 5 past paper questions, notes provided)..."
                  value={bidNote}
                  onChange={(e) => setBidNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveBidRequest(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBid}
                  className="bg-neon-orange hover:bg-neon-hover text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-brand flex items-center gap-2"
                >
                  {submittingBid ? 'Submitting...' : 'Submit Custom Bid'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
