import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { 
  Wallet, 
  Lock, 
  ArrowDownLeft, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Building,
  ShieldCheck
} from 'lucide-react';

export default function TutorWalletPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Bank payout form
  const [bankName, setBankName] = useState('Commercial Bank of Ceylon');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const loadWallet = async () => {
    try {
      const data = await apiRequest('/payments/wallet');
      setWallet(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!wallet || wallet.availableBalance <= 0) {
      alert('No available funds to withdraw.');
      return;
    }
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setWithdrawSuccess(true);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-neon-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500 mt-3">Loading tutor earnings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Tutor Earnings & <span className="text-neon-orange">Escrow Wallet</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track completed lesson settlements and withdraw earnings to your local bank account
        </p>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Available Balance */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-soft flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Available for Payout
              </span>
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-neon-orange flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            
            <p className="text-4xl font-black text-gray-900 tracking-tight">
              LKR {wallet?.availableBalance?.toLocaleString() || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Funds cleared from completed & rated tutoring sessions.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Ready for immediate bank transfer
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-soft flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Locked in Escrow (Ongoing)
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            <p className="text-4xl font-black text-gray-900 tracking-tight">
              LKR {wallet?.pendingEscrowBalance?.toLocaleString() || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Student payments locked in safe platform escrow for active classes.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Automatically released once student confirms completion
          </div>
        </div>

      </div>

      {/* Platform Commission Notice */}
      <div className="bg-orange-50/60 border border-orange-200 rounded-3xl p-6 flex items-start gap-4 text-xs">
        <div className="p-2 rounded-xl bg-orange-100 text-neon-orange shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-orange-950 text-sm">Transparent 90/10 Platform Model</h4>
          <p className="text-orange-900 mt-1 leading-relaxed">
            TutorNow charges a flat 10% platform fee on completed sessions to maintain the marketplace, high-speed video servers, and PayHere escrow security. You receive 90% of every agreed price directly in your wallet.
          </p>
        </div>
      </div>

      {/* Withdrawal Request Box */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-soft">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Withdraw Funds to Sri Lankan Bank Account
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          CEFT / SLIPS direct bank transfer to all licensed domestic banks (Commercial Bank, Sampath, BOC, HNB, Seylan)
        </p>

        {withdrawSuccess ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-950 text-sm">Withdrawal Scheduled</h4>
            <p className="text-xs text-emerald-800">
              Transfer of LKR {wallet?.availableBalance?.toLocaleString()} has been queued to {bankName} (Acc: {accountNumber || 'XXXX1234'}). Expected arrival within 2-4 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bank Name *</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-neon-orange"
                >
                  <option value="Commercial Bank of Ceylon">Commercial Bank of Ceylon</option>
                  <option value="Sampath Bank PLC">Sampath Bank PLC</option>
                  <option value="Bank of Ceylon (BOC)">Bank of Ceylon (BOC)</option>
                  <option value="Hatton National Bank (HNB)">Hatton National Bank (HNB)</option>
                  <option value="Seylan Bank">Seylan Bank</option>
                  <option value="Nations Trust Bank">Nations Trust Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. K. A. Perera"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Account Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8001234567"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-neon-orange"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={withdrawing || !wallet || wallet.availableBalance <= 0}
                className="bg-neon-orange hover:bg-neon-hover disabled:bg-gray-300 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-brand transition-all flex items-center gap-2"
              >
                <ArrowDownLeft className="w-4 h-4" />
                {withdrawing ? 'Processing Transfer...' : `Withdraw LKR ${wallet?.availableBalance?.toLocaleString() || '0.00'}`}
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
