import React, { useState } from 'react';
import { 
  Radar, 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { JobMatchResult, JobFitTier } from '../types';

interface OpportunitiesScreenProps {
  jobMatches: JobMatchResult[];
  onSelectJob: (jobMatch: JobMatchResult) => void;
  onProveSkill: (skillName: string) => void;
}

export const OpportunitiesScreen: React.FC<OpportunitiesScreenProps> = ({
  jobMatches,
  onSelectJob,
  onProveSkill,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  const filteredMatches = jobMatches.filter(match => {
    const companyName = match.job.company || match.job.companyTier || '';
    const matchesSearch = 
      match.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.job.requiredSkills.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTier = selectedTier === 'All' || match.tier === selectedTier;
    const matchesLocation = selectedLocation === 'All' || match.job.remoteType === selectedLocation;

    return matchesSearch && matchesTier && matchesLocation;
  });

  return (
    <div id="opportunities-screen" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Filter Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center gap-2">
              <Radar className="w-5 h-5 text-[#2F6FED]" />
              Opportunities Radar
            </h1>
            <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
              Deterministic match scoring powered by your verified skills and code artifacts.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-semibold text-[#667085] dark:text-[#94A3B8]">
              Showing {filteredMatches.length} of {jobMatches.length} Roles
            </span>
          </div>
        </div>

        {/* Search & Select Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-[#667085] dark:text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role, company, or skill..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#E4E9F0] dark:border-[#263750] bg-white dark:bg-[#16243A] text-[#172033] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2F6FED] transition-colors"
            />
          </div>

          <div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E9F0] dark:border-[#263750] bg-white dark:bg-[#16243A] text-[#172033] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2F6FED] transition-colors"
            >
              <option value="All">All Match Tiers</option>
              <option value="READY NOW">READY NOW (85%+)</option>
              <option value="SMALL GAP">SMALL GAP (70%–84%)</option>
              <option value="UPSKILL REQUIRED">UPSKILL REQUIRED (&lt;70%)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E9F0] dark:border-[#263750] bg-white dark:bg-[#16243A] text-[#172033] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2F6FED] transition-colors"
            >
              <option value="All">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredMatches.map((match) => {
          const isHighMatch = match.overallScore >= 85;
          const isMediumMatch = match.overallScore >= 70 && match.overallScore < 85;

          return (
            <div
              key={match.job.id}
              id={`opportunity-card-${match.job.id}`}
              className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs hover:border-[#2F6FED]/50 transition-all space-y-4"
            >
              {/* Header: Title, Company, Score Badge, Tier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">
                      {match.job.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isHighMatch
                        ? 'bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC] border border-[#86EFAC]/40 dark:border-[#166534]'
                        : isMediumMatch
                        ? 'bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF] border border-[#BFDBFE] dark:border-[#263750]'
                        : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8]'
                    }`}>
                      {match.tier}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#667085] dark:text-[#94A3B8] mt-1">
                    <span className="font-medium text-[#2F6FED] dark:text-[#4F8CFF]">{match.job.company || match.job.companyTier}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {match.job.location} ({match.job.remoteType})
                    </span>
                    <span>•</span>
                    <span className="font-mono">{match.job.salaryRange}</span>
                  </div>
                </div>

                {/* Score Big Display */}
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="text-right">
                    <div className={`text-2xl font-black font-mono leading-none ${
                      isHighMatch ? 'text-[#16A34A] dark:text-[#86EFAC]' : isMediumMatch ? 'text-[#2F6FED] dark:text-[#4F8CFF]' : 'text-[#667085] dark:text-[#94A3B8]'
                    }`}>
                      {match.overallScore}%
                    </div>
                    <span className="text-[10px] text-[#667085] dark:text-[#94A3B8]">Deterministic Fit</span>
                  </div>

                  <button
                    onClick={() => onSelectJob(match)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <span>Match Deep Dive</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Skills Decomposition Pills */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] space-y-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-[#16A34A] dark:text-[#86EFAC] shrink-0">
                    Exact Verified ({match.matchedSkills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {match.matchedSkills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC]">
                        ✓ {s.skillName} ({s.candidateConfidence}%)
                      </span>
                    ))}
                  </div>
                </div>

                {match.semanticSkills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-[#2F6FED] dark:text-[#4F8CFF] shrink-0">
                      Semantic Transfer ({match.semanticSkills.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {match.semanticSkills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF]">
                          ≈ {s.skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {match.missingSkills.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E4E9F0] dark:border-[#263750]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-[#D97706] dark:text-[#FDE68A] shrink-0">
                        Missing Skills ({match.missingSkills.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {match.missingSkills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FEF3C7] dark:bg-[#78350F] text-[#D97706] dark:text-[#FDE68A]">
                            ✗ {s.skillName}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onProveSkill(match.missingSkills[0].skillName)}
                      className="text-[11px] font-bold text-[#2F6FED] dark:text-[#4F8CFF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Prove {match.missingSkills[0].skillName}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
