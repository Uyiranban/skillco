export type SkillCategory = 'Frontend' | 'Backend' | 'Data' | 'Tools' | 'Cloud' | 'Architecture';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

// Canonical verification states
export type SkillVerificationStatus = 
  | 'VERIFIED' 
  | 'SUPPORTED' 
  | 'PENDING REVIEW' 
  | 'CLAIMED' 
  | 'REJECTED'
  | 'verified' 
  | 'supported' 
  | 'pending' 
  | 'unverified' 
  | 'rejected';

export interface EvidenceFile {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  previewUrl?: string;
}

export interface SkillEvidenceItem {
  id: string;
  skillId?: string;
  type: 'project' | 'certificate' | 'github' | 'portfolio' | 'assessment' | 'document';
  title: string;
  fileOrUrl?: string;
  url?: string;
  date: string;
  submittedAt?: string;
  files?: EvidenceFile[];
  description?: string;
  personalContribution?: string;
  relevantPaths?: string;
  technologiesUsed?: string[];
  issuer?: string;
  credentialId?: string;
  credentialUrl?: string;
  liveDemoUrl?: string;
  relevance?: 'High' | 'Medium' | 'Low';
  quality?: 'Strong' | 'Moderate' | 'Weak';
  relevanceScore?: 'High' | 'Medium' | 'Low';
  qualityScore?: 'Strong' | 'Moderate' | 'Weak';
  summary?: string;
  detectedTech?: string[];
  strengths?: string[];
  missingPoints?: string[];
  verifiedScore?: number;
  aiConfidence?: number;
  status?: 'CLAIMED' | 'PENDING REVIEW' | 'SUPPORTED' | 'VERIFIED' | 'REJECTED' | 'WEAK';
  technicalScore?: number;
  whyExplanation?: string;
}

export interface EvidenceTimelineItem {
  date: string;
  action: string;
  note?: string;
}

export interface SkillConfidenceBreakdown {
  claimed: number;
  evidence: number;
  assessment: number;
  overall: number;
}

export interface SkillEvidence {
  claimedInProfile: boolean;
  usedInProject: boolean;
  gitHubEvidence: boolean;
  aiAssessment: boolean;
  verifiedLevel?: string;
  verifiedScore?: number;
  lastValidated?: string;
}

