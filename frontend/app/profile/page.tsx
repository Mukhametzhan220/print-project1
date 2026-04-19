"use client";

import { MobileShell } from "@/components/mobile-shell";
import { BottomNav } from "@/components/bottom-nav";
import { useFlow } from "@/lib/flow-context";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ProfilePage() {
  const { phone, language, setPhone, setLanguage, setCode, setFileName, setFileId, setFilePreviewUrl } = useFlow();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("access_token");
    // Clear flow state
    setPhone("");
    setCode("");
    setFileName("");
    setFileId(null);
    setFilePreviewUrl(null);
    // Clear localStorage
    if (typeof window !== "undefined") {
      Object.keys(localStorage).filter(k => k.startsWith("flow_")).forEach(k => localStorage.removeItem(k));
    }
    router.push("/login");
  };

  return (
    <MobileShell title="Профиль" subtitle="Настройки аккаунта">

      {/* Phone */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--stroke)",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}>
        <div style={{
          width: "52px",
          height: "52px",
          background: "linear-gradient(135deg, #295cff, #00b1ff)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          color: "white",
          flexShrink: 0,
        }}>
          👤
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700 }}>{phone || "Номер не указан"}</p>
          <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>Аккаунт Paraq</p>
        </div>
      </div>

      {/* Language (здесь переключение дублируется для удобства) */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--stroke)",
        borderRadius: "16px",
        overflow: "hidden",
      }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--stroke)" }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.85rem", color: "var(--muted)" }}>НАСТРОЙКИ</p>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>🌍 Язык интерфейса</span>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as "en" | "ru" | "kz")}
            style={{
              border: "1px solid var(--stroke)",
              borderRadius: "8px",
              padding: "4px 8px",
              background: "var(--surface)",
              fontWeight: 600,
            }}
          >
            <option value="ru">🇷🇺 Русский</option>
            <option value="kz">🇰🇿 Қазақша</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          border: "1px solid #ffcccc",
          background: "#fff8f8",
          color: "#cc0000",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        🚪 Выйти из аккаунта
      </button>

      <BottomNav current="profile" />
    </MobileShell>
  );
}
