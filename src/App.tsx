import React, { useState } from 'react';
import { ScreenTab, PatientProfile, VaccineRecommendation } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { GuideMeScreen } from './components/GuideMeScreen';
import { VaccinesScreen } from './components/VaccinesScreen';
import { EvidenceScreen } from './components/EvidenceScreen';
import { DoctorChecklistModal } from './components/DoctorChecklistModal';
import { ClinicLocatorModal } from './components/ClinicLocatorModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('vaccines');

  // Modal states
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [clinicModalOpen, setClinicModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<PatientProfile>({
    ageBracket: '65plus',
    conditions: ['diabetes', 'asthma'],
    householdFactors: ['elderly_80'],
    residency: 'citizen',
    subsidyCard: 'chas_blue',
    enrolledHealthierSg: true,
  });
  const [activeRecommendations, setActiveRecommendations] = useState<VaccineRecommendation[]>([]);

  const handleOpenChecklist = (
    profile: PatientProfile,
    recommendations: VaccineRecommendation[]
  ) => {
    setActiveProfile(profile);
    setActiveRecommendations(recommendations);
    setChecklistModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Mobile/App Header */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto pt-2">
        {currentTab === 'home' && (
          <HomeScreen
            onNavigate={setCurrentTab}
            onOpenClinicFinder={() => setClinicModalOpen(true)}
          />
        )}

        {currentTab === 'guide' && (
          <GuideMeScreen
            onOpenChecklist={handleOpenChecklist}
            onOpenClinicFinder={() => setClinicModalOpen(true)}
          />
        )}

        {currentTab === 'vaccines' && (
          <VaccinesScreen
            onOpenClinicFinder={() => setClinicModalOpen(true)}
            onNavigateToGuide={() => setCurrentTab('guide')}
          />
        )}

        {currentTab === 'evidence' && <EvidenceScreen />}
      </main>

      {/* Doctor Discussion Checklist Modal */}
      <DoctorChecklistModal
        isOpen={checklistModalOpen}
        onClose={() => setChecklistModalOpen(false)}
        profile={activeProfile}
        recommendations={activeRecommendations}
      />

      {/* Polyclinic & CHAS Directory Modal */}
      <ClinicLocatorModal
        isOpen={clinicModalOpen}
        onClose={() => setClinicModalOpen(false)}
      />

      {/* Bottom Sticky Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}
