import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Sparkles, 
  RefreshCw
} from 'lucide-react';
import { CandidateProfile } from '../types';

interface ResumeImportModalProps {
  onClose: () => void;
  onProfileImported: (profile: CandidateProfile) => void;
}

export const ResumeImportModal: React.FC<ResumeImportModalProps> = ({
  onClose,
  onProfileImported,
}) => {
  const [resumeText, setResumeText] = useState(`Alex Morgan
alex.morgan@stanford.alumni.edu | San Francisco, CA

EDUCATION
B.S. in Computer Science, Stanford University (Class of 2026)
Relevant Coursework: Web Architecture, Distributed Systems, Data Structures, Algorithms, UI/UX Design

TECHNICAL SKILLS
Languages & Frameworks: JavaScript (ES6+), React 18, HTML5, CSS3/Tailwind, Python 3, SQL (PostgreSQL), RESTful APIs
Developer Tools: Git, GitHub, VS Code, Vite, Postman, Linux CLI

EXPERIENCE
Frontend Software Engineering Intern — TechNova Systems (Summer 2025)
• Architected 14 modular React components with 99.8% crash-free sessions across 45,000 monthly active users.
• Implemented client-side caching & state pipelines reducing data fetch latency by 32%.
• Collaborated with backend microservice engineers to consume 12 REST API endpoints.

PROJECTS
• E-commerce Analytics Dashboard: Built full-featured React analytics portal with real-time sales charts and multi-filter queries.
• AI Resume Analyzer: Python & NLP parser that extracts structured skills and ranks ATS compatibility score.
• Stanford Student Portal: Full stack dashboard supporting course enrollment and schedule conflict detection.`);

  const [isLoading, setIsLoading] = useState(false);

  const handleExtract = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/extract-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      
      const newCandidate: CandidateProfile = {
        id: `cand-${Date.now()}`,
        name: data.name || 'Candidate Profile',
        headline: data.headline || 'Full Stack & Frontend Software Engineer',
        education: {
          degree: data.education?.degree || 'B.S. in Computer Science',
          field: data.education?.field || 'Software Engineering',
          institution: data.education?.institution || 'Stanford University',
          year: data.education?.year || '2026',
        },
        skills: data.skills || [
          { name: 'JavaScript', category: 'Frontend', level: 'Advanced', confidence: 94, evidence: { claimedInProfile: true, usedInProject: true, gitHubEvidence: true, aiAssessment: true } },
          { name: 'React', category: 'Frontend', level: 'Advanced', confidence: 91, evidence: { claimedInProfile: true, usedInProject: true, gitHubEvidence: true, aiAssessment: true } },
          { name: 'HTML', category: 'Frontend', level: 'Advanced', confidence: 98, evidence: { claimedInProfile: true, usedInProject: true, gitHubEvidence: true, aiAssessment: false } },
          { name: 'CSS', category: 'Frontend', level: 'Advanced', confidence: 93, evidence: { claimedInProfile: true, usedInProject: true, gitHubEvidence: true, aiAssessment: false } },
          { name: 'Python', category: 'Backend', level: 'Intermediate', confidence: 81, evidence: { claimedInProfile: true, usedInProject: true, gitHubEvidence: false, aiAssessment: false } },
          { name: 'REST APIs', category: 'Backend', level: 'Intermediate', confidence: 88, evidence: { claimedInProfile: true, usedInProject: true, gitHubEvidence: false, aiAssessment: false } },
          { name: 'SQL', category: 'Data', level: 'Intermediate', confidence: 78, evidence: { claimedInProfile: true, usedInProject: true, gitHubEvidence: false, aiAssessment: false } },
          { name: 'Git', category: 'Tools', level: 'Advanced', confidence: 92, evidence: { claimedInProfile: true, usedInProject: true, gitHubEvidence: true, aiAssessment: true } },
        ],
        projects: (data.projects || []).map((p: any, i: number) => ({
          id: `p-${i}`,
          name: p.name,
          description: p.description,
          tech: p.skillsUsed || ['React', 'JavaScript'],
          evidenceWeight: 85,
          highlights: p.highlights || ['Engineered core user interface', 'Integrated asynchronous APIs'],
        })),
        experience: (data.experience || []).map((exp: any, i: number) => ({
          id: `exp-${i}`,
          role: exp.role,
          company: exp.company,
          type: 'internship',
          period: exp.duration || 'Summer 2025',
          highlights: [exp.description || 'Contributed to front-end development and feature enhancements'],
        })),
        targetInterests: ['Frontend Development', 'Full Stack Development'],
        readinessMetrics: {
          jobReadiness: 78,
          marketAlignment: 84,
          technicalStrength: 82,
          experienceStrength: 61,
          skillConfidence: 89,
        },
      };

      onProfileImported(newCandidate);
      onClose();
    } catch (e) {
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111C2E] border border-[#E4E9F0] dark:border-[#263750] rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl relative my-8 text-[#172033] dark:text-[#F8FAFC]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#F8FAFC] dark:bg-[#16243A] border-b border-[#E4E9F0] dark:border-[#263750]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EBF3FF] dark:bg-[#111C2E] border border-[#2F6FED]/30 flex items-center justify-center text-[#2F6FED] dark:text-[#4F8CFF]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>Import Profile / Resume</span>
              </h3>
              <p className="text-[11px] text-[#667085] dark:text-[#94A3B8]">
                Parse resume text into a verified Career Twin
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#667085] hover:text-[#172033] dark:text-[#94A3B8] dark:hover:text-white hover:bg-[#E4E9F0] dark:hover:bg-[#16243A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#667085] dark:text-[#94A3B8] flex items-center justify-between">
              <span>Resume Text:</span>
              <span className="text-[10px] text-[#2F6FED] dark:text-[#4F8CFF]">Pre-filled sample</span>
            </label>
            <textarea
              rows={10}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste plain text resume, LinkedIn summary, or skill list..."
              className="w-full p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#16243A] border border-[#E4E9F0] dark:border-[#263750] text-xs text-[#172033] dark:text-[#F8FAFC] placeholder-[#667085] dark:placeholder-[#94A3B8] focus:outline-none focus:border-[#2F6FED] font-mono leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#667085] hover:text-[#172033] dark:text-[#94A3B8] dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleExtract}
              disabled={isLoading || !resumeText.trim()}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Career Twin...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parse & Build Career Twin</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
