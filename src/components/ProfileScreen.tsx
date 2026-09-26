import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Plus, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  ExternalLink, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Filter,
  Sparkles,
  Zap,
  Code2
} from 'lucide-react';
import { CandidateProfile, SkillItem, SkillVerificationStatus } from '../types';

interface ProfileScreenProps {
  candidate: CandidateProfile;
  onOpenAddSkill: (presetName?: string) => void;
  onOpenEvidenceDetail: (skill: SkillItem) => void;
  onNavigateToWhatIf: (skillName: string) => void;
  onNavigateToOpportunities: () => void;
}

type ProfileTab = 'skills' | 'verification' | 'timeline' | 'projects' | 'education';

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  candidate,
  onOpenAddSkill,
  onOpenEvidenceDetail,
  onNavigateToWhatIf,
  onNavigateToOpportunities,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('skills');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<string>('All');
  const [verificationFilter, setVerificationFilter] = useState<string>('All');

  const verifiedSkills = candidate.skills.filter(s => s.verificationStatus === 'verified' || s.verificationStatus === 'supported');
  const unverifiedSkills = candidate.skills.filter(s => s.verificationStatus === 'unverified' || !s.verificationStatus);
  const pendingSkills = candidate.skills.filter(s => s.verificationStatus === 'pending');

  const filteredSkills = candidate.skills.filter(skill => {
    const matchesCategory = skillCategoryFilter === 'All' || skill.category === skillCategoryFilter;
    const matchesVerification = 
      verificationFilter === 'All' ||
      (verificationFilter === 'Verified' && (skill.verificationStatus === 'verified' || skill.verificationStatus === 'supported')) ||
      (verificationFilter === 'Unverified' && (skill.verificationStatus === 'unverified' || !skill.verificationStatus));
    return matchesCategory && matchesVerification;
  });

  return (
    <div id="profile-screen" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Candidate Profile Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#2F6FED] text-white font-extrabold text-xl flex items-center justify-center shadow-xs">
                AM
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center border-2 border-white dark:border-[#0F172A]" title="Evidence Verified Profile">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-[#172033] dark:text-[#F8FAFC]">{candidate.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC] border border-[#86EFAC]/40 dark:border-[#166534]">
                  Evidence-Backed Twin
                </span>
              </div>
              <p className="text-xs text-[#667085] dark:text-[#94A3B8] font-medium mt-0.5">
                {candidate.headline}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[11px] text-[#667085] dark:text-[#94A3B8] flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#2F6FED]" />
                  {candidate.education.degree} in {candidate.education.field} • {candidate.education.institution}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-[#667085] dark:text-[#94A3B8]">Verified Skills</div>
              <div className="text-base font-extrabold text-[#172033] dark:text-[#F8FAFC] font-mono">
                {verifiedSkills.length} <span className="text-xs text-[#667085] font-normal">/ {candidate.skills.length}</span>
              </div>
            </div>

            <button
              id="btn-profile-add-skill"
              onClick={() => onOpenAddSkill()}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add & Prove Skill</span>
            </button>
          </div>

        </div>

        {/* Target Interests Bar */}
        <div className="mt-5 pt-4 border-t border-[#E4E9F0] dark:border-[#263750] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#172033] dark:text-[#F8FAFC]">Target Career Roles:</span>
            <div className="flex flex-wrap gap-1.5">
              {candidate.targetInterests.map((interest, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-md bg-[#EBF3FF] dark:bg-[#16243A] text-[#2F6FED] dark:text-[#4F8CFF] font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#667085] dark:text-[#94A3B8]">Preferred Work Mode:</span>
            <span className="font-semibold text-[#172033] dark:text-[#F8FAFC]">Remote / Hybrid</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#E4E9F0] dark:border-[#263750] pb-2 overflow-x-auto">
        <div className="flex items-center space-x-1 sm:space-x-2">
          {[
            { id: 'skills' as ProfileTab, label: 'Skills & Confidence', count: candidate.skills.length, icon: Layers },
            { id: 'verification' as ProfileTab, label: 'Verification Center', count: unverifiedSkills.length > 0 ? `${unverifiedSkills.length} unverified` : 'All Verified', icon: ShieldCheck },
            { id: 'timeline' as ProfileTab, label: 'Evidence Timeline', icon: Clock },
            { id: 'projects' as ProfileTab, label: 'Projects & Experience', count: candidate.projects.length, icon: Briefcase },
            { id: 'education' as ProfileTab, label: 'Education & Certifications', icon: GraduationCap },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`profile-subtab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#2F6FED] text-white shadow-xs'
                    : 'text-[#667085] dark:text-[#94A3B8] hover:text-[#172033] dark:hover:text-[#F8FAFC] hover:bg-white dark:hover:bg-[#16243A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#E4E9F0] dark:bg-[#1E293B] text-[#667085] dark:text-[#94A3B8]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SKILLS & CONFIDENCE GRAPH */}
      {activeTab === 'skills' && (
        <div className="space-y-5">
          
          {/* Category & Status Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750]">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-[#667085] dark:text-[#94A3B8] mr-1">Category:</span>
              {['All', 'Frontend', 'Backend', 'Tools', 'Cloud', 'Data'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSkillCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    skillCategoryFilter === cat
                      ? 'bg-[#2F6FED] text-white shadow-2xs'
                      : 'text-[#667085] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#16243A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#667085] dark:text-[#94A3B8]">Status:</span>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-[#E4E9F0] dark:border-[#263750] bg-[#F8FAFC] dark:bg-[#16243A] text-[#172033] dark:text-[#F8FAFC]"
              >
                <option value="All">All Statuses</option>
                <option value="Verified">Verified Only</option>
                <option value="Unverified">Unverified Only</option>
              </select>
            </div>
          </div>

          {/* Detailed Skill Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map((skill) => {
              const isVerified = skill.verificationStatus === 'verified' || skill.verificationStatus === 'supported';

              return (
                <div
                  key={skill.name}
                  id={`skill-card-${skill.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs hover:border-[#2F6FED]/40 transition-all space-y-3.5"
                >
                  {/* Top Bar: Skill Name, Category, Verification Badge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">{skill.name}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1]">
                          {skill.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#667085] dark:text-[#94A3B8] mt-0.5">
                        Claimed: <span className="font-semibold text-[#172033] dark:text-[#F8FAFC]">{skill.claimedLevel || skill.level}</span>
                        {isVerified && (
                          <> • Verified: <span className="font-bold text-[#16A34A] dark:text-[#86EFAC]">{skill.verifiedLevel || skill.level}</span></>
                        )}
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isVerified
                        ? 'bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC] border border-[#86EFAC]/40 dark:border-[#166534]'
                        : 'bg-[#FEF3C7] dark:bg-[#78350F] text-[#D97706] dark:text-[#FDE68A] border border-[#FDE68A]/40 dark:border-[#B45309]'
                    }`}>
                      {isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                    </span>
                  </div>

                  {/* 4-Bar Confidence Breakdown Graph */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-[#667085] dark:text-[#94A3B8] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#2F6FED]" />
                        Overall Confidence
                      </span>
                      <span className="font-extrabold font-mono text-[#172033] dark:text-[#F8FAFC]">
                        {skill.confidence}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#E4E9F0] dark:bg-[#1E293B] overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isVerified ? 'bg-[#16A34A]' : 'bg-[#D97706]'
                        }`}
                        style={{ width: `${skill.confidence}%` }}
                      />
                    </div>

                    {/* Micro decomposition bar indicators */}
                    <div className="grid grid-cols-3 gap-1 text-[10px] text-[#667085] dark:text-[#94A3B8] pt-0.5">
                      <div>Claimed: <span className="font-mono font-semibold">{skill.confidenceBreakdown?.claimed || 95}%</span></div>
                      <div>Evidence: <span className="font-mono font-semibold text-[#16A34A]">{skill.confidenceBreakdown?.evidence || (isVerified ? 90 : 20)}%</span></div>
                      <div>AI Rubric: <span className="font-mono font-semibold text-[#2F6FED]">{skill.confidenceBreakdown?.assessment || (isVerified ? 92 : 30)}%</span></div>
                    </div>
                  </div>

                  {/* Evidence summary preview */}
                  <div className="text-xs p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750]">
                    {skill.evidenceItems && skill.evidenceItems.length > 0 ? (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#172033] dark:text-[#F8FAFC] font-medium truncate max-w-[200px]">
                          📄 {skill.evidenceItems[0].title}
                        </span>
                        <span className="text-[#16A34A] dark:text-[#86EFAC] font-semibold shrink-0">
                          {skill.evidenceItems.length} artifact{skill.evidenceItems.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-[#D97706] dark:text-[#FDE68A] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Self-claimed only. Add code evidence to unlock job match points.</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#E4E9F0] dark:border-[#263750]">
                    <button
                      onClick={() => onOpenEvidenceDetail(skill)}
                      className="text-xs font-semibold text-[#2F6FED] dark:text-[#4F8CFF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Evidence & Audit Log</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    {!isVerified && (
                      <button
                        onClick={() => onOpenAddSkill(skill.name)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all cursor-pointer shadow-2xs"
                      >
                        Prove Skill Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: VERIFICATION CENTER */}
      {activeTab === 'verification' && (
        <div className="space-y-5">
          
          {/* Summary Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F0FDF4] dark:bg-[#052E16]/40 border border-[#86EFAC] dark:border-[#166534]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#166534] dark:text-[#86EFAC]">VERIFIED SKILLS</span>
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div className="text-2xl font-extrabold text-[#166534] dark:text-[#86EFAC] font-mono mt-2">
                {verifiedSkills.length}
              </div>
              <p className="text-[11px] text-[#4B7C59] dark:text-[#86EFAC]/80 mt-0.5">
                Evidence approved and contributing to job match scores.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FEF3C7] dark:bg-[#78350F]/30 border border-[#FDE68A] dark:border-[#B45309]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#D97706] dark:text-[#FDE68A]">UNVERIFIED CLAIMS</span>
                <AlertCircle className="w-4 h-4 text-[#D97706]" />
              </div>
              <div className="text-2xl font-extrabold text-[#D97706] dark:text-[#FDE68A] font-mono mt-2">
                {unverifiedSkills.length}
              </div>
              <p className="text-[11px] text-[#B45309] dark:text-[#FDE68A]/80 mt-0.5">
                Self-claimed. Awaiting project code or repository evidence.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EBF3FF] dark:bg-[#16243A] border border-[#BFDBFE] dark:border-[#263750]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2F6FED] dark:text-[#4F8CFF]">PENDING REVIEWS</span>
                <Clock className="w-4 h-4 text-[#2F6FED]" />
              </div>
              <div className="text-2xl font-extrabold text-[#2F6FED] dark:text-[#4F8CFF] font-mono mt-2">
                {pendingSkills.length}
              </div>
              <p className="text-[11px] text-[#2F6FED]/80 dark:text-[#94A3B8] mt-0.5">
                Submitted artifacts pending automated AI AST parsing.
              </p>
            </div>
          </div>

          {/* Actionable Unverified Skills Table / List */}
          {unverifiedSkills.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033] dark:text-[#F8FAFC]">
                  Action Needed: Prove Unverified Skills
                </h3>
                <span className="text-xs text-[#667085] dark:text-[#94A3B8]">
                  Proving these skills will unlock additional match points
                </span>
              </div>

              <div className="divide-y divide-[#E4E9F0] dark:divide-[#263750]">
                {unverifiedSkills.map((skill) => (
                  <div key={skill.name} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC]">{skill.name}</div>
                      <div className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
                        Self-assessed {skill.claimedLevel || skill.level} • Missing code or repository evidence
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateToWhatIf(skill.name)}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-colors"
                      >
                        Simulate Impact
                      </button>
                      <button
                        onClick={() => onOpenAddSkill(skill.name)}
                        className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all cursor-pointer shadow-2xs"
                      >
                        Upload Proof
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: EVIDENCE TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
            Complete Evidence Verification Audit Log
          </h3>

          <div className="space-y-4 pl-3 border-l-2 border-[#E4E9F0] dark:border-[#263750] ml-2">
            {candidate.skills.flatMap(s => (s.timeline || []).map(t => ({ ...t, skill: s.name }))).map((ev, i) => (
              <div key={i} className="relative pl-5 text-xs">
                <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-[#2F6FED] border-2 border-white dark:border-[#0F172A]" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172033] dark:text-[#F8FAFC]">
                    {ev.skill}: {ev.action}
                  </span>
                  <span className="text-[10px] text-[#667085] dark:text-[#94A3B8] font-mono">{ev.date}</span>
                </div>
                {ev.note && (
                  <p className="text-[11px] text-[#667085] dark:text-[#94A3B8] mt-0.5">{ev.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROJECTS & EXPERIENCE */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Projects Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
              Portfolio Projects & Code Repositories ({candidate.projects.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidate.projects.map(project => (
                <div key={project.id} className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">{project.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC]">
                      Code Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563] dark:text-[#94A3B8]">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
              Professional Work & Internship History ({candidate.experience.length})
            </h3>
            <div className="space-y-3">
              {candidate.experience.map(exp => (
                <div key={exp.id} className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">{exp.role}</h4>
                      <p className="text-xs text-[#2F6FED] dark:text-[#4F8CFF] font-medium">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono text-[#667085] dark:text-[#94A3B8]">{exp.period}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.highlights.map((h, i) => (
                      <span key={i} className="text-[11px] text-[#667085] dark:text-[#94A3B8] flex items-center gap-1">
                        • {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EDUCATION & CERTIFICATIONS */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
              Academic Credentials
            </h3>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#172033] dark:text-[#F8FAFC]">
                  {candidate.education.degree} in {candidate.education.field}
                </h4>
                <span className="text-xs font-mono text-[#667085] dark:text-[#94A3B8]">{candidate.education.year}</span>
              </div>
              <p className="text-xs text-[#2F6FED] dark:text-[#4F8CFF]">{candidate.education.institution}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E4E9F0] dark:border-[#263750] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8]">
              Verified Certifications ({candidate.certifications?.length || 0})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {candidate.certifications?.map(cert => (
                <div key={cert.id} className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC]">{cert.name}</h4>
                    <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  </div>
                  <p className="text-[11px] text-[#667085] dark:text-[#94A3B8]">{cert.issuer} • {cert.date}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {cert.skills.map((s, idx) => (
                      <span key={idx} className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#EBF3FF] dark:bg-[#1E293B] text-[#2F6FED] dark:text-[#4F8CFF]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
