import React from 'react';
import { Compass } from 'lucide-react';
import { ScreenTab } from './Navigation';

interface FooterProps {
  onSelectTab: (tab: ScreenTab) => void;
  onResetDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onResetDemo }) => {
  return (
    <footer className="hidden md:block w-full border-t border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0B1220] py-6 px-4 sm:px-6 lg:px-8 mt-12 text-[#64748B] dark:text-[#94A3B8] transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        <div className="flex items-center gap-2 text-[#0F172A] dark:text-[#F8FAFC] font-bold">
          <Compass className="w-4 h-4 text-[#2F6FED] dark:text-[#4F8CFF]" />
          <span>SkillPilot</span>
          <span className="text-[#64748B] dark:text-[#94A3B8] font-normal">• Career Intelligence Platform</span>
        </div>

        <div className="flex items-center gap-5 flex-wrap text-[#64748B] dark:text-[#94A3B8] font-semibold">
          <button onClick={() => onSelectTab('overview')} className="hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer">
            Overview
          </button>
          <button onClick={() => onSelectTab('profile')} className="hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer">
            Profile
          </button>
          <button onClick={() => onSelectTab('opportunities')} className="hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer">
            Opportunities
          </button>
          <button onClick={() => onSelectTab('career-path')} className="hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer">
            Career Path
          </button>
          <button onClick={() => onSelectTab('whatif')} className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer">
            What-If
          </button>
          <button onClick={() => onSelectTab('strategist')} className="text-[#2F6FED] dark:text-[#4F8CFF] hover:underline transition-colors cursor-pointer">
            AI Strategist
          </button>
        </div>

      </div>
    </footer>
  );
};
