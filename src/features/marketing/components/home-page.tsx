import { ClosingCta } from '@/features/marketing/components/closing-cta';
import { HeroSection } from '@/features/marketing/components/hero-section';
import { HowItWorks } from '@/features/marketing/components/how-it-works';
import { WhatWeLookAt } from '@/features/marketing/components/what-we-look-at';
import { WhatYouCanDo } from '@/features/marketing/components/what-you-can-do';
import { Footer } from '@/shared/components/layout/footer';
import { Header } from '@/shared/components/layout/header';

export const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pb-16">
        <HeroSection />
        <HowItWorks />
        <WhatWeLookAt />
        <WhatYouCanDo />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
};
