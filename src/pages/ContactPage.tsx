import { Seo } from '@/components/Seo';

function ContactPage() {
  return (
    <>
      <Seo
        config={{
          title: 'Contact — Kel Nnorom',
          description: 'Have a complex problem? If it sits between operations, technology, growth, data and execution, it is probably worth a conversation.',
          canonical: 'https://kelnnorom.com/contact',
        }}
      />
      <div className="max-w-content container-px section-py">
        <p className="eyebrow">CONTACT</p>
        <p className="body-text mt-4">Contact page will be built in Phase 5.</p>
      </div>
    </>
  );
}

export default ContactPage;
