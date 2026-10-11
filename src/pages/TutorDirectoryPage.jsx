import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { 
  ShieldCheck, 
  Star, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  Search,
  CheckCircle2
} from 'lucide-react';

export default function TutorDirectoryPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiRequest('/tutors/all')
      .then(data => setTutors(Array.isArray(data) ? data : []))
      .catch(() => setTutors([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tutors.filter(t => 
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.university.toLowerCase().includes(search.toLowerCase()) ||
    t.degreeField.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Verified University <span className="text-neon-orange">Tutors</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse qualified tutors ready to provide instant topic & past-paper doubt assistance
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by tutor or university..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-neon-orange shadow-soft"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-neon-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-3">Loading verified tutors...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center max-w-md mx-auto space-y-2">
          <GraduationCap className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-800">No tutors found</h3>
          <p className="text-xs text-gray-400">Try refining your search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(tutor => (
            <div
              key={tutor.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-soft hover:border-orange-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 text-neon-orange font-black text-xl flex items-center justify-center shrink-0 border border-orange-200 overflow-hidden">
                    {tutor.idProofUrl ? (
                      <img src={tutor.idProofUrl} alt={tutor.fullName} className="w-full h-full object-cover" />
                    ) : (
                      tutor.fullName.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-gray-900 text-base">{tutor.fullName}</h3>
                      {tutor.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-50" title="Identity & Marksheet Verified" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 font-semibold mt-0.5">{tutor.university}</p>
                    <p className="text-[11px] text-gray-400">{tutor.degreeField}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{tutor.ratingAvg?.toFixed(1) || '5.0'}</span>
                    <span className="text-gray-400 font-normal">({tutor.totalReviews || 0} reviews)</span>
                  </div>

                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    LKR {tutor.hourlyRate?.toLocaleString()}/hr
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {tutor.bio || 'Qualified tutor offering targeted revision, problem-solving techniques, and past-paper doubt clearance.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Verified Credentials
                </span>

                <Link
                  to="/post-request"
                  className="bg-orange-50 hover:bg-orange-100 text-neon-orange text-xs font-bold px-3.5 py-1.5 rounded-xl border border-orange-200 transition-colors"
                >
                  Request Lesson
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
