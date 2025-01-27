'use client';

import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { PricingSection } from '@/components/sections/pricing-section';
import { FaqSection } from '@/components/sections/faq-section';
import { CtaSection } from '@/components/sections/cta-section';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
