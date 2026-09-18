import { useState, useEffect, useRef } from 'react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contactDropdownRef.current &&
        !contactDropdownRef.current.contains(event.target as Node)
      ) {
        setContactOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContactOpen(false);
        setMobileMenuOpen(false);
      }
    };

    if (contactOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [contactOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    closeMobileMenu();
    setContactOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard?.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  const renderContactContent = () => (
    <div className="space-y-3.5 select-text">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-white tracking-wide">
            Get in touch with Dhruv
          </span>
        </div>
        <button
          type="button"
          onClick={() => setContactOpen(false)}
          className="text-white/40 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer text-xs"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* LinkedIn Option */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5 flex items-center justify-between">
          <span>LinkedIn</span>
          <span className="text-blue-400 text-[10px]">Professional Network</span>
        </div>
        <a
          href="https://www.linkedin.com/in/dhruv-thakur-693a46320/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-[#0A66C2]/15 border border-white/10 hover:border-[#0A66C2]/50 transition-all duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/20 flex items-center justify-center shrink-0 border border-[#0A66C2]/40">
              <svg className="w-4 h-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63Z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-medium text-white group-hover:text-blue-300 flex items-center gap-1.5">
                <span>Dhruv Thakur</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">Profile</span>
              </div>
              <div className="text-[11px] text-white/50 truncate font-mono">
                in/dhruv-thakur-693a46320
              </div>
            </div>
          </div>
          <span className="text-white/50 group-hover:text-white text-xs font-mono shrink-0 ml-2">
            Open ↗
          </span>
        </a>
      </div>

      {/* Gmail Options */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5 flex items-center justify-between">
          <span>Gmail</span>
          <span className="text-red-400 text-[10px]">Direct Webmail & Copy</span>
        </div>

        <div className="space-y-2">
          {/* Personal Gmail */}
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-red-500/40 transition-all">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded bg-red-500/15 flex items-center justify-center shrink-0 border border-red-500/30">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#EA4335" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-white">Personal Gmail</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyEmail('thakurdhruv@gmail.com')}
                className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer shrink-0"
              >
                {copiedEmail === 'thakurdhruv@gmail.com' ? '✓ Copied' : '❐ Copy'}
              </button>
            </div>

            <div className="text-[11px] font-mono text-red-300/90 truncate mb-1.5 select-all">
              thakurdhruv@gmail.com
            </div>

            <div className="flex items-center gap-1.5 text-[10px]">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=thakurdhruv@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1 px-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-200 text-center font-medium transition-colors"
              >
                Compose in Gmail ↗
              </a>
              <a
                href="mailto:thakurdhruv@gmail.com"
                className="py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-center"
              >
                Mailto
              </a>
            </div>
          </div>

          {/* Alternate Gmail */}
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-red-500/40 transition-all">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded bg-red-500/15 flex items-center justify-center shrink-0 border border-red-500/30">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#EA4335" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-white">Alternate Gmail</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyEmail('milindt.102@gmail.com')}
                className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer shrink-0"
              >
                {copiedEmail === 'milindt.102@gmail.com' ? '✓ Copied' : '❐ Copy'}
              </button>
            </div>

            <div className="text-[11px] font-mono text-red-300/90 truncate mb-1.5 select-all">
              milindt.102@gmail.com
            </div>

            <div className="flex items-center gap-1.5 text-[10px]">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=milindt.102@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1 px-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-200 text-center font-medium transition-colors"
              >
                Compose in Gmail ↗
              </a>
              <a
                href="mailto:milindt.102@gmail.com"
                className="py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-center"
              >
                Mailto
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 px-4 sm:px-8 py-3.5 sm:py-5 flex justify-between items-center select-none transition-all duration-300 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        {/* Logo (left) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="text-[18px] sm:text-[24px] tracking-tight text-white font-medium hover:opacity-85 transition-opacity"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Dhruv Thakur®
          </a>
          <span
            className="text-[20px] sm:text-[26px] text-emerald-400 select-none leading-none inline-flex items-center"
            style={{ letterSpacing: '-0.02em' }}
            aria-hidden="true"
          >
            ✳︎
          </span>
        </div>

        {/* Clean right actions (desktop) */}
        <div className="hidden md:flex items-center gap-6 text-[14px] font-normal tracking-wide text-white/80">
          <button
            type="button"
            onClick={() => scrollToSection('about')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('skills')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Skills
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('projects')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('open-source')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Open Source & PRs
          </button>
          <a
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
          >
            Resume ↗
          </a>

          {/* Interactive Get in touch with LinkedIn & Gmail popover */}
          <div className="relative" ref={contactDropdownRef}>
            <button
              type="button"
              onClick={() => setContactOpen((prev) => !prev)}
              className="px-4 py-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-all font-medium text-[13px] tracking-wide cursor-pointer shadow-md flex items-center gap-1.5"
              aria-expanded={contactOpen}
            >
              <span>Get in touch</span>
              <span
                className={`text-[9px] transition-transform duration-200 ${
                  contactOpen ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>

            {contactOpen && (
              <div className="absolute right-0 top-full mt-2.5 w-[340px] bg-[#0c0c12]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl z-50 text-white">
                {renderContactContent()}
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] p-2 focus:outline-none z-40 cursor-pointer"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 origin-center ${
              mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 origin-center ${
              mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-35 bg-black/95 backdrop-blur-lg flex flex-col justify-center items-start px-8 gap-6 sm:gap-7 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          onClick={() => scrollToSection('about')}
          className="text-white text-[24px] sm:text-[28px] font-light hover:text-emerald-400 transition-colors"
        >
          About
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('skills')}
          className="text-white text-[24px] sm:text-[28px] font-light hover:text-emerald-400 transition-colors"
        >
          Skills
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('projects')}
          className="text-white text-[24px] sm:text-[28px] font-light hover:text-emerald-400 transition-colors"
        >
          Projects
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('open-source')}
          className="text-white text-[24px] sm:text-[28px] font-light hover:text-emerald-400 transition-colors"
        >
          Open Source & PRs
        </button>
        <a
          href={`${import.meta.env.BASE_URL}resume.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobileMenu}
          className="text-emerald-400 text-[24px] sm:text-[28px] font-medium hover:text-emerald-300 transition-colors"
        >
          Resume ↗
        </a>
        <button
          type="button"
          onClick={() => {
            closeMobileMenu();
            setContactOpen(true);
          }}
          className="text-white text-[24px] sm:text-[28px] font-light underline underline-offset-4 hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Get in touch</span>
          <span className="text-emerald-400 text-sm">→</span>
        </button>
      </div>

      {/* Mobile contact sheet modal */}
      {contactOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setContactOpen(false);
          }}
        >
          <div className="w-full max-w-sm bg-[#0c0c12] border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl relative text-white">
            {renderContactContent()}
          </div>
        </div>
      )}
    </>
  );
}
