import { Link } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/Button';

function NotFoundPage() {
  return (
    <>
      <Seo
        config={{
          title: '404 — Kel Nnorom',
          description: 'The system could not find that page.',
          canonical: 'https://kelnnorom.com/404',
        }}
      />
      <div className="max-w-content container-px section-py min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="eyebrow">ERROR / 404</p>
        <h1 className="headline-section mt-6 max-w-2xl">
          THE SYSTEM COULD NOT FIND THAT PAGE.
        </h1>
        <p className="body-text mt-6 text-muted" style={{ color: 'var(--muted)' }}>
          The page you're looking for may have moved, changed, or never existed.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button to="/" variant="primary">Back to the Operating System</Button>
          <Button to="/work" variant="secondary">Explore the Work</Button>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
