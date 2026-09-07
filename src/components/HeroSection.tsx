import { IdeWindow } from './IdeWindow';

export function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative z-10 min-h-[100dvh] lg:h-screen w-full flex flex-col justify-between pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16 select-none lg:overflow-hidden"
    >
      {/* 3-Zone Composition: Left (Intro) — Center (Face Animation) — Right (IDE Animation) */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 my-auto w-full">
        {/* Zone 1 (Left): Intro Text & Actions */}
        <div className="w-full lg:w-[32%] xl:w-[30%] max-w-lg space-y-3.5 sm:space-y-4 text-left z-10">
          {/* Academic Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs font-normal text-white/90 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>IIT Hyderabad • B.Tech</span>
          </div>

          {/* Headline Name & Title */}
          <div className="space-y-1">
            <h1
              className="text-3xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              I'm Dhruv
            </h1>
            <h2 className="text-lg sm:text-2xl text-purple-400 font-medium tracking-wide">
              Full-Stack & AI Engineer
            </h2>
          </div>

          {/* Mission Description */}
          <p className="text-xs sm:text-[15px] text-white/75 font-normal leading-relaxed">
            I build high-performance, scalable web applications and AI-driven solutions that turn complex technical challenges into business growth.
          </p>

          {/* Core Focus Line */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md text-[11px] sm:text-xs text-white/80 leading-relaxed font-mono">
            <span className="text-purple-400 font-semibold block mb-0.5">Core Focus:</span>
            Node.js • Scalable Architecture • DSA • LLMs & Generative AI
          </div>

          {/* Action Buttons & Resume Link */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 sm:pt-2">
            <a
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-600 text-white font-medium text-[11px] sm:text-xs uppercase tracking-wider hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer"
            >
              <span>Resume ↗</span>
            </a>
            <button
              type="button"
              onClick={() => scrollTo('about')}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white text-black font-medium text-[11px] sm:text-xs uppercase tracking-wider hover:bg-white/90 transition-all shadow-md cursor-pointer"
            >
              About ↓
            </button>
            <button
              type="button"
              onClick={() => scrollTo('projects')}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 border border-white/20 text-white/90 font-medium text-[11px] sm:text-xs uppercase tracking-wider hover:bg-black/90 hover:border-purple-500/50 transition-all backdrop-blur-sm cursor-pointer"
            >
              Projects ↓
            </button>
            <button
              type="button"
              onClick={() => scrollTo('open-source')}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 border border-white/20 text-white/90 font-medium text-[11px] sm:text-xs uppercase tracking-wider hover:bg-black/90 hover:border-purple-500/50 transition-all backdrop-blur-sm cursor-pointer"
            >
              PRs ↓
            </button>
          </div>
        </div>

        {/* Zone 2 (Center): Generous open stage where the 3D character face sits in between */}
        <div
          className="hidden lg:block lg:w-[34%] xl:w-[36%] pointer-events-none h-full"
          aria-hidden="true"
        >
          {/* Unobstructed: 3D character face is centered right here */}
        </div>

        {/* Zone 3 (Right): IDE Code Window aligned to the right */}
        <div className="w-full lg:w-[34%] xl:w-[34%] flex justify-center lg:justify-end z-10 pt-2 sm:pt-4 lg:pt-0">
          <IdeWindow />
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div
        onClick={() => scrollTo('about')}
        className="w-full flex flex-col items-center justify-center text-white/60 hover:text-white transition-colors text-xs tracking-widest uppercase font-mono cursor-pointer pb-2 z-10"
      >
        <span>Scroll to Explore</span>
        <svg
          className="w-4 h-4 mt-1 animate-bounce text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
