import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiRequest } from '../api/client';
import { 
  GraduationCap, 
  PlusCircle, 
  Wallet, 
  BookOpen, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Layers
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    if (user && user.role === 'ROLE_TUTOR') {
      apiRequest('/payments/wallet')
        .then(data => setWallet(data))
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-neon-orange flex items-center justify-center text-white shadow-brand transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Tutor<span className="text-neon-orange">Now</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-neon-light text-neon-orange rounded-md border border-orange-200">
                Escrow Protected
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/marketplace" className="hover:text-neon-orange transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-gray-400" />
              Lesson Requests
            </Link>
            <Link to="/tutors" className="hover:text-neon-orange transition-colors flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Verified Tutors
            </Link>

            {user?.role === 'ROLE_STUDENT' && (
              <Link to="/student/requests" className="hover:text-neon-orange transition-colors">
                My Requests
              </Link>
            )}

            {user?.role === 'ROLE_TUTOR' && (
              <Link to="/tutor/bids" className="hover:text-neon-orange transition-colors">
                My Bids
              </Link>
            )}
          </nav>

          {/* User Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'ROLE_TUTOR' && wallet && (
                  <Link 
                    to="/tutor/wallet" 
                    className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full text-xs font-semibold text-orange-800 hover:bg-orange-100 transition-colors"
                  >
                    <Wallet className="w-3.5 h-3.5 text-neon-orange" />
                    <span>LKR {wallet.availableBalance?.toLocaleString() || '0.00'}</span>
                    {wallet.pendingEscrowBalance > 0 && (
                      <span className="text-gray-500 text-[10px] font-normal">
                        (+{wallet.pendingEscrowBalance.toLocaleString()} Escrow)
                      </span>
                    )}
                  </Link>
                )}

                {user.role === 'ROLE_STUDENT' && (
                  <Link
                    to="/post-request"
                    className="inline-flex items-center gap-1.5 bg-neon-orange hover:bg-neon-hover text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-brand transition-all hover:shadow-lg"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Doubt / Unit
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900 leading-tight">{user.fullName}</p>
                    <p className="text-[10px] text-gray-500 capitalize">
                      {user.role === 'ROLE_STUDENT' ? 'Student' : user.role === 'ROLE_TUTOR' ? 'Tutor' : 'Admin'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-neon-orange hover:bg-neon-hover text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-brand transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-3">
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700 hover:text-neon-orange"
          >
            Lesson Requests Feed
          </Link>
          <Link
            to="/tutors"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700 hover:text-neon-orange"
          >
            Verified Tutors
          </Link>
          {user ? (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <p className="text-xs font-semibold text-gray-500">Logged in as {user.fullName}</p>
              {user.role === 'ROLE_STUDENT' && (
                <Link
                  to="/post-request"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-neon-orange text-white py-2 rounded-lg text-sm font-semibold"
                >
                  Post Lesson Doubt
                </Link>
              )}
              {user.role === 'ROLE_TUTOR' && (
                <Link
                  to="/tutor/wallet"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-orange-50 text-orange-800 py-2 rounded-lg text-sm font-semibold border border-orange-200"
                >
                  Wallet & Payouts
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-red-600 font-medium"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-neon-orange text-white rounded-lg text-sm font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
