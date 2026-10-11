import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { 
  Send, 
  Video, 
  MapPin, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Paperclip
} from 'lucide-react';

export default function PostRequestPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [subject, setSubject] = useState('Combined Mathematics');
  const [lessonTopic, setLessonTopic] = useState('');
  const [studentGrade, setStudentGrade] = useState('A/L 2026');
  const [targetBudget, setTargetBudget] = useState('2500');
  const [preferredSlot, setPreferredSlot] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('ONLINE');
  const [townName, setTownName] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [attachmentUrls, setAttachmentUrls] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const subjectsList = [
    'Combined Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Information & Communication Technology (ICT)',
    'Agricultural Science',
    'Accounting',
    'Business Studies',
    'Economics',
    'General English',
    'Software Engineering / Programming'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        subject,
        lessonTopic,
        studentGrade,
        targetBudget: parseFloat(targetBudget),
        preferredSlot: preferredSlot || new Date(Date.now() + 86400000 * 2).toISOString(),
        deliveryMode,
        townName: deliveryMode === 'PHYSICAL' ? townName : null,
        fullAddress: deliveryMode === 'PHYSICAL' ? fullAddress : 'Online Class',
        attachmentUrls: attachmentUrls || null
      };

      const result = await apiRequest('/requests', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      navigate(`/request/${result.id}`);
    } catch (err) {
      setError(err.message || 'Failed to post lesson request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-8 sm:p-10">
        <div className="border-b border-gray-100 pb-6 mb-6">
          <span className="px-3 py-1 bg-orange-50 text-neon-orange border border-orange-200 rounded-full text-xs font-bold">
            Reverse-Bidding Request
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Post a Lesson or Doubt
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Verified tutors will review your request and compete by submitting customized proposals.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-neon-orange"
              >
                {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Target Grade / Level *
              </label>
              <select
                value={studentGrade}
                onChange={(e) => setStudentGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-neon-orange"
              >
                <option value="O/L 2025/2026">O/L 2025/2026</option>
                <option value="A/L 2025">A/L 2025</option>
                <option value="A/L 2026">A/L 2026</option>
                <option value="University / Degree">University / Degree</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Specific Unit / Topic / Past Paper Question *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Integration by Parts & 2022 Past Paper Question 14"
              value={lessonTopic}
              onChange={(e) => setLessonTopic(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-neon-orange"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Be precise so tutors can estimate the preparation time accurately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Target Budget (LKR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">LKR</span>
                <input
                  type="number"
                  required
                  min="500"
                  step="50"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-neon-orange"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Tutors may offer equal or lower counter-bids.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Preferred Date & Time Slot *
              </label>
              <input
                type="datetime-local"
                required
                value={preferredSlot}
                onChange={(e) => setPreferredSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-neon-orange"
              />
            </div>
          </div>

          {/* Delivery Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Delivery Mode *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  deliveryMode === 'ONLINE' ? 'border-neon-orange bg-orange-50/50 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMode"
                  value="ONLINE"
                  checked={deliveryMode === 'ONLINE'}
                  onChange={() => setDeliveryMode('ONLINE')}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Online Live Class</h4>
                  <p className="text-[11px] text-gray-500">Auto-generated meeting room link</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  deliveryMode === 'PHYSICAL' ? 'border-neon-orange bg-orange-50/50 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMode"
                  value="PHYSICAL"
                  checked={deliveryMode === 'PHYSICAL'}
                  onChange={() => setDeliveryMode('PHYSICAL')}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Physical In-Person</h4>
                  <p className="text-[11px] text-gray-500">Home or study center visit</p>
                </div>
              </label>
            </div>
          </div>

          {/* Physical Location Fields with Privacy Protection */}
          {deliveryMode === 'PHYSICAL' && (
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-amber-900">Privacy-First Address Concealment</h5>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Bidding tutors will only see your <strong>Town / Area</strong> name to calculate distance. Your exact address is 100% private until you accept a bid and fund Escrow.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Town / Area (Public to Bidders) *
                  </label>
                  <input
                    type="text"
                    required={deliveryMode === 'PHYSICAL'}
                    placeholder="e.g. Nugegoda, Kandy, Maharagama"
                    value={townName}
                    onChange={(e) => setTownName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Exact Meetup Address (Concealed) *
                  </label>
                  <input
                    type="text"
                    required={deliveryMode === 'PHYSICAL'}
                    placeholder="e.g. No. 25, Station Road (Private)"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-gray-400" />
              Attachment URL (Optional: Google Drive / Cloudinary link to question image or PDF)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={attachmentUrls}
              onChange={(e) => setAttachmentUrls(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neon-orange hover:bg-neon-hover text-white font-bold px-8 py-3.5 rounded-xl shadow-brand hover:shadow-lg transition-all text-sm"
            >
              {submitting ? 'Broadcasting Request...' : 'Publish to Marketplace'}
              <Send className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
