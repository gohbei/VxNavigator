import React, { useState } from 'react';
import { FileDown, Printer, Copy, Check, X, Shield, Calendar, Stethoscope, AlertCircle } from 'lucide-react';
import { PatientProfile, VaccineRecommendation } from '../types';
import { DOCTOR_QUESTIONS } from '../data/evidenceRegistry';

interface DoctorChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile;
  recommendations: VaccineRecommendation[];
}

export const DoctorChecklistModal: React.FC<DoctorChecklistModalProps> = ({
  isOpen,
  onClose,
  profile,
  recommendations,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const lines = [
      '====================================================',
      'MY VACCINE GUIDE SG - DOCTOR DISCUSSION CHECKLIST',
      `Date Generated: ${new Date().toLocaleDateString('en-SG')}`,
      '====================================================',
      '',
      'PATIENT PROFILE SUMMARY (Voluntary, no NRIC stored):',
      `- Age Bracket: ${profile.ageBracket === '65plus' ? '65+ Years' : profile.ageBracket === '50-64' ? '50-64 Years' : 'Under 50 Years'}`,
      `- Chronic Conditions: ${profile.conditions.length > 0 ? profile.conditions.join(', ') : 'None reported'}`,
      `- Household/Travel Factors: ${profile.householdFactors.length > 0 ? profile.householdFactors.join(', ') : 'None'}`,
      `- Subsidy Tier: ${profile.subsidyCard.toUpperCase()} | Healthier SG Enrolled: ${profile.enrolledHealthierSg ? 'Yes' : 'No'}`,
      '',
      'RECOMMENDED VACCINES (MOH NAIS Sept 2025):',
      ...recommendations.map(
        (r, i) => `${i + 1}. ${r.vaccineName} (${r.priorityText})\n   - Clinical Basis: ${r.clinicalReason}\n   - Dosing Action: ${r.doseAction}\n   - Rule ID: ${r.ruleId} (${r.evidenceLocator})\n   - Subsidy Estimate: ${r.subsidyMatch}`
      ),
      '',
      'QUESTIONS TO ASK MY GENERAL PRACTITIONER / POLYCLINIC DOCTOR:',
      ...DOCTOR_QUESTIONS.map((q, i) => `${i + 1}. "${q.suggestedAsk}"`),
      '',
      'NOTICE: This document is for patient awareness and doctor discussion only. Suitability and prescriptions are determined by your registered doctor.',
      '====================================================',
    ].join('\n');

    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Doctor Discussion Checklist
              </h3>
              <p className="text-[10px] text-slate-600">
                Singapore NAIS Sept 2025 Consultation Notes
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

        {/* Scrollable Printable Content */}
        <div className="p-4 space-y-4 overflow-y-auto text-xs text-slate-700 flex-1 print:p-0">
          {/* Summary Box */}
          <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
              <span>Patient Assessment Factors</span>
              <span className="text-[10px] text-blue-700 font-normal">
                {new Date().toLocaleDateString('en-SG')}
              </span>
            </div>
            <div className="text-[11px] text-blue-800 space-y-0.5">
              <div>
                <strong>Age Bracket:</strong>{' '}
                {profile.ageBracket === '65plus' ? '65+ Years' : profile.ageBracket === '50-64' ? '50-64 Years' : 'Under 50 Years'}
              </div>
              <div>
                <strong>Conditions:</strong>{' '}
                {profile.conditions.length > 0 ? profile.conditions.join(', ') : 'None specified'}
              </div>
              <div>
                <strong>CHAS Status:</strong> {profile.subsidyCard.toUpperCase()} (
                {profile.enrolledHealthierSg ? 'Healthier SG Enrolled: $0 co-pay for NAIS' : 'Standard CHAS'})
              </div>
            </div>
          </div>

          {/* Recommended Vaccines List */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Recommended Vaccines for Discussion ({recommendations.length})</span>
            </h4>

            <div className="space-y-2">
              {recommendations.map((rec) => (
                <div
                  key={rec.vaccineId}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rec.vaccineName}</span>
                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-semibold">
                      {rec.priorityText}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{rec.clinicalReason}</p>
                  <div className="text-[10px] font-medium text-emerald-700 pt-0.5">
                    Subsidy: {rec.subsidyMatch}
                  </div>
                  <div className="text-[9px] text-slate-600 font-mono">
                    Rule: {rec.ruleId} • {rec.evidenceLocator}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Questions to Ask Doctor */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Questions to Ask Your Doctor</span>
            </h4>

            <div className="space-y-1.5">
              {DOCTOR_QUESTIONS.slice(0, 3).map((q, idx) => (
                <div key={q.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="font-semibold text-slate-800 text-[11px]">
                    {idx + 1}. {q.question}
                  </div>
                  <div className="text-[10px] text-blue-900 italic">
                    "{q.suggestedAsk}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Notice */}
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-900 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Educational checklist only. Does not replace professional clinical diagnosis or doctor prescription. Bring this to your next clinic visit.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            onClick={handleCopyText}
            className="py-2.5 px-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center space-x-1 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
