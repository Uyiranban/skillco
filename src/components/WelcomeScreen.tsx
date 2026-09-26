import React from 'react';
import { 
  Compass, 
  ArrowRight, 
  Radar, 
  Layers, 
  Zap, 
  TrendingUp, 
  ShieldCheck,
  Bot
} from 'lucide-react';
import { CandidateProfile, JobMatchResult } from '../types';

interface WelcomeScreenProps {
  candidate: CandidateProfile;
  topMatch?: JobMatchResult;
  onExplore: (tab: 'twin' | 'radar' | 'gap' | 'upskill' | 'whatif' | 'strategist') => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  candidate,
  topMatch,
  onExplore,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-6">
      
      {/* Header Snapshot */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF] text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Overview & Readiness Snapshot</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
            Welcome back, {candidate.name.split(' ')[0]}
          </h1>

          <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] max-w-xl">
            {candidate.education.degree} • Stanford Class of 2026. Your profile is evaluated across 10 deterministic market benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => onExplore('radar')}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>View 10 Job Matches</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onExplore('whatif')}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-[#172033] dark:text-[#F8FAFC] bg-[#F8FAFC] dark:bg-[#16243A] hover:bg-[#EBF3FF] dark:hover:bg-[#1E2E48] border border-[#E4E9F0] dark:border-[#263750] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span>Simulate Skill Uplift</span>
          </button>
        </div>
      </div>

      {/* 3 Core Metric Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div 
          onClick={() => onExplore('radar')}
          className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] hover:border-[#2F6FED]/50 transition-all cursor-pointer shadow-2xs space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-[#667085] dark:text-[#94A3B8] font-medium">
            <span>Top Role Match</span>
            <Radar className="w-4 h-4 text-[#2F6FED]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#2F6FED] dark:text-[#4F8CFF]">
            {topMatch?.overallScore || 91}% Fit
          </div>
          <div className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC]">
            {topMatch?.job.title || 'Frontend Engineer'}
          </div>
          <div className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
            Top 5% fit based on verified React & JavaScript depth.
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onExplore('gap')}
          className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] hover:border-[#14B8A6]/50 transition-all cursor-pointer shadow-2xs space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-[#667085] dark:text-[#94A3B8] font-medium">
            <span>Best Next Skill</span>
            <Layers className="w-4 h-4 text-[#14B8A6]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#14B8A6]">
            TypeScript
          </div>
          <div className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC]">
            +4% Algorithmic Uplift
          </div>
          <div className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
            Unlocks +12 openings with 2-3 weeks estimated effort.
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onExplore('twin')}
          className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] hover:border-[#2F6FED]/50 transition-all cursor-pointer shadow-2xs space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-[#667085] dark:text-[#94A3B8] font-medium">
            <span>Verified Skills</span>
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#16A34A]">
            8 Verified
          </div>
          <div className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC]">
            94% Confidence Average
          </div>
          <div className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
            Triangulated with GitHub commits and code artifacts.
          </div>
        </div>

      </div>

      {/* Direct Module Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => onExplore('twin')}
          className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] hover:border-[#2F6FED]/40 transition-all cursor-pointer shadow-2xs space-y-1.5"
        >
          <div className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center justify-between">
            <span>Career Twin</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2F6FED]" />
          </div>
          <p className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
            Inspect verified skills, project evidence, and candidate readiness.
          </p>
        </div>

        <div 
          onClick={() => onExplore('radar')}
          className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] hover:border-[#2F6FED]/40 transition-all cursor-pointer shadow-2xs space-y-1.5"
        >
          <div className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center justify-between">
            <span>Opportunity Radar</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2F6FED]" />
          </div>
          <p className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
            10 roles scored by transparent 6-factor deterministic fit.
          </p>
        </div>

        <div 
          onClick={() => onExplore('gap')}
          className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] hover:border-[#2F6FED]/40 transition-all cursor-pointer shadow-2xs space-y-1.5"
        >
          <div className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center justify-between">
            <span>Skill Gap & Path</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2F6FED]" />
          </div>
          <p className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
            Identify critical requirements blocking qualification for senior roles.
          </p>
        </div>

        <div 
          onClick={() => onExplore('whatif')}
          className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] hover:border-[#2F6FED]/40 transition-all cursor-pointer shadow-2xs space-y-1.5"
        >
          <div className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center justify-between">
            <span>What-If Simulator</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#14B8A6]" />
          </div>
          <p className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
            Simulate how acquiring a skill increases match rate and salary.
          </p>
        </div>

      </div>

    </div>
  );
};
