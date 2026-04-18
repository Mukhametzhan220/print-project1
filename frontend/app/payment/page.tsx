"use client";

import { useFlow } from "@/lib/flow-context";
import { MobileShell } from "@/components/mobile-shell";
import { PrimaryButton } from "@/components/primary-button";
import { ProgressHeader } from "@/components/progress-header";

const methods = [
  { key: "kaspi", title: "Kaspi QR", description: "Recommended for Kazakhstan users" },
  { key: "card", title: "Bank Card", description: "Visa, MasterCard, Mir" },
  { key: "apple", title: "Apple Pay", description: "Pay in one tap" }
] as const;

export default function PaymentPage() {
  const { settings, paymentMethod, setPaymentMethod } = useFlow();
  const price = settings.copies * (settings.colorMode === "color" ? 180 : 90);

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

      <PrimaryButton>Pay now</PrimaryButton>
    </MobileShell>
  );
}
