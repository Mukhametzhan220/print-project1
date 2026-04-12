import Link from "next/link";

const steps = [
  ["Login", "/login"],
  ["Verify", "/verify"],
  ["Dashboard", "/dashboard"],
  ["Upload", "/upload"],
  ["File", "/selection"],
  ["Settings", "/settings"],
  ["Preview", "/preview"],
  ["Payment", "/payment"],
] as const;

export function ScreenLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="page-wrap">
      <div className="card">
        <nav className="steps" aria-label="Flow steps">
          {steps.map(([label, href]) => (
            <Link key={href} href={href} className="step-pill">
              {label}
            </Link>
          ))}
        </nav>
        <h1>{title}</h1>
        {subtitle ? <p className="subtitle">{subtitle}</p> : null}
        {children}
      </div>
    </main>
  );
}
