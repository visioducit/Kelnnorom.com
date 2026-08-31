import { Seo } from '@/components/Seo';

function CapabilitiesPage() {
  return (
    <>
      <Seo
        config={{
          title: 'Capabilities — Kel Nnorom',
          description: 'Capabilities built for complex operating environments — operations, digital, data, commercial, technology, logistics and leadership.',
          canonical: 'https://kelnnorom.com/capabilities',
        }}
      />
      <div className="max-w-content container-px section-py">
        <p className="eyebrow">CAPABILITIES</p>
        <p className="body-text mt-4">Capabilities content will be built in Phase 5.</p>
      </div>
    </>
  );
}

export default CapabilitiesPage;
