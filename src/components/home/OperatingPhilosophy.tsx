import { useState } from 'react';
import { philosophyStages } from '@/content/site-data';
import { CheckCircle } from 'lucide-react';

export function OperatingPhilosophy() {
  const [activeStage, setActiveStage] = useState<number>(0);

  return (
    <section className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)] relative">
      <div className="max-w-content mx-auto container-px">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="eyebrow mb-2 text-[var(--accent-gold)]">Operating Philosophy</div>
          <h2 className="headline-section text-[var(--foreground)] mb-4">
            Observe → Design → Optimize → Scale.
          </h2>
          <p className="body-text text-base md:text-lg text-[var(--muted)] leading-relaxed">
            A 6-stage operational lifecycle executed across business turnarounds, digital expansions, and distribution networks.
          </p>
        </div>

        {/* 6-Stage Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {philosophyStages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <div
                key={stage.number}
                onClick={() => setActiveStage(idx)}
                onMouseEnter={() => setActiveStage(idx)}
                className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)] shadow-md ring-1 ring-[var(--accent-gold)]/20 translate-y-[-2px]'
                    : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent-tech)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
                    <span className="text-xs font-mono font-bold text-[var(--accent-gold)]">
                      STAGE {stage.number}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-[var(--accent-gold)]">
                        <CheckCircle className="w-3 h-3" /> Active Focus
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-4">
                    {stage.title}
                  </h3>

                  <div className="space-y-2">
                    {stage.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-center gap-2 text-xs text-[var(--muted)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-tech)] shrink-0" />
                        <span className="text-[var(--foreground)] font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[var(--border)]/60 text-[11px] font-mono text-[var(--muted)]">
                  Step {idx + 1} of 6 in Execution System
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
