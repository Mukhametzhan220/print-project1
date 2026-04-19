"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";
import { useFlow } from "@/lib/flow-context";

export default function SelectedFilePage() {
  const router = useRouter();
  const { fileName, filePreviewUrl, fileSizeKb, filePages, setFileName } = useFlow();

  const currentFile = fileName || "Campus-notes.pdf";

  const formatSize = (kb: number | null) => {
    if (!kb) return "";
    if (kb < 1024) return `${kb} КБ`;
    return `${(kb / 1024).toFixed(1)} МБ`;
  };

  return (
    <MobileShell title="Файл готов" subtitle="Проверьте выбранный документ">
      <ProgressHeader step={5} total={8} />

      {/* PDF Preview */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--stroke)",
        borderRadius: "16px",
        overflow: "hidden",
      }}>
        {filePreviewUrl ? (
          // Real PDF preview using browser iframe
          <iframe
            src={filePreviewUrl + "#toolbar=0&view=FitH"}
            style={{
              width: "100%",
              height: "260px",
              border: "none",
              background: "#f8f8f8",
            }}
            title="PDF Preview"
          />
        ) : (
          // Placeholder for non-PDF or no file
          <div style={{
            height: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            background: "linear-gradient(135deg, #f4f6fb, #eef3ff)",
          }}>
            <div style={{ fontSize: "3rem" }}>📄</div>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
              Предпросмотр недоступен
            </p>
          </div>
        )}

        {/* File info bar */}
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--stroke)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <span style={{ fontSize: "1.4rem" }}>📎</span>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentFile}
            </p>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
              {[formatSize(fileSizeKb), filePages ? `${filePages} стр.` : null]
                .filter(Boolean)
                .join(" · ") || "Готов к печати"}
            </p>
          </div>
          <button
            onClick={() => router.push("/upload")}
            style={{
              background: "none",
              border: "1px solid var(--stroke)",
              borderRadius: "8px",
              padding: "4px 10px",
              fontSize: "0.8rem",
              color: "var(--muted)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Заменить
          </button>
        </div>
      </div>

      <label className="field">
        Переименовать (необязательно)
        <input value={currentFile} onChange={(event) => setFileName(event.target.value)} />
      </label>

      <PrimaryButton onClick={() => router.push("/settings")}>
        Настройки печати →
      </PrimaryButton>
    </MobileShell>
  );
}
