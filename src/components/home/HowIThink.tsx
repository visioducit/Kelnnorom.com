import { useState } from 'react';
import { Layers } from 'lucide-react';

const systemStatements = [
  'A website is a system.',
  'A logistics network is a system.',
  'A supply chain is a system.',
  'A content operation is a system.',
  'A fleet is a system.',
  'A marketing campaign is a system.',
  'A business is a system.',
];

export function HowIThink() {
  const [activeIndex, setActiveIndex] = useState<number>(6); // Default to "A business is a system."

  return (
    <section className="py-24 md:py-32 border-b border-[var(--border)] bg-[var(--surface)] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-gold)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-content mx-auto container-px relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-6">
            <div className="eyebrow mb-3 text-[var(--accent-gold)]">How I Think</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)] font-['Inter_Tight',sans-serif] leading-[1.1] mb-6">
              I don&apos;t manage tasks.<br />
              <span className="text-[var(--accent-gold)]">I manage systems.</span>
            </h2>
            <p className="body-text text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6">
              My job is to understand the moving parts, identify hidden bottlenecks, connect the right people and technology, establish rigorous measurable performance, and continuously improve the system.
            </p>
            <div className="p-4 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--muted)]">
              When you optimize a single task, you get temporary linear gains. 
              When you optimize the underlying system architecture, you unlock lasting compound leverage.
            </div>
          </div>

          {/* Right Signature Build List */}
          <div className="lg:col-span-6 space-y-3 select-none">
            {systemStatements.map((statement, idx) => {
              const isAnchor = idx === systemStatements.length - 1;
              const isActive = activeIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                    isActive
                      ? isAnchor
                        ? 'bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)] shadow-lg scale-[1.02]'
                        : 'bg-[var(--surface-elevated)] border-[var(--accent-tech)] shadow-md translate-x-2'
                      : 'bg-[var(--surface)] border-[var(--border)] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      isAnchor ? 'bg-[var(--accent-gold)]' : 'bg-[var(--accent-tech)]'
                    }`} />
                    <span
                      className={`text-sm md:text-base font-bold font-['Inter_Tight',sans-serif] tracking-tight ${
                        isAnchor
                          ? 'text-[var(--accent-gold)] uppercase tracking-wider text-base md:text-lg'
                          : isActive
                          ? 'text-[var(--foreground)]'
                          : 'text-[var(--muted)]'
                      }`}
                    >
                      {statement}
                    </span>
                  </div>

                  {isAnchor && (
                    <span className="px-2.5 py-1 rounded bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)] text-[10px] font-mono font-bold uppercase text-[var(--accent-gold)]">
                      Ultimate Anchor
                    </span>
                  )}
                  {!isAnchor && isActive && (
                    <Layers className="w-4 h-4 text-[var(--accent-tech)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
