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

import { useCms } from '@/lib/cms-store';

function HomePage() {
  const { state } = useCms();
  const sections = state.settings?.homepageSections || {};

  const showHero = sections.showHero !== false;
  const showSliders = sections.showHeroSliders !== false;
  const showMetrics = sections.showCredibilityMetrics !== false;
  const showAdvantage = sections.showUncommonAdvantage !== false;
  const showOperatingRange = sections.showOperatingRange !== false;
  const showCareerEvolution = sections.showCareerEvolution !== false;
  const showCaseStudies = sections.showFeaturedCaseStudies !== false;
  const showOperatingStack = sections.showOperatingStack !== false;
  const showHowIThink = sections.showHowIThink !== false;
  const showOperatingPhilosophy = sections.showOperatingPhilosophy !== false;
  const showEcosystem = sections.showProfessionalEcosystem !== false;
  const showInsights = sections.showFeaturedInsights !== false;
  const showContactCta = sections.showContactCta !== false;

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
        {showHero && <Hero />}

        {/* 01B EXECUTIVE IMAGE SLIDER BANNER */}
        {showSliders && <ExecutiveSliderBanner />}

        {/* 02 CREDIBILITY METRICS */}
        {showMetrics && <CredibilityMetrics />}

        {/* 03 THE UNCOMMON ADVANTAGE */}
        {showAdvantage && <UncommonAdvantage />}

        {/* 04 ONE OPERATOR / MANY SYSTEMS (Operating Range Stack) */}
        {showOperatingRange && <OperatingRangeStack />}

        {/* 05 CAREER EVOLUTION (From Content to Commerce & Compounding System) */}
        {showCareerEvolution && <CareerEvolution />}

        {/* 06 SELECTED CASE STUDIES */}
        {showCaseStudies && <FeaturedCaseStudies />}

        {/* 07 OPERATING STACK MATRIX */}
        {showOperatingStack && <OperatingStackMatrix />}

        {/* 08 HOW I THINK */}
        {showHowIThink && <HowIThink />}

        {/* 09 OPERATING PHILOSOPHY */}
        {showOperatingPhilosophy && <OperatingPhilosophy />}

        {/* 10 PROFESSIONAL ECOSYSTEM */}
        {showEcosystem && <ProfessionalEcosystem />}

        {/* 11 INSIGHTS PERSPECTIVES */}
        {showInsights && <FeaturedInsights />}

        {/* 12 CONTACT & ENGAGEMENT CTA */}
        {showContactCta && <HomeContactCta />}
      </div>
    </>
  );
}

export default HomePage;
