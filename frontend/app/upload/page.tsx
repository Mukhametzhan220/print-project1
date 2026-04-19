"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";
import { useState, useRef, useCallback } from "react";
import { useFlow } from "@/lib/flow-context";
import { api } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();
  const { setFileName, setFileId, setFilePreviewUrl, setFileSizeKb, setFilePages } = useFlow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const generatePdfPreview = async (file: File): Promise<string | null> => {
    // Only works for PDF files — uses browser's built-in canvas rendering
    if (file.type !== "application/pdf") {
      // For non-PDF files, just return a placeholder
      return null;
    }
    try {
      const url = URL.createObjectURL(file);
      return url; // We store the object URL for the preview
    } catch {
      return null;
    }
  };

  const handleUpload = async (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Неподдерживаемый формат. Загрузите PDF, DOCX, PNG или JPG.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("Файл слишком большой. Максимальный размер — 25 МБ.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUploadProgress("Подготовка файла...");

      // Generate preview URL from the local file (instant, no server needed)
      const previewUrl = await generatePdfPreview(file);
      if (previewUrl) setFilePreviewUrl(previewUrl);
      setFileSizeKb(Math.round(file.size / 1024));
      
      setUploadProgress("Загрузка на сервер...");
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post<{ id: string; name: string; pages?: number }>("/files/upload", formData);
      setFileName(res.name || file.name);
      setFileId(res.id);
      if (res.pages) setFilePages(res.pages);

      setUploadProgress("Готово!");
      router.push("/upload/selected");
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить файл. Попробуйте еще раз.");
      setUploadProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleUpload(file);
    },
    []
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  return (
    <MobileShell title="Загрузить документ" subtitle="PDF, DOCX или фото">
      <ProgressHeader step={4} total={8} />

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !loading && inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "var(--primary)" : "var(--stroke)"}`,
          borderRadius: "20px",
          padding: "40px 20px",
          textAlign: "center",
          background: dragOver ? "rgba(41,92,255,0.04)" : "var(--surface)",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          transform: dragOver ? "scale(1.01)" : "scale(1)",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          disabled={loading}
          style={{ display: "none" }}
        />

        {loading ? (
          <>
            <div style={{ fontSize: "2.5rem" }}>⏳</div>
            <p style={{ fontWeight: 600, color: "var(--primary)" }}>{uploadProgress}</p>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Пожалуйста, подождите...</p>
          </>
        ) : dragOver ? (
          <>
            <div style={{ fontSize: "2.5rem" }}>📂</div>
            <p style={{ fontWeight: 700, color: "var(--primary)" }}>Отпустите файл здесь!</p>
          </>
        ) : (
          <>
            <div style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #eef3ff, #dde8ff)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
            }}>
              📄
            </div>
            <div>
              <p style={{ fontWeight: 700, margin: 0, fontSize: "1.05rem" }}>
                Нажмите или перетащите файл
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "4px 0 0" }}>
                PDF, DOCX, PNG, JPG — до 25 МБ
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div style={{
          background: "#fff0f0",
          border: "1px solid #ffcccc",
          borderRadius: "12px",
          padding: "12px 16px",
          color: "#cc0000",
          fontSize: "0.9rem",
          textAlign: "center",
        }}>
          {error}
        </div>
      )}
    </MobileShell>
  );
}
