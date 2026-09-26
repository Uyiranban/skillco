import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ArrowDown
} from 'lucide-react';
import { CandidateProfile } from '../types';

interface UpskillPathScreenProps {
  candidate: CandidateProfile;
  onNavigateToWhatIf: (skillName?: string) => void;
}

export const UpskillPathScreen: React.FC<UpskillPathScreenProps> = ({
  candidate,
  onNavigateToWhatIf,
}) => {
  const roadmapSteps = [
    {
      id: 'current',
      skill: 'Current Skills (React, JS, HTML, CSS)',
      time: 'Verified Baseline',
      purpose: 'Solid frontend foundation with 91% verified proficiency in modern React and JavaScript.',
      status: 'completed',
      isCompleted: true,
    },
    {
      id: 'typescript',
      skill: 'TypeScript & Type Systems',
      time: '2–3 Weeks',
      purpose: 'Migrate React codebase to static types, narrowing runtime errors and qualifying for 7 of 10 roles.',
      status: 'active',
      isCompleted: false,
    },
    {
      id: 'testing',
      skill: 'Testing (Jest & React Testing Library)',
      time: '1–2 Weeks',
      purpose: 'Write unit & component tests with 85%+ coverage to prove production reliability.',
      status: 'upcoming',
      isCompleted: false,
    },
    {
      id: 'cicd',
      skill: 'CI/CD & Containerization (Docker + GitHub Actions)',
      time: '1–2 Weeks',
      purpose: 'Automate build test validation and multi-environment container deployments.',
      status: 'upcoming',
      isCompleted: false,
    },
    {
      id: 'portfolio',
      skill: 'Portfolio & System Architecture',
      time: '1 Week',
      purpose: 'Package typed, tested repositories into ATS-optimized proof artifacts.',
      status: 'upcoming',
      isCompleted: false,
    },
    {
      id: 'job-ready',
      skill: 'Job Ready (95%+ Fit for Top Roles)',
      time: 'Goal Achieved',
      purpose: 'Top 2% candidate tier unlocking $150k+ market compensation.',
      status: 'goal',
      isCompleted: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E9F0] dark:border-[#263750] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF] text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Career Path</span>
          </div>
          <h1 className="text-2xl font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
            Sequenced Upskill Roadmap
          </h1>
          <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
            Optimal sequence designed for lowest learning resistance and highest hiring yield.
          </p>
        </div>

        <button
          onClick={() => onNavigateToWhatIf('TypeScript')}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Simulate Timeline</span>
        </button>
      </div>

      {/* Visually Clean Roadmap Flowchart (Requirement 7) */}
      <div className="space-y-3">
        {roadmapSteps.map((step, idx) => {
          const isLast = idx === roadmapSteps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
                step.isCompleted
                  ? 'bg-white dark:bg-[#111C2E] border-[#16A34A]/30 shadow-2xs'
                  : step.status === 'active'
                  ? 'bg-white dark:bg-[#111C2E] border-[#2F6FED] shadow-xs'
                  : step.status === 'goal'
                  ? 'bg-white dark:bg-[#111C2E] border-[#14B8A6]/40 shadow-2xs'
                  : 'bg-white dark:bg-[#111C2E] border-[#E4E9F0] dark:border-[#263750] shadow-2xs'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                      step.isCompleted
                        ? 'bg-[#ECFDF5] dark:bg-[#16243A] text-[#16A34A]'
                        : step.status === 'active'
                        ? 'bg-[#2F6FED] text-white'
                        : step.status === 'goal'
                        ? 'bg-[#EBF3FF] dark:bg-[#16243A] text-[#14B8A6]'
                        : 'bg-[#F8FAFC] dark:bg-[#16243A] text-[#667085] dark:text-[#94A3B8] border border-[#E4E9F0] dark:border-[#263750]'
                    }`}>
                      {step.isCompleted ? '✓' : `0${idx + 1}`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">
                          {step.skill}
                        </h3>

                        {step.status === 'active' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF] border border-[#2F6FED]/20">
                            RECOMMENDED NEXT
                          </span>
                        )}

                        {step.isCompleted && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ECFDF5] dark:bg-[#16243A] text-[#16A34A] border border-[#16A34A]/20">
                            COMPLETED
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-1 leading-relaxed">
                        {step.purpose}
                      </p>
                    </div>
                  </div>

                  {/* Estimated Time & Simulation CTA */}
                  <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-semibold text-[#172033] dark:text-[#F8FAFC] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#2F6FED]" />
                        <span>{step.time}</span>
                      </div>
                    </div>

                    {!step.isCompleted && (
                      <button
                        onClick={() => onNavigateToWhatIf(step.skill.split('(')[0].split('&')[0].trim())}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2F6FED] dark:text-[#4F8CFF] bg-[#EBF3FF] dark:bg-[#16243A] hover:bg-[#D9E8FF] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Simulate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                </div>
              </div>

              {!isLast && (
                <div className="flex justify-center py-0.5 text-[#667085] dark:text-[#94A3B8]">
                  <ArrowDown className="w-4 h-4 text-[#2F6FED]/60" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

    </div>
  );
};
