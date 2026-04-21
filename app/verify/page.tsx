"use client";

import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useFlow } from "@/lib/flow-context";

export default function VerifyPage() {
  const router = useRouter();
  const { verificationCode, setVerificationCode, phone } = useFlow();

  return (
    <ScreenLayout title="Verification" subtitle={`Enter the code sent to ${phone || "your phone"}.`}>
      <label className="field">
        One-time code
        <input
          type="text"
          value={verificationCode}
          maxLength={6}
          placeholder="123456"
          onChange={(e) => setVerificationCode(e.target.value)}
        />
      </label>
      <div className="row">
        <button type="button" className="secondary" onClick={() => router.push("/login")}>Back</button>
        <button type="button" className="primary" onClick={() => router.push("/dashboard")}>Verify</button>
      </div>
    </ScreenLayout>
  );
}
