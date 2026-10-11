import React from 'react';
import { GraduationCap, ShieldCheck, Heart, MapPin, CreditCard, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neon-orange flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Tutor<span className="text-neon-orange">Now</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sri Lanka's premier on-demand tutoring marketplace. Request single-topic doubt clearance sessions with verified university tutors.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Popular Subjects</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>A/L Combined Mathematics</li>
              <li>A/L Physics & Chemistry</li>
              <li>O/L Mathematics & Science</li>
              <li>Software Engineering & Python</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Escrow Guarantee</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Zero Risk: Payment held in escrow
              </li>
              <li className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                PayHere Gateway (LKR)
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                10% Fair Platform Fee
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">Modes of Delivery</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Online Live Meeting (Auto Link)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Physical In-Person (Town Radius)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                Privacy-first location reveal
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} TutorNow (Sri Lanka). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-neon-orange fill-neon-orange" /> for Sri Lankan Students & Educators
          </p>
        </div>
      </div>
    </footer>
  );
}
