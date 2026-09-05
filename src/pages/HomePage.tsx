import { Seo } from '@/components/Seo';
import { Hero } from '@/components/home/Hero';
import { ExecutiveSliderBanner } from '@/components/home/ExecutiveSliderBanner';
import { CredibilityMetrics } from '@/components/home/CredibilityMetrics';
import { UncommonAdvantage } from '@/components/home/UncommonAdvantage';
import { OperatingRangeStack } from '@/components/home/OperatingRangeStack';
import { CareerEvolution } from '@/components/home/CareerEvolution';
import { FeaturedCaseStudies } from '@/components/home/FeaturedCaseStudies';
import { OperatingStackMatrix } from '@/components/home/OperatingStackMatrix';
import { HowIThink } from '@/components/home/HowIThink';
import { OperatingPhilosophy } from '@/components/home/OperatingPhilosophy';
import { ProfessionalEcosystem } from '@/components/home/ProfessionalEcosystem';
import { FeaturedInsights } from '@/components/home/FeaturedInsights';
import { HomeContactCta } from '@/components/home/HomeContactCta';

function HomePage() {
  return (
    <>
      <Seo
        config={{
          title: 'Kel Nnorom | Growth Strategist',
          description:
            'Kel Nnorom turns complex operations into measurable revenue growth and margin efficiency. Working across digital systems, business operations, data, programmatic monetization, logistics and supply chains.',
          canonical: 'https://www.kelnnorom.com/',
          keywords: [
            'Kel Nnorom',
            'Cross-Functional Operations Strategist',
            'Business Turnaround Executive',
            'Growth Strategist',
            'Digital Transformation',
            'Supply Chain Logistics Optimization',
            'Fleet Operations Lagos Nigeria',
            'Digital Asset Monetization',
            'SEO Strategy Architecture',
            'Operating Systems for Scaling Firms',
          ],
        }}
      />
      <div className="w-full">
        {/* 01 HERO + Interactive System Map */}
        <Hero />

        {/* 01B EXECUTIVE IMAGE SLIDER BANNER */}
        <ExecutiveSliderBanner />

        {/* 02 CREDIBILITY METRICS */}
        <CredibilityMetrics />

        {/* 03 THE UNCOMMON ADVANTAGE */}
        <UncommonAdvantage />

        {/* 04 ONE OPERATOR / MANY SYSTEMS (Operating Range Stack) */}
        <OperatingRangeStack />

        {/* 05 CAREER EVOLUTION (From Content to Commerce & Compounding System) */}
        <CareerEvolution />

        {/* 06 SELECTED CASE STUDIES */}
        <FeaturedCaseStudies />

        {/* 07 OPERATING STACK MATRIX */}
        <OperatingStackMatrix />

        {/* 08 HOW I THINK */}
        <HowIThink />

        {/* 09 OPERATING PHILOSOPHY */}
        <OperatingPhilosophy />

        {/* 10 PROFESSIONAL ECOSYSTEM */}
        <ProfessionalEcosystem />

        {/* 11 INSIGHTS PERSPECTIVES */}
        <FeaturedInsights />

        {/* 12 CONTACT & ENGAGEMENT CTA */}
        <HomeContactCta />
      </div>
    </>
  );
}

export default HomePage;
