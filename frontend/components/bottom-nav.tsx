"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavKey = "home" | "upload" | "orders" | "map" | "profile";

const navItems: Array<{ key: NavKey; label: string; href: string; icon: string }> = [
  { key: "home",    label: "Главная", href: "/dashboard", icon: "🏠" },
  { key: "upload",  label: "Печать",  href: "/upload",    icon: "📄" },
  { key: "orders",  label: "Заказы",  href: "/orders",    icon: "📦" },
  { key: "map",     label: "Карта",   href: "/map",       icon: "🗺️" },
  { key: "profile", label: "Профиль", href: "/profile",   icon: "👤" },
];

type BottomNavProps = {
  current?: NavKey;
};

export function BottomNav({ current }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(100%, 420px)",
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(12px)",
      borderTop: "1px solid var(--stroke)",
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      padding: "8px 4px 16px",
      zIndex: 100,
    }}>
      {navItems.map((item) => {
        const isActive = current ? current === item.key : pathname === item.href;
        return (
          <Link
            key={item.key}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              textDecoration: "none",
              color: isActive ? "var(--primary)" : "var(--muted)",
              fontSize: "0.68rem",
              fontWeight: isActive ? 700 : 500,
              padding: "4px 2px",
              borderRadius: "10px",
              background: isActive ? "rgba(41,92,255,0.08)" : "transparent",
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
