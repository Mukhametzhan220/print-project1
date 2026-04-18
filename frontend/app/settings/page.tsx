"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";
import { useFlow } from "@/lib/flow-context";

export default function SettingsPage() {
  const router = useRouter();
  const { settings, setSettings } = useFlow();

  return (
    <MobileShell title="Print Settings" subtitle="Configure document output">
      <ProgressHeader step={6} total={8} />

      <label className="field">
        Copies
        <input
          type="number"
          min={1}
          max={99}
          value={settings.copies}
          onChange={(event) =>
            setSettings({
              ...settings,
              copies: Number(event.target.value) || 1
            })
          }
        />
      </label>

      <label className="field">
        Color mode
        <select
          value={settings.colorMode}
          onChange={(event) => setSettings({ ...settings, colorMode: event.target.value as "bw" | "color" })}
        >
          <option value="bw">Black & White</option>
          <option value="color">Color</option>
        </select>
      </label>

      <label className="toggle-row">
        <span>Duplex (double-sided)</span>
        <input
          type="checkbox"
          checked={settings.duplex}
          onChange={(event) => setSettings({ ...settings, duplex: event.target.checked })}
        />
      </label>

      <PrimaryButton onClick={() => router.push("/preview")}>Preview PDF</PrimaryButton>
    </MobileShell>
  );
}
