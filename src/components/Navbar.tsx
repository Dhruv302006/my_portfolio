import { useState, useEffect } from 'react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    closeMobileMenu();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <a
            href="mailto:thakurdhruv@gmail.com"
            className="px-4 py-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-all font-medium text-[13px] tracking-wide cursor-pointer shadow-md"
          >
            Get in touch
          </a>
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
        <a
          href="mailto:thakurdhruv@gmail.com"
          onClick={closeMobileMenu}
          className="text-white text-[24px] sm:text-[28px] font-light underline underline-offset-4 hover:text-emerald-400 transition-colors"
        >
          Get in touch
        </a>
      </div>
    </>
  );
}
