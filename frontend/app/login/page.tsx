"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LangSwitcher } from "@/components/lang-switcher";
import { PrimaryButton } from "@/components/primary-button";
import { useState } from "react";
import { useFlow } from "@/lib/flow-context";
import { api } from "@/lib/api";
import { useTranslation } from "@/lib/use-translation";

export default function LoginPage() {
  const router = useRouter();
  const { phone, setPhone } = useFlow();
  const t = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTelegramPrompt, setShowTelegramPrompt] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return setPhone("");

    let digits = val.replace(/\D/g, "");
    
    if (digits === "7" && phone.length > val.length && val.length < 3) return setPhone("");

    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    else if (digits.length > 0 && !digits.startsWith("7")) digits = "7" + digits;

    let formatted = "";
    if (digits.length > 0) {
      formatted = "+7";
      if (digits.length > 1) formatted += " " + digits.substring(1, 4);
      if (digits.length > 4) formatted += " " + digits.substring(4, 7);
      if (digits.length > 7) formatted += " " + digits.substring(7, 9);
      if (digits.length > 9) formatted += " " + digits.substring(9, 11);
    }
    setPhone(formatted);
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.post("/auth/send-code", { phone });
      router.push("/verify");
    } catch (err: any) {
      if (err.data?.error?.code === "telegram_required") {
        setShowTelegramPrompt(true);
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <LangSwitcher />
        </div>
        <div className="auth-card__header">
          <h1>{t.welcomeTitle}</h1>
          <p className="subtitle">{t.welcomeSubtitle}</p>
        </div>
      <label className="field">
        {t.phoneNumber}
        <input
          type="tel"
          placeholder={t.phonePlaceholder}
          value={phone}
          onChange={handlePhoneChange}
          maxLength={16}
        />
      </label>

      <p className="hint">
        {t.termsPrefix}<Link href="/preview#terms">{t.termsLink}</Link>{t.termsSuffix}
      </p>

      {showTelegramPrompt && (
        <div style={{ background: "#f0f8ff", padding: "16px", borderRadius: "12px", marginBottom: "16px", textAlign: "center" }}>
          <h3 style={{ color: "#0088cc", marginBottom: "8px" }}>{t.telegramRequiredTitle}</h3>
          <p style={{ fontSize: "14px", marginBottom: "16px", color: "#555" }}>
            {t.telegramRequiredText}
          </p>
          <a
            href="https://t.me/ParaqKZ_bot?start=auth"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#0088cc",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 500,
              width: "100%",
            }}
          >
            {t.openTelegramButton}
          </a>
        </div>
      )}

      {error && <p className="error" style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{error}</p>}
      <PrimaryButton onClick={handleContinue} disabled={phone.trim().length < 8 || loading}>
        {loading ? t.sendingButton : (showTelegramPrompt ? t.botStartedButton : t.continueButton)}
      </PrimaryButton>
      </div>
    </div>
  );
}
