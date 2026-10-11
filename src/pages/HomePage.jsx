import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Video, 
  MapPin, 
  Star, 
  Clock, 
  Send, 
  Sparkles,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest('/requests').catch(() => []),
      apiRequest('/tutors').catch(() => [])
    ]).then(([reqData, tutorData]) => {
      setRequests(Array.isArray(reqData) ? reqData.slice(0, 4) : []);
      setTutors(Array.isArray(tutorData) ? tutorData.slice(0, 4) : []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-orange-50/50 via-white to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-neon-orange text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sri Lanka's First On-Demand Reverse Bidding Tutoring Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Stop Paying Monthly Fees When You Only Need <span className="text-neon-orange underline decoration-orange-300">One Specific Topic</span> Solved.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Stuck on an A/L or O/L past paper question? Post your lesson request, set your budget, and receive competitive bids from verified university tutors within minutes.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user?.role === 'ROLE_STUDENT' ? "/post-request" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neon-orange hover:bg-neon-hover text-white font-bold px-8 py-4 rounded-2xl shadow-brand hover:shadow-lg transition-all text-base"
            >
              <Send className="w-5 h-5" />
              Post Your Lesson Doubt Now
            </Link>

            <Link
              to="/marketplace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-semibold px-8 py-4 rounded-2xl shadow-soft transition-all text-base"
            >
              <Search className="w-5 h-5 text-gray-400" />
              Browse Open Requests
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Escrow Protected: Tutor paid only upon lesson completion</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>PayHere Gateway (LKR Verified)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Verified Mora & Colombo Tutors</span>
            </div>
          </div>
        </div>
      </section>

      {/* How Reverse Bidding Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How TutorNow Works</h2>
          <p className="text-sm text-gray-500 mt-2">Transparent reverse-bidding engineered for fast doubt resolution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft relative overflow-hidden group hover:border-orange-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-neon-orange flex items-center justify-center font-black mb-4">
              1
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Post Specific Topic</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Specify your subject (e.g., Combined Maths Integration), target budget, and Online or Physical mode.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft relative overflow-hidden group hover:border-orange-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-neon-orange flex items-center justify-center font-black mb-4">
              2
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Tutors Submit Bids</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Qualified tutors propose their fee, cover note, and time slot. Compare ratings and university degrees.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft relative overflow-hidden group hover:border-orange-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-neon-orange flex items-center justify-center font-black mb-4">
              3
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Escrow Hold</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Pay securely via PayHere. 100% of your money is safely locked in Escrow until the class concludes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft relative overflow-hidden group hover:border-orange-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-neon-orange flex items-center justify-center font-black mb-4">
              4
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Session & Settlement</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Attend the live session. Once you confirm satisfaction, 90% is released to tutor and 10% platform fee settles.
            </p>
          </div>
        </div>
      </section>

      {/* Live Marketplace Feed Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Lesson Requests</h2>
            <p className="text-sm text-gray-500 mt-1">Students actively waiting for tutor proposals right now</p>
          </div>
          <Link to="/marketplace" className="text-sm font-bold text-neon-orange hover:underline flex items-center gap-1">
            View All ({requests.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map(req => (
            <Link
              key={req.id}
              to={`/request/${req.id}`}
              className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-neon-orange shadow-soft hover:shadow-brand/20 transition-all block group"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {req.subject}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      {req.studentGrade}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                      req.deliveryMode === 'ONLINE' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {req.deliveryMode === 'ONLINE' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      {req.deliveryMode}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-neon-orange transition-colors">
                    {req.lessonTopic}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span>By {req.studentName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(req.preferredSlot).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium">Budget</p>
                  <p className="text-lg font-black text-gray-900">
                    LKR {req.targetBudget?.toLocaleString()}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-orange-50 text-neon-orange rounded-md text-xs font-bold border border-orange-200">
                    {req.bidsCount} Bids Submitted
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Verified Tutors Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Verified Tutors</h2>
            <p className="text-sm text-gray-500 mt-1">Graduates and undergraduates with verified marksheets</p>
          </div>
          <Link to="/tutors" className="text-sm font-bold text-neon-orange hover:underline flex items-center gap-1">
            Browse All Tutors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tutors.map(tutor => (
            <div key={tutor.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-orange-100 mx-auto flex items-center justify-center text-neon-orange font-bold text-xl overflow-hidden border-2 border-orange-200">
                {tutor.idProofUrl ? (
                  <img src={tutor.idProofUrl} alt={tutor.fullName} className="w-full h-full object-cover" />
                ) : (
                  tutor.fullName.charAt(0)
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm flex items-center justify-center gap-1">
                  {tutor.fullName}
                  {tutor.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-50" />}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{tutor.university}</p>
                <p className="text-[11px] text-gray-400 line-clamp-1">{tutor.degreeField}</p>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{tutor.ratingAvg?.toFixed(1) || '5.0'}</span>
                <span className="text-gray-400 font-normal">({tutor.totalReviews || 0})</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400">Rate</span>
                <span className="font-bold text-gray-900">LKR {tutor.hourlyRate?.toLocaleString()}/hr</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
