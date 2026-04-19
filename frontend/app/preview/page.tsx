"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";
import { useFlow } from "@/lib/flow-context";
import Link from "next/link";

export default function PreviewPage() {
  const router = useRouter();
  const { fileName, filePreviewUrl, fileSizeKb, filePages, settings, termsAccepted, setTermsAccepted } = useFlow();

  const displayName = fileName || "Campus-notes.pdf";
  const price = settings.copies * (settings.colorMode === "color" ? 180 : 90);

  const formatSize = (kb: number | null) => {
    if (!kb) return null;
    if (kb < 1024) return `${kb} КБ`;
    return `${(kb / 1024).toFixed(1)} МБ`;
  };

  return (
    <MobileShell title="Предпросмотр" subtitle="Проверьте перед оплатой">
      <ProgressHeader step={7} total={8} />

      {/* PDF Preview */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--stroke)",
        borderRadius: "16px",
        overflow: "hidden",
      }}>
        {filePreviewUrl ? (
          <iframe
            src={filePreviewUrl + "#toolbar=0&view=FitH"}
            style={{
              width: "100%",
              height: "300px",
              border: "none",
              background: "#f8f8f8",
            }}
            title="PDF Preview"
          />
        ) : (
          <div style={{
            height: "220px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            background: "linear-gradient(135deg, #f4f6fb, #eef3ff)",
          }}>
            <div style={{ fontSize: "3rem" }}>📄</div>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>Предпросмотр недоступен</p>
          </div>
        )}

        {/* Summary bar */}
        <div style={{
          padding: "14px 16px",
          borderTop: "1px solid var(--stroke)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
          textAlign: "center",
        }}>
          {[
            { label: "Копии", value: settings.copies },
            { label: "Цвет", value: settings.colorMode === "color" ? "Цветной" : "Ч/Б" },
            { label: "Печать", value: settings.duplex ? "Двусторон." : "Односторон." },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted)" }}>{label}</p>
              <p style={{ margin: "2px 0 0", fontWeight: 700, fontSize: "0.9rem" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* File name */}
        <div style={{
          padding: "10px 16px",
          borderTop: "1px solid var(--stroke)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.85rem",
        }}>
          <span style={{ color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
            {displayName}
          </span>
          <span style={{ color: "var(--muted)" }}>
            {[formatSize(fileSizeKb), filePages ? `${filePages} стр.` : null].filter(Boolean).join(" · ")}
          </span>
        </div>
      </div>

      {/* Price */}
      <div style={{
        background: "linear-gradient(135deg, #295cff, #00b1ff)",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
      }}>
        <div>
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.85 }}>Итого к оплате</p>
          <p style={{ margin: "2px 0 0", fontSize: "1.8rem", fontWeight: 800 }}>{price} ₸</p>
        </div>
        <span style={{ fontSize: "2rem" }}>💳</span>
      </div>

      {/* Terms */}
      <label id="terms" style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "var(--surface)",
        border: "1px solid var(--stroke)",
        borderRadius: "14px",
        padding: "14px 16px",
        cursor: "pointer",
      }}>
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          style={{ width: "18px", height: "18px", accentColor: "var(--primary)", cursor: "pointer" }}
        />
        <span style={{ fontSize: "0.9rem" }}>
          Согласен с{" "}
          <Link href="/preview#terms" style={{ color: "var(--primary)" }}>
            условиями публичной печати
          </Link>
        </span>
      </label>

      <PrimaryButton onClick={() => router.push("/payment")} disabled={!termsAccepted}>
        Перейти к оплате →
      </PrimaryButton>
    </MobileShell>
  );
}
