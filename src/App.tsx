import React, { useState, useEffect } from 'react';
import { 
  CandidateProfile, 
  SkillItem, 
  SkillEvidenceItem, 
  JobMatchResult, 
  SkillGapAnalysisItem,
  JobProfile
} from './types';
import { DEMO_CANDIDATE, SEEDED_JOBS } from './data/seedData';
import { matchAllJobs, computeSkillGapAnalysis } from './utils/matcher';
import { Navigation, ScreenTab } from './components/Navigation';
import { OverviewScreen } from './components/OverviewScreen';
import { CareerTwinScreen } from './components/CareerTwinScreen';
import { OpportunitiesScreen } from './components/OpportunitiesScreen';
import { SkillGapScreen } from './components/SkillGapScreen';
import { CareerPathScreen } from './components/CareerPathScreen';
import { WhatIfSimulatorScreen } from './components/WhatIfSimulatorScreen';
import { AIStrategistScreen } from './components/AIStrategistScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AddSkillModal } from './components/AddSkillModal';
import { EvidenceDetailModal } from './components/EvidenceDetailModal';
import { JobMatchDetailModal } from './components/JobMatchDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { Bot } from 'lucide-react';

const CANDIDATE_STORAGE_KEY = 'skillpilot_candidate_state_v2';
const THEME_STORAGE_KEY = 'skillpilot_theme_mode';

