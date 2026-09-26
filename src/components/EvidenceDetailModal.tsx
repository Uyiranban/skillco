import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Calendar, ExternalLink, Award, Code2, Sparkles, AlertCircle } from 'lucide-react';
import { SkillItem } from '../types';

interface EvidenceDetailModalProps {
  skill: SkillItem | null;
  onClose: () => void;
  onAddMoreEvidence?: (skillName: string) => void;
}

export const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({
  skill,
  onClose,
  onAddMoreEvidence,
}) => {
  if (!skill) return null;

  const isVerified = skill.verificationStatus === 'verified' || skill.verificationStatus === 'supported';

  return (
    <div id="evidence-detail-modal" className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-[#E4E9F0] dark:border-[#263750] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E9F0] dark:border-[#263750] bg-[#F8FAFC] dark:bg-[#111C2E]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2F6FED]/10 dark:bg-[#2F6FED]/20 text-[#2F6FED] dark:text-[#4F8CFF] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#172033] dark:text-[#F8FAFC]">{skill.name} Verification Record</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isVerified 
                    ? 'bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC]' 
                    : 'bg-[#FEF3C7] dark:bg-[#78350F] text-[#D97706] dark:text-[#FDE68A]'
                }`}>
                  {skill.verificationStatus || (isVerified ? 'VERIFIED' : 'UNVERIFIED')}
                </span>
              </div>
              <p className="text-xs text-[#667085] dark:text-[#94A3B8]">
                {skill.category} • Claimed: {skill.claimedLevel || skill.level} • Verified: {skill.verifiedLevel || skill.level}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#667085] hover:text-[#172033] dark:hover:text-[#F8FAFC] hover:bg-[#E4E9F0] dark:hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Confidence Breakdown Card */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#2F6FED]" />
                Evidence & Confidence Scoring
              </span>
              <span className="text-sm font-extrabold font-mono text-[#2F6FED] dark:text-[#4F8CFF]">
                {skill.confidence}% Overall
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750]">
                <span className="text-[10px] text-[#667085] dark:text-[#94A3B8] block">Self-Assessment</span>
                <span className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC] font-mono">
                  {skill.confidenceBreakdown?.claimed || 95}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750]">
                <span className="text-[10px] text-[#667085] dark:text-[#94A3B8] block">Code Evidence</span>
                <span className="text-xs font-bold text-[#16A34A] dark:text-[#86EFAC] font-mono">
                  {skill.confidenceBreakdown?.evidence || (isVerified ? 92 : 20)}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750]">
                <span className="text-[10px] text-[#667085] dark:text-[#94A3B8] block">AI Rubric</span>
                <span className="text-xs font-bold text-[#2F6FED] dark:text-[#4F8CFF] font-mono">
                  {skill.confidenceBreakdown?.assessment || (isVerified ? 90 : 30)}%
                </span>
              </div>
            </div>
          </div>

          {/* Evidence Artifacts List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8] mb-2.5">
              Verified Evidence Artifacts ({skill.evidenceItems?.length || 0})
            </h3>

            {skill.evidenceItems && skill.evidenceItems.length > 0 ? (
              <div className="space-y-2.5">
                {skill.evidenceItems.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-white dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#2F6FED]" />
                        <span className="text-xs font-bold text-[#172033] dark:text-[#F8FAFC]">
                          {item.title}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EBF3FF] dark:bg-[#1E293B] text-[#2F6FED] dark:text-[#4F8CFF]">
                        {item.type}
                      </span>
                    </div>

                    <p className="text-xs text-[#4B5563] dark:text-[#94A3B8]">
                      {item.summary}
                    </p>

                    {item.detectedTech && item.detectedTech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.detectedTech.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.fileOrUrl && (
                      <div className="text-[11px] text-[#2F6FED] dark:text-[#4F8CFF] flex items-center gap-1 font-mono pt-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>{item.fileOrUrl}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-xl bg-[#F8FAFC] dark:bg-[#111C2E] border border-dashed border-[#E4E9F0] dark:border-[#263750]">
                <AlertCircle className="w-6 h-6 text-[#D97706] mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC]">No Evidence Uploaded Yet</p>
                <p className="text-[11px] text-[#667085] dark:text-[#94A3B8] mt-0.5">
                  This skill is self-claimed. Add a project, repository, or assessment to verify it.
                </p>
              </div>
            )}
          </div>

          {/* Verification Timeline */}
          {skill.timeline && skill.timeline.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] dark:text-[#94A3B8] mb-2.5">
                Verification History
              </h3>
              <div className="space-y-2 pl-2 border-l-2 border-[#E4E9F0] dark:border-[#263750] ml-2">
                {skill.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-4 text-xs">
                    <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-[#2F6FED] border-2 border-white dark:border-[#0F172A]" />
                    <div className="font-semibold text-[#172033] dark:text-[#F8FAFC] flex items-center justify-between">
                      <span>{event.action}</span>
                      <span className="text-[10px] text-[#667085] dark:text-[#94A3B8] font-mono">{event.date}</span>
                    </div>
                    {event.note && (
                      <p className="text-[11px] text-[#667085] dark:text-[#94A3B8] mt-0.5">{event.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E4E9F0] dark:border-[#263750] bg-[#F8FAFC] dark:bg-[#111C2E] flex items-center justify-between">
          {onAddMoreEvidence && (
            <button
              onClick={() => {
                onClose();
                onAddMoreEvidence(skill.name);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#2F6FED] dark:text-[#4F8CFF] bg-[#EBF3FF] dark:bg-[#16243A] hover:bg-[#D9E8FF] transition-all cursor-pointer"
            >
              + Submit Additional Evidence
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-1.5 rounded-xl text-xs font-semibold text-[#667085] hover:text-[#172033] dark:hover:text-[#F8FAFC] bg-white dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
