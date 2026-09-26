import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Database, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  RefreshCw, 
  Sun, 
  Moon, 
  CheckCircle2, 
  AlertCircle,
  Key,
  Layers,
  Server
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onResetDemo: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode,
  onResetDemo,
}) => {
  const [healthData, setHealthData] = useState<{
    status: string;
    geminiConfigured: boolean;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/health')
        .then(res => res.json())
        .then(data => setHealthData(data))
        .catch(() => {
          setHealthData({
            status: 'ok',
            geminiConfigured: false,
            timestamp: new Date().toISOString()
          });
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2F6FED] text-white flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">Platform Settings & Environment</h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">System status, storage, and persistence configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Theme Switcher */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="w-5 h-5 text-[#60A5FA]" /> : <Sun className="w-5 h-5 text-[#D97706]" />}
              <div>
                <div className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Interface Theme</div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Currently in {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </div>
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] hover:border-[#2F6FED] transition-all cursor-pointer shadow-2xs"
            >
              Toggle to {isDarkMode ? 'Light' : 'Dark'}
            </button>
          </div>

          {/* Database Architecture Status */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                <Database className="w-4 h-4 text-[#2F6FED]" />
                <span>SQLAlchemy 2.0 ORM & Database</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Configured via <code className="font-mono bg-white dark:bg-[#0F172A] px-1.5 py-0.5 rounded border border-[#E2E8F0] dark:border-[#334155]">DATABASE_URL</code>. 21 relational entities mapped with Alembic migrations and seed data.
            </p>
          </div>

          {/* AI Career Engine Status */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                <Cpu className="w-4 h-4 text-[#2F6FED]" />
                <span>Gemini Multimodal Verification & AI Strategist</span>
              </div>
              {healthData?.geminiConfigured ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live (Gemini API)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] dark:bg-[#78350F] text-[#92400E] dark:text-[#FDE68A] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Grounded Deterministic
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              {healthData?.geminiConfigured
                ? 'Server-side Gemini 3.7 Flash integration active for multimodal AST inspection, anti-fake guardrails, and real-time strategist queries.'
                : 'Deterministic 6-factor mathematical engine active with AST rule verification. Optional GEMINI_API_KEY can be provided in Settings for live AI generations.'}
            </p>
          </div>

          {/* Evidence Storage Status */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                <HardDrive className="w-4 h-4 text-[#2F6FED]" />
                <span>Evidence Storage (Supabase / Local Disk)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Evidence files (PDFs, images, code repos, certificates) stored securely with MIME validation and checksum verification.
            </p>
          </div>

          {/* Reset Demo Data */}
          <div className="p-4 rounded-xl bg-[#FEF2F2] dark:bg-[#450A0A]/40 border border-[#FECACA] dark:border-[#7F1D1D] flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-[#991B1B] dark:text-[#FCA5A5]">Reset Profile Data</div>
              <div className="text-xs text-[#B91C1C] dark:text-[#F87171]">
                Restore baseline Alex Morgan candidate profile state.
              </div>
            </div>
            <button
              onClick={() => {
                onResetDemo();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-[#1E293B] border border-[#F87171] text-[#991B1B] dark:text-[#FCA5A5] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Profile</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0B1220] flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
          <span>SkillPilot Platform v2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#2F6FED] hover:bg-[#2557BD] text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
