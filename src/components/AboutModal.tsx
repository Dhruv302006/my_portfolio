import React, { useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-[#0a0606] border border-red-500/25 rounded-2xl p-6 sm:p-8 text-white shadow-2xl space-y-6 font-light"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Profile Header */}
        <div className="space-y-1.5 pr-8">
          <span className="inline-block text-[11px] uppercase tracking-wider font-light text-red-400 bg-red-950/60 border border-red-500/30 px-2.5 py-0.5 rounded-full">
            Engineer Profile
          </span>
          <h2
            id="about-modal-title"
            className="text-2xl sm:text-3xl font-light tracking-tight text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {PERSONAL_INFO.name}
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
            {PERSONAL_INFO.education} • {PERSONAL_INFO.institution}
          </p>
        </div>

        {/* Positions of Responsibility */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-red-400/80 font-light">
            Positions of Responsibility
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {PERSONAL_INFO.positions.map((pos, index) => (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              >
                <div>
                  <div className="text-sm font-normal text-white">{pos.role}</div>
                  <div className="text-xs text-white/60 font-light">{pos.organization}</div>
                  <div className="text-xs text-white/75 mt-1 font-light">{pos.description}</div>
                </div>
                <div className="text-xs text-red-400 font-mono shrink-0 sm:text-right font-light">
                  {pos.period}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-red-400/80 font-light">
            Technical Competencies
          </h3>
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
              <span className="text-white/50 uppercase text-[11px] font-light block mb-1.5">Programming Languages</span>
              <div className="flex flex-wrap gap-1.5">
                {PERSONAL_INFO.skills.programming.map((s) => (
                  <span key={s} className="px-2.5 py-0.5 rounded-md bg-white/10 text-white/90 font-light">{s}</span>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
              <span className="text-white/50 uppercase text-[11px] font-light block mb-1.5">Databases & Distributed Backend</span>
              <div className="flex flex-wrap gap-1.5">
                {PERSONAL_INFO.skills.databases_backend.map((s) => (
                  <span key={s} className="px-2.5 py-0.5 rounded-md bg-white/10 text-white/90 font-light">{s}</span>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
              <span className="text-white/50 uppercase text-[11px] font-light block mb-1.5">Applied AI & Machine Learning</span>
              <div className="flex flex-wrap gap-1.5">
                {PERSONAL_INFO.skills.ai_llm.map((s) => (
                  <span key={s} className="px-2.5 py-0.5 rounded-md bg-white/10 text-white/90 font-light">{s}</span>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
              <span className="text-white/50 uppercase text-[11px] font-light block mb-1.5">DevOps & Cloud Tools</span>
              <div className="flex flex-wrap gap-1.5">
                {PERSONAL_INFO.skills.devops_tools.map((s) => (
                  <span key={s} className="px-2.5 py-0.5 rounded-md bg-white/10 text-white/90 font-light">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Extracurriculars & Courses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 space-y-1.5">
            <h4 className="text-xs uppercase tracking-wider text-red-400/80 font-light">Extracurriculars</h4>
            <ul className="text-xs sm:text-sm text-white/80 space-y-1 font-light">
              {PERSONAL_INFO.extracurriculars.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 space-y-1.5">
            <h4 className="text-xs uppercase tracking-wider text-red-400/80 font-light">Certifications</h4>
            <ul className="text-xs sm:text-sm text-white/80 space-y-1 font-light">
              {PERSONAL_INFO.certifications.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>{c.title} <span className="text-white/50">({c.issuer})</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-white/70 font-light flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Direct Contact:</span>
            <a href="mailto:thakurdhruv@gmail.com" className="text-red-400 underline">thakurdhruv@gmail.com</a>
            <span className="text-white/30">•</span>
            <a href="mailto:milindt.102@gmail.com" className="text-red-400 underline">milindt.102@gmail.com</a>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-light uppercase tracking-wider rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
