"use client";

import { MobileShell } from "@/components/mobile-shell";
import { BottomNav } from "@/components/bottom-nav";
import Link from "next/link";

// When you open a new print point, add it here like this:
// { id: 1, name: "ЕНУ Корпус 1", address: "ул. Кунаева 12", city: "Астана", hours: "08:00–22:00", lat: 51.128, lng: 71.430 }
const PRINT_POINTS: {
  id: number;
  name: string;
  address: string;
  city: string;
  hours: string;
  lat?: number;
  lng?: number;
}[] = [];

export default function MapPage() {
  return (
    <MobileShell title="Точки печати" subtitle="Найдите ближайшую точку">

      {PRINT_POINTS.length === 0 ? (
        // Empty state — shown until you add the first print point
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          textAlign: "center",
          gap: "16px",
        }}>
          {/* Map placeholder illustration */}
          <div style={{
            width: "120px",
            height: "120px",
            background: "linear-gradient(135deg, #eef3ff, #dde8ff)",
            borderRadius: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3.5rem",
          }}>
            🗺️
          </div>

          <div>
            <p style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0 0 8px", color: "var(--text)" }}>
              Скоро открываемся!
            </p>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Мы активно готовим первые точки печати.<br />
              Следите за обновлениями — совсем скоро появятся адреса в вашем городе.
            </p>
          </div>

          {/* Telegram notification button */}
          <a
            href="https://t.me/ParaqKZ_bot"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#0088cc",
              color: "white",
              padding: "12px 24px",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              marginTop: "8px",
            }}
          >
            <span>🔔</span> Уведомить меня в Telegram
          </a>
        </div>
      ) : (
        // List of print points — shown when PRINT_POINTS array is not empty
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {PRINT_POINTS.map(point => (
            <div
              key={point.id}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--stroke)",
                borderRadius: "16px",
                padding: "16px",
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
              }}
            >
              {/* Icon */}
              <div style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #eef3ff, #dde8ff)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                flexShrink: 0,
              }}>
                🖨️
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>{point.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                  📍 {point.address}, {point.city}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--muted)" }}>
                  🕐 {point.hours}
                </p>
              </div>

              {/* 2GIS link if coordinates available */}
              {point.lat && point.lng && (
                <a
                  href={`https://2gis.kz/directions/points/${point.lng},${point.lat}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid var(--stroke)",
                    textDecoration: "none",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                    color: "var(--primary)",
                  }}
                  title="Открыть в 2GIS"
                >
                  🧭
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <BottomNav current="map" />
    </MobileShell>
  );
}
