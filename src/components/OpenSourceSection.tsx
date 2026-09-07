export default function OpenSourceSection() {
  const prs = [
    {
      repo: 'supabase/auth',
      title: 'Exact Case-Insensitive Email Lookup on Admin API',
      prNumber: '#2668',
      tags: ['Go', 'PostgreSQL', 'Docker', 'REST API'],
      summary:
        'Contributed to the Supabase Auth Go backend by implementing exact, case-insensitive user lookup by email on the admin API.',
      details: [
        'Bypassed slow, unindexed fuzzy search queries by replacing them with index-supported exact PostgreSQL queries.',
        'Eliminated query bottlenecks on large user tables, speeding up administrative user retrieval.',
        'Verified end-to-end functionality using Go unit testing suites and local Docker environments to ensure backwards compatibility with client SDKs.',
      ],
      impact: 'Direct index scan query optimization on mission-critical auth infrastructure',
    },
    {
      repo: 'rakutentech/querycraft',
      title: 'Offline Prisma ORM Schema Parser to SQL DDL Transpiler',
      prNumber: '#109',
      tags: ['TypeScript', 'Prisma ORM', 'Next.js', 'LLM Context'],
      summary:
        "Contributed to Rakuten Tech's QueryCraft AI-SQL assistant by engineering an offline Prisma ORM schema parsing module.",
      details: [
        'Designed a TypeScript transpiler that parses Prisma schema files directly into normalized SQL DDL statements for LLM system context.',
        'Bypassed Next.js API credential validation hurdles by enabling offline schema introspection without live database credentials.',
        'Verified transpilation accuracy and strict type safety using the TypeScript compiler.',
      ],
      impact: 'Enables zero-credential LLM prompt grounding from Prisma models',
    },
  ];

  return (
    <section id="open-source" className="relative z-10 py-16 sm:py-24 px-4 sm:px-10 md:px-16 max-w-7xl mx-auto space-y-12 selection:bg-red-600 selection:text-white font-light">
      {/* Section Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-light text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>03 / Open Source Contributions</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Open Source PRs & Upstream Contributions
        </h2>
        <p className="text-white/70 max-w-2xl text-base sm:text-lg font-light">
          Upstream contributions and production pull requests to mission-critical open-source developer tooling.
        </p>
      </div>

      {/* Open Source Contributions */}
      <div className="space-y-6">
        <h3 className="text-xl font-light text-white tracking-tight flex items-center gap-2">
          <span>Upstream Pull Requests</span>
          <span className="text-xs font-mono text-red-400 bg-red-950/60 border border-red-500/30 px-2.5 py-0.5 rounded-full font-light">
            Merged & Reviewed
          </span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prs.map((pr) => (
            <div
              key={pr.prNumber}
              className="bg-[#0e0707]/90 border border-red-500/20 rounded-2xl p-5 sm:p-7 backdrop-blur-md hover:border-red-500/40 transition-colors flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-red-400 font-light">{pr.repo}</span>
                  <span className="font-mono text-xs text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full font-light">
                    {pr.prNumber}
                  </span>
                </div>
                <h4 className="text-xl font-light text-white leading-snug">
                  {pr.title}
                </h4>
                <p className="text-sm text-white/70 font-light">
                  {pr.summary}
                </p>
                <ul className="space-y-1.5 text-xs text-white/75 pt-2">
                  {pr.details.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500 font-normal shrink-0">✓</span>
                      <span className="font-light">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="text-xs font-light text-red-400">
                  Impact: <span className="text-white/80">{pr.impact}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pr.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded bg-red-950/40 border border-red-500/20 text-white/80 font-mono font-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

