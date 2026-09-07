import { useState, useEffect } from 'react';

const CODE_LINES = [
  { type: 'line', text: "import { FullStackEngineer } from 'dhruv.dev';" },
  { type: 'empty' },
  { type: 'line', text: "const developer = new FullStackEngineer({" },
  { type: 'line', text: "  name: 'Dhruv'," },
  { type: 'line', text: "  college: 'IIT Hyderabad (B.Tech)'," },
  { type: 'line', text: "  stack: ['Fastify', 'Kafka', 'Redis', 'PostgreSQL']," },
  { type: 'line', text: "  focus: 'Scalable Systems & LLM Agents'," },
  { type: 'line', text: "  status: 'Open to opportunities'" },
  { type: 'line', text: "});" },
  { type: 'empty' },
  { type: 'line', text: "await developer.launchLedger();" },
  { type: 'line', text: "// Latency: 1526ms -> 29ms (98.1% drop)" },
  { type: 'line', text: "// 166+ TPS zero write deadlocks" },
  { type: 'empty' },
  { type: 'line', text: "developer.connect();" },
  { type: 'line', text: "console.log('🚀 Ready to build exceptional systems!');" },
];

export function IdeWindow() {
  const fullText = CODE_LINES.map((l) => (l.type === 'empty' ? '' : l.text)).join('\n');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    let typingInterval: ReturnType<typeof setInterval> | null = null;
    let resetTimeout: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;

    const startTyping = () => {
      let index = 0;
      setCharCount(0);

      typingInterval = setInterval(() => {
        if (!isMounted) return;
        index += 2;
        if (index >= fullText.length) {
          index = fullText.length;
          setCharCount(fullText.length);
          if (typingInterval) clearInterval(typingInterval);

          // Wait 2 seconds once fully rendered, then restart
          resetTimeout = setTimeout(() => {
            if (isMounted) {
              startTyping();
            }
          }, 2000);
        } else {
          setCharCount(index);
        }
      }, 28);
    };

    startTyping();

    return () => {
      isMounted = false;
      if (typingInterval) clearInterval(typingInterval);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, [fullText]);

  // Highlight helper for typed text
  const currentText = fullText.slice(0, charCount);
  const renderedLines = currentText.split('\n');

  const highlightTokens = (line: string) => {
    if (line.startsWith('//')) {
      return <span className="text-white/40 italic">{line}</span>;
    }

    const parts = line.split(/('(?:\\'|[^'])*'|\b(?:import|from|const|new|await)\b|\b(?:FullStackEngineer)\b|\b(?:name|college|stack|focus|status)\b|console\.log)/g);

    return parts.map((part, i) => {
      if (!part) return null;
      if (/^'(?:\\'|[^'])*'$/.test(part)) {
        return <span key={i} className="text-emerald-300">{part}</span>;
      }
      if (['import', 'from', 'const', 'new', 'await'].includes(part)) {
        return <span key={i} className="text-purple-400 font-semibold">{part}</span>;
      }
      if (part === 'FullStackEngineer') {
        return <span key={i} className="text-cyan-300 font-semibold">{part}</span>;
      }
      if (['name', 'college', 'stack', 'focus', 'status'].includes(part)) {
        return <span key={i} className="text-purple-300">{part}</span>;
      }
      if (part === 'console.log') {
        return <span key={i} className="text-yellow-300">{part}</span>;
      }
      return <span key={i} className="text-white/90">{part}</span>;
    });
  };

  return (
    <div className="w-full max-w-full sm:max-w-[430px] xl:max-w-[480px] bg-black/45 sm:bg-black/35 border border-white/20 rounded-2xl p-4 sm:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl font-mono select-none overflow-hidden">
      {/* Window Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 sm:pb-3 mb-3 sm:mb-3.5">
        {/* macOS Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm"></span>
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm"></span>
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] inline-block shadow-sm"></span>
        </div>

        {/* Tab Title */}
        <div className="text-xs sm:text-[13px] text-white/90 font-medium tracking-wide">
          dhruv.js
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-mono">Live</span>
        </div>
      </div>

      {/* Code Editor Body with larger text and no horizontal scrollbar */}
      <div className="text-[11px] sm:text-[13px] xl:text-[13.5px] leading-[1.65] sm:leading-[1.7] overflow-hidden min-h-[260px] sm:min-h-[310px]">
        {renderedLines.map((line, idx) => (
          <div key={idx} className="flex">
            <span className="w-5 sm:w-7 text-white/25 shrink-0 select-none text-right pr-2 sm:pr-3 font-mono text-[10px] sm:text-[11px] leading-[1.8] sm:leading-[1.9]">
              {idx + 1}
            </span>
            <span className="whitespace-pre flex-1 truncate">
              {highlightTokens(line)}
              {idx === renderedLines.length - 1 && charCount < fullText.length && (
                <span className="inline-block w-2 sm:w-2.5 h-3.5 sm:h-4 bg-purple-500 ml-0.5 align-middle animate-pulse" />
              )}
            </span>
          </div>
        ))}
        {charCount >= fullText.length && (
          <div className="flex">
            <span className="w-5 sm:w-7 text-white/25 shrink-0 select-none text-right pr-2 sm:pr-3 font-mono text-[10px] sm:text-[11px] leading-[1.8] sm:leading-[1.9]">
              {renderedLines.length + 1}
            </span>
            <span className="inline-block w-2 sm:w-2.5 h-3.5 sm:h-4 bg-purple-500 ml-0.5 align-middle animate-pulse" />
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] text-white/60">
        <span className="text-white/40">Full-Stack & AI</span>
        <span className="text-emerald-400 font-medium">IIT Hyderabad</span>
      </div>
    </div>
  );
}
