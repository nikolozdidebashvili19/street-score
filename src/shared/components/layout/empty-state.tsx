import { type ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  text?: string;
  action?: ReactNode;
};

/** A ruled, quiet "nothing here yet" block — no icon, no card. */
export const EmptyState = ({ title, text, action }: EmptyStateProps) => {
  return (
    <div className="animate-rise flex flex-col items-start gap-3 border-y border-border py-12">
      <p className="font-heading text-2xl">{title}</p>
      {text && <p className="max-w-md text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
