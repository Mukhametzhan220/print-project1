"use client";

import { useState } from "react";
import { useFlow } from "@/lib/flow-context";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";
import { api } from "@/lib/api";

const methods = [
  { key: "kaspi", title: "Kaspi QR", description: "Recommended for Kazakhstan users" },
  { key: "card", title: "Bank Card", description: "Visa, MasterCard, Mir" },
  { key: "apple", title: "Apple Pay", description: "Pay in one tap" }
] as const;

export default function PaymentPage() {
  const { settings, paymentMethod, setPaymentMethod, fileId } = useFlow();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = settings.copies * (settings.colorMode === "color" ? 180 : 90);

  const handlePay = async () => {
    if (!fileId) {
      setError("No document uploaded");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // 1. Create order
      const order = await api.post<{ id: number }>("/orders", {
        file_id: parseInt(fileId),
        copies: settings.copies,
        color_mode: settings.colorMode,
        duplex: settings.duplex,
      });

      // 2. Initialize payment
      const payment = await api.post<{ redirect_url: string }>("/payments/create", {
        order_id: order.id,
        method: paymentMethod,
      });

      if (payment.redirect_url) {
        window.location.href = payment.redirect_url;
      } else {
        setError("Could not retrieve payment link");
      }
    } catch (err: any) {
      setError(err.message || "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell title="Payment" subtitle="Secure checkout">
      <ProgressHeader step={8} total={8} />
      <div className="payment-total">
        <strong>{price} ₸</strong>
        <span>Total for your order</span>
      </div>

      <div className="card-grid">
        {methods.map((method) => (
          <button
            key={method.key}
            className={`payment-card ${paymentMethod === method.key ? "active" : ""}`}
            onClick={() => setPaymentMethod(method.key)}
          >
            <h3>{method.title}</h3>
            <p>{method.description}</p>
          </button>
        ))}
      </div>
      {error && <p className="error" style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <PrimaryButton onClick={handlePay} disabled={loading}>
        {loading ? "Processing..." : "Pay now"}
      </PrimaryButton>
    </MobileShell>
  );
}
