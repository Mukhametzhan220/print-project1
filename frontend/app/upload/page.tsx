"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";
import { useFlow } from "@/lib/flow-context";

export default function UploadPage() {
  const router = useRouter();
  const { setFileName } = useFlow();

  return (
    <MobileShell title="Upload Document" subtitle="Choose PDF, DOCX or image">
      <ProgressHeader step={4} total={8} />
      <label className="upload-box">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) {
              setFileName(selected.name);
              router.push("/upload/selected");
            }
          }}
        />
        <span>Tap to pick file</span>
      </label>

      <PrimaryButton onClick={() => router.push("/upload/selected")}>Use sample document</PrimaryButton>
    </MobileShell>
  );
}
