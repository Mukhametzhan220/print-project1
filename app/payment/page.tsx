"use client";

import { useRouter } from "next/navigation";
import { ScreenLayout } from "@/components/ScreenLayout";
import { useFlow } from "@/lib/flow-context";

export default function PaymentPage() {
  const router = useRouter();
  const { paymentMethod, setPaymentMethod, selectedFile, settings } = useFlow();
  const estimatedTotal = (settings.copies * (settings.colorMode === "color" ? 0.35 : 0.2)).toFixed(2);

  return (
    <ScreenLayout title="Payment" subtitle="Complete your print order.">
      <p className="summary">{selectedFile || "Document"} • ${estimatedTotal}</p>
      <div className="segmented two-col">
        <button
          type="button"
          onClick={() => setPaymentMethod("card")}
          className={paymentMethod === "card" ? "active" : ""}
        >
          Card
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("wallet")}
          className={paymentMethod === "wallet" ? "active" : ""}
        >
          Wallet
        </button>
      </div>
      <div className="row">
        <button className="secondary" type="button" onClick={() => router.push("/preview")}>Back</button>
        <button className="primary" type="button">Pay now</button>
      </div>
    </ScreenLayout>
  );
}
