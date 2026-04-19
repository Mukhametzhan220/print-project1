"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
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
    <MobileShell title={t.welcomeTitle} subtitle={t.welcomeSubtitle}>
      <label className="field">
        {t.phoneNumber}
        <input
          type="tel"
          placeholder={t.phonePlaceholder}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
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
    </MobileShell>
  );
}
