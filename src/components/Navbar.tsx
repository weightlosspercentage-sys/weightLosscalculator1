import React from 'react';
import { Unit } from '../types';
import { Scale, TrendingDown, Target, LineChart, Users, BookOpen, Printer } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unit: Unit;
  setUnit: (u: Unit) => void;
  onOpenReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unit,
  setUnit,
  onOpenReport,
}) => {
  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Scale },
    { id: 'milestones', label: 'Milestones (5%-20%)', icon: Target },
    { id: 'history', label: 'Weight Log & Chart', icon: LineChart },
    { id: 'challenge', label: 'Group Challenge', icon: Users },
    { id: 'guide', label: 'Formula & Science', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div 
            onClick={() => setActiveTab('calculator')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200 group-hover:scale-105 transition-transform">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight block leading-tight">
                Weight Loss <span className="text-emerald-600">%</span> Calculator
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Percentage Progress & Clinical Milestones
              </span>
            </div>
          </div>

          {/* Unit Toggle & Print */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Unit selector pill */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/80 text-xs sm:text-sm font-medium">
              <button
                type="button"
                onClick={() => setUnit('lbs')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  unit === 'lbs'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pounds (lbs)
              </button>
              <button
                type="button"
                onClick={() => setUnit('kg')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  unit === 'kg'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kilograms (kg)
              </button>
              <button
                type="button"
                onClick={() => setUnit('st')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  unit === 'st'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Stones & lbs
              </button>
            </div>

            {/* Print / Report button */}
            <button
              type="button"
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs sm:text-sm font-medium transition-colors"
              title="Print Summary Report"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Print Report</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
