import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  currentRadius: number;
  opacity: number;
  opacitySpeed: number;
  isAccent: boolean;
}

interface ClickImpulse {
  x: number;
  y: number;
  time: number;
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = false;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let mouseX = -9999;
    let mouseY = -9999;
    let clickImpulse: ClickImpulse | null = null;

    let particles: Particle[] = [];

    // Density calculation: ~52 particles per 800x800 area as per particles.js config
    const initParticles = () => {
      const area = (width * height) / (800 * 800);
      const count = Math.max(50, Math.min(130, Math.floor(52 * Math.max(1, area))));

      particles = [];
      for (let i = 0; i < count; i++) {
        const baseRadius = Math.random() * 1.6 + 0.7; // random size ~ 0.7px to 2.3px
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // Move: speed 1, direction none, random true
          vx: (Math.random() - 0.5) * 0.75,
          vy: (Math.random() - 0.5) * 0.75,
          baseRadius,
          currentRadius: baseRadius,
          // Opacity: value 1, random true, anim speed 1
          opacity: Math.random() * 0.85 + 0.15,
          opacitySpeed: (Math.random() * 0.012 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
          // Subtle accent: 10% of stars have a cyber-crimson glow, 90% pure diamond white
          isAccent: Math.random() < 0.12,
        });
      }
    };

    // Clips the canvas precisely to where the black sections are visible on screen
    // This guarantees 0 particles on the Hero section and 100% full coverage across About, Skills, Projects, PRs, and Footer!
    const updateClipAndVisibility = () => {
      const target =
        document.getElementById('black-sections-container') ||
        container.parentElement;
      if (!target || !container) return;

      const rect = target.getBoundingClientRect();
      const topClip = Math.max(0, Math.floor(rect.top));
      const bottomClip = Math.max(0, Math.floor(window.innerHeight - rect.bottom));

      container.style.clipPath = `inset(${topClip}px 0 ${bottomClip}px 0)`;

      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView !== isVisible) {
        isVisible = inView;
        if (isVisible) {
          cancelAnimationFrame(animationFrameId);
          render();
        }
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      initParticles();
      updateClipAndVisibility();
    };

    handleResize();

    // Track mouse position relative to viewport
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    // Repulse impulse on click (mode: "repulse", distance: 400, duration: 0.4s)
    const handleClick = (e: MouseEvent) => {
      clickImpulse = {
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
      };
    };

    const handleScroll = () => {
      updateClipAndVisibility();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    const BUBBLE_DISTANCE = 220;
    const REPULSE_DISTANCE = 380;
    const REPULSE_DURATION = 400; // ms

    const render = () => {
      if (!isVisible) return;

      // Update clip coordinates every frame to ensure silky smooth response to trackpad/mobile scrolling
      updateClipAndVisibility();

      ctx.clearRect(0, 0, width, height);

      const now = performance.now();
      let clickFactor = 0;
      if (clickImpulse) {
        const elapsed = now - clickImpulse.time;
        if (elapsed < REPULSE_DURATION) {
          clickFactor = 1 - elapsed / REPULSE_DURATION;
        } else {
          clickImpulse = null;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges smoothly
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // 2. Opacity Twinkle (sine pulsing)
        p.opacity += p.opacitySpeed;
        if (p.opacity >= 0.95) {
          p.opacity = 0.95;
          p.opacitySpeed = -Math.abs(p.opacitySpeed);
        } else if (p.opacity <= 0.08) {
          p.opacity = 0.08;
          p.opacitySpeed = Math.abs(p.opacitySpeed);
        }

        let renderOpacity = p.opacity;
        let renderRadius = p.baseRadius;

        // 3. Hover "Bubble" Interaction (fade and shrink when near mouse)
        if (mouseX > -1000) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);

          if (dist < BUBBLE_DISTANCE && dist > 0) {
            const proximity = 1 - dist / BUBBLE_DISTANCE;
            // Particles fade and gently disperse away from cursor
            renderOpacity = Math.max(0, renderOpacity * (1 - proximity * 0.9));
            renderRadius = Math.max(0.2, renderRadius * (1 - proximity * 0.6));

            // Gentle push away
            const push = proximity * 0.9;
            p.x += (dx / dist) * push;
            p.y += (dy / dist) * push;
          }
        }

        // 4. Click "Repulse" Shockwave Interaction
        if (clickFactor > 0 && clickImpulse) {
          const dx = p.x - clickImpulse.x;
          const dy = p.y - clickImpulse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < REPULSE_DISTANCE && dist > 0) {
            const force = (1 - dist / REPULSE_DISTANCE) * clickFactor * 9;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // 5. Draw Particle
        if (renderOpacity > 0.01) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, renderRadius, 0, Math.PI * 2);

          if (p.isAccent) {
            // Subtle ruby crimson star
            ctx.fillStyle = `rgba(255, 75, 90, ${renderOpacity * 0.9})`;
            ctx.shadowBlur = renderRadius * 4;
            ctx.shadowColor = 'rgba(255, 50, 70, 0.6)';
          } else {
            // Crisp diamond white star
            ctx.fillStyle = `rgba(255, 255, 255, ${renderOpacity})`;
            ctx.shadowBlur = renderRadius * 3;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
          }

          ctx.fill();
        }
      }

      // Reset shadow for performance
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ clipPath: 'inset(100vh 0 0 0)' }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}

export default ParticlesBackground;
