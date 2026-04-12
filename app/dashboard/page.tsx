"use client";

import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/components/ScreenLayout";

const sections = [
  "Recent files",
  "Saved printers",
  "Balance",
  "Promotions",
  "Support",
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <ScreenLayout title="Dashboard" subtitle="Everything you need before printing.">
      <div className="grid">
        {sections.map((name) => (
          <section key={name} className="section-card">
            <h2>{name}</h2>
            <p>Quick access to {name.toLowerCase()}.</p>
          </section>
        ))}
      </div>
      <button className="primary" type="button" onClick={() => router.push("/upload")}>Start New Print</button>
    </ScreenLayout>
  );
}
