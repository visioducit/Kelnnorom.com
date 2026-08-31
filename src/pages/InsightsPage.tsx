import { Seo } from '@/components/Seo';

function InsightsPage() {
  return (
    <>
      <Seo
        config={{
          title: 'Insights — Kel Nnorom',
          description: 'Thinking about operations, digital systems, growth, technology and the mechanics behind performance.',
          canonical: 'https://kelnnorom.com/insights',
        }}
      />
      <div className="max-w-content container-px section-py">
        <p className="eyebrow">INSIGHTS</p>
        <p className="body-text mt-4">Insights archive will be built in Phase 5.</p>
      </div>
    </>
  );
}

export default InsightsPage;
