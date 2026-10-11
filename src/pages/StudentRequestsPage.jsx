import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { Clock, PlusCircle, ArrowRight, Video, MapPin, BookOpen } from 'lucide-react';

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/requests/my')
      .then(data => setRequests(Array.isArray(data) ? data : []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            My Posted <span className="text-neon-orange">Requests</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track student doubts and review reverse proposals from tutors
          </p>
        </div>

        <Link
          to="/post-request"
          className="inline-flex items-center gap-1.5 bg-neon-orange hover:bg-neon-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-brand"
        >
          <PlusCircle className="w-4 h-4" /> Post New Request
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-neon-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-3">Loading your requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center max-w-md mx-auto space-y-3">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-900">No requests posted yet</h3>
          <p className="text-xs text-gray-500">
            Post your first A/L or O/L unit doubt to start receiving proposals from university tutors.
          </p>
          <Link
            to="/post-request"
            className="inline-block bg-neon-orange text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Post a Lesson Doubt
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft hover:border-orange-200 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-orange-50 text-neon-orange border border-orange-200">
                    {req.subject}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    req.status === 'OPEN' ? 'bg-amber-50 text-amber-800' :
                    req.status === 'ASSIGNED' ? 'bg-emerald-50 text-emerald-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {req.status}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">{req.deliveryMode}</span>
                </div>

                <h3 className="font-bold text-gray-900 text-lg">{req.lessonTopic}</h3>
                
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Slot: {new Date(req.preferredSlot).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  {req.deliveryMode === 'PHYSICAL' && ` • Town: ${req.townName}`}
                </p>
              </div>

              <div className="text-right w-full sm:w-auto flex sm:flex-col justify-between items-end border-t sm:border-t-0 pt-3 sm:pt-0">
                <div>
                  <p className="text-xs text-gray-400 font-semibold">Budget: LKR {req.targetBudget?.toLocaleString()}</p>
                  <p className="text-xs font-bold text-neon-orange mt-0.5">
                    {req.bidsCount} Proposals Received
                  </p>
                </div>

                <Link
                  to={`/request/${req.id}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold bg-gray-900 text-white hover:bg-neon-orange px-4 py-2 rounded-xl transition-colors"
                >
                  Review Bids <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
