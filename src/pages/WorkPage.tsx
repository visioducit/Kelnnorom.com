import { Seo } from '@/components/Seo';

function WorkPage() {
  return (
    <>
      <Seo
        config={{
          title: 'Work — Kel Nnorom',
          description: 'Selected work and case studies across digital operations, logistics, supply chain, fintech, and digital media.',
          canonical: 'https://kelnnorom.com/work',
        }}
      />
      <div className="max-w-content container-px section-py">
        <p className="eyebrow">WORK</p>
        <p className="body-text mt-4">Work archive will be built in Phase 5.</p>
      </div>
    </>
  );
}

export default WorkPage;
