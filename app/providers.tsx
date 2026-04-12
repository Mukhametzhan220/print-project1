"use client";

import { FlowProvider } from "@/lib/flow-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <FlowProvider>{children}</FlowProvider>;
}
