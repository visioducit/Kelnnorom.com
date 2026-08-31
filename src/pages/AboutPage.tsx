import { Seo } from '@/components/Seo';

function AboutPage() {
  return (
    <>
      <Seo
        config={{
          title: 'About — Kel Nnorom',
          description: 'A cross-functional operator with a wide operating range across digital, commercial, technology, operations, logistics and growth.',
          canonical: 'https://kelnnorom.com/about',
        }}
      />
      <div className="max-w-content container-px section-py">
        <p className="eyebrow">ABOUT</p>
        <p className="body-text mt-4">About page will be built in Phase 5.</p>
      </div>
    </>
  );
}

export default AboutPage;
