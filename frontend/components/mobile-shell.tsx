import type { ReactNode } from "react";

type MobileShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function MobileShell({ title, subtitle, children }: MobileShellProps) {
  return (
    <main className="screen">
      <header className="screen__header">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <section className="screen__content">{children}</section>
    </main>
  );
}
