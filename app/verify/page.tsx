"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";
import { useFlow } from "@/lib/flow-context";

export default function VerifyPage() {
  const router = useRouter();
  const { code, phone, setCode } = useFlow();

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
      <PrimaryButton onClick={() => router.push("/dashboard")} disabled={code.length < 4}>
        Verify
      </PrimaryButton>
    </MobileShell>
  );
}
