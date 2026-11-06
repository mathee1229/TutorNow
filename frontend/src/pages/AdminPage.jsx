import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiRequest } from '../api/client';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  CreditCard,
  Star,
  BarChart3,
  Search,
  UserPlus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Trash2,
  ExternalLink,
  RefreshCw,
  Eye,
  Check,
  X,
  Building,
  GraduationCap,
  DollarSign
} from 'lucide-react';

export default function AdminPage() {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Data States
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Loading & Action State
  const [dataLoading, setDataLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userActiveFilter, setUserActiveFilter] = useState('');

  const [tutorPendingOnly, setTutorPendingOnly] = useState(false);

  const [requestSearch, setRequestSearch] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('');

  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingPaymentFilter, setBookingPaymentFilter] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('');

  // Modals State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'ROLE_STUDENT',
    university: '',
    degreeField: '',
    hourlyRate: 2000,
    bio: ''
  });

  const [roleChangeModalUser, setRoleChangeModalUser] = useState(null);
  const [selectedNewRole, setSelectedNewRole] = useState('ROLE_STUDENT');

  const [previewDocUrl, setPreviewDocUrl] = useState(null);
  const [previewDocTitle, setPreviewDocTitle] = useState('');

  // Redirect non-admins
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'ROLE_ADMIN') {
        navigate('/');
      }
    }
  }, [user, isLoading, navigate]);

  // Load Initial Data
  useEffect(() => {
    if (user?.role === 'ROLE_ADMIN') {
      loadStats();
      loadUsers();
      loadTutors();
      loadRequests();
      loadBookings();
      loadReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const showBanner = (msg, isError = false) => {
    if (isError) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 5000);
    } else {
      setActionMessage(msg);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  // API Loaders
  const loadStats = async () => {
    try {
      const data = await apiRequest('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const loadUsers = async () => {
    try {
      setDataLoading(true);
      const queryParams = new URLSearchParams();
      if (userSearch) queryParams.append('search', userSearch);
      if (userRoleFilter) queryParams.append('role', userRoleFilter);
      if (userActiveFilter !== '') queryParams.append('active', userActiveFilter);

      const data = await apiRequest(`/admin/users?${queryParams.toString()}`);
      setUsers(data);
    } catch (err) {
      showBanner(err.message, true);
    } finally {
      setDataLoading(false);
    }
  };

  const loadTutors = async () => {
    try {
      const query = tutorPendingOnly ? '?pendingOnly=true' : '';
      const data = await apiRequest(`/admin/tutors${query}`);
      setTutors(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRequests = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (requestSearch) queryParams.append('search', requestSearch);
      if (requestStatusFilter) queryParams.append('status', requestStatusFilter);

      const data = await apiRequest(`/admin/requests?${queryParams.toString()}`);
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBookings = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (bookingSearch) queryParams.append('search', bookingSearch);
      if (bookingPaymentFilter) queryParams.append('paymentStatus', bookingPaymentFilter);
      if (bookingStatusFilter) queryParams.append('bookingStatus', bookingStatusFilter);

      const data = await apiRequest(`/admin/bookings?${queryParams.toString()}`);
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await apiRequest('/admin/reviews');
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  // User Actions
  const handleToggleUserActive = async (userId) => {
    try {
      const updated = await apiRequest(`/admin/users/${userId}/toggle-active`, {
        method: 'PATCH'
      });
      setUsers(users.map(u => u.id === userId ? updated : u));
      showBanner(`User ${updated.fullName} account is now ${updated.active ? 'ACTIVE' : 'DEACTIVATED'}`);
      loadStats();
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  const handleUpdateRole = async () => {
    if (!roleChangeModalUser) return;
    try {
      const updated = await apiRequest(`/admin/users/${roleChangeModalUser.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: selectedNewRole })
      });
      setUsers(users.map(u => u.id === roleChangeModalUser.id ? updated : u));
      setRoleChangeModalUser(null);
      showBanner(`Role updated to ${selectedNewRole} for ${updated.fullName}`);
      loadStats();
      loadTutors();
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await apiRequest(`/admin/users/${userId}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== userId));
      showBanner(`User "${name}" has been deleted.`);
      loadStats();
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const created = await apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify(newUserForm)
      });
      setUsers([created, ...users]);
      setShowAddUserModal(false);
      setNewUserForm({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'ROLE_STUDENT',
        university: '',
        degreeField: '',
        hourlyRate: 2000,
        bio: ''
      });
      showBanner(`New user ${created.fullName} (${created.role}) created successfully!`);
      loadStats();
      if (created.role === 'ROLE_TUTOR') loadTutors();
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  // Tutor Verification Actions
  const handleVerifyTutor = async (profileId, verified) => {
    try {
      const updated = await apiRequest(`/admin/tutors/${profileId}/verify?verified=${verified}`, {
        method: 'PATCH'
      });
      setTutors(tutors.map(t => t.profileId === profileId ? updated : t));
      showBanner(`Tutor ${updated.fullName} verification ${verified ? 'APPROVED' : 'REVOKED'}.`);
      loadStats();
      loadUsers();
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  // Lesson Request Actions
  const handleUpdateRequestStatus = async (requestId, status) => {
    try {
      const updated = await apiRequest(`/admin/requests/${requestId}/status?status=${status}`, {
        method: 'PATCH'
      });
      setRequests(requests.map(r => r.id === requestId ? updated : r));
      showBanner(`Request #${requestId} status set to ${status}`);
      loadStats();
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm(`Delete lesson request #${requestId}? Associated open bids will also be removed.`)) {
      return;
    }
    try {
      await apiRequest(`/admin/requests/${requestId}`, { method: 'DELETE' });
      setRequests(requests.filter(r => r.id !== requestId));
      showBanner(`Lesson request #${requestId} deleted.`);
      loadStats();
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  // Escrow & Booking Actions
  const handleForceReleaseEscrow = async (bookingId) => {
    if (!window.confirm(`FORCE RELEASE escrow payment for Booking #${bookingId}? Funds will be immediately transferred to tutor's available wallet balance.`)) {
      return;
    }
    try {
      const updated = await apiRequest(`/admin/bookings/${bookingId}/force-release`, {
        method: 'POST'
      });
      setBookings(bookings.map(b => b.id === bookingId ? updated : b));
      showBanner(`Escrow successfully released to tutor for Booking #${bookingId}.`);
      loadStats();
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  const handleRefundEscrow = async (bookingId) => {
    if (!window.confirm(`REFUND escrow for Booking #${bookingId}? Booking will be marked as disputed/refunded.`)) {
      return;
    }
    try {
      const updated = await apiRequest(`/admin/bookings/${bookingId}/refund`, {
        method: 'POST'
      });
      setBookings(bookings.map(b => b.id === bookingId ? updated : b));
      showBanner(`Booking #${bookingId} marked as REFUNDED.`);
      loadStats();
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  // Reviews Actions
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm(`Delete review #${reviewId}?`)) return;
    try {
      await apiRequest(`/admin/reviews/${reviewId}`, { method: 'DELETE' });
      setReviews(reviews.filter(r => r.id !== reviewId));
      showBanner(`Review #${reviewId} deleted.`);
      loadStats();
    } catch (err) {
      showBanner(err.message, true);
    }
  };

  if (!user || user.role !== 'ROLE_ADMIN') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-neon-orange text-white text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5" /> Platform Admin
              </span>
              <span className="text-xs text-gray-400">TutorNow Management Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Administration & Moderation Portal
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Manage platform users, verify tutors, monitor lesson requests, inspect escrow balances, and resolve disputes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadStats();
                loadUsers();
                loadTutors();
                loadRequests();
                loadBookings();
                loadReviews();
                showBanner('Data refreshed!');
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-1.5 border border-white/15"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="bg-neon-orange hover:bg-neon-hover text-white px-4 py-2 rounded-xl text-xs font-bold shadow-brand transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Add User / Admin
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Banners */}
      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{actionMessage}</span>
        </div>
      )}

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm shadow-sm animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">{actionError}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-gray-200 shadow-soft flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-neon-orange text-white shadow-brand'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Overview
        </button>

        <button
          onClick={() => { setActiveTab('users'); loadUsers(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-neon-orange text-white shadow-brand'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Users ({stats?.totalUsers || users.length})
        </button>

        <button
          onClick={() => { setActiveTab('tutors'); loadTutors(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'tutors'
              ? 'bg-neon-orange text-white shadow-brand'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Tutor KYC & Verifications
          {stats?.pendingTutorVerifications > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
              {stats.pendingTutorVerifications}
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveTab('requests'); loadRequests(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'requests'
              ? 'bg-neon-orange text-white shadow-brand'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Lesson Requests ({stats?.totalLessonRequests || requests.length})
        </button>

        <button
          onClick={() => { setActiveTab('bookings'); loadBookings(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bookings'
              ? 'bg-neon-orange text-white shadow-brand'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Bookings & Escrow ({stats?.totalBookings || bookings.length})
        </button>

        <button
          onClick={() => { setActiveTab('reviews'); loadReviews(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reviews'
              ? 'bg-neon-orange text-white shadow-brand'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Star className="w-4 h-4" />
          Reviews Moderation ({reviews.length})
        </button>
      </div>

      {/* ==================== TAB 1: OVERVIEW ==================== */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Users */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-soft space-y-3">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">{stats.totalUsers}</span>
                <span className="text-xs font-medium text-emerald-600">({stats.activeUsers} active)</span>
              </div>
              <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-100 flex justify-between">
                <span>Students: <strong className="text-gray-900">{stats.totalStudents}</strong></span>
                <span>Tutors: <strong className="text-gray-900">{stats.totalTutors}</strong></span>
                <span>Admins: <strong className="text-gray-900">{stats.totalAdmins}</strong></span>
              </div>
            </div>

            {/* Card 2: Lesson Requests */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-soft space-y-3">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Lesson Requests</span>
                <div className="p-2 bg-orange-50 text-neon-orange rounded-xl">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">{stats.totalLessonRequests}</span>
                <span className="text-xs font-medium text-amber-600">({stats.openLessonRequests} open)</span>
              </div>
              <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-100 flex justify-between">
                <span>Assigned: <strong className="text-gray-900">{stats.assignedLessonRequests}</strong></span>
                <span>Completed: <strong className="text-gray-900">{stats.completedLessonRequests}</strong></span>
                <span>Cancelled: <strong className="text-gray-900">{stats.cancelledLessonRequests}</strong></span>
              </div>
            </div>

            {/* Card 3: Escrow & Bookings */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-soft space-y-3">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Escrow Transacted</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">
                  LKR {Number(stats.totalEscrowVolume).toLocaleString()}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-100 flex justify-between">
                <span>Escrow Held: <strong className="text-amber-600">{stats.escrowHeldBookings}</strong></span>
                <span>Paid Out: <strong className="text-emerald-600">{stats.releasedBookings}</strong></span>
                <span>Total: <strong className="text-gray-900">{stats.totalBookings}</strong></span>
              </div>
            </div>

            {/* Card 4: Platform Revenue */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-soft space-y-3">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Platform Revenue (10%)</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-700">
                  LKR {Number(stats.totalPlatformRevenue).toLocaleString()}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-100 flex justify-between">
                <span>Tutors Paid: <strong className="text-gray-900">LKR {Number(stats.totalTutorEarnings).toLocaleString()}</strong></span>
              </div>
            </div>

          </div>

          {/* Verification Alert Callout */}
          {stats.pendingTutorVerifications > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-950 text-sm">
                    {stats.pendingTutorVerifications} Tutor Profile{stats.pendingTutorVerifications > 1 ? 's' : ''} Pending KYC Verification
                  </h3>
                  <p className="text-xs text-amber-800">
                    Review uploaded NIC / Student ID and University transcripts to verify tutor authenticity.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTutorPendingOnly(true);
                  setActiveTab('tutors');
                  loadTutors();
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Review Verification Queue
              </button>
            </div>
          )}

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-soft space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <Users className="w-4 h-4 text-blue-600" /> User Accounts
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Search, filter, block, or change roles for registered students and tutors.
              </p>
              <button
                onClick={() => setActiveTab('users')}
                className="w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs py-2 rounded-xl border border-gray-200 transition-colors"
              >
                Manage All Users &rarr;
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-soft space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <BookOpen className="w-4 h-4 text-neon-orange" /> Lesson Requests Moderation
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Inspect doubt posts and unit requests, moderate spam, and monitor live bids.
              </p>
              <button
                onClick={() => setActiveTab('requests')}
                className="w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs py-2 rounded-xl border border-gray-200 transition-colors"
              >
                Inspect Requests Feed &rarr;
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-soft space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Escrow & Dispute Resolution
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Oversee PayHere payments, force-release escrow to tutors, or refund disputed sessions.
              </p>
              <button
                onClick={() => setActiveTab('bookings')}
                className="w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs py-2 rounded-xl border border-gray-200 transition-colors"
              >
                View Escrow Bookings &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: USERS MANAGEMENT ==================== */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-6 space-y-6">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">User Management</h2>
              <p className="text-xs text-gray-500">
                Total {users.length} accounts matching filters. Toggle active state to immediately suspend or reactivate access.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') loadUsers(); }}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                />
              </div>

              {/* Role Filter */}
              <select
                value={userRoleFilter}
                onChange={(e) => { setUserRoleFilter(e.target.value); }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-neon-orange"
              >
                <option value="">All Roles</option>
                <option value="ROLE_STUDENT">Students</option>
                <option value="ROLE_TUTOR">Tutors</option>
                <option value="ROLE_ADMIN">Admins</option>
              </select>

              {/* Active Filter */}
              <select
                value={userActiveFilter}
                onChange={(e) => { setUserActiveFilter(e.target.value); }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-neon-orange"
              >
                <option value="">All Statuses</option>
                <option value="true">Active Only</option>
                <option value="false">Deactivated Only</option>
              </select>

              <button
                onClick={loadUsers}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Academic / Info</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* User name & email */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-neon-orange font-bold flex items-center justify-center shrink-0">
                          {u.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.fullName}</p>
                          <p className="text-[11px] text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      {u.role === 'ROLE_ADMIN' ? (
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold rounded-lg border border-purple-200 inline-flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Admin
                        </span>
                      ) : u.role === 'ROLE_TUTOR' ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 inline-flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> Tutor
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 inline-flex items-center gap-1">
                          <Users className="w-3 h-3" /> Student
                        </span>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4 text-gray-700 font-medium">
                      {u.phoneNumber || 'N/A'}
                    </td>

                    {/* Extra Info */}
                    <td className="py-3 px-4 text-gray-500">
                      {u.role === 'ROLE_TUTOR' ? (
                        <div>
                          <p className="text-gray-800 font-medium">{u.university || 'N/A'}</p>
                          <p className="text-[10px] text-gray-400">{u.degreeField || 'Specialist'}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Regular Learner</span>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4">
                      {u.active ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded-full text-[10px] inline-flex items-center gap-1">
                          <X className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>

                    {/* Joined date */}
                    <td className="py-3 px-4 text-gray-400 text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle Active */}
                        <button
                          onClick={() => handleToggleUserActive(u.id)}
                          title={u.active ? "Suspend / Block User" : "Activate User"}
                          disabled={u.email === user.email}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.active
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          } ${u.email === user.email ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                          {u.active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>

                        {/* Change Role */}
                        <button
                          onClick={() => {
                            setRoleChangeModalUser(u);
                            setSelectedNewRole(u.role);
                          }}
                          title="Change Role"
                          disabled={u.email === user.email}
                          className={`p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${
                            u.email === user.email ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(u.id, u.fullName)}
                          title="Delete User"
                          disabled={u.email === user.email}
                          className={`p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors ${
                            u.email === user.email ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && !dataLoading && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400">
                      No users match the search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: TUTOR KYC & VERIFICATIONS ==================== */}
      {activeTab === 'tutors' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Tutor Verification & KYC Applications</h2>
              <p className="text-xs text-gray-500">
                Inspect academic transcripts, student IDs, and certifications before granting the verified tutor shield.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tutorPendingOnly}
                  onChange={(e) => {
                    setTutorPendingOnly(e.target.checked);
                  }}
                  className="rounded text-neon-orange focus:ring-neon-orange h-4 w-4"
                />
                Show Pending Only
              </label>

              <button
                onClick={loadTutors}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
              >
                Refresh Queue
              </button>
            </div>
          </div>

          {/* Tutor Verification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tutors
              .filter(t => !tutorPendingOnly || !t.isVerified)
              .map((t) => (
                <div
                  key={t.profileId}
                  className={`p-5 rounded-2xl border transition-all ${
                    t.isVerified
                      ? 'bg-white border-gray-200'
                      : 'bg-amber-50/40 border-amber-200 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-sm">{t.fullName}</h3>
                        {t.isVerified ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Pending Review
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{t.email} • {t.phoneNumber || 'No phone'}</p>
                    </div>

                    <span className="text-xs font-extrabold text-neon-orange bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                      LKR {t.hourlyRate?.toLocaleString()}/hr
                    </span>
                  </div>

                  {/* University & Degree Field */}
                  <div className="mt-3 bg-white p-3 rounded-xl border border-gray-100 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-800 font-semibold">
                      <Building className="w-3.5 h-3.5 text-gray-400" />
                      <span>{t.university}</span>
                    </div>
                    <p className="text-gray-500 pl-5 text-[11px]">{t.degreeField}</p>
                  </div>

                  {/* Bio */}
                  {t.bio && (
                    <p className="mt-2.5 text-xs text-gray-600 italic bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                      "{t.bio}"
                    </p>
                  )}

                  {/* Document Proof Links */}
                  <div className="mt-4 pt-3 border-t border-gray-200/60 flex flex-wrap gap-2 text-xs">
                    {t.idProofUrl ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewDocUrl(t.idProofUrl);
                          setPreviewDocTitle(`NIC / ID Proof - ${t.fullName}`);
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View NIC / ID Proof
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-400 py-1.5">No ID uploaded</span>
                    )}

                    {t.marksheetProofUrl ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewDocUrl(t.marksheetProofUrl);
                          setPreviewDocTitle(`Marksheet / Degree Proof - ${t.fullName}`);
                        }}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Academic Marksheet
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-400 py-1.5">No Marksheet uploaded</span>
                    )}
                  </div>

                  {/* Approval Actions */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    {t.isVerified ? (
                      <button
                        onClick={() => handleVerifyTutor(t.profileId, false)}
                        className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Revoke Verification
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleVerifyTutor(t.profileId, false)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleVerifyTutor(t.profileId, true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve & Verify
                        </button>
                      </>
                    )}
                  </div>

                </div>
              ))}

            {tutors.length === 0 && (
              <div className="col-span-2 text-center py-10 text-gray-400 text-xs">
                No tutor verification applications registered yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: LESSON REQUESTS MODERATION ==================== */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Lesson Requests Moderation</h2>
              <p className="text-xs text-gray-500">
                Inspect requested doubts, student budgets, delivery modes, and delete violating posts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Subject, student, town..."
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') loadRequests(); }}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                />
              </div>

              <select
                value={requestStatusFilter}
                onChange={(e) => setRequestStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-neon-orange"
              >
                <option value="">All Statuses</option>
                <option value="OPEN">OPEN</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <button
                onClick={loadRequests}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Requests Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Subject & Topic</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Target Budget</th>
                  <th className="py-3 px-4">Mode / Location</th>
                  <th className="py-3 px-4">Bids</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-extrabold text-gray-900">{r.subject}</span>
                        <span className="text-[10px] text-gray-500 ml-2">({r.studentGrade || 'Any'})</span>
                        <p className="text-[11px] text-gray-600 truncate max-w-xs">{r.lessonTopic}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-800">{r.studentName}</p>
                      <p className="text-[11px] text-gray-400">{r.studentEmail}</p>
                    </td>

                    <td className="py-3 px-4 font-bold text-neon-orange">
                      LKR {r.targetBudget?.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        r.deliveryMode === 'ONLINE' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {r.deliveryMode}
                      </span>
                      {r.townName && <p className="text-[10px] text-gray-400 mt-0.5">{r.townName}</p>}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">
                        {r.bidsCount} bid{r.bidsCount === 1 ? '' : 's'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        r.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' :
                        r.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                        r.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status === 'OPEN' && (
                          <button
                            onClick={() => handleUpdateRequestStatus(r.id, 'CANCELLED')}
                            title="Cancel Request"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRequest(r.id)}
                          title="Delete Request"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {requests.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400">
                      No lesson requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: BOOKINGS & ESCROW PAYMENTS ==================== */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Bookings & Escrow Oversight</h2>
              <p className="text-xs text-gray-500">
                Monitor live escrow locks, release tutor payouts upon completed sessions, or refund disputed bookings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Subject, student, tutor..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') loadBookings(); }}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                />
              </div>

              <select
                value={bookingPaymentFilter}
                onChange={(e) => setBookingPaymentFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-neon-orange"
              >
                <option value="">All Payments</option>
                <option value="PENDING">PENDING</option>
                <option value="ESCROW_HELD">ESCROW_HELD</option>
                <option value="RELEASED_TO_TUTOR">RELEASED_TO_TUTOR</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>

              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-neon-orange"
              >
                <option value="">All Booking Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="DISPUTED">DISPUTED</option>
              </select>

              <button
                onClick={loadBookings}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Lesson Details</th>
                  <th className="py-3 px-4">Student & Tutor</th>
                  <th className="py-3 px-4">Financials</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Meeting Link</th>
                  <th className="py-3 px-4 text-right">Escrow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-700">
                      #{b.id}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">{b.subject}</p>
                      <p className="text-[11px] text-gray-500 truncate max-w-xs">{b.lessonTopic}</p>
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-800 font-medium">Student: {b.studentName}</p>
                        <p className="text-emerald-700 font-medium">Tutor: {b.tutorName}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <span className="font-extrabold text-gray-900">LKR {b.agreedPrice?.toLocaleString()}</span>
                        <p className="text-[10px] text-gray-500">
                          Fee (10%): LKR {b.platformFee?.toLocaleString()} | Tutor: LKR {b.tutorPayout?.toLocaleString()}
                        </p>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {b.paymentStatus === 'ESCROW_HELD' ? (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-extrabold rounded-lg text-[10px] inline-flex items-center gap-1 border border-amber-300">
                          <Lock className="w-3 h-3 text-amber-700" /> ESCROW HELD
                        </span>
                      ) : b.paymentStatus === 'RELEASED_TO_TUTOR' ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-lg text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> RELEASED
                        </span>
                      ) : b.paymentStatus === 'REFUNDED' ? (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 font-bold rounded-lg text-[10px]">
                          REFUNDED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-[10px]">
                          PENDING PAYMENT
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {b.meetingLink ? (
                        <a
                          href={b.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          Join Jitsi <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400">Physical Session</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {b.paymentStatus === 'ESCROW_HELD' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleForceReleaseEscrow(b.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors"
                            title="Force release escrow to tutor"
                          >
                            Release
                          </button>
                          <button
                            onClick={() => handleRefundEscrow(b.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors border border-red-200"
                            title="Refund payment to student"
                          >
                            Refund
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[10px]">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}

                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400">
                      No bookings matching current criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: REVIEWS MODERATION ==================== */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Reviews & Ratings Moderation</h2>
              <p className="text-xs text-gray-500">
                Delete abusive or non-compliant reviews to preserve platform integrity.
              </p>
            </div>
            <button
              onClick={loadReviews}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
            >
              Refresh Reviews
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-gray-800 ml-1">({r.rating}/5)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      From <strong className="text-gray-800">{r.reviewerName}</strong> to <strong className="text-gray-800">{r.revieweeName}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-100">
                  "{r.feedbackText}"
                </p>

                <p className="text-[10px] text-gray-400">
                  Posted on {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="col-span-2 text-center py-10 text-gray-400 text-xs">
                No user reviews posted yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== MODAL 1: ADD NEW USER / ADMIN ==================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-gray-900 text-base">Add New Account</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-neon-orange"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="kasun@example.lk"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-neon-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-neon-orange"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="0771234567"
                    value={newUserForm.phoneNumber}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phoneNumber: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-neon-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Role *</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:outline-none focus:border-neon-orange"
                >
                  <option value="ROLE_STUDENT">Student</option>
                  <option value="ROLE_TUTOR">Tutor (Auto-Verified)</option>
                  <option value="ROLE_ADMIN">Administrator</option>
                </select>
              </div>

              {newUserForm.role === 'ROLE_TUTOR' && (
                <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2">
                  <span className="font-bold text-orange-900 block text-[11px]">Tutor Credentials</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="University"
                      value={newUserForm.university}
                      onChange={(e) => setNewUserForm({ ...newUserForm, university: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Degree Field"
                      value={newUserForm.degreeField}
                      onChange={(e) => setNewUserForm({ ...newUserForm, degreeField: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neon-orange hover:bg-neon-hover text-white rounded-xl font-bold shadow-brand"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: CHANGE ROLE ==================== */}
      {roleChangeModalUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-gray-900 text-sm">
              Change Role: {roleChangeModalUser.fullName}
            </h3>
            <p className="text-xs text-gray-500">
              Select the new security and functional role for this account:
            </p>

            <div className="space-y-2">
              {['ROLE_STUDENT', 'ROLE_TUTOR', 'ROLE_ADMIN'].map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedNewRole === r
                      ? 'border-neon-orange bg-orange-50/50 text-neon-orange font-bold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={selectedNewRole === r}
                    onChange={() => setSelectedNewRole(r)}
                    className="text-neon-orange focus:ring-neon-orange"
                  />
                  <span className="text-xs">
                    {r === 'ROLE_ADMIN' ? '🛡️ Administrator' : r === 'ROLE_TUTOR' ? '🎓 Tutor' : '👤 Student'}
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRoleChangeModalUser(null)}
                className="px-3.5 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateRole}
                className="px-4 py-1.5 bg-neon-orange hover:bg-neon-hover text-white rounded-xl text-xs font-bold shadow-brand"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 3: DOCUMENT PREVIEW ==================== */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-gray-900 text-sm">{previewDocTitle}</h3>
              <button
                onClick={() => setPreviewDocUrl(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 max-h-96 flex items-center justify-center p-2">
              <img
                src={previewDocUrl}
                alt="Verification Document"
                className="object-contain max-h-80 w-full rounded-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600';
                }}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={previewDocUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-bold"
              >
                Open in new tab <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setPreviewDocUrl(null)}
                className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
