import Link from "next/link";

type BottomNavProps = {
  current: "home" | "upload" | "orders" | "chat" | "profile";
};

const navItems: Array<{ key: BottomNavProps["current"]; label: string; href: string }> = [
  { key: "home", label: "Home", href: "/dashboard" },
  { key: "upload", label: "Upload", href: "/upload" },
  { key: "orders", label: "Orders", href: "/dashboard#orders" },
  { key: "chat", label: "Support", href: "/dashboard#support" },
  { key: "profile", label: "Profile", href: "/dashboard#profile" }
];

export function BottomNav({ current }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link key={item.key} href={item.href} className={item.key === current ? "active" : ""}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
