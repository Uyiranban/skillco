import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  User, 
  Radar, 
  GitBranch, 
  Zap, 
  Bot, 
  RefreshCw, 
  ShieldCheck, 
  Plus,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Layers,
  Cpu,
  FileCheck2,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { CandidateProfile } from '../types';

export type ScreenTab = 
  | 'overview' 
  | 'career-twin' 
  | 'opportunities' 
  | 'skill-gap' 
  | 'career-path' 
  | 'whatif' 
  | 'strategist' 
  | 'profile' 
  | 'evidence' 
  | 'settings';

interface NavigationProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  candidate: CandidateProfile;
  onResetDemo: () => void;
  onOpenAddSkill: () => void;
  onOpenSettings?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  candidate,
  onResetDemo,
  onOpenAddSkill,
  onOpenSettings,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const mobileMoreRef = useRef<HTMLDivElement>(null);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
      if (mobileMoreRef.current && !mobileMoreRef.current.contains(event.target as Node)) {
        setIsMobileMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const verifiedCount = candidate.skills.filter(
    s => s.verificationStatus === 'verified' || s.verificationStatus === 'supported'
  ).length;

  // Primary navigation items (Desktop & Large screens)
  const primaryNav = [
    { id: 'overview' as ScreenTab, label: 'Overview', icon: Compass },
    { id: 'career-twin' as ScreenTab, label: 'Career Twin', icon: Cpu, badge: `${verifiedCount}v` },
    { id: 'opportunities' as ScreenTab, label: 'Opportunities', icon: Radar },
    { id: 'skill-gap' as ScreenTab, label: 'Skill Gap', icon: Layers },
    { id: 'career-path' as ScreenTab, label: 'Career Path', icon: GitBranch },
    { id: 'whatif' as ScreenTab, label: 'What-If', icon: Zap },
    { id: 'strategist' as ScreenTab, label: 'AI Strategist', icon: Bot },
  ];

  // Secondary navigation items (Desktop & Drawer)
  const secondaryNav = [
    { id: 'profile' as ScreenTab, label: 'Profile', icon: User },
    { id: 'evidence' as ScreenTab, label: 'Evidence Center', icon: FileCheck2 },
  ];

  // Mobile primary 5 destinations
  const mobileNav = [
    { id: 'overview' as ScreenTab, label: 'Overview', icon: Compass },
    { id: 'career-twin' as ScreenTab, label: 'Twin', icon: Cpu },
    { id: 'opportunities' as ScreenTab, label: 'Jobs', icon: Radar },
    { id: 'career-path' as ScreenTab, label: 'Path', icon: GitBranch },
    { id: 'strategist' as ScreenTab, label: 'AI', icon: Bot },
  ];

  const handleTabClick = (tab: ScreenTab) => {
    onSelectTab(tab);
    setIsMoreOpen(false);
    setIsMobileMoreOpen(false);
  };

  return (
    <>
      {/* Top Desktop & Laptop Application Shell Header */}
      <header 
        id="app-header" 
        className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] dark:border-[#1E293B] bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Brand Identity */}
            <div 
              id="brand-logo"
              className="flex items-center gap-2.5 cursor-pointer select-none shrink-0" 
              onClick={() => handleTabClick('overview')}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#2F6FED] text-white shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                    Skill<span className="text-[#2F6FED] dark:text-[#4F8CFF]">Pilot</span>
                  </span>
                  <span className="hidden xl:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2F6FED] dark:text-[#60A5FA] border border-[#BFDBFE] dark:border-[#334155] font-mono">
                    Career Intelligence
                  </span>
                </div>
              </div>
            </div>

            {/* Center / Left: Primary Navigation (Desktop full tabs, Laptop responsive overflow) */}
            <nav id="desktop-nav" className="hidden lg:flex items-center gap-1">
              
              {/* Primary Tabs */}
              {primaryNav.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2F6FED] dark:text-[#60A5FA] shadow-2xs border border-[#BFDBFE] dark:border-[#334155]'
                        : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2F6FED] dark:text-[#60A5FA]' : 'text-[#64748B] dark:text-[#94A3B8]'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white dark:bg-[#0F172A] text-[#2F6FED] dark:text-[#60A5FA] border border-[#BFDBFE] dark:border-[#334155]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

            </nav>

            {/* Right: Secondary Nav (Profile, Evidence, Settings, Prove Skill, Theme) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              
              {/* Prove Skill Primary Action */}
              <button
                id="btn-nav-add-skill"
                onClick={onOpenAddSkill}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                title="Add and Prove a Skill with Evidence"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Prove Skill</span>
              </button>

              {/* Secondary Navigation Menu / More for desktop */}
              <div className="relative hidden md:block" ref={moreRef}>
                <button
                  id="btn-nav-more"
                  onClick={() => setIsMoreOpen(prev => !prev)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    currentTab === 'profile' || currentTab === 'evidence' || isMoreOpen
                      ? 'bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2F6FED] dark:text-[#60A5FA] border-[#BFDBFE] dark:border-[#334155]'
                      : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#1E293B]'
                  }`}
                  title="Secondary views and options"
                >
                  <span>More</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isMoreOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                      Secondary Views
                    </div>
                    {secondaryNav.map(item => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
                            currentTab === item.id
                              ? 'bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2F6FED] dark:text-[#60A5FA]'
                              : 'text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-[#2F6FED]" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                    <div className="border-t border-[#E2E8F0] dark:border-[#1E293B] my-1" />
                    <button
                      onClick={() => {
                        setIsMoreOpen(false);
                        if (onOpenSettings) onOpenSettings();
                        else onSelectTab('settings');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Settings & Environment</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Theme Toggle Button */}
              {onToggleDarkMode && (
                <button
                  id="btn-theme-toggle"
                  onClick={onToggleDarkMode}
                  className="p-2 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] transition-colors cursor-pointer shadow-2xs"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  aria-label="Toggle Theme"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-[#D97706]" /> : <Moon className="w-4 h-4 text-[#2F6FED]" />}
                </button>
              )}

              {/* Profile Avatar / Quick Link */}
              <div 
                id="btn-nav-avatar"
                onClick={() => handleTabClick('profile')}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#2F6FED]/50 cursor-pointer transition-all shadow-2xs select-none"
              >
                <div className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-[10px] font-black">
                  AM
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-tight flex items-center gap-1">
                    <span>{candidate.name.split(' ')[0]}</span>
                    <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* SINGLE Global Mobile Bottom Navigation Bar (Rendered ONCE across application) */}
      <nav 
        id="global-mobile-bottom-nav" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md border-t border-[#E2E8F0] dark:border-[#1E293B] px-2 py-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-lg transition-colors"
      >
        {mobileNav.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'text-[#2F6FED] dark:text-[#4F8CFF] bg-[#EFF6FF] dark:bg-[#1E293B]/80 font-bold'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 mb-0.5 ${isActive ? 'text-[#2F6FED] dark:text-[#4F8CFF]' : 'text-[#64748B] dark:text-[#94A3B8]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Mobile More Button to access Skill Gap, What-If, Profile, Evidence, Settings */}
        <div className="relative" ref={mobileMoreRef}>
          <button
            id="mobile-nav-more"
            onClick={() => setIsMobileMoreOpen(prev => !prev)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
              ['skill-gap', 'whatif', 'profile', 'evidence', 'settings'].includes(currentTab) || isMobileMoreOpen
                ? 'text-[#2F6FED] dark:text-[#4F8CFF] bg-[#EFF6FF] dark:bg-[#1E293B]/80 font-bold'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            <MoreHorizontal className="w-4.5 h-4.5 mb-0.5" />
            <span>More</span>
          </button>

          {isMobileMoreOpen && (
            <div className="absolute right-0 bottom-12 mb-2 w-48 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                onClick={() => handleTabClick('skill-gap')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-left ${
                  currentTab === 'skill-gap' ? 'text-[#2F6FED] bg-[#EFF6FF] dark:bg-[#1E293B]' : 'text-[#334155] dark:text-[#CBD5E1]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#2F6FED]" />
                <span>Skill Gap</span>
              </button>
              <button
                onClick={() => handleTabClick('whatif')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-left ${
                  currentTab === 'whatif' ? 'text-[#2F6FED] bg-[#EFF6FF] dark:bg-[#1E293B]' : 'text-[#334155] dark:text-[#CBD5E1]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>What-If Simulator</span>
              </button>
              <button
                onClick={() => handleTabClick('profile')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-left ${
                  currentTab === 'profile' ? 'text-[#2F6FED] bg-[#EFF6FF] dark:bg-[#1E293B]' : 'text-[#334155] dark:text-[#CBD5E1]'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#2F6FED]" />
                <span>Candidate Profile</span>
              </button>
              <button
                onClick={() => handleTabClick('evidence')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-left ${
                  currentTab === 'evidence' ? 'text-[#2F6FED] bg-[#EFF6FF] dark:bg-[#1E293B]' : 'text-[#334155] dark:text-[#CBD5E1]'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Evidence Center</span>
              </button>
              <div className="border-t border-[#E2E8F0] dark:border-[#1E293B] my-1" />
              <button
                onClick={() => {
                  setIsMobileMoreOpen(false);
                  if (onOpenSettings) onOpenSettings();
                  else onSelectTab('settings');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#334155] dark:text-[#CBD5E1]"
              >
                <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Settings & Status</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
