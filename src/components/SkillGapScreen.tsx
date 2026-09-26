import React from 'react';
import { 
  Layers, 
  ArrowRight, 
  Clock, 
  Zap, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';
import { CandidateProfile, SkillGapAnalysisItem } from '../types';

interface SkillGapScreenProps {
  candidate: CandidateProfile;
  gapItems: SkillGapAnalysisItem[];
  onNavigateToWhatIf: (skillName?: string) => void;
  onNavigateToUpskill: () => void;
}

export const SkillGapScreen: React.FC<SkillGapScreenProps> = ({
  candidate,
  gapItems,
  onNavigateToWhatIf,
  onNavigateToUpskill,
}) => {
  const bestNextSkill = {
    skillName: 'TypeScript',
    category: 'Frontend & Full Stack',
    matchUplift: '+4%',
    rolesUnlocked: 12,
    learningTime: '2–3 weeks',
    roiScore: '94/100',
    relatedCurrentSkill: 'JavaScript (94% Verified)',
    explanation: 'Shortest learning distance from existing JavaScript mastery. Closes top requirement across 7 of 10 target roles.',
  };

  const otherIdentifiedGaps = [
    {
      skillName: 'Jest & Unit Testing',
      category: 'Testing',
      matchUplift: '+3%',
      rolesUnlocked: 8,
      learningTime: '1–2 weeks',
      roiScore: '86/100',
      purpose: 'Verifies component reliability and test-driven development workflows.',
    },
    {
      skillName: 'Docker & CI/CD',
      category: 'DevOps & Infrastructure',
      matchUplift: '+2%',
      rolesUnlocked: 6,
      learningTime: '2 weeks',
      roiScore: '78/100',
      purpose: 'Demonstrates containerized microservices and automated build pipelines.',
    },
    {
      skillName: 'Next.js / SSR',
      category: 'Architecture',
      matchUplift: '+3%',
      rolesUnlocked: 7,
      learningTime: '2–3 weeks',
      roiScore: '82/100',
      purpose: 'Required for Senior Full Stack and modern server-rendered React applications.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-4">
      
      {/* Header */}
      <div className="border-b border-[#E4E9F0] dark:border-[#263750] pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF] text-xs font-semibold mb-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>Skill Gap Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
          Targeted Skill Gaps
        </h1>
        <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
          Pinpoint highest-yield technical gaps to close the distance to 95%+ match scores.
        </p>
      </div>

      {/* Signature "Best Next Skill" Spotlight Card (Requirement 6) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-[#2F6FED]/50 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF]">
              BEST NEXT SKILL
            </span>
            <span className="text-xs font-semibold text-[#14B8A6]">
              Highest Algorithmic Yield
            </span>
          </div>

          <button
            onClick={() => onNavigateToWhatIf(bestNextSkill.skillName)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Learning {bestNextSkill.skillName}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          <div className="md:col-span-6 space-y-2">
            <div className="text-3xl font-extrabold text-[#172033] dark:text-[#F8FAFC]">
              {bestNextSkill.skillName}
            </div>
            <p className="text-xs text-[#667085] dark:text-[#94A3B8] leading-relaxed">
              {bestNextSkill.explanation}
            </p>
            <div className="text-xs text-[#2F6FED] dark:text-[#4F8CFF] font-medium pt-1">
              Transferable foundation: {bestNextSkill.relatedCurrentSkill}
            </div>
          </div>

          {/* 4 Spotlight Metrics (Match Uplift: +4%, Roles Unlocked: 12, Learning Time: 2–3 weeks, ROI Score: 94/100) */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] text-center space-y-1">
              <div className="text-[10px] text-[#667085] dark:text-[#94A3B8] font-semibold uppercase">
                Match Uplift
              </div>
              <div className="text-xl font-bold font-mono text-[#16A34A]">
                {bestNextSkill.matchUplift}
              </div>
              <div className="text-[10px] text-[#667085] dark:text-[#94A3B8]">
                Immediate
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] text-center space-y-1">
              <div className="text-[10px] text-[#667085] dark:text-[#94A3B8] font-semibold uppercase">
                Roles Unlocked
              </div>
              <div className="text-xl font-bold font-mono text-[#2F6FED] dark:text-[#4F8CFF]">
                {bestNextSkill.rolesUnlocked}
              </div>
              <div className="text-[10px] text-[#667085] dark:text-[#94A3B8]">
                Openings
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] text-center space-y-1">
              <div className="text-[10px] text-[#667085] dark:text-[#94A3B8] font-semibold uppercase">
                Learning Time
              </div>
              <div className="text-xl font-bold font-mono text-[#172033] dark:text-[#F8FAFC]">
                2–3 wks
              </div>
              <div className="text-[10px] text-[#667085] dark:text-[#94A3B8]">
                Low effort
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] text-center space-y-1">
              <div className="text-[10px] text-[#667085] dark:text-[#94A3B8] font-semibold uppercase">
                ROI Score
              </div>
              <div className="text-xl font-bold font-mono text-[#14B8A6]">
                {bestNextSkill.roiScore}
              </div>
              <div className="text-[10px] text-[#667085] dark:text-[#94A3B8]">
                Top priority
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Other Identified Gaps (Testing, CI/CD, Next.js) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC] uppercase tracking-wider font-mono">
            Other Identified Gaps
          </h2>
          <button
            onClick={onNavigateToUpskill}
            className="text-xs text-[#2F6FED] dark:text-[#4F8CFF] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Career Roadmap</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {otherIdentifiedGaps.map((item) => (
            <div
              key={item.skillName}
              className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-2xs hover:border-[#2F6FED]/40 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">
                    {item.skillName}
                  </h3>
                  <span className="text-[10px] text-[#667085] dark:text-[#94A3B8]">
                    {item.category} • ROI {item.roiScore}
                  </span>
                </div>

                <span className="text-xs font-bold font-mono text-[#16A34A]">
                  {item.matchUplift}
                </span>
              </div>

              <p className="text-[11px] text-[#667085] dark:text-[#94A3B8] leading-relaxed">
                {item.purpose}
              </p>

              <div className="pt-2 border-t border-[#E4E9F0] dark:border-[#263750] flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-[#667085] dark:text-[#94A3B8] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.learningTime}
                </span>

                <button
                  onClick={() => onNavigateToWhatIf(item.skillName.split('&')[0].trim())}
                  className="text-xs font-semibold text-[#2F6FED] dark:text-[#4F8CFF] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Simulate</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
