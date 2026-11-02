import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { GraduationCap, UserCheck, AlertCircle, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [role, setRole] = useState('ROLE_STUDENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Tutor-specific fields
  const [university, setUniversity] = useState('University of Moratuwa');
  const [degreeField, setDegreeField] = useState('BSc Engineering');
  const [hourlyRate, setHourlyRate] = useState('2500');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        fullName,
        email,
        password,
        phoneNumber,
        role,
        ...(role === 'ROLE_TUTOR' ? {
          university,
          degreeField,
          hourlyRate: parseFloat(hourlyRate),
          bio,
          idProofUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400',
          marksheetProofUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400'
        } : {})
      };

      await register(payload);
      navigate('/marketplace');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft max-w-lg w-full p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-neon-orange text-white flex items-center justify-center mx-auto shadow-brand">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-gray-500">
            Join Sri Lanka's leading on-demand reverse-bidding learning network
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('ROLE_STUDENT')}
            className={`py-2.5 rounded-xl transition-all ${
              role === 'ROLE_STUDENT' ? 'bg-white text-neon-orange shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            I am a Student
          </button>
          <button
            type="button"
            onClick={() => setRole('ROLE_TUTOR')}
            className={`py-2.5 rounded-xl transition-all ${
              role === 'ROLE_TUTOR' ? 'bg-white text-neon-orange shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            I am a Tutor
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kasun Silva"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-neon-orange"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="kasun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="0771234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-neon-orange"
            />
          </div>

          {/* Additional Tutor Credentials */}
          {role === 'ROLE_TUTOR' && (
            <div className="pt-2 border-t border-gray-100 space-y-4">
              <span className="text-xs font-bold text-neon-orange flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Academic & Tutoring Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">University / Institute *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. University of Moratuwa"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Degree / Field *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSc Eng / Combined Maths"
                    value={degreeField}
                    onChange={(e) => setDegreeField(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Standard Hourly Rate (LKR) *</label>
                <input
                  type="number"
                  required
                  min="500"
                  step="50"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Teaching Bio</label>
                <textarea
                  rows="2"
                  placeholder="Tell students about your tutoring experience..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                ></textarea>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-orange hover:bg-neon-hover text-white font-bold py-3.5 rounded-xl shadow-brand transition-all flex items-center justify-center gap-2 text-sm"
          >
            <UserCheck className="w-4 h-4" />
            {loading ? 'Creating Account...' : `Register as ${role === 'ROLE_STUDENT' ? 'Student' : 'Tutor'}`}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-neon-orange hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
