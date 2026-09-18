import { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

export default function AboutSection() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section id="about" className="relative z-10 py-20 sm:py-28 px-4 sm:px-10 md:px-14 lg:px-16 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-4 mb-14 sm:mb-20">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#180808] border border-red-500/40 text-xs font-light tracking-wider text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
          </svg>
          <span>ABOUT ME</span>
        </div>

        {/* Display Headline */}
        <h2
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-center leading-[1.15] sm:leading-[1.12]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span className="bg-gradient-to-r from-white via-red-100 to-red-400 bg-clip-text text-transparent">
            Transforming
          </span>
          <br />
          <span className="bg-gradient-to-r from-red-400 via-red-500 to-rose-400 bg-clip-text text-transparent">
            Ideas Into Reality
          </span>
        </h2>

        {/* Sub-caption with highlighted keywords */}
        <p className="text-center text-xs sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto pt-2 leading-relaxed font-light px-2">
          Building digital experiences that combine{' '}
          <span className="text-red-400 font-normal">innovation</span>,{' '}
          <span className="text-red-400 font-normal">performance</span>, and{' '}
          <span className="text-red-400 font-normal">elegance</span>
        </p>
      </div>

      {/* Spacious 2-Column Layout: Photo on Left — Information on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-start">
        {/* Left Column (5 cols): Photo & Quick Credentials */}
        <div className="lg:col-span-5 space-y-6">
          {/* Framed Portrait Photo */}
          <div className="relative group mx-auto max-w-md lg:max-w-none">
            {/* Ambient Red Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-rose-600/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500"></div>

            <div className="relative rounded-3xl overflow-hidden border border-red-500/20 bg-gradient-to-b from-[#140808]/90 to-[#0a0505]/95 backdrop-blur-xl shadow-2xl p-3 sm:p-4">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
                <img
                  src={`${import.meta.env.BASE_URL}profile.png`}
                  alt="Dhruv Milind Thakur"
                  className="w-full h-auto max-h-[420px] sm:max-h-[520px] object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Photo Caption Tag */}
              <div className="pt-3 sm:pt-4 pb-1 px-1 sm:px-2 flex items-center justify-between">
                <div>
                  <div className="text-sm sm:text-base font-normal text-white">Dhruv Milind Thakur</div>
                  <div className="text-[11px] sm:text-xs text-red-300 font-light">IIT Hyderabad • Full-Stack & AI</div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[10px] sm:text-[11px] text-white/80 font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="font-light">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-[#0d0707]/90 border border-white/10 hover:border-red-500/40 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md transition-colors">
              <div className="text-xl sm:text-3xl font-light text-white font-mono">500+</div>
              <div className="text-[11px] sm:text-xs text-white/60 mt-0.5 font-light">LeetCode Solved</div>
            </div>
            <div className="bg-[#0d0707]/90 border border-white/10 hover:border-red-500/40 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md transition-colors">
              <div className="text-xl sm:text-3xl font-light text-red-400 font-mono">NSO</div>
              <div className="text-[11px] sm:text-xs text-white/60 mt-0.5 font-light">IITH Football</div>
            </div>
          </div>

          {/* Direct Action Links & Email Contacts */}
          <div className="bg-[#0d0707]/90 border border-white/10 hover:border-red-500/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-3 transition-colors">
            <div className="space-y-2 pb-2 border-b border-white/10">
              {/* Personal Gmail */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="text-white/60 font-light">Personal Gmail:</span>
                <button
                  type="button"
                  onClick={() => handleCopyEmail(PERSONAL_INFO.personalEmail)}
                  className="text-red-400 font-mono hover:underline flex items-center gap-1 cursor-pointer font-light break-all sm:break-normal text-left sm:text-right"
                >
                  <span>{PERSONAL_INFO.personalEmail}</span>
                  <span className="text-[10px] text-white/40 shrink-0">
                    {copiedEmail === PERSONAL_INFO.personalEmail ? '✓ Copied' : '❐'}
                  </span>
                </button>
              </div>

              {/* Alternate Gmail */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="text-white/60 font-light">Alternate Gmail:</span>
                <button
                  type="button"
                  onClick={() => handleCopyEmail(PERSONAL_INFO.alternateEmail)}
                  className="text-red-400 font-mono hover:underline flex items-center gap-1 cursor-pointer font-light break-all sm:break-normal text-left sm:text-right"
                >
                  <span>{PERSONAL_INFO.alternateEmail}</span>
                  <span className="text-[10px] text-white/40 shrink-0">
                    {copiedEmail === PERSONAL_INFO.alternateEmail ? '✓ Copied' : '❐'}
                  </span>
                </button>
              </div>

              {/* Institute Email */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="text-white/60 font-light">Institute Email:</span>
                <button
                  type="button"
                  onClick={() => handleCopyEmail(PERSONAL_INFO.instituteEmail)}
                  className="text-red-400 font-mono hover:underline flex items-center gap-1 cursor-pointer font-light break-all sm:break-normal text-left sm:text-right"
                >
                  <span>{PERSONAL_INFO.instituteEmail}</span>
                  <span className="text-[10px] text-white/40 shrink-0">
                    {copiedEmail === PERSONAL_INFO.instituteEmail ? '✓ Copied' : '❐'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              <a
                href={`${import.meta.env.BASE_URL}resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 rounded-xl bg-red-600 text-white text-xs font-light tracking-wide hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center gap-1"
              >
                <span>Resume ↗</span>
              </a>
              <a
                href={PERSONAL_INFO.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 rounded-xl border border-white/20 text-white/80 text-xs font-light hover:bg-white/10 hover:border-red-500/30 transition-colors flex items-center justify-center gap-1"
              >
                <span>GitHub ↗</span>
              </a>
              <a
                href={PERSONAL_INFO.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 rounded-xl border border-white/20 text-white/80 text-xs font-light hover:bg-white/10 hover:border-red-500/30 transition-colors flex items-center justify-center gap-1"
              >
                <span>LinkedIn ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Information & Experience (Spacious) */}
        <div className="lg:col-span-7 space-y-7">
          {/* 1. Education Card (Clean: only B.Tech IIT Hyderabad, no HSC, no CBSE, no CG) */}
          <div className="bg-[#0d0707]/90 border border-white/10 hover:border-red-500/40 rounded-2xl p-6 sm:p-7 backdrop-blur-md space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-light uppercase tracking-wider text-red-400/80">
                Education
              </h3>
              <span className="text-xs text-red-400 font-mono font-light">Undergraduate</span>
            </div>

            <div className="border-l-2 border-red-500 pl-4 py-1 space-y-1.5">
              <div className="text-xl sm:text-2xl font-light text-white tracking-tight">
                B.Tech in Engineering Physics
              </div>
              <div className="text-sm sm:text-base text-red-300 font-light">
                Indian Institute of Technology (IIT) Hyderabad
              </div>
              <div className="text-xs text-white/60 font-mono font-light">
                Class of 2024 — 2028
              </div>
            </div>
          </div>

          {/* 2. Positions of Responsibility */}
          <div className="bg-[#0d0707]/90 border border-white/10 hover:border-red-500/40 rounded-2xl p-6 sm:p-7 backdrop-blur-md space-y-4 transition-colors">
            <h3 className="text-xs font-light uppercase tracking-wider text-red-400/80">
              Positions of Responsibility
            </h3>
            <div className="space-y-3.5">
              {PERSONAL_INFO.positions.map((pos, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-red-500/30 transition-colors space-y-1.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-base font-normal text-white">{pos.role}</span>
                    <span className="text-xs font-mono text-red-400 shrink-0 font-light">{pos.period}</span>
                  </div>
                  <div className="text-xs text-white/60 font-light">{pos.organization}</div>
                  <div className="text-xs text-white/75 pt-0.5 leading-relaxed font-light">{pos.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Technical Mastery Summary & Quick Link */}
          <div className="bg-[#0d0707]/90 border border-white/10 hover:border-red-500/40 rounded-2xl p-6 sm:p-7 backdrop-blur-md space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-light uppercase tracking-wider text-red-400/80">
                Technical Mastery
              </h3>
              <a
                href="#skills"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1 cursor-pointer transition-colors font-light"
              >
                <span>Interactive Skills</span>
                <span>↓</span>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-xs font-normal text-white">Backend</div>
                <div className="text-[11px] text-white/60 font-mono font-light">Node • Fastify • SQL</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-xs font-normal text-white">Applied AI</div>
                <div className="text-[11px] text-white/60 font-mono font-light">PyTorch • QLoRA • RAG</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-xs font-normal text-white">Frontend</div>
                <div className="text-[11px] text-white/60 font-mono font-light">React • Next.js • TS</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="text-xs font-normal text-white">Cloud / Infra</div>
                <div className="text-[11px] text-white/60 font-mono font-light">Kafka • Redis • Docker</div>
              </div>
            </div>
          </div>

          {/* 4. Certifications & Badges */}
          <div className="bg-[#0d0707]/90 border border-white/10 hover:border-red-500/40 rounded-2xl p-6 sm:p-7 backdrop-blur-md space-y-3 transition-colors">
            <h3 className="text-xs font-light uppercase tracking-wider text-red-400/80">
              Certifications & Industry Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PERSONAL_INFO.certifications.map((cert, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-xs font-normal text-white">{cert.title}</div>
                  <div className="text-[11px] text-red-400 font-light">{cert.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
