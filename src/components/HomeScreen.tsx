import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sun,
  Wind,
  MapPin,
  Calendar,
  Stethoscope,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Phone,
  FileCheck2,
} from 'lucide-react';
import { fetchWeatherAndAir, WeatherContext } from '../services/apiService';
import { ScreenTab } from '../types';

interface HomeScreenProps {
  onNavigate: (tab: ScreenTab) => void;
  onOpenClinicFinder: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onOpenClinicFinder }) => {
  const [weather, setWeather] = useState<WeatherContext | null>(null);

  useEffect(() => {
    fetchWeatherAndAir().then((w) => setWeather(w));
  }, []);

  return (
    <div className="space-y-4 pb-28 max-w-md mx-auto px-4 pt-2">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-5 shadow-lg">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-blue-100 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>MOH NAIS Sept 2025 Framework</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight leading-tight">
            Protect Your Health with Adult Vaccines
          </h2>

          <p className="text-xs text-blue-100 leading-relaxed max-w-xs">
            Find out which vaccinations you qualify for under Healthier SG and CHAS. Subsidised at over 950 family clinics across Singapore.
          </p>

          <div className="pt-1 flex items-center space-x-2">
            <button
              onClick={() => onNavigate('guide')}
              className="py-2.5 px-4 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md active:scale-95"
            >
              <span>Personalised Guide Me</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('vaccines')}
              className="py-2.5 px-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-xs transition-colors border border-white/20"
            >
              <span>View All Vaccines</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Outdoor Air & Weather Context Widget */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900">
              Singapore Environmental Context
            </span>
          </div>
          <span className="text-[10px] text-slate-600 font-medium">
            NEA Data.gov.sg Feed
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {/* PM2.5 */}
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-600">1-hr PM2.5</div>
            <div className="font-extrabold text-slate-900 text-sm mt-0.5">
              {weather?.pm25Avg ?? 16} <span className="text-[10px] font-normal text-slate-600">µg/m³</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">
              {weather?.pm25Status ?? 'Normal'}
            </div>
          </div>

          {/* Temperature */}
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-600">Temperature</div>
            <div className="font-extrabold text-slate-900 text-sm mt-0.5">
              {weather?.temperature ?? 30.5}°C
            </div>
            <div className="text-[10px] text-slate-600">Outdoor</div>
          </div>

          {/* 2-hr Forecast */}
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-600">2-hr Forecast</div>
            <div className="font-bold text-slate-900 text-xs mt-0.5 truncate">
              {weather?.twoHourForecast ?? 'Partly Cloudy'}
            </div>
            <div className="text-[10px] text-blue-700 font-semibold truncate">
              {weather?.station ?? 'Central'}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-600 leading-normal">
          * Environmental readings provided for outdoor travel planning. Air quality does not alter vaccine schedules.
        </p>
      </div>

      {/* Priority Vaccines Spotlight */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-900">Key Adult Vaccines in Singapore</h3>
          <button
            onClick={() => onNavigate('vaccines')}
            className="text-[11px] font-semibold text-blue-600 flex items-center space-x-0.5 hover:underline"
          >
            <span>See All 5 Vaccines</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pneumococcal Card */}
        <div
          onClick={() => onNavigate('vaccines')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all shadow-xs"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-xs font-bold text-slate-900">Pneumococcal Conjugate</h4>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                  $0 Co-pay
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                For seniors 65+ and adults with chronic diabetes or heart conditions
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 ml-2" />
        </div>

        {/* Influenza Card */}
        <div
          onClick={() => onNavigate('vaccines')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all shadow-xs"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-xs font-bold text-slate-900">Seasonal Influenza (Flu)</h4>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800">
                  Annual
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Annual protection during May-Jul & Nov-Jan peaks. Subsidised via CHAS.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 ml-2" />
        </div>

        {/* Shingles Card */}
        <div
          onClick={() => onNavigate('vaccines')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all shadow-xs"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-xs font-bold text-slate-900">Shingles (Shingrix)</h4>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                  MediSave 500/700
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Recommended for adults 50+ to protect against post-herpetic neuralgia.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 ml-2" />
        </div>
      </div>

      {/* Healthier SG & CHAS Subsidies Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2.5 shadow-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-emerald-950">
            Healthier SG & CHAS Subsidy Framework
          </h4>
        </div>
        <p className="text-[11px] text-emerald-800 leading-relaxed">
          Singapore Citizens who enrol in Healthier SG with a family doctor clinic receive <strong>fully subsidised ($0 co-payment)</strong> nationally recommended adult vaccinations for eligible tiers (Pioneer Gen, Merdeka Gen, and CHAS Blue/Orange).
        </p>
        <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-900 font-semibold">
          <span>Check your card balance</span>
          <button
            onClick={() => onNavigate('guide')}
            className="text-emerald-700 underline font-bold"
          >
            Start Personalised Check
          </button>
        </div>
      </div>

      {/* Find Nearby Clinic Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Participating Clinic Directory</h4>
              <p className="text-[10px] text-slate-600">Polyclinics & CHAS GP Clinics</p>
            </div>
          </div>
          <button
            onClick={onOpenClinicFinder}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
          >
            Find Clinic
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-snug">
          Visit any SingHealth, National Healthcare Group (NHGP), or National University Polyclinics (NUHS), or your enrolled Healthier SG family doctor.
        </p>
      </div>
    </div>
  );
};
