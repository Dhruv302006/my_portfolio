import { useEffect, useRef } from 'react';

const SENSITIVITY = 0.8;
const VIDEO_SRC = `${import.meta.env.BASE_URL}hero-character.mp4`;

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Refs to manage the scrubbing state without triggering re-renders
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      // Make sure the video is loaded and has a valid duration
      if (!video || Number.isNaN(video.duration)) return;

      const currentX = e.clientX;
      
      // Initialize prevX on the very first mouse movement
      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      // 1. Compute delta
      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      // 2. Convert to a time offset
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;

      // 3. Clamp targetTime between 0 and video duration
      let newTarget = targetTimeRef.current + timeOffset;
      newTarget = Math.max(0, Math.min(newTarget, video.duration));
      targetTimeRef.current = newTarget;

      // 4. Attempt to seek
      performSeek();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const video = videoRef.current;
      if (!video || Number.isNaN(video.duration)) return;

      const currentX = e.touches[0].clientX;
      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      let newTarget = targetTimeRef.current + timeOffset;
      newTarget = Math.max(0, Math.min(newTarget, video.duration));
      targetTimeRef.current = newTarget;

      performSeek();
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    const performSeek = () => {
      const video = videoRef.current;
      // If we are currently seeking, or video isn't ready, bail out
      if (!video || isSeekingRef.current) return;

      // Only trigger a seek if the target time has moved meaningfully
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
        isSeekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // 5. Handle onSeeked to queue the next seek and prevent flooding
  const handleSeeked = () => {
    isSeekingRef.current = false;
    const video = videoRef.current;
    
    if (!video) return;

    // If the mouse continued moving while the video was seeking, catch up
    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      isSeekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-[#b80a24] pointer-events-none">
      {/* Studio Backdrop Gradient matching video lighting */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 48% 45%, #d60e2e 0%, #cb0c2c 42%, #a30820 75%, #7a0416 100%)',
        }}
      />

      {/* Stop-Motion Felt Character Video */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none hero-character-video"
      />
    </div>
  );
}
