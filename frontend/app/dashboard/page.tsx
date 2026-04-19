"use client";

import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { MobileShell } from "@/components/mobile-shell";
import { useFlow } from "@/lib/flow-context";

const sections = [
  {
    id: "new",
    icon: "📄",
    title: "Новая печать",
    description: "Загрузите и распечатайте документ за минуту",
    href: "/upload",
    gradient: "linear-gradient(135deg, #295cff, #00b1ff)",
    featured: true,
  },
  {
    id: "orders",
    icon: "📦",
    title: "Мои заказы",
    description: "Отслеживайте статус активных и прошлых заказов",
    href: "/orders",
    gradient: "",
  },
  {
    id: "map",
    icon: "🗺️",
    title: "Точки печати",
    description: "Найдите ближайшую самообслуживаемую точку",
    href: "/map",
    gradient: "",
  },
  {
    id: "profile",
    icon: "👤",
    title: "Профиль",
    description: "Настройки аккаунта и история платежей",
    href: "/profile",
    gradient: "",
  },
];

export default function DashboardPage() {
  const { phone } = useFlow();

  return (
    <MobileShell title="Paraq" subtitle={phone ? `Добро пожаловать, ${phone}` : "Сервис самообслуживаемой печати"}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sections.map((section) =>
          section.featured ? (
            // Featured card — big blue "New Print" button
            <Link key={section.id} href={section.href} style={{
              background: section.gradient,
              borderRadius: "20px",
              padding: "24px 20px",
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 4px 24px rgba(41,92,255,0.25)",
            }}>
              <div style={{
                width: "56px",
                height: "56px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                flexShrink: 0,
              }}>
                {section.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem" }}>{section.title}</p>
                <p style={{ margin: "4px 0 0", fontSize: "0.85rem", opacity: 0.85 }}>{section.description}</p>
              </div>
              <span style={{ marginLeft: "auto", fontSize: "1.3rem", opacity: 0.7 }}>→</span>
            </Link>
          ) : (
            // Regular card
            <Link key={section.id} href={section.href} style={{
              background: "var(--surface)",
              border: "1px solid var(--stroke)",
              borderRadius: "16px",
              padding: "16px",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}>
              <div style={{
                width: "44px",
                height: "44px",
                background: "linear-gradient(135deg, #f0f3fc, #e4eaff)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
                flexShrink: 0,
              }}>
                {section.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>{section.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: "0.83rem", color: "var(--muted)" }}>{section.description}</p>
              </div>
              <span style={{ marginLeft: "auto", color: "var(--muted)", fontSize: "1.1rem" }}>›</span>
            </Link>
          )
        )}
      </div>

      <BottomNav current="home" />
    </MobileShell>
  );
}
