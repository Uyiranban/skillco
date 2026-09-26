import React, { useState } from 'react';
import { 
  Radar, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  Zap,
  Briefcase
} from 'lucide-react';
import { JobMatchResult } from '../types';

interface OpportunityRadarScreenProps {
  jobMatches: JobMatchResult[];
  onSelectJob: (jobMatch: JobMatchResult) => void;
  onNavigateToWhatIf: (skillOrTitle?: string) => void;
}

export const OpportunityRadarScreen: React.FC<OpportunityRadarScreenProps> = ({
  jobMatches,
  onSelectJob,
  onNavigateToWhatIf,
}) => {
  const [filterTier, setFilterTier] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getReadinessTier = (score: number) => {
    if (score >= 90) return { label: 'Ready Now (90%+)', color: 'text-[#16A34A] bg-[#ECFDF5] dark:bg-[#16243A] border-[#16A34A]/20' };
    if (score >= 80) return { label: '1 Skill Away (80-89%)', color: 'text-[#2F6FED] dark:text-[#4F8CFF] bg-[#EBF3FF] dark:bg-[#16243A] border-[#2F6FED]/20' };
    return { label: 'Upskill Required (<80%)', color: 'text-[#D97706] bg-[#FFFBEB] dark:bg-[#16243A] border-[#D97706]/20' };
  };

  const filteredMatches = jobMatches.filter(m => {
    const matchesTier = filterTier === 'All' 
      ? true 
      : filterTier === 'Ready Now'
      ? m.overallScore >= 90
      : filterTier === '1 Skill Away'
      ? m.overallScore >= 80 && m.overallScore < 90
      : m.overallScore < 80;

    const matchesQuery = m.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.job.companyTier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.job.requiredSkills.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTier && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E9F0] dark:border-[#263750] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF] text-xs font-semibold mb-1.5">
            <Radar className="w-3.5 h-3.5" />
            <span>Opportunities</span>
          </div>
          <h1 className="text-2xl font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
            Target Job Opportunities
          </h1>
          <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
            Deterministic readiness ranking based on verified candidate skills.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <input
            type="text"
            placeholder="Search roles or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl text-xs bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] text-[#172033] dark:text-[#F8FAFC] placeholder-[#667085] dark:placeholder-[#94A3B8] focus:outline-none focus:border-[#2F6FED] transition-all shadow-2xs"
          />

          <div className="flex items-center gap-1 bg-white dark:bg-[#111C2E] p-1 rounded-xl border border-[#E4E9F0] dark:border-[#263750] shadow-2xs">
            {['All', 'Ready Now', '1 Skill Away', 'Upskill Required'].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterTier === tier
                    ? 'bg-[#2F6FED] text-white shadow-2xs'
                    : 'text-[#667085] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F8FAFC]'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunity Compact Cards List */}
      <div className="space-y-3">
        {filteredMatches.map(match => {
          const { job, overallScore, rank } = match;
          const tierInfo = getReadinessTier(overallScore);
          const matchedCount = match.matchedSkills.length + match.semanticSkills.length;
          const missingCount = match.missingSkills.length;

          return (
            <div
              key={job.id}
              onClick={() => onSelectJob(match)}
              className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] hover:border-[#2F6FED]/50 transition-all shadow-2xs cursor-pointer space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] text-[#172033] dark:text-[#F8FAFC] font-bold text-xs font-mono flex items-center justify-center flex-shrink-0">
                    {String(rank).padStart(2, '0')}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
                        {job.title}
                      </h3>
                      
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${tierInfo.color}`}>
                        {tierInfo.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#667085] dark:text-[#94A3B8] mt-0.5">
                      <span>{job.companyTier}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#16A34A]">{job.salaryRange}</span>
                      <span>•</span>
                      <span>{job.location} ({job.remoteType})</span>
                    </div>
                  </div>
                </div>

                {/* Score & Tier */}
                <div className="text-right self-end sm:self-auto flex items-center gap-3">
                  <div>
                    <div className="text-2xl font-bold font-mono text-[#2F6FED] dark:text-[#4F8CFF]">
                      {overallScore}%
                    </div>
                    <div className="text-[10px] text-[#667085] dark:text-[#94A3B8]">Deterministic Fit</div>
                  </div>
                </div>

              </div>

              {/* Matched vs Missing Skills Counts & Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E4E9F0] dark:border-[#263750]">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[#16A34A] font-semibold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {matchedCount} Matched Skills
                  </span>
                  <span className="text-[#667085] dark:text-[#94A3B8]">•</span>
                  <span className="text-[#D97706] font-semibold font-mono">
                    {missingCount} Missing Gap{missingCount === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToWhatIf(match.topActionableGap || 'TypeScript');
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#2F6FED] dark:text-[#4F8CFF] bg-[#EBF3FF] dark:bg-[#16243A] hover:bg-[#D9E8FF] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Simulate</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectJob(match);
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <span>View Match</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
