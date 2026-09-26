import React from 'react';
import { 
  GitBranch, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  BookOpen, 
  Code2, 
  Layers,
  Zap,
  TrendingUp
} from 'lucide-react';
import { CandidateProfile, JobMatchResult, SkillGapAnalysisItem } from '../types';
import { getBestNextSkill, getDynamicRoadmap } from '../utils/matcher';

interface CareerPathScreenProps {
  candidate: CandidateProfile;
  jobMatches: JobMatchResult[];
  gapAnalysis: SkillGapAnalysisItem[];
  onOpenAddSkill: (skillName?: string) => void;
  onNavigateToWhatIf: (skillName: string) => void;
}

export const CareerPathScreen: React.FC<CareerPathScreenProps> = ({
  candidate,
  jobMatches,
  gapAnalysis,
  onOpenAddSkill,
  onNavigateToWhatIf,
}) => {
  const bestNextSkill = getBestNextSkill(candidate, gapAnalysis, jobMatches);
  const roadmap = getDynamicRoadmap(candidate);

  return (
    <div id="career-path-screen" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-[#2F6FED]" />
              Career Path & Dynamic Skill Gaps
            </h1>
            <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
              Automated skill gap closure pathway tailored to your target software engineering roles.
            </p>
          </div>

          <button
            onClick={() => onOpenAddSkill()}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <span>Add / Prove Skill</span>
          </button>
        </div>
      </div>

      {/* Best Next Skill Recommendation Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D97706] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] dark:text-[#FDE68A]">
                  AI Strategist Highest Leverage Move
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#FEF3C7] dark:bg-[#78350F] text-[#D97706] dark:text-[#FDE68A]">
                  {bestNextSkill.priority} PRIORITY
                </span>
              </div>
              <h2 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
                {bestNextSkill.skill}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateToWhatIf(bestNextSkill.skill)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#14B8A6] bg-[#F0FDFA] dark:bg-[#042F2E] hover:bg-[#CCFBF1] transition-colors cursor-pointer"
            >
              Simulate in What-If
            </button>
            <button
              onClick={() => onOpenAddSkill(bestNextSkill.skill)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all cursor-pointer shadow-xs"
            >
              Prove {bestNextSkill.skill} Now
            </button>
          </div>
        </div>

        <p className="text-xs text-[#4B5563] dark:text-[#94A3B8]">
          {bestNextSkill.tagline}
        </p>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {bestNextSkill.reasons.map((reason, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <span className="text-[#374151] dark:text-[#D1D5DB]">{reason}</span>
            </div>
          ))}
        </div>

        {/* Impact on Matches Table */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8] block">
            Projected Match Score Increase:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {bestNextSkill.impactOnTopMatches.map((m, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-white dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] text-center">
                <span className="text-[10px] text-[#667085] dark:text-[#94A3B8] block truncate">{m.roleTitle}</span>
                <span className="font-mono font-bold text-[#16A34A] dark:text-[#86EFAC]">
                  {m.beforeScore}% → {m.afterScore}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Skill Gaps Across Target Roles */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#172033] dark:text-[#F8FAFC]">
              Identified Skill Gaps ({gapAnalysis.length})
            </h2>
            <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
              Skills preventing 95%+ match across your top target roles.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#16A34A] dark:text-[#86EFAC]">
            Dynamic Live Gap Detection
          </span>
        </div>

        <div className="divide-y divide-[#E4E9F0] dark:divide-[#263750]">
          {gapAnalysis.map((gap) => (
            <div key={gap.skill} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#172033] dark:text-[#F8FAFC]">{gap.skill}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    gap.importance === 'Critical' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}>
                    {gap.importance}
                  </span>
                  <span className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
                    Demand: {gap.marketDemand}
                  </span>
                </div>
                <div className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
                  Impacts: <span className="font-medium text-[#172033] dark:text-[#F8FAFC]">{gap.rolesImpacted.join(', ')}</span> • Est. Effort: {gap.effortWeeks}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => onNavigateToWhatIf(gap.skill)}
                  className="px-3 py-1 rounded-lg text-xs font-medium text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-colors cursor-pointer"
                >
                  Simulate
                </button>
                <button
                  onClick={() => onOpenAddSkill(gap.skill)}
                  className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all cursor-pointer shadow-2xs"
                >
                  Prove Skill
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic 5-Step Learning Roadmap */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
            Personalized 5-Step Upskilling Roadmap
          </h2>
          <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
            Curated sequence of milestones and vetted learning modules designed to systematically close each gap.
          </p>
        </div>

        <div className="space-y-4">
          {roadmap.map((step) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';

            return (
              <div
                key={step.id}
                id={`roadmap-step-${step.stepNumber}`}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-[#F0FDF4] dark:bg-[#052E16]/30 border-[#86EFAC] dark:border-[#166534]'
                    : isActive
                    ? 'bg-white dark:bg-[#0F172A] border-[#2F6FED] shadow-xs ring-2 ring-[#2F6FED]/20'
                    : 'bg-[#F8FAFC] dark:bg-[#111C2E] border-[#E4E9F0] dark:border-[#263750] opacity-80'
                }`}
              >
                {/* Step Header */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isCompleted
                        ? 'bg-[#16A34A] text-white'
                        : isActive
                        ? 'bg-[#2F6FED] text-white'
                        : 'bg-[#E4E9F0] dark:bg-[#1E293B] text-[#667085] dark:text-[#94A3B8]'
                    }`}>
                      {isCompleted ? '✓' : step.stepNumber}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">
                        Step {step.stepNumber}: {step.skill}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC]'
                        : isActive
                        ? 'bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF]'
                        : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#667085] dark:text-[#94A3B8]'
                    }`}>
                      {step.status}
                    </span>

                    {isActive && (
                      <button
                        onClick={() => onOpenAddSkill(step.skill)}
                        className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all cursor-pointer shadow-2xs"
                      >
                        Prove This Skill
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] mb-2">
                  {step.whyItMatters}
                </p>

                <div className="text-xs text-[#16A34A] dark:text-[#86EFAC] font-semibold mb-3">
                  {step.unlockedImpact}
                </div>

                {/* Resources List */}
                {step.resources && step.resources.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#E4E9F0] dark:border-[#263750]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
                      Vetted Learning Resources:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.resources.map((res) => (
                        <div key={res.id} className="p-2.5 rounded-xl bg-white dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#172033] dark:text-[#F8FAFC] truncate">{res.title}</span>
                            <span className="text-[10px] text-[#2F6FED] dark:text-[#4F8CFF] shrink-0 font-mono">{res.estimatedTime}</span>
                          </div>
                          <p className="text-[11px] text-[#667085] dark:text-[#94A3B8]">{res.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
