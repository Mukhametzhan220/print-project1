"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";
import { useState } from "react";
import { useFlow } from "@/lib/flow-context";
import { api } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();
  const { setFileName, setFileId } = useFlow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await api.post<{ id: string, name: string }>("/files/upload", formData);
      setFileName(res.name);
      setFileId(res.id);
      router.push("/upload/selected");
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

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
              handleUpload(selected);
            }
          }}
          disabled={loading}
        />
        <span>{loading ? "Uploading..." : "Tap to pick file"}</span>
      </label>
      {error && <p className="error" style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <PrimaryButton onClick={() => router.push("/upload/selected")}>Use sample document</PrimaryButton>
    </MobileShell>
  );
}
