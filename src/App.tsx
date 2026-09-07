import { lazy, Suspense } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { ParticlesBackground } from './components/ParticlesBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';

// React Lazy-Loaded Sections
const AboutSection = lazy(() => import('./components/AboutSection'));
const SkillsSection = lazy(() => import('./components/SkillsSection'));
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const OpenSourceSection = lazy(() => import('./components/OpenSourceSection'));

function SectionLoadingFallback({ title }: { title: string }) {
  return (
    <div className="py-24 px-6 sm:px-10 md:px-16 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-32 bg-white/10 rounded"></div>
      <div className="h-10 w-80 bg-white/15 rounded"></div>
      <div className="h-4 w-96 bg-white/10 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="h-64 bg-white/5 border border-white/10 rounded-2xl"></div>
        <div className="h-64 bg-white/5 border border-white/10 rounded-2xl"></div>
      </div>
      <div className="text-center text-xs text-white/40 uppercase tracking-widest pt-2">
        Loading {title}...
      </div>
    </div>
  );
}

export function App() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-red-600 selection:text-white overflow-x-hidden font-light">
      {/* Fixed background video with mouse-scrubbing */}
      <BackgroundVideo />

      {/* Fixed Header */}
      <Navbar />

      {/* Main Content Flow */}
      <main className="relative">
        {/* PAGE 1: Fullscreen Hero View (Pure Video Background, Zero Dark Overlay) */}
        <HeroSection />

        {/* PAGE 2+: Scroll-Triggered Rich Black Background Wrapper */}
        <div id="black-sections-container" className="relative z-10 bg-[#050507] border-t border-red-500/20 shadow-[0_-25px_60px_rgba(0,0,0,0.98)]">
          {/* Twinkling Star Particle Animation Background (starts from About section down to Footer) */}
          <ParticlesBackground />

          <div className="relative z-10">
            {/* 1. About Section (Lazy Loaded, Displayed First) */}
            <Suspense fallback={<SectionLoadingFallback title="About & Background" />}>
              <AboutSection />
            </Suspense>

            {/* 2. Technical Arsenal / Skills Section (Lazy Loaded) */}
            <Suspense fallback={<SectionLoadingFallback title="Technical Arsenal & Skills" />}>
              <SkillsSection />
            </Suspense>

            {/* 3. Projects Section (Lazy Loaded, Displayed Third) */}
            <Suspense fallback={<SectionLoadingFallback title="Flagship Projects" />}>
              <ProjectsSection />
            </Suspense>

            {/* 4. Open Source Contributions (Lazy Loaded) */}
            <Suspense fallback={<SectionLoadingFallback title="Open Source Contributions" />}>
              <OpenSourceSection />
            </Suspense>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
