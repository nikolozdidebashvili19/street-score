'use client';
import { HOME_FEATURES } from '@/shared/const/home.const';
import { useI18n } from '@/shared/hooks/use-i18n';

export const FeatureSection = () => {
  const { t } = useI18n();

  return (
    <section aria-label={t.home.howItWorks} className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
      <h2 className="text-3xl sm:text-4xl">{t.home.howItWorks}</h2>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0">
        {HOME_FEATURES.map(({ key }, index) => {
          const feature = t.home.features[key];

          return (
            <div key={key} className="border-t border-foreground pt-5 md:border-l md:border-t-0 md:px-6 md:pt-0 md:first:border-l-0 md:first:pl-0">
              <p className="font-mono text-xs uppercase tracking-wider text-brick">
                {String.fromCharCode(97 + index)}. {feature.label}
              </p>
              <h3 className="mt-3 text-2xl">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
