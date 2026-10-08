import React, { useState } from 'react';
import { Shield, Bell, Info, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { ScreenTab } from '../types';

interface NavbarProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  airQualityStatus?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, airQualityStatus = 'Normal' }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Logo & App Title */}
          <div className="flex items-center space-x-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100">
              <Shield className="w-5 h-5" fill="currentColor" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-red-500 font-extrabold text-xs select-none">＋</span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  My Vaccine Guide SG
                </h1>
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                  MOH & WHO Feed
                </span>
                <span className="text-[10px] text-slate-600">
                  • NAIS 2025
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNotificationModal(true)}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Guideline updates"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
            </button>

            <button
              onClick={() => setShowInfoModal(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs hover:ring-2 hover:ring-blue-300 transition-all shadow-xs"
              aria-label="Profile and Data Privacy"
            >
              SG
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Health & Schedule Updates</h3>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="text-slate-600 hover:text-slate-600 text-xs px-2 py-1 rounded-md bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1">
                <div className="font-semibold text-blue-900 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  MOH NAIS September 2025 Active
                </div>
                <p>Updated pneumococcal conjugate protocols (PCV20 / PCV13 with PPSV23) and Healthier SG co-payment subsidies now active across Singapore polyclinics.</p>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100 space-y-1">
                <div className="font-semibold text-amber-900 flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  Seasonal Flu Formulation Window
                </div>
                <p>Southern hemisphere quadrivalent vaccine formulation available for the mid-year influenza peak (May–July).</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowNotificationModal(false);
                onTabChange('guide');
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
            >
              Check My Eligibility
            </button>
          </div>
        </div>
      )}

      {/* Info & Privacy Notice Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">About My Vaccine Guide SG</h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-600 hover:text-slate-600 text-xs px-2 py-1 rounded-md bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Educational Awareness Only:</strong> This application empowers Singapore residents to understand adult vaccines under the National Adult Immunisation Schedule (NAIS), Healthier SG, and CHAS subsidies.
              </p>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-800">🔒 Privacy & Boundary</p>
                <p>No NRIC, full name, or permanent patient health records are stored. All assessment inputs remain in your browser session.</p>
              </div>
              <p>
                Clinical suitability, past vaccination history, and exact co-payment are confirmed by your doctor at your registered polyclinic or CHAS GP clinic.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://www.healthhub.sg"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                <span>Check Personal Records on HealthHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
