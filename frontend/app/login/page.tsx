"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { useFlow } from "@/lib/flow-context";

export default function LoginPage() {
  const router = useRouter();
  const { phone, language, setPhone, setLanguage } = useFlow();

  return (
    <MobileShell title="Welcome to Paraq" subtitle="Sign in with your phone number">
      <div className="lang-switch">
        <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>
          EN
        </button>
        <button className={language === "ru" ? "active" : ""} onClick={() => setLanguage("ru")}>
          RU
        </button>
      </div>

      <label className="field">
        Phone number
        <input
          type="tel"
          placeholder="+7 700 000 00 00"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </label>

      <p className="hint">
        By continuing, you agree to our <Link href="/preview#terms">terms and conditions</Link>.
      </p>

      <PrimaryButton onClick={() => router.push("/verify")} disabled={phone.trim().length < 8}>
        Continue
      </PrimaryButton>
    </MobileShell>
  );
}
