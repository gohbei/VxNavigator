import React, { useState } from 'react';
import {
  Search,
  Shield,
  ShieldCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Copy,
  Check,
  MapPin,
  Phone,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  FileCheck2,
} from 'lucide-react';
import { VACCINE_CATALOG, DOCTOR_QUESTIONS } from '../data/evidenceRegistry';
import { VaccineItem } from '../types';

interface VaccinesScreenProps {
  onOpenClinicFinder: () => void;
  onNavigateToGuide: () => void;
}

export const VaccinesScreen: React.FC<VaccinesScreenProps> = ({
  onOpenClinicFinder,
  onNavigateToGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'nais' | 'healthier_sg' | 'medisave'>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [bookingVaccineModal, setBookingVaccineModal] = useState<VaccineItem | null>(null);

  // Filter vaccines
  const filteredVaccines = VACCINE_CATALOG.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.subName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.targetGroups.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'nais') return v.categoryBadge.includes('NAIS') || v.subsidyBadge.includes('Subsidised');
    if (activeFilter === 'healthier_sg') return v.subsidyBadge.includes('Fully Subsidised') || v.healthierSgSubsidy.includes('$0');
    if (activeFilter === 'medisave') return v.subsidyBadge.includes('MediSave') || Boolean(v.chasAndMedisave.medisaveClaim);

    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const toggleQuestion = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  const handleCopyQuestions = () => {
    const textToCopy = DOCTOR_QUESTIONS.map(
      (q, idx) => `${idx + 1}. ${q.question}\n   Reason: ${q.context}\n   What to ask: "${q.suggestedAsk}"`
    ).join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto px-4 pt-2">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vaccines (e.g. Pneumococcal, Flu...)"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-600 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs / Pills */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shadow-xs ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Adult Vaccines
        </button>
        <button
          onClick={() => setActiveFilter('nais')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 transition-colors shadow-xs ${
            activeFilter === 'nais'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>MOH NAIS Listed</span>
        </button>
        <button
          onClick={() => setActiveFilter('healthier_sg')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 transition-colors shadow-xs ${
            activeFilter === 'healthier_sg'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Healthier SG</span>
        </button>
        <button
          onClick={() => setActiveFilter('medisave')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shadow-xs ${
            activeFilter === 'medisave'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          MediSave Subsidised
        </button>
      </div>

      {/* Singapore NAIS Framework Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start space-x-3 shadow-xs">
        <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-xs mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-emerald-950 tracking-tight">Singapore NAIS Framework</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/80 text-emerald-800">
              Updated 2025
            </span>
          </div>
          <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
            National Adult Immunisation Schedule subsidised by MOH at all enrolled Healthier SG GP clinics & Polyclinics.
          </p>
        </div>
      </div>

      {/* Vaccine Cards */}
      <div className="space-y-4">
        {filteredVaccines.map((vaccine) => {
          const isExpanded = expandedCardId === vaccine.id;

          return (
            <div
              key={vaccine.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {/* Header tags */}
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-blue-600" />
                    <span>{vaccine.categoryBadge}</span>
                  </span>
                  <span className="text-emerald-700 flex items-center font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    {vaccine.subsidyBadge}
                  </span>
                </div>

                {/* Title & description */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5 shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {vaccine.name}
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                      {vaccine.subName}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {vaccine.description}
                </p>

                {/* Subsidy Highlight Box */}
                {vaccine.id === 'pneumococcal' && (
                  <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Healthier SG Enrolled Subsidy</span>
                    </div>
                    <p className="text-slate-600 leading-normal">
                      <strong className="text-slate-900">$0 co-payment</strong> for Pioneer Generation, Merdeka Generation, and CHAS Blue/Orange holders at enrolled family clinics.
                    </p>
                    <div className="pt-1.5 border-t border-slate-200/70 flex items-start space-x-2 text-[11px] text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Dosing Protocol:</strong> {vaccine.dosingProtocol}
                      </span>
                    </div>
                  </div>
                )}

                {vaccine.id === 'influenza' && (
                  <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <div className="text-blue-900 font-semibold flex items-center space-x-1.5">
                      <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>CHAS & MediSave Co-payment</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-2 bg-white rounded-lg border border-slate-200/70">
                        <div className="text-slate-600">Pioneer Gen:</div>
                        <div className="font-bold text-emerald-700 text-sm">$0</div>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200/70">
                        <div className="text-slate-600">CHAS Blue/Orange:</div>
                        <div className="font-bold text-blue-700 text-sm">$9 to $18</div>
                      </div>
                    </div>
                  </div>
                )}

                {vaccine.id === 'shingles' && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1.5 text-xs">
                    <div className="text-amber-900 font-semibold flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>MediSave 500/700 Usage</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Singapore Citizens and PRs aged 50 and above can claim up to <strong>$500 or $700/year</strong> per patient from their MediSave account under the Chronic Disease Management Programme (CDMP).
                    </p>
                  </div>
                )}

                {vaccine.id === 'tdap' && (
                  <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="text-slate-900 font-semibold">Singapore Polyclinic & CHAS Subsidies</div>
                    <p className="text-slate-600 text-[11px] leading-normal">
                      Subsidised rates for eligible citizens under NAIS. Full screening available during routine chronic health checks.
                    </p>
                  </div>
                )}

                {/* Expandable Clinical Guidelines */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="font-bold text-slate-800 flex items-center space-x-1">
                      <Info className="w-3.5 h-3.5 text-blue-600" />
                      <span>Clinical Guidance & Footnotes (MOH NAIS Sept 2025):</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                      {vaccine.guidelineDetails.map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                    <div className="p-2 bg-blue-50/60 rounded-lg text-[10px] text-blue-900">
                      <strong>Source verification:</strong> MOH Singapore National Adult Immunisation Schedule (NAIS, Table 1). Confirm past immunisation intervals in HealthHub NIR.
                    </div>
                  </div>
                )}

                {/* Bottom Action Buttons */}
                <div className="pt-1 flex items-center justify-between space-x-3">
                  <button
                    onClick={() => toggleExpand(vaccine.id)}
                    className="flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors py-1.5"
                  >
                    <span>
                      {vaccine.id === 'influenza'
                        ? 'Strain Schedule'
                        : vaccine.id === 'shingles'
                        ? 'Dosage Details'
                        : vaccine.id === 'tdap'
                        ? 'Eligibility Breakdown'
                        : 'Clinical Guidelines'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => setBookingVaccineModal(vaccine)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Book at Clinic</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Doctor Consultation Helper Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl mt-0.5">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Doctor Consultation Helper
            </h3>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">
              Prepare questions for your next GP appointment
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {DOCTOR_QUESTIONS.slice(0, 3).map((q) => {
            const isQExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50"
              >
                <button
                  onClick={() => toggleQuestion(q.id)}
                  className="w-full text-left p-3 flex items-center justify-between text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center space-x-2 pr-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                    <span>"{q.question}"</span>
                  </div>
                  {isQExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </button>

                {isQExpanded && (
                  <div className="px-3.5 pb-3 text-[11px] text-slate-600 space-y-1.5 border-t border-slate-100 bg-white pt-2">
                    <p className="text-slate-600">{q.context}</p>
                    <div className="p-2 bg-blue-50/70 rounded-lg text-blue-900">
                      <strong>How to ask:</strong> "{q.suggestedAsk}"
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleCopyQuestions}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
        >
          {copiedQuestions ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Questions Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Save Questions to Phone Notes</span>
            </>
          )}
        </button>
      </div>

      {/* Find Nearby Clinic Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Find Nearby Clinic
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                CHAS GP & SingHealth / NHGP / NUHS Polyclinics
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            950+ Clinics
          </span>
        </div>

        {/* Singapore Map Mock Preview with authentic styling */}
        <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-tr from-blue-900 via-indigo-900 to-slate-900 p-3 flex flex-col justify-between text-white">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Islandwide Healthier SG Network</span>
            </div>
            <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md font-medium">
              Singapore
            </span>
          </div>

          <div className="relative z-10 flex items-end justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-semibold">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Tampines, Jurong, Woodlands & Central</span>
            </div>
            <button
              onClick={onOpenClinicFinder}
              className="px-2.5 py-1 bg-white text-slate-900 font-bold text-[10px] rounded-lg shadow-sm hover:bg-slate-100 transition-colors"
            >
              Open Map
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            onClick={onOpenClinicFinder}
            className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Locate Nearest</span>
          </button>

          <a
            href="tel:18002254122"
            className="py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>Healthline 1800 225 4122</span>
          </a>
        </div>
      </div>

      {/* Booking Dialog Modal */}
      {bookingVaccineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Booking Guidance</h3>
              </div>
              <button
                onClick={() => setBookingVaccineModal(null)}
                className="text-slate-600 hover:text-slate-600 text-xs px-2 py-1 rounded-md bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100">
                <div className="font-bold text-blue-900 mb-1">{bookingVaccineModal.name}</div>
                <p className="text-[11px] text-blue-800">{bookingVaccineModal.dosingProtocol}</p>
              </div>

              <div className="space-y-2 text-[11px]">
                <p className="font-semibold text-slate-800">Where to receive this vaccination:</p>
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-1 border border-slate-200">
                  <div className="font-semibold text-slate-800">1. Enrolled Healthier SG Family GP</div>
                  <p className="text-slate-600">Enjoy full national subsidies with $0 co-payment for eligible tiers.</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-1 border border-slate-200">
                  <div className="font-semibold text-slate-800">2. SingHealth / NHGP / NUHS Polyclinics</div>
                  <p className="text-slate-600">Book directly via HealthHub app or SingHealth Health Buddy app.</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-600">
                * Note: Vaccine stocks (especially Shingrix or PCV20) may vary. Contact your preferred clinic in advance to ensure availability.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href="https://www.healthhub.sg"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
              >
                <span>Book Appointment via HealthHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => {
                  setBookingVaccineModal(null);
                  onOpenClinicFinder();
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Find Participating Clinics Near Me
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
