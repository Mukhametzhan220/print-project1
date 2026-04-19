"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";
import { useState } from "react";
import Cookies from "js-cookie";
import { useFlow } from "@/lib/flow-context";
import { api } from "@/lib/api";

export default function VerifyPage() {
  const router = useRouter();
  const { code, phone, language, setCode } = useFlow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post<{ access_token: string, expires_in: number }>("/auth/verify-code", { 
        phone, 
        code,
        language
      });
      // Set the token cookie
      Cookies.set("access_token", res.access_token, { expires: res.expires_in / 86400 });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell title="Verification" subtitle={`We sent an SMS code to ${phone || "your number"}`}>
      <ProgressHeader step={2} total={8} />
      <label className="field">
        Enter code
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
      </label>
      {error && <p className="error" style={{ color: "red" }}>{error}</p>}
      <PrimaryButton onClick={handleVerify} disabled={code.length < 4 || loading}>
        {loading ? "Verifying..." : "Verify"}
      </PrimaryButton>
    </MobileShell>
  );
}
