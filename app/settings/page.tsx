"use client";

import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useFlow } from "@/lib/flow-context";

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, selectedFile } = useFlow();

  return (
    <ScreenLayout title="Print settings" subtitle={`Applying settings to ${selectedFile || "your selected file"}.`}>
      <label className="field">
        Color mode
        <select
          value={settings.colorMode}
          onChange={(e) => updateSettings({ colorMode: e.target.value as "color" | "bw" })}
        >
          <option value="color">Color</option>
          <option value="bw">Black & White</option>
        </select>
      </label>
      <label className="field">
        Copies
        <input
          type="number"
          min={1}
          max={99}
          value={settings.copies}
          onChange={(e) => updateSettings({ copies: Number(e.target.value) })}
        />
      </label>
      <label className="field">
        Paper size
        <select
          value={settings.paperSize}
          onChange={(e) => updateSettings({ paperSize: e.target.value as "A4" | "Letter" })}
        >
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
        </select>
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={settings.duplex}
          onChange={(e) => updateSettings({ duplex: e.target.checked })}
        />
        Double-sided printing
      </label>
      <div className="row">
        <button className="secondary" type="button" onClick={() => router.push("/selection")}>Back</button>
        <button className="primary" type="button" onClick={() => router.push("/preview")}>Continue</button>
      </div>
    </ScreenLayout>
  );
}
