import { type ReactNode } from 'react';

type DashboardShellProps = {
  children: ReactNode;
};

/** Scroll container below the app header; pages own their own padding so the explorer can run edge to edge. */
export const DashboardShell = ({ children }: DashboardShellProps) => {
  return <main className="flex min-h-0 flex-1 flex-col overflow-auto">{children}</main>;
};
