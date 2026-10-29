import { type ReactNode } from 'react';

type ReportSectionProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
};

/** A report spread: heading and lede in the margin column, the exhibit in the wide column. */
export const ReportSection = ({ eyebrow, title, lede, children }: ReportSectionProps) => {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
      <div className="grid grid-cols-1 gap-8 border-t border-foreground py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
        <div className="lg:col-span-4">
          <p className="font-mono text-xs uppercase tracking-wider text-brick">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-normal sm:text-4xl">{title}</h2>
          {lede && <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{lede}</p>}
        </div>
        <div className="min-w-0 lg:col-span-8">{children}</div>
      </div>
    </section>
  );
};
