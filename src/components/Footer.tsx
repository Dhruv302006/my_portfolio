import { PERSONAL_INFO } from '../data/portfolioData';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-red-500/20 bg-[#050507] backdrop-blur-md py-10 sm:py-12 px-4 sm:px-10 md:px-16 text-white select-none selection:bg-red-600 selection:text-white font-light">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="text-xl font-light tracking-tight text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {PERSONAL_INFO.name}
            </span>
            <span className="text-red-500 text-lg">✳︎</span>
          </div>
          <p className="text-xs text-white/60 font-light">
            {PERSONAL_INFO.education} • {PERSONAL_INFO.institution}
          </p>
          <div className="text-xs text-white/50 flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 font-mono font-light">
            <a href="mailto:thakurdhruv@gmail.com" className="hover:text-red-400 transition-colors">
              thakurdhruv@gmail.com
            </a>
            <span className="text-white/20 hidden sm:inline">•</span>
            <a href="mailto:milindt.102@gmail.com" className="hover:text-red-400 transition-colors">
              milindt.102@gmail.com
            </a>
            <span className="text-white/20 hidden sm:inline">•</span>
            <a href="mailto:ep24btech11010@iith.ac.in" className="hover:text-red-400 transition-colors">
              ep24btech11010@iith.ac.in
            </a>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span>{PERSONAL_INFO.phone}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-light">
          <a
            href="https://github.com/Dhruv302006"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-red-400 transition-colors"
          >
            GitHub
          </a>
          <span className="text-white/20">•</span>
          <a
            href="https://www.linkedin.com/in/dhruv-thakur-693a46320/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-red-400 transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-white/20">•</span>
          <a
            href="https://leetcode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-red-400 transition-colors"
          >
            LeetCode (500+)
          </a>
          <span className="text-white/20">•</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="px-3.5 py-1.5 rounded-full border border-red-500/30 bg-red-950/30 text-white/80 hover:text-white hover:border-red-500 hover:bg-red-900/40 transition-colors cursor-pointer"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
