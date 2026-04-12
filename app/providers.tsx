"use client";

import type { ReactNode } from "react";
import { FlowProvider } from "@/lib/flow-context";

export function Providers({ children }: { children: ReactNode }) {
  return <FlowProvider>{children}</FlowProvider>;
}
