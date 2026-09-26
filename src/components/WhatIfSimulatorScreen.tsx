import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Plus, 
  AlertCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { CandidateProfile, JobMatchResult } from '../types';
import { matchAllJobs } from '../utils/matcher';
import { SEEDED_JOBS } from '../data/seedData';

interface WhatIfSimulatorScreenProps {
  candidate: CandidateProfile;
  onOpenAddSkill: (skillName?: string) => void;
  initialSimulatedSkill?: string | null;
}

export const WhatIfSimulatorScreen: React.FC<WhatIfSimulatorScreenProps> = ({
  candidate,
  onOpenAddSkill,
  initialSimulatedSkill,
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    initialSimulatedSkill ? [initialSimulatedSkill] : ['TypeScript']
  );

  // Available skills to toggle
  const availableSimSkills = [
    { name: 'TypeScript', category: 'Frontend', effort: '2–3 weeks', desc: 'Strict typing for React components & AST linting' },
    { name: 'Docker', category: 'Cloud', effort: '3–4 weeks', desc: 'Multi-stage container builds & microservices' },
    { name: 'Jest', category: 'Tools', effort: '1–2 weeks', desc: 'Automated unit & integration test coverage' },
    { name: 'AWS', category: 'Cloud', effort: '4–6 weeks', desc: 'Serverless Lambda, S3, API Gateway' },
    { name: 'Node.js', category: 'Backend', effort: '2–3 weeks', desc: 'Express API microservices & clustering' },
    { name: 'GraphQL', category: 'Backend', effort: '2 weeks', desc: 'Apollo client/server schemas & queries' },
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const resetSimulation = () => {
    setSelectedSkills([]);
  };

  // Compute live comparison
  const baselineMatches = matchAllJobs(candidate, SEEDED_JOBS, []);
  const simulatedMatches = matchAllJobs(candidate, SEEDED_JOBS, selectedSkills);

  // Summary Metrics
  const avgBaseline = Math.round(baselineMatches.slice(0, 3).reduce((a, b) => a + b.overallScore, 0) / 3);
  const avgSimulated = Math.round(simulatedMatches.slice(0, 3).reduce((a, b) => a + b.overallScore, 0) / 3);
  const avgUplift = avgSimulated - avgBaseline;

  const newlyReadyCount = simulatedMatches.filter(m => m.tier === 'READY NOW').length - baselineMatches.filter(m => m.tier === 'READY NOW').length;

  return (
    <div id="whatif-simulator-screen" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Sandbox Notification Banner */}
      <div className="p-4 rounded-2xl bg-[#F0FDFA] dark:bg-[#042F2E]/40 border border-[#99F6E4] dark:border-[#115E59] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#14B8A6] text-white flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F766E] dark:text-[#5EEAD4] flex items-center gap-1.5">
              <span>Non-Destructive Skill Simulation Sandbox</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] bg-[#CCFBF1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#5EEAD4] uppercase font-mono">
                Isolated State
              </span>
            </div>
            <p className="text-xs text-[#134E4A] dark:text-[#99F6E4]/80 mt-0.5">
              Simulating skills temporarily recalculates matching without altering your verified profile.
            </p>
          </div>
        </div>

        {selectedSkills.length > 0 && (
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0F766E] dark:text-[#5EEAD4] bg-white dark:bg-[#115E59]/40 border border-[#99F6E4] dark:border-[#115E59] hover:bg-[#CCFBF1] transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sandbox</span>
          </button>
        )}
      </div>

      {/* Simulator Control Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
              Select Skills to Simulate
            </h1>
            <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
              Toggle one or more skills to project match increases across all 10 roles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#667085] dark:text-[#94A3B8]">
              Simulating <strong className="text-[#14B8A6]">{selectedSkills.length}</strong> skills
            </span>
          </div>
        </div>

        {/* Skill Toggle Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {availableSimSkills.map((s) => {
            const isSelected = selectedSkills.includes(s.name);

            return (
              <button
                key={s.name}
                onClick={() => toggleSkill(s.name)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                  isSelected
                    ? 'bg-[#F0FDFA] dark:bg-[#042F2E] border-[#14B8A6] shadow-xs ring-2 ring-[#14B8A6]/20'
                    : 'bg-[#F8FAFC] dark:bg-[#111C2E] border-[#E4E9F0] dark:border-[#263750] hover:border-[#14B8A6]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#0F766E] dark:text-[#5EEAD4]' : 'text-[#172033] dark:text-[#F8FAFC]'}`}>
                    {s.name}
                  </span>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isSelected ? 'bg-[#14B8A6] text-white' : 'border border-[#CBD5E1] dark:border-[#475569]'
                  }`}>
                    {isSelected && '✓'}
                  </div>
                </div>
                <div className="text-[10px] text-[#667085] dark:text-[#94A3B8] font-mono">
                  {s.effort}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Simulation Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8] block">
            Top 3 Match Score Average
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-black font-mono text-[#172033] dark:text-[#F8FAFC]">
              {avgSimulated}%
            </span>
            {avgUplift > 0 && (
              <span className="text-xs font-bold text-[#16A34A] dark:text-[#86EFAC] font-mono">
                +{avgUplift}% Uplift
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#667085] dark:text-[#94A3B8] mt-0.5">
            Baseline: {avgBaseline}% without simulation
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8] block">
            New "Ready Now" Roles
          </span>
          <div className="text-2xl font-black font-mono text-[#14B8A6] dark:text-[#5EEAD4] mt-1.5">
            +{Math.max(0, newlyReadyCount)} Roles
          </div>
          <p className="text-[11px] text-[#667085] dark:text-[#94A3B8] mt-0.5">
            Total {simulatedMatches.filter(m => m.tier === 'READY NOW').length} Ready Now roles
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8] block">
              Permanent Verification
            </span>
            <p className="text-[11px] text-[#667085] dark:text-[#94A3B8] mt-1">
              Ready to lock in these projected gains?
            </p>
          </div>
          <button
            onClick={() => onOpenAddSkill(selectedSkills[0] || 'TypeScript')}
            className="w-full py-1.5 px-3 rounded-xl text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs mt-2"
          >
            <span>Prove {selectedSkills[0] || 'TypeScript'} in Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Role-by-Role Before vs After Match Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#172033] dark:text-[#F8FAFC]">
          Opportunity Impact Comparison (Current vs. Simulated)
        </h2>

        <div className="divide-y divide-[#E4E9F0] dark:divide-[#263750]">
          {simulatedMatches.map((simMatch) => {
            const baseMatch = baselineMatches.find(b => b.job.id === simMatch.job.id)!;
            const diff = simMatch.overallScore - baseMatch.overallScore;

            return (
              <div key={simMatch.job.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#172033] dark:text-[#F8FAFC]">{simMatch.job.title}</span>
                    <span className="text-[11px] text-[#667085] dark:text-[#94A3B8]">({simMatch.job.company || simMatch.job.companyTier})</span>
                  </div>
                  <div className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
                    {simMatch.job.salaryRange} • {simMatch.job.location}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-auto">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#667085] dark:text-[#94A3B8]">{baseMatch.overallScore}%</span>
                      <span className="text-[#667085]">→</span>
                      <span className="font-mono font-black text-sm text-[#16A34A] dark:text-[#86EFAC]">{simMatch.overallScore}%</span>
                    </div>
                    {diff > 0 && (
                      <span className="text-[10px] font-bold text-[#16A34A] dark:text-[#86EFAC] font-mono">
                        +{diff}% Increase
                      </span>
                    )}
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    simMatch.tier === 'READY NOW' ? 'bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC]' : 'bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF]'
                  }`}>
                    {simMatch.tier}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
