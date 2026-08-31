import { useParams, Link } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { getCaseStudy } from '@/content/case-studies';

function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const caseStudy = slug ? getCaseStudy(slug) : undefined;

  if (!caseStudy) {
    return (
      <>
        <Seo config={{ title: 'Case Study Not Found — Kel Nnorom', description: 'The requested case study could not be found.' }} />
        <div className="max-w-content container-px section-py">
          <p className="eyebrow">404</p>
          <h1 className="headline-section mt-4">Case study not found.</h1>
          <Link to="/work" className="text-gold mt-6 inline-block">← Back to all work</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        config={{
          title: `${caseStudy.title} — Kel Nnorom`,
          description: caseStudy.challenge,
          canonical: `https://kelnnorom.com/work/${caseStudy.slug}`,
          type: 'article',
        }}
      />
      <div className="max-w-content container-px section-py">
        <p className="eyebrow">CASE STUDY</p>
        <h1 className="headline-section mt-4">{caseStudy.title}</h1>
        <p className="body-text mt-4 text-muted" style={{ color: 'var(--muted)' }}>
          {caseStudy.company} — {caseStudy.tagline}
        </p>
        <p className="body-text mt-6">{caseStudy.challenge}</p>
      </div>
    </>
  );
}

export default CaseStudyPage;
