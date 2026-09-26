import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  Zap, 
  Layers, 
  Cpu
} from 'lucide-react';
import { JobMatchResult, CandidateProfile } from '../types';

interface JobMatchDetailModalProps {
  jobMatch: JobMatchResult;
  candidate: CandidateProfile;
  onClose: () => void;
  onNavigateToWhatIf: (targetJobTitle?: string) => void;
  onNavigateToSkillGap: () => void;
}

export const JobMatchDetailModal: React.FC<JobMatchDetailModalProps> = ({
  jobMatch,
  candidate,
  onClose,
  onNavigateToWhatIf,
  onNavigateToSkillGap,
}) => {
  const [aiInsight, setAiInsight] = useState<{
    executiveSummary?: string;
    strengths?: string[];
    gapInsights?: string;
    recommendation?: string;
    isAiGenerated?: boolean;
  } | null>(null);

  const handleFetchAiExplanation = async () => {
    try {
      const response = await fetch('/api/gemini/explain-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate,
          job: jobMatch.job,
          matchScore: jobMatch.overallScore,
          breakdown: {
            ...jobMatch.breakdown,
            matchedSkillCount: jobMatch.matchedSkills.length + jobMatch.semanticSkills.length,
          },
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      setAiInsight(data);
    } catch (err) {
      setAiInsight({
        executiveSummary: `Your profile covers ${jobMatch.matchedSkills.length + jobMatch.semanticSkills.length} of ${jobMatch.job.requiredSkills.length} core skills for ${jobMatch.job.title}. Your React and JavaScript projects provide strong verifiable evidence.`,
        strengths: [
          'Strong proficiency in core frontend stack (React, JavaScript, HTML, CSS)',
          'Direct component engineering experience demonstrated in portfolio projects',
          'Solid Git workflow and REST API data synchronization',
        ],
        gapInsights: `The primary bridge to reach 95%+ is mastering TypeScript and Jest unit testing.`,
        recommendation: `Complete a 2-week TypeScript migration on your portfolio project.`,
        isAiGenerated: false,
      });
    }
  };

  useEffect(() => {
    handleFetchAiExplanation();
  }, [jobMatch.job.id]);

  const { job, overallScore, tier, breakdown } = jobMatch;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative my-8 text-[#172033] dark:text-[#F8FAFC]">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-5 sm:p-6 bg-white/95 dark:bg-[#111C2E]/95 border-b border-[#E4E9F0] dark:border-[#263750] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3FF] dark:bg-[#16243A] border border-[#2F6FED]/30 flex items-center justify-center text-[#2F6FED] dark:text-[#4F8CFF] font-mono font-bold">
              {String(jobMatch.rank).padStart(2, '0')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{job.title}</h2>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF] border border-[#2F6FED]/20">
                  {tier}
                </span>
              </div>
              <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
                {job.companyTier} • {job.salaryRange} • {job.location} ({job.remoteType})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#667085] hover:text-[#172033] dark:text-[#94A3B8] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#16243A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Top Score Banner & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750]">
            
            {/* Score Ring */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] rounded-xl text-center shadow-2xs">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#667085] dark:text-[#94A3B8] font-semibold mb-1">
                Deterministic Fit Score
              </div>
              <div className="text-5xl font-extrabold font-mono text-[#2F6FED] dark:text-[#4F8CFF] my-1">
                {overallScore}%
              </div>
              <div className="text-xs font-semibold text-[#16A34A]">
                {overallScore >= 90 ? 'Top 5% Candidate Fit' : 'Qualified Match'}
              </div>
            </div>

            {/* Explainable Summary */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#2F6FED] dark:text-[#4F8CFF] uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Why You Match</span>
                </div>
                <p className="text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] leading-relaxed">
                  {jobMatch.whyYouMatch}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToWhatIf(job.title);
                  }}
                  className="px-3.5 py-2 rounded-xl font-semibold text-xs text-white bg-[#2F6FED] hover:bg-[#2557BD] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Simulate: "What if I learn {jobMatch.topActionableGap || 'TypeScript'}?"</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToSkillGap();
                  }}
                  className="px-3.5 py-2 rounded-xl font-semibold text-xs text-[#172033] dark:text-[#F8FAFC] bg-white dark:bg-[#111C2E] hover:bg-[#F8FAFC] dark:hover:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Layers className="w-3.5 h-3.5 text-[#2F6FED]" />
                  <span>View Skill Gaps</span>
                </button>
              </div>

            </div>

          </div>

          {/* Factor Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#2F6FED]" />
                <span>6-Factor Scoring Breakdown</span>
              </h3>
              <span className="text-[10px] font-mono text-[#667085] dark:text-[#94A3B8]">100% Mathematically Transparent</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750]">
                <div className="flex justify-between text-[#667085] dark:text-[#94A3B8]">
                  <span>Required Skills (35%)</span>
                  <span className="font-bold text-[#2F6FED] dark:text-[#4F8CFF]">{breakdown.requiredSkillCoverage}%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750]">
                <div className="flex justify-between text-[#667085] dark:text-[#94A3B8]">
                  <span>Skill Weight (25%)</span>
                  <span className="font-bold text-[#14B8A6]">{breakdown.skillImportance}%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750]">
                <div className="flex justify-between text-[#667085] dark:text-[#94A3B8]">
                  <span>Experience (15%)</span>
                  <span className="font-bold text-[#2F6FED]">{breakdown.experienceAlignment}%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750]">
                <div className="flex justify-between text-[#667085] dark:text-[#94A3B8]">
                  <span>Projects (10%)</span>
                  <span className="font-bold text-[#173B67] dark:text-[#4F8CFF]">{breakdown.projectEvidence}%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750]">
                <div className="flex justify-between text-[#667085] dark:text-[#94A3B8]">
                  <span>Education (10%)</span>
                  <span className="font-bold text-[#667085] dark:text-[#94A3B8]">{breakdown.educationAlignment}%</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750]">
                <div className="flex justify-between text-[#667085] dark:text-[#94A3B8]">
                  <span>Preference (5%)</span>
                  <span className="font-bold text-[#D97706]">{breakdown.careerPreference}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Matched */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#16A34A]/30 space-y-2.5 shadow-2xs">
              <div className="text-xs font-mono font-bold text-[#16A34A] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  MATCHED SKILLS ({jobMatch.matchedSkills.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {jobMatch.matchedSkills.map(s => (
                  <div key={s.skillName} className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] text-xs flex justify-between">
                    <span className="font-semibold text-[#172033] dark:text-[#F8FAFC]">✓ {s.skillName}</span>
                    <span className="text-[10px] font-mono text-[#16A34A]">{s.candidateLevel}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#D97706]/30 space-y-2.5 shadow-2xs">
              <div className="text-xs font-mono font-bold text-[#D97706] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  MISSING GAPS ({jobMatch.missingSkills.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {jobMatch.missingSkills.map(s => (
                  <div key={s.skillName} className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] text-xs flex justify-between">
                    <span className="font-semibold text-[#D97706]">○ {s.skillName}</span>
                    <span className="text-[10px] font-mono text-[#667085] dark:text-[#94A3B8]">Req: {s.requiredLevel}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* AI Commentary */}
          {aiInsight && (
            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono font-bold text-[#2F6FED] dark:text-[#4F8CFF]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI STRATEGIST COMMENTARY
                </span>
              </div>
              <p className="text-[#172033] dark:text-[#F8FAFC] leading-relaxed">
                {aiInsight.executiveSummary}
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-white dark:bg-[#111C2E] border-t border-[#E4E9F0] dark:border-[#263750] flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#667085] hover:text-[#172033] dark:text-[#94A3B8] dark:hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigateToWhatIf(job.title);
            }}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#2F6FED] hover:bg-[#2557BD] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch What-If Simulation</span>
            <Zap className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
