import React from 'react';
import { Home, Compass, Syringe, Database } from 'lucide-react';
import { ScreenTab } from '../types';

interface BottomNavProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as ScreenTab, label: 'Home', icon: Home },
    { id: 'guide' as ScreenTab, label: 'Guide Me', icon: Compass },
    { id: 'vaccines' as ScreenTab, label: 'Vaccines', icon: Syringe },
    { id: 'evidence' as ScreenTab, label: 'Sources & APIs', icon: Database },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-600 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-blue-50 text-blue-600 scale-110' : 'text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
