import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import PostRequestPage from './pages/PostRequestPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import TutorDirectoryPage from './pages/TutorDirectoryPage';
import TutorWalletPage from './pages/TutorWalletPage';
import StudentRequestsPage from './pages/StudentRequestsPage';
import TutorBidsPage from './pages/TutorBidsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-porcelain">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/post-request" element={<PostRequestPage />} />
            <Route path="/request/:id" element={<RequestDetailsPage />} />
            <Route path="/booking/:id" element={<BookingDetailsPage />} />
            <Route path="/tutors" element={<TutorDirectoryPage />} />
            <Route path="/tutor/wallet" element={<TutorWalletPage />} />
            <Route path="/tutor/bids" element={<TutorBidsPage />} />
            <Route path="/student/requests" element={<StudentRequestsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
