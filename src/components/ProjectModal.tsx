import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ProjectDetail } from '../data/portfolioData';

interface ProjectModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'demos' | 'readme'>('demos');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  // Lock background body scroll when modal is active
  useEffect(() => {
    if (project) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, lightboxOpen]);

  // Reset states when project changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setActiveTab('demos');
    setLightboxOpen(false);
  }, [project]);

  if (!project) return null;

  const currentImage = project.demoImages && project.demoImages.length > 0
    ? project.demoImages[selectedImageIndex]
    : null;

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeIndex(index);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    } catch {
      // Fallback
    }
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5 md:p-8 bg-black/90 backdrop-blur-xl animate-fade-in overflow-hidden"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <div
          className="relative w-full max-w-5xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto bg-[#0a0606] border border-red-500/25 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 text-white shadow-[0_0_100px_rgba(0,0,0,0.95)] space-y-6 sm:space-y-7 selection:bg-red-600 selection:text-white font-light"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar: Close Button & GitHub link */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 border-b border-white/10 pb-4 sm:pb-5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {project.badge && (
                <span className="inline-block text-[10px] sm:text-[11px] uppercase tracking-wider font-light text-red-400 bg-red-950/60 border border-red-500/30 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  {project.badge}
                </span>
              )}
              <span className="text-[11px] sm:text-xs text-white/50 font-mono font-light">
                {project.role}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-[11px] sm:text-xs text-red-300 hover:bg-red-900/60 hover:border-red-400 transition-colors flex items-center gap-1.5 font-light"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>Live App ↗</span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] sm:text-xs text-white hover:bg-white/20 transition-colors flex items-center gap-1.5 font-light"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span className="hidden sm:inline">Repository</span>
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Project Title & Subtitle */}
          <div className="space-y-2">
            <h2
              id="project-modal-title"
              className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {project.title}
            </h2>
            <p className="text-xs sm:text-base text-white/75 leading-relaxed max-w-3xl font-light">
              {project.subtitle}
            </p>
          </div>

          {/* Tab Navigation (If README content exists) */}
          {project.readmeContent && (
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('demos')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'demos'
                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] font-normal'
                    : 'text-white/70 hover:text-white hover:bg-white/5 font-light'
                }`}
              >
                <span>✦ Live Demos & Architecture</span>
                {project.demoImages && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 text-current font-mono">
                    {project.demoImages.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('readme')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'readme'
                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] font-normal'
                    : 'text-white/70 hover:text-white hover:bg-white/5 font-light'
                }`}
              >
                <span>📄 Full System README.md</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 text-current font-mono">
                  docs
                </span>
              </button>
            </div>
          )}

          {/* VIEW 1: Demos & Architecture */}
          {activeTab === 'demos' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Interactive Demo Gallery */}
              {project.demoImages && project.demoImages.length > 0 && currentImage && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-light uppercase tracking-wider text-red-400/80">
                      Live Telemetry & Execution Visuals
                    </span>
                    <span className="text-xs text-white/50 font-mono font-light">
                      Image {selectedImageIndex + 1} of {project.demoImages.length} • Click to enlarge
                    </span>
                  </div>

                  {/* Active Featured Image Viewer */}
                  <div
                    onClick={() => setLightboxOpen(true)}
                    className="relative group w-full rounded-2xl overflow-hidden border border-white/15 bg-black/80 shadow-2xl cursor-zoom-in"
                  >
                    <img
                      src={currentImage.url.startsWith('/') ? `${import.meta.env.BASE_URL}${currentImage.url.slice(1)}` : currentImage.url}
                      alt={currentImage.title}
                      className="w-full h-auto max-h-[520px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
                    />

                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Overlay Tag */}
                    {currentImage.tag && (
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-xs font-light text-red-200 backdrop-blur-md">
                          {currentImage.tag}
                        </span>
                      </div>
                    )}

                    {/* Bottom Title Banner */}
                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between pointer-events-none">
                      <span className="text-xs sm:text-base font-normal text-white drop-shadow-md truncate mr-2">
                        {currentImage.title}
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-black/70 border border-white/20 text-red-300 backdrop-blur-md font-light shrink-0">
                        Enlarge ⤢
                      </span>
                    </div>
                  </div>

                  {/* Caption Explanatory Box */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-red-950/20 border border-red-500/25 backdrop-blur-md space-y-1">
                    <div className="text-xs font-normal text-red-400">
                      Verified Architectural Feat:
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
                      {currentImage.caption}
                    </p>
                  </div>

                  {/* Thumbnail Row Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2">
                    {project.demoImages.map((img, idx) => {
                      const isSelected = idx === selectedImageIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.35)] scale-[1.02]'
                              : 'border-white/10 bg-white/[0.02] hover:border-red-500/30 hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="relative h-16 sm:h-20 w-full rounded-lg overflow-hidden bg-black/60">
                            <img
                              src={img.url.startsWith('/') ? `${import.meta.env.BASE_URL}${img.url.slice(1)}` : img.url}
                              alt={img.title}
                              className="w-full h-full object-cover object-top"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-red-600/15" />
                            )}
                          </div>
                          <div className="p-1 sm:p-1.5 space-y-0.5">
                            <div className="text-[10px] sm:text-[11px] font-normal text-white truncate">
                              {img.title}
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-white/50 font-mono truncate font-light">
                              {img.tag || `Demo ${idx + 1}`}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantitative Metrics Strip */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs uppercase tracking-wider text-red-400 font-light">
                    Verified Performance Metrics & Benchmarks
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {project.metrics.map((metric, i) => (
                      <div
                        key={i}
                        className="bg-[#120707]/60 border border-red-500/20 hover:border-red-500/50 rounded-2xl p-4.5 flex flex-col justify-between transition-colors shadow-lg"
                      >
                        <div className="text-2xl sm:text-3xl font-light tracking-tight text-white font-mono">
                          {metric.value}
                        </div>
                        <div className="mt-1.5">
                          <div className="text-xs font-light text-red-400 uppercase tracking-wider">
                            {metric.label}
                          </div>
                          {metric.detail && (
                            <div className="text-[11px] text-white/60 mt-0.5 leading-snug font-light">
                              {metric.detail}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Overview */}
              <div className="space-y-2.5">
                <h3 className="text-xs uppercase tracking-wider text-red-400 font-light">
                  System Architecture Overview
                </h3>
                <p className="text-sm sm:text-base text-white/85 leading-relaxed bg-[#120707]/40 border border-red-500/15 p-5 rounded-2xl font-light">
                  {project.overview}
                </p>
              </div>

              {/* Architectural Highlights */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-red-400 font-light">
                  Key Engineering Mechanisms & Innovations
                </h3>
                <ul className="space-y-3">
                  {project.architecturalHighlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="p-4 rounded-xl bg-[#120707]/40 border border-red-500/15 flex items-start gap-3 text-xs sm:text-sm text-white/85 leading-relaxed font-light"
                    >
                      <span className="text-red-500 mt-0.5 shrink-0 text-sm">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Tags */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs uppercase tracking-wider text-white/50 font-light">
                  Stack & Tooling
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-red-950/40 border border-red-500/20 text-white/90 font-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Full System README.md */}
          {activeTab === 'readme' && project.readmeContent && (
            <div className="space-y-8 animate-fadeIn font-sans font-light">
              {/* README File Header Badge */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/60 border border-red-500/20 text-xs font-mono text-white/60">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">📄</span>
                  <span className="text-white font-normal">README.md</span>
                  <span className="text-white/40">•</span>
                  <span>markdown</span>
                </div>
                <span className="text-red-400">Production Documentation</span>
              </div>

              {/* Summary Lead */}
              <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/25 text-sm sm:text-base text-white/90 leading-relaxed font-light">
                <span className="font-normal text-red-400 block mb-1">Executive Summary:</span>
                {project.readmeContent.summary}
              </div>

              {/* Readme Sections */}
              <div className="space-y-6">
                {project.readmeContent.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#120707]/40 border border-red-500/20 space-y-4"
                  >
                    <h4 className="text-lg sm:text-xl font-light text-white flex items-center gap-2 border-b border-red-500/15 pb-3">
                      <span className="text-red-500 font-mono text-sm">#</span>
                      <span>{section.title}</span>
                    </h4>

                    {/* Section Text Content with whitespace preservation */}
                    <div className="text-xs sm:text-sm text-white/80 leading-relaxed whitespace-pre-line font-light">
                      {section.content}
                    </div>

                    {/* Code Block if available */}
                    {section.codeBlock && (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs text-white/50 font-mono px-3">
                          <span>{section.codeBlock.language}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(section.codeBlock!.code, idx)}
                            className="text-red-400 hover:text-red-300 transition-colors cursor-pointer font-light"
                          >
                            {copiedCodeIndex === idx ? '✓ Copied' : 'Copy Code'}
                          </button>
                        </div>
                        <pre className="p-4 rounded-xl bg-black/90 border border-red-500/25 text-xs font-mono text-red-200 overflow-x-auto leading-relaxed">
                          <code>{section.codeBlock.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4 font-light">
            <div className="text-xs text-white/50">
              Role: <span className="text-white/80 font-normal">{project.role}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-light uppercase tracking-wider rounded-full bg-red-600 text-white hover:bg-red-500 transition-all cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.35)]"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox for Demo Images */}
      {lightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-[10000] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in cursor-zoom-out"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 text-white/80 hover:text-white bg-white/10 rounded-full cursor-pointer transition-colors"
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="max-w-6xl max-h-[85vh] flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentImage.url.startsWith('/') ? `${import.meta.env.BASE_URL}${currentImage.url.slice(1)}` : currentImage.url}
              alt={currentImage.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-white/20 shadow-2xl"
            />
            <div className="text-center space-y-1">
              <div className="text-base font-normal text-white">{currentImage.title}</div>
              <div className="text-xs text-white/70 max-w-2xl">{currentImage.caption}</div>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};

export default ProjectModal;
