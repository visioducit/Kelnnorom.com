import { Seo } from '@/components/Seo';

function ExperiencePage() {
  return (
    <>
      <Seo
        config={{
          title: 'Experience — Kel Nnorom',
          description: 'A career of increasing system complexity across digital media, fintech, consulting, logistics and supply chain.',
          canonical: 'https://kelnnorom.com/experience',
        }}
      />
      <div className="max-w-content container-px section-py">
        <p className="eyebrow">EXPERIENCE</p>
        <p className="body-text mt-4">Experience timeline will be built in Phase 5.</p>
      </div>
    </>
  );
}

export default ExperiencePage;
