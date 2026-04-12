"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";
import { useFlow } from "@/lib/flow-context";

export default function PreviewPage() {
  const router = useRouter();
  const { fileName, settings, termsAccepted, setTermsAccepted } = useFlow();

  return (
    <MobileShell title="PDF Preview" subtitle="Final check before payment">
      <ProgressHeader step={7} total={8} />
      <div className="pdf-preview">
        <div className="pdf-preview__mock">PDF PREVIEW</div>
        <p>{fileName || "Campus-notes.pdf"}</p>
        <p>
          {settings.copies} copies · {settings.colorMode === "color" ? "Color" : "B/W"} ·
          {settings.duplex ? " Duplex" : " Single side"}
        </p>
      </div>
      <label id="terms" className="toggle-row">
        <span>I agree to Terms of Public Printing Service</span>
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) => setTermsAccepted(event.target.checked)}
        />
      </label>
      <PrimaryButton onClick={() => router.push("/payment")} disabled={!termsAccepted}>
        Continue to payment
      </PrimaryButton>
    </MobileShell>
  );
}