export interface SkillItem {
  id?: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel; // Effective/current level
  claimedLevel?: SkillLevel;
  verifiedLevel?: SkillLevel;
  verificationStatus: SkillVerificationStatus;
  status?: 'CLAIMED' | 'PENDING REVIEW' | 'SUPPORTED' | 'VERIFIED' | 'REJECTED';
  confidence: number; // 0-100
  evidenceIds?: string[];
  evidence: SkillEvidence;
  evidenceItems?: SkillEvidenceItem[];
  timeline?: EvidenceTimelineItem[];
  confidenceBreakdown?: SkillConfidenceBreakdown;
  lastReviewed?: string;
  impact?: {
    rolesUnlocked: number;
    matchScoreUplift: number;
    salaryUplift: string;
  };
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  tech: string[];
  evidenceWeight: number; // 0-100
  highlights: string[];
  link?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  type: 'internship' | 'project' | 'full-time' | 'contract';
  period: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  skills: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

export interface CandidateProfile {
  id: string;
  name: string;
  headline: string;
  avatar?: string;
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certifications?: CertificationItem[];
  education: {
    degree: string;
    field: string;
    institution: string;
    year: string;
  };
  targetInterests: string[];
  readinessMetrics: {
    jobReadiness: number; // e.g. 78%
    marketAlignment: number; // e.g. 84%
    technicalStrength: number; // e.g. 82%
    experienceStrength: number; // e.g. 61%
    skillConfidence: number; // e.g. 89%
  };
}

export interface RequiredSkillSpec {
  name: string;
  importance: number; // 1 to 5 (5 is critical)
  minLevel: SkillLevel;
  category: SkillCategory;
  semanticEquivalents?: string[];
}

export interface JobProfile {
  id: string;
  title: string;
  company?: string;
  category: 'Frontend' | 'Full Stack' | 'Backend' | 'Software Engineering' | 'Data & AI' | 'DevOps & Cloud' | 'Security';
  companyTier: 'Top Tech' | 'High-Growth Startup' | 'Enterprise Scale' | 'Design Studio';
  salaryRange: string;
  location: string;
  remoteType: 'Remote' | 'Hybrid' | 'On-site';
  requiredSkills: RequiredSkillSpec[];
  preferredSkills: string[];
  experienceRequiredYears: number;
  educationRequired: string;
  demandLevel: 'Very High' | 'High' | 'Moderate';
  openPositions: number;
  description: string;
}

export type SkillClassificationType = 'exact' | 'semantic' | 'partial' | 'missing';

export interface SkillClassification {
  skillName: string;
  type: SkillClassificationType;
  candidateLevel?: SkillLevel;
  requiredLevel: SkillLevel;
  candidateConfidence?: number;
  importance: number;
  explanation: string;
}

export type JobFitTier = 'READY NOW' | 'SMALL GAP' | 'UPSKILL REQUIRED';

export interface JobMatchResult {
  job: JobProfile;
  overallScore: number; // 0 - 100
  tier: JobFitTier;
  rank: number;
  breakdown: {
    requiredSkillCoverage: number; // 35% weight
    skillImportance: number;       // 25% weight
    experienceAlignment: number;   // 15% weight
    projectEvidence: number;       // 10% weight
    educationAlignment: number;    // 10% weight
    careerPreference: number;      // 5% weight
    marketAlignment: number;       // metric
  };
  matchedSkills: SkillClassification[];
  semanticSkills: SkillClassification[];
  partialSkills: SkillClassification[];
  missingSkills: SkillClassification[];
  whyYouMatch: string;
  gapSize: 'Minimal' | 'Small' | 'Moderate' | 'Large';
  topActionableGap?: string;
}

export interface SkillGapAnalysisItem {
  skill: string;
  category: SkillCategory;
  currentLevel: SkillLevel | 'None';
  requiredLevel: SkillLevel;
  gapDegree: 'Low' | 'Medium' | 'High' | 'None';
  importance: 'Critical' | 'High' | 'Medium';
  rolesImpacted: string[];
  effortWeeks: string;
  marketDemand: 'Surging' | 'High' | 'Steady';
}

export interface BestNextSkillRecommendation {
  skill: string;
  category: SkillCategory;
  tagline: string;
  priority: 'VERY HIGH' | 'HIGH' | 'MEDIUM';
  reasons: string[];
  potentialOpportunitiesUnlocked: number;
  averageSkillGapReductionPercent: number;
  estimatedEffortWeeks: string;
  learningDistance: 'Small (High Overlap)' | 'Moderate' | 'Large';
  impactOnTopMatches: {
    roleTitle: string;
    beforeScore: number;
    afterScore: number;
  }[];
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'Official Documentation' | 'Interactive Practice' | 'Mini Project' | 'Architecture Deep Dive' | 'Portfolio Project';
  provider: string;
  estimatedTime: string;
  description: string;
  badge: string;
}

export interface SkillAssessmentResult {
  skillName: string;
  assessedLevel: SkillLevel | string;
  confidenceScore: number;
  feedback: string;
  passedRubricPoints: string[];
  improvementTips: string[];
}

export interface UpskillMilestone {
  id: string;
  stepNumber: number;
  skill: string;
  status: 'completed' | 'active' | 'upcoming';
  currentLevel: string;
  targetLevel: string;
  estimatedDuration: string;
  whyItMatters: string;
  unlockedImpact: string;
  resources: LearningResource[];
}

export interface WhatIfScenarioOption {
  skill: string;
  displayName: string;
  category: SkillCategory;
  iconName: string;
  estimatedEffort: string;
  description: string;
  whyLearn: string;
  impactMetrics: {
    opportunitiesUnlocked: number;
    skillGapsReduced: number;
    newCareerPaths: number;
    salaryUplift: string;
  };
  comparisonRoles: {
    roleId: string;
    roleTitle: string;
    beforeScore: number;
    afterScore: number;
    tierBefore: JobFitTier;
    tierAfter: JobFitTier;
  }[];
}
