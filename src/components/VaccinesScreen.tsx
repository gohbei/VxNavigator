import React, { useState, useEffect } from 'react';
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
  CloudRain,
  Wind,
  Thermometer,
  AlertCircle,
  Building2,
  Filter,
} from 'lucide-react';
import { VACCINE_CATALOG, DOCTOR_QUESTIONS } from '../data/evidenceRegistry';
import { HEALTHIER_SG_CLINICS, HealthierSgClinic } from '../data/healthierSgClinics';
import { VaccineItem } from '../types';
import { fetchWeatherAndAir, WeatherContext } from '../services/apiService';

interface VaccinesScreenProps {
  onOpenClinicFinder?: () => void;
  onNavigateToGuide: () => void;
}

export const VaccinesScreen: React.FC<VaccinesScreenProps> = ({
  onNavigateToGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [bookingVaccineModal, setBookingVaccineModal] = useState<VaccineItem | null>(null);

  // Weather & PSI Environment Awareness State
  const [weatherData, setWeatherData] = useState<WeatherContext | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [showRegionalDetails, setShowRegionalDetails] = useState(false);

  // Healthier SG Clinics State
  const [clinicSearch, setClinicSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'Central' | 'East' | 'North' | 'Northeast' | 'West'>('All');
  const [selectedClinicType, setSelectedClinicType] = useState<'All' | 'Polyclinic' | 'Healthier SG GP Clinic'>('All');

  useEffect(() => {
    let isMounted = true;
    async function loadEnvData() {
      try {
        const data = await fetchWeatherAndAir();
        if (isMounted) {
          setWeatherData(data);
          setLoadingWeather(false);
        }
      } catch {
        if (isMounted) setLoadingWeather(false);
      }
    }
    loadEnvData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter vaccines solely by user search query (no category pills)
  const filteredVaccines = VACCINE_CATALOG.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.subName.toLowerCase().includes(q) ||
      v.targetGroups.some((t) => t.toLowerCase().includes(q)) ||
      v.description.toLowerCase().includes(q)
    );
  });

  // Filter Healthier SG Clinics
  const filteredClinics = HEALTHIER_SG_CLINICS.filter((c) => {
    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
    const matchesType = selectedClinicType === 'All' || c.type === selectedClinicType;
    const matchesSearch =
      clinicSearch.trim() === '' ||
      c.name.toLowerCase().includes(clinicSearch.toLowerCase()) ||
      c.estate.toLowerCase().includes(clinicSearch.toLowerCase()) ||
      c.address.toLowerCase().includes(clinicSearch.toLowerCase());
    return matchesRegion && matchesType && matchesSearch;
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
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vaccines (e.g. Pneumococcal, Flu, Shingrix...)"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Environmental & Seasonal Health Awareness Section */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-4 text-white shadow-md border border-slate-800 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500/20 text-cyan-300 rounded-xl border border-cyan-500/30">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide flex items-center space-x-1.5">
                <span>Environmental & Climate Awareness</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </h3>
              <p className="text-[10px] text-slate-300">
                Live PSI & Weather Impact on Adult Respiratory Vaccination
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-cyan-200 bg-white/10 px-2 py-0.5 rounded-md">
            Data.gov.sg Feed
          </span>
        </div>

        {weatherData && (
          <>
            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/10">
                <div className="text-[9px] text-slate-300 uppercase tracking-wider">24-hr PSI</div>
                <div className="text-base font-extrabold text-cyan-300 mt-0.5">{weatherData.psiAvg}</div>
                <div className="text-[9px] text-slate-200 font-medium truncate">{weatherData.psiStatus}</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/10">
                <div className="text-[9px] text-slate-300 uppercase tracking-wider">1-hr PM2.5</div>
                <div className="text-base font-extrabold text-emerald-300 mt-0.5">{weatherData.pm25Avg} <span className="text-[9px] font-normal text-slate-300">µg/m³</span></div>
                <div className="text-[9px] text-slate-200 font-medium truncate">{weatherData.pm25Status}</div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-white/10">
                <div className="text-[9px] text-slate-300 uppercase tracking-wider">Temp & Sky</div>
                <div className="text-base font-extrabold text-amber-300 mt-0.5">{weatherData.temperature}°C</div>
                <div className="text-[9px] text-slate-200 font-medium truncate">{weatherData.twoHourForecast}</div>
              </div>
            </div>

            {/* Regional Breakdown Toggle */}
            <button
              onClick={() => setShowRegionalDetails(!showRegionalDetails)}
              className="w-full py-1 text-[10px] text-cyan-300 hover:text-cyan-200 flex items-center justify-center space-x-1 font-semibold transition-colors"
            >
              <span>{showRegionalDetails ? 'Hide Regional Forecast & Readings' : 'View Islandwide Regional Breakdown & 4-Day Outlook'}</span>
              {showRegionalDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showRegionalDetails && (
              <div className="p-2.5 bg-black/25 rounded-xl border border-white/10 space-y-2 text-[11px] animate-in fade-in duration-200">
                <div className="grid grid-cols-5 gap-1 text-center font-mono text-[9px] text-slate-300">
                  <div className="bg-white/5 p-1 rounded">North<br /><span className="text-cyan-300 font-bold">PSI {weatherData.psiRegional.north}</span></div>
                  <div className="bg-white/5 p-1 rounded">South<br /><span className="text-cyan-300 font-bold">PSI {weatherData.psiRegional.south}</span></div>
                  <div className="bg-white/5 p-1 rounded">East<br /><span className="text-cyan-300 font-bold">PSI {weatherData.psiRegional.east}</span></div>
                  <div className="bg-white/5 p-1 rounded">West<br /><span className="text-cyan-300 font-bold">PSI {weatherData.psiRegional.west}</span></div>
                  <div className="bg-white/5 p-1 rounded">Central<br /><span className="text-cyan-300 font-bold">PSI {weatherData.psiRegional.central}</span></div>
                </div>

                <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                  <span><strong>24-hr Outlook:</strong> {weatherData.twentyFourHourForecast.text}</span>
                  <span className="text-amber-300 font-bold">{weatherData.twentyFourHourForecast.lowTemp}°C - {weatherData.twentyFourHourForecast.highTemp}°C</span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-[9px] text-center pt-1">
                  {weatherData.fourDayOutlook.map((item, idx) => (
                    <div key={idx} className="bg-white/5 p-1 rounded">
                      <div className="font-bold text-slate-200">{item.day}</div>
                      <div className="text-[8px] text-slate-400 truncate">{item.forecast}</div>
                      <div className="text-cyan-300">{item.low}°-{item.high}°</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact of Air Quality & Climate on Vaccine Need */}
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 text-cyan-300 font-bold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>How Weather & Air Quality Impact Vaccine Need</span>
              </div>

              <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-200">
                <div className="p-2 bg-blue-900/40 rounded-lg border border-blue-500/20">
                  <span className="font-bold text-cyan-200">1. Pneumococcal Disease (PCV20 / PPSV23):</span>{' '}
                  Particulate air pollutants (PM2.5) and ozone irritate the lower bronchial lining, impairing alveolar macrophage clearance. Adults aged 65+ and individuals with diabetes, asthma, or COPD face heightened susceptibility to secondary bacterial <em>Streptococcus pneumoniae</em> pneumonia. Keeping your NAIS pneumococcal vaccination up to date protects deep lung tissue.
                </div>

                <div className="p-2 bg-blue-900/40 rounded-lg border border-blue-500/20">
                  <span className="font-bold text-cyan-200">2. Seasonal Influenza (Flu Shot):</span>{' '}
                  In Singapore’s tropical climate, influenza transmission peaks during wet monsoon spells (May–July and November–January) with increased indoor congregation. Rapid weather shifts lower mucosal barrier resistance. NAIS recommends annual influenza vaccination prior to monsoon surges, subsidised under Healthier SG.
                </div>
              </div>

              <div className="text-[10px] text-slate-300 italic pt-0.5">
                Observed in Singapore as of {weatherData.observedAt}. For patient awareness; consult your GP for individualized immunization.
              </div>
            </div>
          </>
        )}
      </div>

      {/* Singapore NAIS Framework Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center space-x-3 text-xs shadow-xs">
        <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-emerald-950 flex items-center space-x-1.5">
            <span>Singapore NAIS Framework (Updated 2025)</span>
            <span className="px-1.5 py-0.5 text-[9px] bg-emerald-200 text-emerald-900 rounded-md font-semibold">
              MOH Subsidised
            </span>
          </div>
          <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
            All listed vaccines are approved under the National Adult Immunisation Schedule (NAIS) and subsidised at all enrolled Healthier SG GP clinics & polyclinics.
          </p>
        </div>
      </div>

      {/* Vaccine Cards Section */}
      <div className="space-y-3">
        {filteredVaccines.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <Info className="w-6 h-6 text-slate-400 mx-auto" />
            <div className="text-xs font-bold text-slate-700">No vaccines match "{searchQuery}"</div>
            <p className="text-[11px] text-slate-500">
              Try searching for "Pneumococcal", "Flu", "Shingrix", or "Tdap".
            </p>
          </div>
        ) : (
          filteredVaccines.map((vaccine) => {
            const isExpanded = expandedCardId === vaccine.id;

            return (
              <div
                key={vaccine.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs hover:border-blue-200 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">
                        {vaccine.name}
                      </h3>
                    </div>
                    <p className="text-xs text-blue-600 font-semibold">{vaccine.subName}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {vaccine.categoryBadge}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {vaccine.subsidyBadge}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {vaccine.description}
                </p>

                {/* Target Groups Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {vaccine.targetGroups.map((group, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium"
                    >
                      {group}
                    </span>
                  ))}
                </div>

                {/* Subsidies Summary Box */}
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100/80 space-y-1 text-xs">
                  <div className="font-bold text-blue-900 flex items-center justify-between">
                    <span>Healthier SG Subsidy</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Enrolled Clinics
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-snug">
                    {vaccine.healthierSgSubsidy}
                  </p>
                </div>

                {/* Dosing Protocol Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Dosing & Administration Protocol</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {vaccine.dosingProtocol}
                  </p>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-100 space-y-3 text-xs animate-in fade-in duration-150">
                    {/* CHAS / MediSave Breakdown */}
                    <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <div className="font-semibold text-slate-800 text-[11px]">
                        CHAS & MediSave Framework
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-600">
                        <div className="flex justify-between">
                          <span>Pioneer Generation:</span>
                          <span className="font-bold text-slate-900">{vaccine.chasAndMedisave.pioneerGen || 'Subsidised'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Merdeka Generation:</span>
                          <span className="font-bold text-slate-900">{vaccine.chasAndMedisave.merdekaGen || 'Subsidised'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CHAS Blue / Orange:</span>
                          <span className="font-bold text-slate-900">{vaccine.chasAndMedisave.chasBlueOrange || 'Subsidised'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CHAS Green / Non-CHAS:</span>
                          <span className="font-bold text-slate-900">{vaccine.chasAndMedisave.chasGreenStandard || 'Standard fees apply'}</span>
                        </div>
                        {vaccine.chasAndMedisave.medisaveClaim && (
                          <div className="pt-1 border-t border-slate-200 text-emerald-800 font-medium">
                            {vaccine.chasAndMedisave.medisaveClaim}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Clinical Guidelines & Citations */}
                    <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1 text-[11px]">
                      <div className="font-bold text-indigo-950 flex items-center space-x-1">
                        <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Clinical Guideline Reference</span>
                      </div>
                      <div className="text-indigo-900 leading-snug space-y-1">
                        {vaccine.guidelineDetails.map((detail, idx) => (
                          <p key={idx}>• {detail}</p>
                        ))}
                      </div>
                      <div className="text-[10px] text-indigo-700 font-mono pt-1">
                        Citation IDs: {vaccine.evidenceIds.join(', ')} • MOH NAIS 2025 Table 1
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => toggleExpand(vaccine.id)}
                    className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors border border-slate-200"
                  >
                    <span>{isExpanded ? 'Less Details' : 'Clinical Guidelines'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setBookingVaccineModal(vaccine)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center space-x-1 transition-colors shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>How to Book</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Doctor Consultation Questions Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Ask Your Doctor
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Key questions to discuss with your GP or Polyclinic doctor
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
            Consultation Helper
          </span>
        </div>

        <div className="space-y-2">
          {DOCTOR_QUESTIONS.map((q) => {
            const isQExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 space-y-1.5 transition-colors cursor-pointer"
                onClick={() => toggleQuestion(q.id)}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span className="pr-2">{q.question}</span>
                  {isQExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </div>

                {isQExpanded && (
                  <div className="pt-1.5 border-t border-slate-200/80 space-y-1 text-xs text-slate-600 animate-in fade-in duration-100">
                    <p className="text-[11px]">{q.context}</p>
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
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
        >
          {copiedQuestions ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Questions Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Save Questions to Phone Notes</span>
            </>
          )}
        </button>
      </div>

      {/* Healthier SG in Singapore Clinics Directory (No Map) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Healthier SG Clinics in Singapore
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Polyclinics & Enrolled GP clinics offering NAIS adult vaccination
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            {HEALTHIER_SG_CLINICS.length} Listed
          </span>
        </div>

        {/* Clinic Search & Region Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={clinicSearch}
              onChange={(e) => setClinicSearch(e.target.value)}
              placeholder="Filter by estate or clinic (e.g. Bedok, Tampines, Jurong)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {(['All', 'Central', 'East', 'North', 'Northeast', 'West'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors ${
                  selectedRegion === reg
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex space-x-1.5 pt-0.5">
            {(['All', 'Polyclinic', 'Healthier SG GP Clinic'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedClinicType(type)}
                className={`px-2 py-0.5 rounded-md text-[9px] font-semibold transition-colors ${
                  selectedClinicType === type
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {type === 'Healthier SG GP Clinic' ? 'CHAS GP Clinics' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Clinics List */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-0.5">
          {filteredClinics.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
              No Healthier SG clinics found matching your filter criteria.
            </div>
          ) : (
            filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 space-y-2 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900 leading-snug">
                      {clinic.name}
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] text-blue-700 font-medium mt-0.5">
                      <span className="px-1.5 py-0.2 bg-blue-100 rounded text-[9px] font-bold">
                        {clinic.cluster}
                      </span>
                      <span>• {clinic.estate} ({clinic.region})</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    clinic.type === 'Polyclinic' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {clinic.type}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{clinic.address}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{clinic.operatingHours}</span>
                  </div>
                </div>

                {/* Vaccines Available Tags */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {clinic.vaccinesAvailable.map((vac, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.2 bg-white border border-slate-200 text-slate-700 rounded text-[9px] font-medium"
                    >
                      {vac}
                    </span>
                  ))}
                </div>

                {/* Subsidies & Call Action */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="text-[10px] text-emerald-800 font-semibold truncate pr-2">
                    {clinic.subsidyNote}
                  </div>
                  <a
                    href={`tel:${clinic.phone.replace(/\s+/g, '')}`}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 shrink-0 transition-colors shadow-2xs"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{clinic.phone}</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Healthline Assistance Hotline */}
        <div className="pt-1">
          <a
            href="tel:18002254122"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>MOH Healthline Hotline: 1800 225 4122</span>
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
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded-md bg-slate-100"
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
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-900">1. Enrolled Healthier SG GP Clinic:</div>
                  <p className="text-slate-600">
                    Book directly with your designated family physician via HealthHub or by phone. Eligible enrolled seniors receive $0 co-payment.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-900">2. Any Public Polyclinic:</div>
                  <p className="text-slate-600">
                    Book an adult immunization appointment via the SingHealth Health Buddy, OneNUHS, or NHGP apps.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900">
                <strong>Subsidy Verification:</strong> Bring your NRIC and CHAS / Pioneer / Merdeka Generation card to your visit for on-the-spot fee subsidies.
              </div>
            </div>

            <div className="flex space-x-2 pt-1">
              <button
                onClick={() => setBookingVaccineModal(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Done
              </button>
              <a
                href="https://www.healthhub.sg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors shadow-xs"
              >
                <span>HealthHub App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
