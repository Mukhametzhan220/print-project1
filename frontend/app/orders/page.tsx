"use client";

import { useEffect, useState } from "react";
import { MobileShell } from "@/components/mobile-shell";
import { BottomNav } from "@/components/bottom-nav";
import { api } from "@/lib/api";
import Link from "next/link";

type Order = {
  id: number;
  file_name: string;
  copies: number;
  color_mode: "bw" | "color";
  duplex: boolean;
  status: "draft" | "pending_payment" | "paid" | "in_progress" | "ready" | "completed" | "cancelled";
  total_price: number;
  created_at: string;
};

const STATUS_CONFIG: Record<Order["status"], { label: string; color: string; bg: string; icon: string }> = {
  draft:           { label: "Черновик",        color: "#888",    bg: "#f5f5f5", icon: "📝" },
  pending_payment: { label: "Ожидает оплаты",  color: "#b97400", bg: "#fff8e6", icon: "⏳" },
  paid:            { label: "Оплачен",          color: "#1a7a1a", bg: "#f0fff0", icon: "✅" },
  in_progress:     { label: "Печатается...",   color: "#295cff", bg: "#eef3ff", icon: "🖨️" },
  ready:           { label: "Готов к выдаче",  color: "#00897b", bg: "#e8f5e9", icon: "🟢" },
  completed:       { label: "Выдан",            color: "#555",    bg: "#f0f0f0", icon: "📦" },
  cancelled:       { label: "Отменён",          color: "#cc0000", bg: "#fff0f0", icon: "❌" },
};

function OrderCard({ order }: { order: Order }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.draft;
  const date = new Date(order.created_at).toLocaleDateString("ru-RU", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
  });

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--stroke)",
      borderRadius: "16px",
      overflow: "hidden",
    }}>
      {/* Status bar */}
      <div style={{
        background: cfg.bg,
        padding: "8px 14px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}>
        <span>{cfg.icon}</span>
        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: cfg.color }}>{cfg.label}</span>
        <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--muted)" }}>#{order.id}</span>
      </div>

      {/* Order details */}
      <div style={{ padding: "12px 14px" }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {order.file_name}
        </p>
        <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
          {[
            `${order.copies} коп.`,
            order.color_mode === "color" ? "Цветной" : "Ч/Б",
            order.duplex ? "Двусторонний" : "Односторонний",
          ].map(tag => (
            <span key={tag} style={{
              background: "#f0f3fa",
              borderRadius: "6px",
              padding: "2px 8px",
              fontSize: "0.78rem",
              color: "var(--muted)",
              fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{date}</span>
          <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--primary)" }}>
            {order.total_price} ₸
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Order[]>("/orders")
      .then(setOrders)
      .catch(() => setError("Не удалось загрузить заказы"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MobileShell title="Мои заказы" subtitle="История и активные заказы">
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {loading && (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                background: "var(--surface)",
                border: "1px solid var(--stroke)",
                borderRadius: "16px",
                height: "110px",
                animation: "pulse 1.5s ease-in-out infinite",
                opacity: 0.6,
              }} />
            ))}
          </>
        )}

        {!loading && error && (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "var(--muted)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>⚠️</div>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--muted)",
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🗂️</div>
            <p style={{ fontWeight: 600, margin: "0 0 8px", color: "var(--text)" }}>Заказов пока нет</p>
            <p style={{ margin: "0 0 24px", fontSize: "0.9rem" }}>Загрузите документ и оформите первый заказ!</p>
            <Link href="/upload" style={{
              background: "var(--primary)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 600,
            }}>
              Загрузить документ
            </Link>
          </div>
        )}

        {!loading && !error && orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      <BottomNav current="orders" />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </MobileShell>
  );
}
