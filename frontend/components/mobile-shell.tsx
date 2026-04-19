import type { ReactNode } from "react";
import { LangSwitcher } from "./lang-switcher";

type MobileShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function MobileShell({ title, subtitle, children }: MobileShellProps) {
  return (
    <main className="screen">
      <header className="screen__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <LangSwitcher />
      </header>
      <section className="screen__content">{children}</section>
    </main>
  );
}