export function App() {
  // Theme state persisted in localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDarkMode]);

  // Primary Candidate Profile State persisted locally with baseline fallback
  const [candidate, setCandidate] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem(CANDIDATE_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse candidate profile state:', e);
      }
    }
    return DEMO_CANDIDATE;
  });

  // Persist candidate profile updates
  useEffect(() => {
    localStorage.setItem(CANDIDATE_STORAGE_KEY, JSON.stringify(candidate));
  }, [candidate]);

  // Router / Screen Tab State
  const [currentTab, setCurrentTab] = useState<ScreenTab>('overview');

  // Modals & Inspectors
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [addSkillInitialName, setAddSkillInitialName] = useState<string>('');
  const [inspectingSkill, setInspectingSkill] = useState<SkillItem | null>(null);
  const [selectedJobMatch, setSelectedJobMatch] = useState<JobMatchResult | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Parameterized Simulator Target Skill
  const [whatIfTargetSkill, setWhatIfTargetSkill] = useState<string>('TypeScript');

  // Recently verified skill for visual feedback banner
  const [recentlyVerifiedSkill, setRecentlyVerifiedSkill] = useState<string | null>(null);

  // Compute live multi-dimensional job matching using 6-factor algorithm
  const jobMatches: JobMatchResult[] = matchAllJobs(candidate, SEEDED_JOBS);

  // Compute live skill gap analysis
  const gapAnalysis: SkillGapAnalysisItem[] = computeSkillGapAnalysis(candidate, jobMatches);

  const handleResetDemo = () => {
    setCandidate(DEMO_CANDIDATE);
    localStorage.removeItem(CANDIDATE_STORAGE_KEY);
    setRecentlyVerifiedSkill(null);
  };

  const handleOpenAddSkill = (skillName?: string) => {
    setAddSkillInitialName(skillName || '');
    setIsAddSkillOpen(true);
  };

  const handleAddSkillWithEvidence = (newSkill: SkillItem, evidence: SkillEvidenceItem) => {
    setCandidate(prev => {
      const existingSkillIndex = prev.skills.findIndex(
        s => s.name.toLowerCase() === newSkill.name.toLowerCase()
      );

      let updatedSkills: SkillItem[];

      if (existingSkillIndex >= 0) {
        // Update existing skill
        updatedSkills = [...prev.skills];
        const existing = updatedSkills[existingSkillIndex];
        const existingEvidenceItems = existing.evidenceItems || [];

        updatedSkills[existingSkillIndex] = {
          ...existing,
          level: newSkill.level,
          confidence: Math.max(existing.confidence, newSkill.confidence),
          verificationStatus: newSkill.verificationStatus,
          status: newSkill.status,
          evidence: {
            ...existing.evidence,
            ...newSkill.evidence,
          },
          evidenceItems: [...existingEvidenceItems, evidence],
        };
      } else {
        // Add newly verified/supported skill
        const skillWithEvidence: SkillItem = {
          ...newSkill,
          evidenceItems: [evidence],
        };
        updatedSkills = [...prev.skills, skillWithEvidence];
      }

      return {
        ...prev,
        skills: updatedSkills,
      };
    });

    setRecentlyVerifiedSkill(newSkill.name);
  };

  const handleNavigateToWhatIf = (skillName?: string) => {
    if (skillName) {
      setWhatIfTargetSkill(skillName);
    }
    setCurrentTab('whatif');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans antialiased transition-colors">
      
      {/* Top Application Shell Navigation & Global Mobile Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        candidate={candidate}
        onResetDemo={handleResetDemo}
        onOpenAddSkill={() => handleOpenAddSkill()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />

      {/* Main Screen Router with safe padding on mobile */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        
        {/* 1. Overview Screen */}
        {currentTab === 'overview' && (
          <OverviewScreen
            candidate={candidate}
            jobMatches={jobMatches}
            gapAnalysis={gapAnalysis}
            onSelectTab={setCurrentTab}
            onOpenAddSkill={handleOpenAddSkill}
            onSelectJob={(match) => setSelectedJobMatch(match)}
            onNavigateToWhatIf={handleNavigateToWhatIf}
            recentlyVerifiedSkill={recentlyVerifiedSkill}
          />
        )}

        {/* 2. Career Twin Screen */}
        {currentTab === 'career-twin' && (
          <CareerTwinScreen
            candidate={candidate}
            onNavigateToRadar={() => setCurrentTab('opportunities')}
            onNavigateToWhatIf={() => handleNavigateToWhatIf()}
            onOpenSkillValidation={(skillName) => handleOpenAddSkill(skillName)}
          />
        )}

        {/* 3. Opportunities Screen */}
        {currentTab === 'opportunities' && (
          <OpportunitiesScreen
            jobMatches={jobMatches}
            onSelectJob={(match) => setSelectedJobMatch(match)}
            onProveSkill={(skillName) => handleOpenAddSkill(skillName)}
          />
        )}

        {/* 4. Skill Gap Screen */}
        {currentTab === 'skill-gap' && (
          <SkillGapScreen
            candidate={candidate}
            gapItems={gapAnalysis}
            onNavigateToWhatIf={handleNavigateToWhatIf}
            onNavigateToUpskill={() => setCurrentTab('career-path')}
          />
        )}

        {/* 5. Career Path Screen */}
        {currentTab === 'career-path' && (
          <CareerPathScreen
            candidate={candidate}
            jobMatches={jobMatches}
            gapAnalysis={gapAnalysis}
            onOpenAddSkill={handleOpenAddSkill}
            onNavigateToWhatIf={handleNavigateToWhatIf}
          />
        )}

        {/* 6. What-If Simulator Screen */}
        {currentTab === 'whatif' && (
          <WhatIfSimulatorScreen
            candidate={candidate}
            onOpenAddSkill={handleOpenAddSkill}
            initialSimulatedSkill={whatIfTargetSkill}
          />
        )}

        {/* 7. AI Strategist Screen */}
        {currentTab === 'strategist' && (
          <AIStrategistScreen
            candidate={candidate}
            jobMatches={jobMatches}
            gapAnalysis={gapAnalysis}
            onSelectTab={setCurrentTab}
            onOpenAddSkill={handleOpenAddSkill}
            onSelectJob={(match) => setSelectedJobMatch(match)}
            onNavigateToWhatIf={handleNavigateToWhatIf}
          />
        )}

        {/* 8. Profile Screen */}
        {currentTab === 'profile' && (
          <ProfileScreen
            candidate={candidate}
            onOpenAddSkill={handleOpenAddSkill}
            onOpenEvidenceDetail={(skill) => setInspectingSkill(skill)}
            onNavigateToWhatIf={handleNavigateToWhatIf}
            onNavigateToOpportunities={() => setCurrentTab('opportunities')}
          />
        )}

        {/* 9. Evidence Center (Profile verification tab view) */}
        {currentTab === 'evidence' && (
          <ProfileScreen
            candidate={candidate}
            onOpenAddSkill={handleOpenAddSkill}
            onOpenEvidenceDetail={(skill) => setInspectingSkill(skill)}
            onNavigateToWhatIf={handleNavigateToWhatIf}
            onNavigateToOpportunities={() => setCurrentTab('opportunities')}
          />
        )}

      </main>

      {/* Add Skill & Evidence Review Modal */}
      {isAddSkillOpen && (
        <AddSkillModal
          isOpen={isAddSkillOpen}
          onClose={() => setIsAddSkillOpen(false)}
          onAddSkillWithEvidence={handleAddSkillWithEvidence}
          initialSkillName={addSkillInitialName}
        />
      )}

      {/* Skill Evidence Detail Modal */}
      {inspectingSkill && (
        <EvidenceDetailModal
          skill={inspectingSkill}
          onClose={() => setInspectingSkill(null)}
          onAddMoreEvidence={(name) => {
            setInspectingSkill(null);
            handleOpenAddSkill(name);
          }}
        />
      )}

      {/* Job Match Detail Modal */}
      {selectedJobMatch && (
        <JobMatchDetailModal
          jobMatch={selectedJobMatch}
          candidate={candidate}
          onClose={() => setSelectedJobMatch(null)}
          onNavigateToWhatIf={handleNavigateToWhatIf}
          onNavigateToSkillGap={() => {
            setSelectedJobMatch(null);
            setCurrentTab('skill-gap');
          }}
        />
      )}

      {/* Platform Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        onResetDemo={handleResetDemo}
      />

      {/* Desktop/Tablet Floating AI Strategist Quick Launcher (Hidden on mobile and hidden on strategist tab) */}
      {currentTab !== 'strategist' && (
        <button
          onClick={() => setCurrentTab('strategist')}
          className="hidden md:flex fixed bottom-6 right-6 z-30 px-4 py-2.5 rounded-full bg-[#2F6FED] hover:bg-[#2557BD] text-white font-bold text-xs shadow-lg items-center gap-2 cursor-pointer transition-all hover:scale-105"
          title="Ask AI Career Strategist"
        >
          <Bot className="w-4 h-4" />
          <span>AI Strategist</span>
        </button>
      )}

      {/* Desktop Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onResetDemo={handleResetDemo}
      />

    </div>
  );
}
export default App;
