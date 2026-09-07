import { useState } from 'react';
import { PROJECTS } from '../data/portfolioData';
import type { ProjectDetail } from '../data/portfolioData';
import { ProjectModal } from './ProjectModal';

export default function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<ProjectDetail | null>(null);

  const projectList: ProjectDetail[] = [
    PROJECTS.wallet,
    PROJECTS.ai_analyst,
    PROJECTS.maplink,
    PROJECTS.aura_intel,
  ];

  return (
    <section id="projects" className="relative z-10 py-16 sm:py-24 px-4 sm:px-10 md:px-16 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-light text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          <span>02 / Flagship Systems & Projects</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Engineered Projects & Systems
        </h2>
        <p className="text-white/70 max-w-2xl text-base sm:text-lg font-light">
          Production-grade distributed architectures, concurrency benchmarks, and fine-tuned AI workflows built and audited locally.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {projectList.map((project) => (
          <div
            key={project.id}
            className="group relative bg-[#0d0707]/90 border border-white/10 rounded-2xl p-5 sm:p-7 backdrop-blur-md hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between space-y-6"
          >
            {/* Top Bar: Badge & Role */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] uppercase tracking-wider font-light text-red-400 bg-red-950/60 border border-red-500/30 px-2.5 py-0.5 rounded-full">
                  {project.badge}
                </span>
                <span className="text-xs text-white/50 font-light">{project.role}</span>
              </div>

              {/* Title & Subtitle */}
              <h3
                className="text-xl sm:text-2xl font-light text-white tracking-tight group-hover:text-red-300 transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {project.subtitle}
              </p>
            </div>

            {/* Thumbnail Preview Banner */}
            {project.thumbnail && (
              <div
                onClick={() => setActiveProject(project)}
                className="relative w-full h-40 sm:h-56 rounded-xl overflow-hidden border border-white/10 bg-black/60 group/thumb cursor-pointer shadow-xl -mt-1"
              >
                <img
                  src={project.thumbnail.startsWith('/') ? `${import.meta.env.BASE_URL}${project.thumbnail.slice(1)}` : project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover/thumb:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-black/80 border border-white/20 text-red-300 backdrop-blur-md font-light">
                    Live Telemetry
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-light px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-red-600 text-white shadow-md group-hover/thumb:bg-red-500 transition-colors">
                    Inspect Demos ↗
                  </span>
                </div>
              </div>
            )}

            {/* Verified Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 py-2">
              {project.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col justify-between"
                >
                  <div className="text-lg sm:text-2xl font-light text-white font-mono">
                    {m.value}
                  </div>
                  <div className="text-[10px] uppercase font-light text-red-400 mt-1">
                    {m.label}
                  </div>
                  {m.detail && (
                    <div className="text-[10px] text-white/50 mt-0.5 leading-tight font-light">
                      {m.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Architectural Highlight Snippets */}
            <div className="space-y-2">
              <h4 className="text-xs font-light uppercase tracking-wider text-red-400/80">
                Key Architectural Mechanisms
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-white/75 font-light">
                {project.architecturalHighlights.slice(0, 3).map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 font-normal shrink-0 mt-0.5">›</span>
                    <span className="leading-snug">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Tags & Deep Dive Button */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-white/85 font-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveProject(project)}
                  className="px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-all font-light text-xs uppercase tracking-wider cursor-pointer"
                >
                  Inspect Full Architecture →
                </button>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-950/50 border border-red-500/40 text-red-300 hover:bg-red-900/50 hover:border-red-400 text-xs font-light tracking-wider transition-all shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>Live App ↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for In-depth Breakdown */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}
