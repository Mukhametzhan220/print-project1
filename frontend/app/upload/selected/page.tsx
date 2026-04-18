"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";
import { useFlow } from "@/lib/flow-context";

export default function SelectedFilePage() {
  const router = useRouter();
  const { fileName, setFileName } = useFlow();

  const currentFile = fileName || "Campus-notes.pdf";

  return (
    <MobileShell title="File Ready" subtitle="Review selected document">
      <ProgressHeader step={5} total={8} />
      <div className="selected-file">
        <h3>{currentFile}</h3>
        <p>2.4 MB · 12 pages · Ready for printing</p>
      </div>
      <label className="field">
        Rename file label
        <input value={currentFile} onChange={(event) => setFileName(event.target.value)} />
      </label>
      <PrimaryButton onClick={() => router.push("/settings")}>Continue to print settings</PrimaryButton>
    </MobileShell>
  );
}
