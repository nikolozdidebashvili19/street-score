import { ClosingCta } from '@/features/marketing/components/closing-cta';
import { ExampleComparison } from '@/features/marketing/components/example-comparison';
import { HeroSection } from '@/features/marketing/components/hero-section';
import { MethodTable } from '@/features/marketing/components/method-table';
import { Footer } from '@/shared/components/layout/footer';
import { Header } from '@/shared/components/layout/header';

export const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pb-16">
        <HeroSection />
        <ExampleComparison />
        <MethodTable />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
};
