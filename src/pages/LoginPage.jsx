import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { GraduationCap, LogIn, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.role === 'ROLE_TUTOR') {
        navigate('/marketplace');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft max-w-md w-full p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-neon-orange text-white flex items-center justify-center mx-auto shadow-brand">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Welcome to Tutor<span className="text-neon-orange">Now</span>
          </h2>
          <p className="text-xs text-gray-500">
            Sign in to access reverse bids, lesson requests, and escrow balance
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Pre-fills */}
        <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-3.5 space-y-2">
          <p className="text-[11px] font-bold text-orange-950 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-neon-orange" /> 1-Click Demo Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => fillQuickDemo('sandun@student.lk', 'student123')}
              className="bg-white hover:bg-orange-100 text-gray-800 font-bold py-1.5 px-2 rounded-lg border border-orange-200 transition-colors"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('kavindu@tutors.lk', 'tutor123')}
              className="bg-white hover:bg-orange-100 text-gray-800 font-bold py-1.5 px-2 rounded-lg border border-orange-200 transition-colors"
            >
              Demo Tutor (Mora)
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-neon-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-neon-orange"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-orange hover:bg-neon-hover text-white font-bold py-3 rounded-xl shadow-brand transition-all flex items-center justify-center gap-2 text-sm"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-neon-orange hover:underline">
            Register now
          </Link>
        </p>

      </div>
    </div>
  );
}
