import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  FolderGit2, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ExternalLink
} from 'lucide-react';
import { CandidateProfile } from '../types';

interface CareerTwinScreenProps {
  candidate: CandidateProfile;
  onNavigateToRadar: () => void;
  onNavigateToWhatIf: () => void;
  onOpenSkillValidation: (skillName?: string) => void;
}

export const CareerTwinScreen: React.FC<CareerTwinScreenProps> = ({
  candidate,
  onNavigateToRadar,
  onNavigateToWhatIf,
  onOpenSkillValidation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Frontend', 'Backend', 'Data', 'Tools'];

  const filteredSkills = selectedCategory === 'All'
    ? candidate.skills
    : candidate.skills.filter(s => s.category === selectedCategory);

  const getEvidenceLabel = (skill: typeof candidate.skills[0]) => {
    const parts: string[] = [];
    if (skill.evidence.usedInProject) parts.push('Project');
    if (skill.evidence.gitHubEvidence) parts.push('GitHub');
    if (skill.evidence.aiAssessment) parts.push('Assessment');
    if (parts.length === 0) return 'Claimed';
    return parts.join(' + ');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-4">
      
      {/* Profile Header */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#2F6FED] text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0">
            AM
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-[#172033] dark:text-[#F8FAFC] tracking-tight">
                {candidate.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] dark:bg-[#16243A] text-[#16A34A] border border-[#16A34A]/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Career Twin</span>
              </span>
            </div>

            <p className="text-xs text-[#667085] dark:text-[#94A3B8] mt-1">
              {candidate.education.degree} • {candidate.education.institution} ({candidate.education.year})
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onOpenSkillValidation('React')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#172033] dark:text-[#F8FAFC] bg-[#F8FAFC] dark:bg-[#16243A] hover:bg-[#EBF3FF] dark:hover:bg-[#1E2E48] border border-[#E4E9F0] dark:border-[#263750] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Validate Skill</span>
          </button>

          <button
            onClick={onNavigateToRadar}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>View Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 5 Core Metric Cards (Per Specification 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
            Job Readiness
          </div>
          <div className="text-2xl font-bold font-mono text-[#2F6FED] dark:text-[#4F8CFF]">
            78%
          </div>
          <div className="text-[10px] text-[#667085] dark:text-[#94A3B8]">
            Top: Frontend (91%)
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
            Market Alignment
          </div>
          <div className="text-2xl font-bold font-mono text-[#14B8A6]">
            84%
          </div>
          <div className="text-[10px] text-[#667085] dark:text-[#94A3B8]">
            Modern web stack fit
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
            Technical Depth
          </div>
          <div className="text-2xl font-bold font-mono text-[#172033] dark:text-[#F8FAFC]">
            82%
          </div>
          <div className="text-[10px] text-[#667085] dark:text-[#94A3B8]">
            8 verified core skills
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
            Portfolio Evidence
          </div>
          <div className="text-2xl font-bold font-mono text-[#D97706]">
            61%
          </div>
          <div className="text-[10px] text-[#667085] dark:text-[#94A3B8]">
            3 code repositories
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
            Skill Confidence
          </div>
          <div className="text-2xl font-bold font-mono text-[#16A34A]">
            89%
          </div>
          <div className="text-[10px] text-[#667085] dark:text-[#94A3B8]">
            Multi-signal triangulation
          </div>
        </div>

      </div>

      {/* Main Skills Matrix with Concise Evidence */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#2F6FED]" />
              <span>Verified Skills Matrix</span>
            </h2>
            <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
              Multi-factor confidence ratings grounded in project artifacts and assessments.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#111C2E] p-1 rounded-xl border border-[#E4E9F0] dark:border-[#263750] shadow-2xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#2F6FED] text-white shadow-2xs'
                    : 'text-[#667085] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F8FAFC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredSkills.map(skill => (
            <div
              key={skill.name}
              className="p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-2xs hover:border-[#2F6FED]/40 transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">{skill.name}</h3>
                  <span className="text-[10px] text-[#667085] dark:text-[#94A3B8]">{skill.category}</span>
                </div>

                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-[#2F6FED] dark:text-[#4F8CFF]">
                    {skill.confidence}%
                  </span>
                </div>
              </div>

              {/* Concise Evidence Line */}
              <div className="text-[11px] font-mono text-[#16A34A] dark:text-[#20B8A6] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{getEvidenceLabel(skill)}</span>
              </div>

              {/* Validate action */}
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => onOpenSkillValidation(skill.name)}
                  className="text-[11px] font-semibold text-[#2F6FED] dark:text-[#4F8CFF] hover:underline cursor-pointer"
                >
                  Test with AI →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects & Work Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Projects */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#2F6FED]" />
              <span>Project Artifact Evidence</span>
            </h3>
            <span className="text-xs text-[#667085] dark:text-[#94A3B8]">
              {candidate.projects.length} Verified Repos
            </span>
          </div>

          <div className="space-y-2.5">
            {candidate.projects.map(proj => (
              <div
                key={proj.id}
                className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC]">{proj.name}</h4>
                  <span className="text-[10px] font-mono text-[#2F6FED] font-semibold">
                    {proj.evidenceWeight}% Weight
                  </span>
                </div>

                <p className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.tech.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] text-[#172033] dark:text-[#F8FAFC]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#2F6FED]" />
              <span>Experience & Trajectory</span>
            </h3>
            <span className="text-xs text-[#667085] dark:text-[#94A3B8]">
              Stanford Class of 2026
            </span>
          </div>

          <div className="space-y-2.5">
            {candidate.experience.map(exp => (
              <div
                key={exp.id}
                className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC]">{exp.role}</h4>
                    <span className="text-[11px] text-[#2F6FED] font-medium">{exp.company}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#667085] dark:text-[#94A3B8]">
                    {exp.period}
                  </span>
                </div>

                <ul className="text-[11px] text-[#667085] dark:text-[#94A3B8] space-y-1 list-disc list-inside">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
