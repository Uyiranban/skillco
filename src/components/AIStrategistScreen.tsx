import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Radar, 
  GitBranch, 
  Zap, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { CandidateProfile, JobMatchResult, SkillGapAnalysisItem } from '../types';
import { calculateCareerReadiness, getBestNextSkill } from '../utils/matcher';
import { ScreenTab } from './Navigation';

interface AIStrategistScreenProps {
  candidate: CandidateProfile;
  jobMatches: JobMatchResult[];
  gapAnalysis: SkillGapAnalysisItem[];
  onSelectTab: (tab: ScreenTab) => void;
  onOpenAddSkill: (skillName?: string) => void;
  onSelectJob: (jobMatch: JobMatchResult) => void;
  onNavigateToWhatIf: (skillName: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: {
    type: 'nav' | 'add_skill' | 'view_job' | 'simulate';
    label: string;
    targetTab?: ScreenTab;
    skillName?: string;
    jobId?: string;
  };
}

export const AIStrategistScreen: React.FC<AIStrategistScreenProps> = ({
  candidate,
  jobMatches,
  gapAnalysis,
  onSelectTab,
  onOpenAddSkill,
  onSelectJob,
  onNavigateToWhatIf,
}) => {
  const readiness = calculateCareerReadiness(candidate, jobMatches);
  const bestNextSkill = getBestNextSkill(candidate, gapAnalysis, jobMatches);
  const topJob = jobMatches[0];
  const verifiedSkills = candidate.skills.filter(
    s => s.verificationStatus === 'verified' || s.verificationStatus === 'supported'
  );
  const hasVerifiedTS = candidate.skills.some(
    s => s.name.toLowerCase() === 'typescript' && (s.verificationStatus === 'verified' || s.verificationStatus === 'supported')
  );

  const initialGreeting = hasVerifiedTS
    ? `Welcome back, ${candidate.name.split(' ')[0]}. Your TypeScript verification is live across all systems. Your ${topJob?.job.title || 'Frontend Engineer'} fit is currently ${topJob?.overallScore || 91}%. How can I guide your next strategic career milestone?`
    : `Hello ${candidate.name.split(' ')[0]}! I am your SkillPilot Career Strategist. I have live context on your ${verifiedSkills.length} verified skills, current ${topJob?.overallScore || 91}% match for ${topJob?.job.title || 'Frontend Engineer'}, and ${gapAnalysis.length} active skill gaps. What would you like to explore today?`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const suggestedPrompts = [
    { text: `Show my remaining skill gaps for ${topJob?.job.title || 'Frontend Engineer'}`, action: 'gaps' },
    { text: `Why am I matched ${topJob?.overallScore || 91}% for ${topJob?.job.title || 'Frontend Engineer'}?`, action: 'top_match' },
    { text: `Simulate learning ${bestNextSkill.skill || 'Docker'} in What-If`, action: 'simulate' },
    { text: 'How do I prove my unverified skills with evidence?', action: 'unverified' },
  ];

  const handleSendMessage = async (customText?: string) => {
    const text = customText || inputQuery;
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      // Grounded request with live state
      const response = await fetch('/api/gemini/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          candidate: {
            name: candidate.name,
            headline: candidate.headline,
            verifiedSkills: verifiedSkills.map(s => `${s.name} (${s.level})`),
            targetInterests: candidate.targetInterests,
          },
          topMatch: {
            title: topJob?.job.title,
            company: topJob?.job.company || topJob?.job.companyTier,
            score: topJob?.overallScore,
          },
          gaps: gapAnalysis.slice(0, 3).map(g => g.skill),
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply || data.response || "Based on your verified skills and code evidence, you have strong alignment with target engineering roles.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Detect contextual action button
      const lower = text.toLowerCase();
      if (lower.includes('gap') || lower.includes('path')) {
        aiMsg.action = { type: 'nav', label: 'Open Career Path & Gaps', targetTab: 'career-path' };
      } else if (lower.includes('docker') || lower.includes('simulate') || lower.includes('what-if')) {
        aiMsg.action = { type: 'simulate', label: `Simulate ${bestNextSkill.skill || 'Docker'} in What-If`, skillName: bestNextSkill.skill || 'Docker' };
      } else if (lower.includes('why') || lower.includes('match') || lower.includes('frontend')) {
        aiMsg.action = { type: 'view_job', label: `View ${topJob?.job.title} Deep Dive`, jobId: topJob?.job.id };
      } else if (lower.includes('unverified') || lower.includes('prove')) {
        aiMsg.action = { type: 'nav', label: 'Open Verification Center', targetTab: 'profile' };
      }

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn('AI chat fallback engaged:', err);
      
      let fallbackText = `Based on your live profile state, you possess ${verifiedSkills.length} evidence-verified skills including React (Advanced), JavaScript (Advanced), and Python. Your highest leverage next step is closing critical gaps in your target career roadmap.`;
      let fallbackAction: Message['action'] | undefined = undefined;

      if (text.toLowerCase().includes('gap')) {
        fallbackText = `Your primary skill gaps across target roles are ${gapAnalysis.slice(0, 3).map(g => g.skill).join(', ')}. Closing ${bestNextSkill.skill} will yield the highest immediate match increase.`;
        fallbackAction = { type: 'nav', label: 'View Career Path Roadmap', targetTab: 'career-path' };
      } else if (text.toLowerCase().includes('simulate') || text.toLowerCase().includes('docker') || text.toLowerCase().includes('what-if')) {
        fallbackText = `Simulating ${bestNextSkill.skill} boosts your overall fit across target roles and moves you closer to 100% interview readiness.`;
        fallbackAction = { type: 'simulate', label: `Launch What-If with ${bestNextSkill.skill}`, skillName: bestNextSkill.skill };
      } else if (text.toLowerCase().includes('why') || text.toLowerCase().includes('match') || text.toLowerCase().includes('frontend')) {
        fallbackText = `You are matched ${topJob?.overallScore}% for ${topJob?.job.title} at ${topJob?.job.company || topJob?.job.companyTier} because you have ${topJob?.matchedSkills.length} verified matching skills including React, JavaScript, and CSS/Tailwind, backed by code repository AST evidence.`;
        fallbackAction = { type: 'view_job', label: `Inspect ${topJob?.job.title} Breakdown`, jobId: topJob?.job.id };
      } else if (text.toLowerCase().includes('prove') || text.toLowerCase().includes('unverified')) {
        fallbackText = `You can prove skills via 4 distinct evidence paths: GitHub Repository Code, Pull Request / Architecture, Verified Certificate, or interactive Technical Assessment.`;
        fallbackAction = { type: 'nav', label: 'Open Profile to Prove Skills', targetTab: 'profile' };
      }

      const fallbackMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: fallbackAction,
      };

      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExecuteAction = (action: Message['action']) => {
    if (!action) return;
    if (action.type === 'nav' && action.targetTab) {
      onSelectTab(action.targetTab);
    } else if (action.type === 'simulate' && action.skillName) {
      onNavigateToWhatIf(action.skillName);
    } else if (action.type === 'view_job' && topJob) {
      onSelectJob(topJob);
    } else if (action.type === 'add_skill') {
      onOpenAddSkill(action.skillName);
    }
  };

  return (
    <div id="ai-strategist-screen" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Dedicated Workspace Grid: Left Conversation, Right Career Context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left (2 Columns): AI Conversation Workspace */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Workspace Title Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2F6FED] text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    SkillPilot AI Strategist
                  </h1>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2F6FED] dark:text-[#60A5FA] border border-[#BFDBFE] dark:border-[#334155] uppercase font-mono">
                    Context-Aware
                  </span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Context-aware career intelligence grounded in your verified skills and target roles.
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#64748B] dark:text-[#94A3B8]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Grounded Model</span>
            </div>
          </div>

          {/* Chat Container */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs flex flex-col h-[540px]">
            
            {/* Scrollable Message History */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-[#2F6FED] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`max-w-[85%] sm:max-w-[80%] space-y-2 ${
                      isUser
                        ? 'bg-[#2F6FED] text-white p-3.5 rounded-2xl rounded-tr-xs shadow-2xs'
                        : 'bg-[#F8FAFC] dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] p-3.5 rounded-2xl rounded-tl-xs border border-[#E2E8F0] dark:border-[#334155]'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      
                      {msg.action && (
                        <div className="pt-2">
                          <button
                            onClick={() => handleExecuteAction(msg.action)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <span>{msg.action.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className={`text-[10px] text-right ${isUser ? 'text-white/70' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>
                        {msg.timestamp}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-[#0F172A] dark:bg-[#334155] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        AM
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3 text-xs justify-start">
                  <div className="w-7 h-7 rounded-lg bg-[#2F6FED] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#F8FAFC] dark:bg-[#1E293B] p-3 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#2F6FED] animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-[#2F6FED] animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-[#2F6FED] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Chips */}
            <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex flex-wrap gap-1.5 mb-3">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.text)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#F8FAFC] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2F6FED]/50 transition-all cursor-pointer truncate max-w-full sm:max-w-[280px]"
                >
                  {p.text}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about your skills, match reasons, or next career moves..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#111C2E] text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2F6FED] transition-colors"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-2.5 rounded-xl text-white bg-[#2F6FED] hover:bg-[#2557BD] disabled:opacity-50 transition-all cursor-pointer shadow-2xs shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

        {/* Right (1 Column): Live Career Context Panel */}
        <div className="space-y-4">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#1E293B] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2F6FED]" />
                Live Career Context
              </span>
              <span className="text-[10px] font-mono text-[#16A34A] dark:text-[#86EFAC] font-semibold">
                ● Synchronized
              </span>
            </div>

            {/* Metric 1: Career Readiness */}
            <div 
              onClick={() => handleSendMessage(`Analyze my composite career readiness score of ${readiness.jobReadiness}% and tell me how to reach 90%`)}
              className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2F6FED]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">Career Readiness</span>
                <span className="font-mono font-black text-base text-[#2F6FED] dark:text-[#60A5FA]">
                  {readiness.jobReadiness}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] dark:bg-[#334155] overflow-hidden mt-2">
                <div 
                  className="h-full rounded-full bg-[#2F6FED] dark:bg-[#60A5FA]" 
                  style={{ width: `${readiness.jobReadiness}%` }}
                />
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-1.5 group-hover:text-[#2F6FED] dark:group-hover:text-[#60A5FA] flex items-center justify-between">
                <span>Click to analyze readiness</span>
                <ChevronRight className="w-3 h-3" />
              </p>
            </div>

            {/* Metric 2: Top Match */}
            <div 
              onClick={() => handleSendMessage(`Why am I matched ${topJob?.overallScore || 91}% for ${topJob?.job.title || 'Frontend Engineer'}?`)}
              className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2F6FED]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">Top Match</span>
                <span className="font-mono font-black text-sm text-[#16A34A] dark:text-[#86EFAC]">
                  {topJob?.overallScore || 91}%
                </span>
              </div>
              <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                {topJob?.job.title || 'Frontend Engineer'}
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-1 group-hover:text-[#2F6FED] dark:group-hover:text-[#60A5FA] flex items-center justify-between">
                <span>Click to explain match factors</span>
                <ChevronRight className="w-3 h-3" />
              </p>
            </div>

            {/* Metric 3: Best Next Skill */}
            <div 
              onClick={() => handleSendMessage(`Tell me why ${bestNextSkill.skill} is my highest leverage skill to learn and prove next.`)}
              className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2F6FED]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">Best Next Skill</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FEF3C7] dark:bg-[#78350F] text-[#D97706] dark:text-[#FDE68A]">
                  HIGH PRIORITY
                </span>
              </div>
              <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                {bestNextSkill.skill}
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-1 group-hover:text-[#2F6FED] dark:group-hover:text-[#60A5FA] flex items-center justify-between">
                <span>Click to view ROI breakdown</span>
                <ChevronRight className="w-3 h-3" />
              </p>
            </div>

            {/* Metric 4: Active Skill Gaps */}
            <div 
              onClick={() => handleSendMessage(`List my top 3 active skill gaps and give me a 2-week learning plan.`)}
              className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2F6FED]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">Active Skill Gaps</span>
                <span className="font-mono font-bold text-xs text-[#DC2626] dark:text-[#F87171]">
                  {gapAnalysis.length} Gaps
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {gapAnalysis.slice(0, 3).map((g, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-[#334155] dark:text-[#CBD5E1]">
                    {g.skill}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-1.5 group-hover:text-[#2F6FED] dark:group-hover:text-[#60A5FA] flex items-center justify-between">
                <span>Click to generate closure strategy</span>
                <ChevronRight className="w-3 h-3" />
              </p>
            </div>

            {/* Quick Actions at bottom of context */}
            <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B] space-y-2">
              <button
                onClick={() => onSelectTab('career-path')}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-[#2F6FED] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#1E293B] hover:bg-[#DBEAFE] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Open Full Career Roadmap</span>
              </button>

              <button
                onClick={() => onOpenAddSkill(bestNextSkill.skill)}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#2F6FED] hover:bg-[#2557BD] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Prove {bestNextSkill.skill} Now</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
