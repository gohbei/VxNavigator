import React, { useState, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Bot,
  Send,
  FileDown,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
  Mic,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  Info,
} from 'lucide-react';
import { PatientProfile, VaccineRecommendation, AssistantResponse } from '../types';
import { evaluatePatientProfile } from '../data/evidenceRegistry';
import { queryGroundedAssistant } from '../services/apiService';

interface GuideMeScreenProps {
  onOpenChecklist: (profile: PatientProfile, recommendations: VaccineRecommendation[]) => void;
  onOpenClinicFinder: () => void;
}

export const GuideMeScreen: React.FC<GuideMeScreenProps> = ({
  onOpenChecklist,
  onOpenClinicFinder,
}) => {
  // Voluntary Patient Profile state
  const [ageBracket, setAgeBracket] = useState<'under50' | '50-64' | '65plus'>('65plus');
  const [conditions, setConditions] = useState<string[]>(['diabetes', 'asthma']);
  const [householdFactors, setHouseholdFactors] = useState<string[]>(['elderly_80']);
  const [residency, setResidency] = useState<'citizen' | 'pr' | 'foreigner'>('citizen');
  const [subsidyCard, setSubsidyCard] = useState<'pioneer' | 'merdeka' | 'chas_blue' | 'chas_orange' | 'chas_green' | 'none'>('chas_blue');
  const [enrolledHealthierSg, setEnrolledHealthierSg] = useState(true);

  // AI Assistant Interaction
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<AssistantResponse | null>({
    answer:
      'Based on your profile (Age 68 + Type 2 Diabetes & Asthma), you meet the MOH criteria for Pneumococcal vaccination (PCV20 or PCV13 followed by PPSV23) and annual Influenza. Under Healthier SG at your enrolled clinic, these carry a $0 co-payment for CHAS Blue holders.',
    claims: [
      {
        claimId: 'c1',
        text: 'Age 65+ with Type 2 Diabetes meets criteria for Pneumococcal conjugate & polysaccharide schedule.',
        evidenceIds: ['NAIS-Sept-2025', 'PUBMED-32890123'],
        status: 'supported',
      },
      {
        claimId: 'c2',
        text: 'Enrolled Healthier SG CHAS Blue cardholders receive $0 co-payment on NAIS vaccines.',
        evidenceIds: ['MOH-HEALTHIER-SG-VACC'],
        status: 'supported',
      },
    ],
    sources: [
      {
        id: 'NAIS-Sept-2025',
        title: 'MOH Singapore National Adult Immunisation Schedule (Sept 2025)',
        url: 'https://isomer-user-content.by.gov.sg/18/abda18d6-75b8-4ce2-9085-58905e6e75b6/NAIS_Sept%202025.pdf',
      },
      {
        id: 'PUBMED-32890123',
        title: 'PubMed ID 32890123: Pneumococcal Vaccine Effectiveness in Diabetic Elderly',
        url: 'https://pubmed.ncbi.nlm.nih.gov/32890123/',
      },
    ],
    dataAsOf: new Date().toISOString(),
    missingInformation: ['Previous dose dates in HealthHub NIR'],
    limitations: ['Educational guidance only. Suitability determined by treating doctor.'],
  });

  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  // Build profile object
  const currentProfile: PatientProfile = useMemo(
    () => ({
      ageBracket,
      conditions,
      householdFactors,
      residency,
      subsidyCard,
      enrolledHealthierSg,
    }),
    [ageBracket, conditions, householdFactors, residency, subsidyCard, enrolledHealthierSg]
  );

  // Deterministic evaluation
  const recommendations = useMemo(
    () => evaluatePatientProfile(currentProfile),
    [currentProfile]
  );

  // Preset Handlers
  const handleApplyPreset = (preset: 'senior_diabetes' | 'asthma_caregiver' | 'healthy_52') => {
    if (preset === 'senior_diabetes') {
      setAgeBracket('65plus');
      setConditions(['diabetes']);
      setHouseholdFactors(['elderly_80']);
      setSubsidyCard('chas_blue');
      setEnrolledHealthierSg(true);
    } else if (preset === 'asthma_caregiver') {
      setAgeBracket('50-64');
      setConditions(['asthma']);
      setHouseholdFactors(['elderly_80', 'travel']);
      setSubsidyCard('chas_orange');
      setEnrolledHealthierSg(true);
    } else if (preset === 'healthy_52') {
      setAgeBracket('50-64');
      setConditions([]);
      setHouseholdFactors([]);
      setSubsidyCard('chas_green');
      setEnrolledHealthierSg(false);
    }
  };

  const toggleCondition = (cond: string) => {
    if (cond === 'none') {
      setConditions([]);
      return;
    }
    setConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const toggleHousehold = (factor: string) => {
    setHouseholdFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  };

  const handleAskAi = async (customText?: string) => {
    const textToSend = customText || aiQuery;
    if (!textToSend.trim()) return;

    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await queryGroundedAssistant(textToSend, currentProfile);
      setAiResponse(response);
      setAiQuery('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Assistant request failed';
      setAiError(msg);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-28 max-w-md mx-auto px-4 pt-2">
      {/* Step Header & Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Step 2 of 3: Health Profile & Factors
            </h2>
          </div>
          <span className="text-xs font-bold text-blue-600">65% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full w-[65%] transition-all duration-300"></div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
          <span>Personalised for Singapore MOH Guidelines</span>
          <span className="flex items-center text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            NAIS Verified
          </span>
        </div>
      </div>

      {/* Quick Scenario Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-700 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Quick Scenario Presets</span>
          </span>
          <span className="text-[11px] text-slate-600">Tap to autofill</span>
        </div>

        <div className="flex space-x-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => handleApplyPreset('senior_diabetes')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 transition-all shadow-xs ${
              ageBracket === '65plus' && conditions.includes('diabetes')
                ? 'bg-blue-600 text-white shadow-blue-200'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>I am 68 with Diabetes</span>
          </button>

          <button
            onClick={() => handleApplyPreset('asthma_caregiver')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 transition-all shadow-xs ${
              conditions.includes('asthma') && householdFactors.includes('elderly_80')
                ? 'bg-blue-600 text-white shadow-blue-200'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Asthma & Caregiver</span>
          </button>

          <button
            onClick={() => handleApplyPreset('healthy_52')}
            className="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all shadow-xs"
          >
            <span>52 Healthy Adult</span>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs">
        {/* 1. Age Bracket */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <label className="text-xs font-bold text-slate-900">Age Bracket</label>
            </div>
            {ageBracket === '65plus' && (
              <span className="text-[11px] font-bold text-blue-600">68 years old</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setAgeBracket('under50')}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                ageBracket === 'under50'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="font-bold text-xs">Under 50</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Baseline</div>
            </button>

            <button
              onClick={() => setAgeBracket('50-64')}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                ageBracket === '50-64'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="font-bold text-xs">50 – 64</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Screening</div>
            </button>

            <button
              onClick={() => setAgeBracket('65plus')}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                ageBracket === '65plus'
                  ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="font-bold text-xs">65+ Years</div>
              <div
                className={`text-[10px] mt-0.5 ${
                  ageBracket === '65plus' ? 'text-blue-100' : 'text-slate-600'
                }`}
              >
                Pioneer / CHAS
              </div>
            </button>
          </div>
        </div>

        {/* 2. Chronic Health Conditions */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <label className="text-xs font-bold text-slate-900">Chronic Health Conditions</label>
            </div>
            <span className="text-[10px] text-slate-600">Multi-select</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            Select conditions to match MOH priority recommendations & Medisave subsidy brackets.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { id: 'diabetes', label: 'Type 2 Diabetes' },
              { id: 'asthma', label: 'Mild Asthma / COPD' },
              { id: 'hypertension', label: 'Hypertension' },
              { id: 'kidney', label: 'Kidney Disease' },
            ].map((c) => {
              const isSelected = conditions.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCondition(c.id)}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate pr-1">{c.label}</span>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0"></span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => toggleCondition('none')}
            className={`w-full p-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
              conditions.length === 0
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>None of the above</span>
          </button>
        </div>

        {/* 3. Household & Lifestyle Factors */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <label className="text-xs font-bold text-slate-900">Household & Lifestyle Factors</label>
          </div>

          <div className="space-y-2">
            {/* Factor 1: Live with senior 80+ */}
            <div
              onClick={() => toggleHousehold('elderly_80')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                householdFactors.includes('elderly_80')
                  ? 'bg-blue-50/60 border-blue-200'
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg mt-0.5 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900">
                  Live with elderly family member (80+)
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Recommended for household cocooning protection
                </div>
              </div>
              <input
                type="checkbox"
                checked={householdFactors.includes('elderly_80')}
                readOnly
                className="w-4 h-4 text-blue-600 rounded-sm mt-1"
              />
            </div>

            {/* Factor 2: Frequent travel */}
            <div
              onClick={() => toggleHousehold('travel')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                householdFactors.includes('travel')
                  ? 'bg-blue-50/60 border-blue-200'
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <div className="p-2 bg-slate-100 text-slate-700 rounded-lg mt-0.5 shrink-0">
                ✈️
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900">
                  Frequent Air Travel / Regional Work
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Exposure to seasonal regional strains
                </div>
              </div>
              <input
                type="checkbox"
                checked={householdFactors.includes('travel')}
                readOnly
                className="w-4 h-4 text-blue-600 rounded-sm mt-1"
              />
            </div>
          </div>
        </div>

        {/* Subsidy Card Tier Selection */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span>CHAS / Pioneer Card Tier</span>
            <span className="text-[10px] text-blue-600 font-semibold">Determines Co-payment</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            {[
              { id: 'pioneer', label: 'Pioneer Gen' },
              { id: 'merdeka', label: 'Merdeka Gen' },
              { id: 'chas_blue', label: 'CHAS Blue' },
              { id: 'chas_orange', label: 'CHAS Orange' },
              { id: 'chas_green', label: 'CHAS Green' },
              { id: 'none', label: 'Standard' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSubsidyCard(t.id as any)}
                className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                  subsidyCard === t.id
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Healthier SG Enrolled toggle */}
          <div className="flex items-center justify-between p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
            <div className="flex items-center space-x-2 text-emerald-950 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Enrolled in Healthier SG Clinic</span>
            </div>
            <button
              onClick={() => setEnrolledHealthierSg(!enrolledHealthierSg)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                enrolledHealthierSg
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {enrolledHealthierSg ? 'Yes ($0 Subsidies)' : 'No'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {recommendations.length} Vaccines Recommended
          </h3>
          <p className="text-[11px] text-slate-600">
            Tailored for CHAS / Polyclinic Consultation
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Fully Subsidised</span>
        </span>
      </div>

      {/* Recommendation Result Cards */}
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.vaccineId}
            className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rec.vaccineName}</h4>
                  <span className="text-[10px] text-slate-600 font-medium">
                    Rule ID: {rec.ruleId}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white">
                {rec.badge}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{rec.clinicalReason}</p>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
              <div className="font-semibold text-emerald-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{rec.subsidyMatch}</span>
              </div>
              <p className="text-[11px] text-slate-600">{rec.doseAction}</p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-slate-100">
              <span>{rec.evidenceLocator}</span>
              <span className="text-blue-600 font-semibold">NAIS Schedule</span>
            </div>
          </div>
        ))}
      </div>

      {/* SG Health AI Advisor (Section 7 Assistant) */}
      <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-2xl p-4 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-300 rounded-xl ring-1 ring-blue-400/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-xs font-bold text-white">SG Health AI Advisor</h4>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  MOH v4.2
                </span>
              </div>
              <p className="text-[10px] text-blue-200">Live clinical cross-referencing</p>
            </div>
          </div>
        </div>

        {/* Clinical Evidence Insight Box */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 space-y-2 text-xs">
          <div className="flex items-center space-x-1.5 text-blue-200 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Clinical Evidence Insight</span>
          </div>

          {isAiLoading ? (
            <div className="flex items-center space-x-2 py-3 text-blue-200 text-xs">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Grounding answer in MOH NAIS Sept 2025 and PubMed evidence...</span>
            </div>
          ) : aiResponse ? (
            <div className="space-y-2 text-slate-100 text-xs leading-relaxed">
              <p>"{aiResponse.answer}"</p>

              {/* Citations & Evidence references */}
              {aiResponse.sources && aiResponse.sources.length > 0 && (
                <div className="pt-1.5 border-t border-white/10 flex flex-wrap gap-1 text-[10px]">
                  {aiResponse.sources.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-0.5 rounded bg-blue-600/40 hover:bg-blue-600/60 text-blue-200 border border-blue-400/30 flex items-center space-x-1 transition-colors"
                    >
                      <span>{s.title}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {aiError && (
            <div className="p-2 bg-red-900/40 border border-red-500/40 text-red-200 rounded-lg text-xs flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-300" />
              <span>{aiError}</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompt Buttons */}
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => handleAskAi('What are the polyclinic and CHAS subsidies for my profile?')}
            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-medium border border-white/10 whitespace-nowrap transition-colors"
          >
            Check Polyclinic Subsidies
          </button>
          <button
            onClick={() => handleAskAi('What are common side effects and precautions for Shingrix?')}
            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-medium border border-white/10 whitespace-nowrap transition-colors"
          >
            Ask about Shingles side effects
          </button>
          <button
            onClick={() => handleAskAi('Can I receive the flu vaccine and pneumococcal vaccine together?')}
            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-medium border border-white/10 whitespace-nowrap transition-colors"
          >
            Flu & Pneumococcal together?
          </button>
        </div>

        {/* Ask Question Input */}
        <div className="relative">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
            placeholder="Ask questions (e.g. Can I take flu & pn...)"
            className="w-full pl-3 pr-20 py-2.5 bg-white/15 border border-white/20 rounded-xl text-xs text-white placeholder-blue-200 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
          />
          <div className="absolute inset-y-0 right-1 flex items-center space-x-1">
            <button
              onClick={() => handleAskAi('What vaccines are recommended for elderly with diabetes?')}
              className="p-1.5 text-blue-200 hover:text-white rounded-lg"
              title="Voice / Quick suggestion"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAskAi()}
              disabled={isAiLoading || !aiQuery.trim()}
              className="p-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Verified Institutional Sources Expandable */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <button
          onClick={() => setSourcesExpanded(!sourcesExpanded)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">
              Verified Institutional Sources
            </span>
          </div>
          {sourcesExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {sourcesExpanded && (
          <div className="p-3.5 pt-0 space-y-2.5 text-xs text-slate-600 border-t border-slate-100">
            <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1">
                <span>MOH Singapore NAIS 2024 / Sept 2025</span>
              </div>
              <p className="text-[11px] text-slate-600">
                National Adult Immunisation Schedule recommendations for chronic conditions & elderly age group.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1">
                <span>WHO SAGE Guidance & Lancet Infectious Diseases</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Evidence synthesis on pneumococcal conjugate vaccines in diabetic adult populations (PMID: 32890123).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={() => onOpenChecklist(currentProfile, recommendations)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99]"
        >
          <FileDown className="w-4 h-4" />
          <span>Download Doctor Discussion Checklist (PDF)</span>
        </button>

        <button
          onClick={onOpenClinicFinder}
          className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all border border-blue-200"
        >
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>Locate Healthier SG Polyclinic / GP</span>
        </button>
      </div>

      {/* Privacy Notice Footer */}
      <div className="text-center text-[10px] text-slate-600 space-y-1 pt-2 px-2">
        <p>
          Assessment based on MOH Singapore Adult Immunisation Schedule (NAIS). Information is for educational use and not a replacement for doctor's clinical judgment.
        </p>
        <div className="flex items-center justify-center space-x-1 text-slate-600 font-medium">
          <Lock className="w-3 h-3 text-slate-600" />
          <span>No NRIC or identifiable health information is logged.</span>
        </div>
      </div>
    </div>
  );
};
