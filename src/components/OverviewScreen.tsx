import React from 'react';
import { 
  Compass, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Radar, 
  GitBranch, 
  Zap, 
  Bot, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  ChevronRight,
  Layers,
  Award,
  ExternalLink,
  Code2
} from 'lucide-react';
import { CandidateProfile, JobMatchResult, SkillGapAnalysisItem } from '../types';
import { calculateCareerReadiness, getBestNextSkill } from '../utils/matcher';
import { ScreenTab } from './Navigation';

interface OverviewScreenProps {
  candidate: CandidateProfile;
  jobMatches: JobMatchResult[];
  gapAnalysis: SkillGapAnalysisItem[];
  onSelectTab: (tab: ScreenTab) => void;
  onOpenAddSkill: (presetName?: string) => void;
  onSelectJob: (jobMatch: JobMatchResult) => void;
  onNavigateToWhatIf: (skillName: string) => void;
  recentlyVerifiedSkill?: string | null;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  candidate,
  jobMatches,
  gapAnalysis,
  onSelectTab,
  onOpenAddSkill,
  onSelectJob,
  onNavigateToWhatIf,
  recentlyVerifiedSkill,
}) => {
  const readiness = calculateCareerReadiness(candidate, jobMatches);
  const bestNextSkill = getBestNextSkill(candidate, gapAnalysis, jobMatches);
  const topJob = jobMatches[0];
  const verifiedSkills = candidate.skills.filter(s => s.verificationStatus === 'verified' || s.verificationStatus === 'supported');
  const unverifiedSkills = candidate.skills.filter(s => s.verificationStatus === 'unverified' || !s.verificationStatus);

  // Compute clean snapshot metrics
  const avgConfidence = Math.round(
    candidate.skills.reduce((acc, s) => acc + (s.confidence || 75), 0) / Math.max(1, candidate.skills.length)
  );
  const portfolioEvidenceScore = Math.round(
    (verifiedSkills.length / Math.max(1, candidate.skills.length)) * 100
  );
  const marketAlignmentScore = topJob?.overallScore || 85;

  return (
    <div id="overview-screen" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Skill Impact Alert Banner if recently verified */}
      {recentlyVerifiedSkill && (
        <div className="p-4 rounded-2xl bg-[#F0FDF4] dark:bg-[#052E16]/60 border border-[#86EFAC] dark:border-[#166534] shadow-xs flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#16A34A] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#166534] dark:text-[#86EFAC] flex items-center gap-1.5">
                <span>Skill Verified: {recentlyVerifiedSkill}</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] uppercase font-mono">
                  Career Twin Updated
                </span>
              </div>
              <p className="text-xs text-[#374151] dark:text-[#D1D5DB] mt-0.5">
                Target job fit increased to <strong className="text-[#16A34A]">{topJob?.overallScore}%</strong> • Composite Readiness reached <strong className="text-[#16A34A]">{readiness.jobReadiness}%</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('opportunities')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors shrink-0 shadow-2xs cursor-pointer"
          >
            View Opportunities
          </button>
        </div>
      )}

      {/* 1. Header Overview Bar: Welcome & Key Pillars */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Candidate Greeting */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
                Welcome back, {candidate.name.split(' ')[0]}
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2F6FED] dark:text-[#60A5FA] border border-[#BFDBFE] dark:border-[#334155] font-mono">
                Live Twin
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              {candidate.headline} • Evidence-backed career intelligence
            </p>
          </div>

          {/* 3 Core Overview Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
            
            {/* Metric A: Career Readiness */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex flex-col justify-center min-w-[140px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                Career Readiness
              </span>
              <div className="text-xl font-black text-[#2F6FED] dark:text-[#60A5FA] font-mono mt-0.5">
                {readiness.jobReadiness}%
              </div>
            </div>

            {/* Metric B: Top Opportunity */}
            <div 
              onClick={() => topJob && onSelectJob(topJob)}
              className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2F6FED]/50 transition-all cursor-pointer flex flex-col justify-center min-w-[150px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Top Opportunity
                </span>
                <span className="text-xs font-mono font-black text-[#16A34A] dark:text-[#86EFAC]">
                  {topJob?.overallScore || 91}%
                </span>
              </div>
              <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate mt-0.5">
                {topJob?.job.title || 'Frontend Engineer'}
              </div>
            </div>

            {/* Metric C: Best Next Skill */}
            <div 
              onClick={() => onOpenAddSkill(bestNextSkill.skill)}
              className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2F6FED]/50 transition-all cursor-pointer flex flex-col justify-center min-w-[140px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] dark:text-[#FDE68A]">
                  Best Next Skill
                </span>
                <span className="text-[9px] font-bold px-1 rounded bg-[#FEF3C7] dark:bg-[#78350F] text-[#D97706]">
                  HIGH
                </span>
              </div>
              <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate mt-0.5">
                {bestNextSkill.skill}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Career Snapshot 3-Metric Cards Grid */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-3 px-1">
          Career Snapshot
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Snapshot A: Skill Confidence */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">Skill Confidence</span>
              <span className="font-mono font-black text-xl text-[#0F172A] dark:text-[#F8FAFC]">
                {avgConfidence}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E2E8F0] dark:bg-[#334155] overflow-hidden">
              <div className="h-full rounded-full bg-[#2F6FED]" style={{ width: `${avgConfidence}%` }} />
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              AST & static code analysis confidence across {candidate.skills.length} skills.
            </p>
          </div>

          {/* Snapshot B: Market Alignment */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">Market Alignment</span>
              <span className="font-mono font-black text-xl text-[#16A34A] dark:text-[#86EFAC]">
                {marketAlignmentScore}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E2E8F0] dark:bg-[#334155] overflow-hidden">
              <div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${marketAlignmentScore}%` }} />
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Deterministic fit for target Frontend and Full Stack software roles.
            </p>
          </div>

          {/* Snapshot C: Portfolio Evidence */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">Portfolio Evidence</span>
              <span className="font-mono font-black text-xl text-[#0D9488] dark:text-[#2DD4BF]">
                {portfolioEvidenceScore}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E2E8F0] dark:bg-[#334155] overflow-hidden">
              <div className="h-full rounded-full bg-[#0D9488]" style={{ width: `${portfolioEvidenceScore}%` }} />
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              {verifiedSkills.length} of {candidate.skills.length} skills supported with code, PR, or test proofs.
            </p>
          </div>

        </div>
      </div>

      {/* 3. Recommended Action Banner & Action Plan */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2F6FED] dark:text-[#60A5FA] flex items-center justify-center shrink-0 border border-[#BFDBFE] dark:border-[#334155]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2F6FED] dark:text-[#60A5FA]">
                  Recommended Strategic Action
                </span>
              </div>
              <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Verify {bestNextSkill.skill} evidence & close high-leverage gap
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateToWhatIf(bestNextSkill.skill)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0D9488] dark:text-[#2DD4BF] bg-[#F0FDFA] dark:bg-[#042F2E] hover:bg-[#CCFBF1] transition-colors cursor-pointer"
            >
              Simulate in What-If
            </button>
            <button
              onClick={() => onOpenAddSkill(bestNextSkill.skill)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all cursor-pointer shadow-2xs"
            >
              Review / Prove Evidence
            </button>
          </div>
        </div>

        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
          {bestNextSkill.tagline}
        </p>

        {/* 2-Column Key Reasons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {bestNextSkill.reasons.slice(0, 2).map((reason, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <span className="text-[#334155] dark:text-[#CBD5E1]">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Two-Column Dashboard Section: Left Top Job Deep Dive, Right Quick Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 Columns): Target Job Fit Breakdown */}
        {topJob && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Radar className="w-4 h-4 text-[#2F6FED]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Primary Target Role Breakdown
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC] uppercase font-mono">
                {topJob.tier}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">{topJob.job.title}</h3>
                <p className="text-xs text-[#2F6FED] dark:text-[#60A5FA] font-semibold">{topJob.job.company || topJob.job.companyTier} • {topJob.job.location}</p>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono mt-0.5">{topJob.job.salaryRange}</p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-[#16A34A] dark:text-[#86EFAC] font-mono">
                  {topJob.overallScore}%
                </div>
                <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Deterministic Fit</span>
              </div>
            </div>

            {/* Matched vs Missing Skills list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#F0FDF4] dark:bg-[#052E16]/40 border border-[#DCFCE7] dark:border-[#166534]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] dark:text-[#86EFAC] block mb-1">
                  Verified Matched ({topJob.matchedSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {topJob.matchedSkills.map((s, i) => (
                    <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-[#0F172A] text-[#166534] dark:text-[#86EFAC] border border-[#86EFAC]/40">
                      {s.skillName}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FEF2F2] dark:bg-[#450A0A]/40 border border-[#FEE2E2] dark:border-[#991B1B]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#991B1B] dark:text-[#FCA5A5] block mb-1">
                  Remaining Gaps ({topJob.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {topJob.missingSkills.map((s, i) => (
                    <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-[#0F172A] text-[#991B1B] dark:text-[#FCA5A5] border border-[#FCA5A5]/40">
                      {s.skillName}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onSelectJob(topJob)}
                className="text-xs font-bold text-[#2F6FED] dark:text-[#60A5FA] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Comprehensive Match Factors</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Right (1 Column): Quick Destination Portals */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] block">
              Direct Workspaces
            </span>

            <button
              onClick={() => onSelectTab('profile')}
              className="w-full p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2F6FED]/40 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#2F6FED] flex items-center justify-between">
                <span>Profile & Evidence</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                {verifiedSkills.length} verified skills, code repositories, credentials
              </p>
            </button>

            <button
              onClick={() => onSelectTab('opportunities')}
              className="w-full p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2F6FED]/40 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#2F6FED] flex items-center justify-between">
                <span>Opportunities Radar</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                {jobMatches.length} seeded roles ranked with deterministic scoring
              </p>
            </button>

            <button
              onClick={() => onSelectTab('career-path')}
              className="w-full p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2F6FED]/40 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#2F6FED] flex items-center justify-between">
                <span>Career Path Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                Multi-step milestone pathway and prioritized skill gaps
              </p>
            </button>

            <button
              onClick={() => onSelectTab('whatif')}
              className="w-full p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#0D9488]/40 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#0D9488] flex items-center justify-between">
                <span>What-If Simulator</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                Non-destructive sandbox to test learning new skills
              </p>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
