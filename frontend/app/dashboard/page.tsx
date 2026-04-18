import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { MobileShell } from "@/components/mobile-shell";
import { ProgressHeader } from "@/components/progress-header";

const sections = [
  { id: "new", title: "New Print", description: "Upload and print in under 60 seconds", href: "/upload" },
  { id: "orders", title: "My Orders", description: "Track your active and completed orders", href: "/dashboard#orders" },
  { id: "shops", title: "Nearby Shops", description: "Find 24/7 self-service print points", href: "/dashboard#shops" },
  { id: "support", title: "Support", description: "Chat with operators in real-time", href: "/dashboard#support" },
  { id: "profile", title: "Profile", description: "Payment methods, language, and invoices", href: "/dashboard#profile" }
];

export default function DashboardPage() {
  return (
    <MobileShell title="Dashboard" subtitle="Everything you need to print from your phone">
      <ProgressHeader step={3} total={8} />
      <div className="card-grid">
        {sections.map((section) => (
          <Link key={section.id} href={section.href} className="app-card" id={section.id}>
            <h3>{section.title}</h3>
            <p>{section.description}</p>
          </Link>
        ))}
      </div>
      <BottomNav current="home" />
    </MobileShell>
  );
}
