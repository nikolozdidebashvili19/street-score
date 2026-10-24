import { type ReactNode } from 'react';

type PageHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export const PageHeading = ({ eyebrow, title, description, children }: PageHeadingProps) => {
  return (
    <header className="animate-rise flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-brick">{eyebrow}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </header>
  );
};
