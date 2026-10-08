import React, { useState } from 'react';
import { MapPin, X, Phone, ExternalLink, Search, Building2, CheckCircle2 } from 'lucide-react';

interface ClinicLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POLYCLINIC_CLUSTERS = [
  {
    cluster: 'SingHealth Polyclinics',
    region: 'East & Central Singapore',
    clinics: ['Bedok Polyclinic', 'Marine Parade Polyclinic', 'Pasir Ris Polyclinic', 'Punggol Polyclinic', 'Tampines Polyclinic', 'Outram Polyclinic'],
    phone: '6643 6969',
  },
  {
    cluster: 'National Healthcare Group Polyclinics (NHGP)',
    region: 'North & Central Singapore',
    clinics: ['Ang Mo Kio Polyclinic', 'Hougang Polyclinic', 'Toa Payoh Polyclinic', 'Woodlands Polyclinic', 'Yishun Polyclinic'],
    phone: '6355 3000',
  },
  {
    cluster: 'National University Polyclinics (NUHS)',
    region: 'West Singapore',
    clinics: ['Bukit Batok Polyclinic', 'Choa Chu Kang Polyclinic', 'Clementi Polyclinic', 'Jurong Polyclinic', 'Pioneer Polyclinic'],
    phone: '6663 6847',
  },
];

export const ClinicLocatorModal: React.FC<ClinicLocatorModalProps> = ({ isOpen, onClose }) => {
  const [filterRegion, setFilterRegion] = useState<'all' | 'east' | 'north' | 'west'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Singapore Polyclinic & CHAS Directory
              </h3>
              <p className="text-[10px] text-slate-600">
                SingHealth • NHGP • NUHS • Healthier SG GP Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 overflow-y-auto text-xs text-slate-700 flex-1">
          {/* Official Healthline card */}
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <div className="font-bold text-xs">MOH Healthline Hotline</div>
              <div className="text-[10px] text-blue-100">National Healthier SG & Vaccine Enquiries</div>
            </div>
            <a
              href="tel:18002254122"
              className="py-1.5 px-3 bg-white text-blue-700 font-bold text-xs rounded-xl flex items-center space-x-1 shadow-xs hover:bg-blue-50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>1800-225-4122</span>
            </a>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clinic name or town (e.g. Bedok, Tampines)..."
              className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Clusters List */}
          <div className="space-y-3">
            {POLYCLINIC_CLUSTERS.map((c, idx) => (
              <div key={idx} className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 text-xs">{c.cluster}</span>
                  </div>
                  <a
                    href={`tel:${c.phone.replace(/\s+/g, '')}`}
                    className="text-blue-600 text-[11px] font-bold hover:underline flex items-center space-x-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{c.phone}</span>
                  </a>
                </div>

                <div className="text-[10px] text-slate-600">{c.region}</div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {c.clinics
                    .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((clinicName, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-medium text-slate-700 flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{clinicName}</span>
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* External Links */}
          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2 text-xs">
            <div className="font-bold text-blue-950">Locate Online & Book Appointments:</div>
            <div className="space-y-1.5 text-[11px]">
              <a
                href="https://www.gowhere.gov.sg"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 text-slate-800 hover:text-blue-600 font-semibold"
              >
                <span>CHAS Clinic GoWhere (MOH)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
              </a>

              <a
                href="https://www.healthhub.sg"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 text-slate-800 hover:text-blue-600 font-semibold"
              >
                <span>HealthHub Polyclinic Appointment Booking</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
