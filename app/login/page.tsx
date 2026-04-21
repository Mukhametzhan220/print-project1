"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useFlow } from "@/lib/flow-context";

export default function LoginPage() {
  const router = useRouter();
  const { phone, setPhone, language, setLanguage } = useFlow();

  return (
    <ScreenLayout title="Welcome" subtitle="Sign in to start your print job.">
      <label className="field">
        Phone number
        <input
          type="tel"
          value={phone}
          placeholder="+1 555 555 5555"
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>

      <div className="row between">
        <span>Language</span>
        <div className="segmented">
          <button
            className={language === "EN" ? "active" : ""}
            type="button"
            onClick={() => setLanguage("EN")}
          >
            EN
          </button>
          <button
            className={language === "ES" ? "active" : ""}
            type="button"
            onClick={() => setLanguage("ES")}
          >
            ES
          </button>
        </div>
      </div>

      <Link href="/terms" className="link">
        Terms and privacy policy
      </Link>

      <button type="button" className="primary" onClick={() => router.push("/verify")}>Continue</button>
    </ScreenLayout>
  );
}
