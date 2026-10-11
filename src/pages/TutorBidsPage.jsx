import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { Clock, CheckCircle2, ArrowRight, Layers, FileText } from 'lucide-react';

export default function TutorBidsPage() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/bids/my')
      .then(data => setBids(Array.isArray(data) ? data : []))
      .catch(() => setBids([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          My Submitted <span className="text-neon-orange">Bids</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your proposals, accepted lessons, and payout statuses
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-neon-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-3">Loading your bids...</p>
        </div>
      ) : bids.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center max-w-md mx-auto space-y-3">
          <Layers className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-900">No proposals submitted</h3>
          <p className="text-xs text-gray-500">
            Visit the marketplace to place proposals on student lesson doubts.
          </p>
          <Link
            to="/marketplace"
            className="inline-block bg-neon-orange text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Explore Lesson Requests
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map(bid => (
            <div
              key={bid.id}
              className={`bg-white rounded-3xl border p-6 shadow-soft transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                bid.status === 'ACCEPTED' ? 'border-emerald-400 bg-emerald-50/20' : 'border-gray-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    bid.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                    bid.status === 'REJECTED' ? 'bg-gray-100 text-gray-500' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {bid.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    Slot: {new Date(bid.availableSlot).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 max-w-xl italic">
                  "{bid.coverNote}"
                </p>
              </div>

              <div className="text-right w-full sm:w-auto flex sm:flex-col justify-between items-end border-t sm:border-t-0 pt-3 sm:pt-0">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Offered Fee</p>
                  <p className="text-xl font-black text-gray-900">
                    LKR {bid.proposedPrice?.toLocaleString()}
                  </p>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <Link
                    to={`/request/${bid.lessonRequestId}`}
                    className="text-xs font-bold text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-200 rounded-xl"
                  >
                    View Request
                  </Link>

                  {bid.status === 'ACCEPTED' && (
                    <Link
                      to={`/marketplace`} // Or direct booking link
                      className="bg-emerald-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm"
                    >
                      Lesson Active <CheckCircle2 className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
