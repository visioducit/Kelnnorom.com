import { Seo } from '@/components/Seo';

function ExecutiveBriefPage() {
  return (
    <>
      <Seo
        config={{
          title: 'Executive Brief — Kel Nnorom',
          description: 'The 60-second executive profile: positioning, strongest metrics, case studies, capabilities and industries.',
          canonical: 'https://kelnnorom.com/executive-brief',
        }}
      />
      <div className="max-w-content container-px section-py">
        <p className="eyebrow">EXECUTIVE BRIEF</p>
        <p className="body-text mt-4">Executive brief will be built in Phase 5.</p>
      </div>
    </>
  );
}

export default ExecutiveBriefPage;
