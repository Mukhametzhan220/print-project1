"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useFlow } from "@/lib/flow-context";

export default function PreviewPage() {
  const router = useRouter();
  const { selectedFile, settings, termsAccepted, setTermsAccepted } = useFlow();

  return (
    <ScreenLayout title="PDF preview" subtitle="Review before payment.">
      <section className="preview-box">
        <h2>{selectedFile || "No file selected"}</h2>
        <p>
          {settings.copies} copies • {settings.paperSize} • {settings.colorMode === "color" ? "Color" : "B&W"} •
          {settings.duplex ? " Duplex" : " Single-sided"}
        </p>
      </section>
      <label className="check">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        I agree to the <Link href="/terms" className="link">terms</Link>.
      </label>
      <div className="row">
        <button className="secondary" type="button" onClick={() => router.push("/settings")}>Back</button>
        <button className="primary" type="button" disabled={!termsAccepted} onClick={() => router.push("/payment")}>Continue</button>
      </div>
    </ScreenLayout>
  );
}
