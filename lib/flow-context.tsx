"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type PrintSettings = {
  colorMode: "color" | "bw";
  copies: number;
  duplex: boolean;
  paperSize: "A4" | "Letter";
};

type FlowState = {
  phone: string;
  language: "EN" | "ES";
  verificationCode: string;
  files: string[];
  selectedFile: string | null;
  settings: PrintSettings;
  termsAccepted: boolean;
  paymentMethod: "card" | "wallet";
};

type FlowContextValue = FlowState & {
  setPhone: (value: string) => void;
  setLanguage: (value: "EN" | "ES") => void;
  setVerificationCode: (value: string) => void;
  addFile: (name: string) => void;
  removeFile: (name: string) => void;
  setSelectedFile: (name: string | null) => void;
  updateSettings: (value: Partial<PrintSettings>) => void;
  setTermsAccepted: (value: boolean) => void;
  setPaymentMethod: (value: "card" | "wallet") => void;
};

const DEFAULT_STATE: FlowState = {
  phone: "",
  language: "EN",
  verificationCode: "",
  files: [],
  selectedFile: null,
  settings: {
    colorMode: "color",
    copies: 1,
    duplex: false,
    paperSize: "A4",
  },
  termsAccepted: false,
  paymentMethod: "card",
};

const FlowContext = createContext<FlowContextValue | undefined>(undefined);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FlowState>(DEFAULT_STATE);

  useEffect(() => {
    const saved = localStorage.getItem("print_flow_state");
    if (saved) {
      setState(JSON.parse(saved) as FlowState);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("print_flow_state", JSON.stringify(state));
  }, [state]);

  const value = useMemo<FlowContextValue>(() => ({
    ...state,
    setPhone: (phone) => setState((prev) => ({ ...prev, phone })),
    setLanguage: (language) => setState((prev) => ({ ...prev, language })),
    setVerificationCode: (verificationCode) => setState((prev) => ({ ...prev, verificationCode })),
    addFile: (name) =>
      setState((prev) => ({
        ...prev,
        files: prev.files.includes(name) ? prev.files : [...prev.files, name],
        selectedFile: prev.selectedFile ?? name,
      })),
    removeFile: (name) =>
      setState((prev) => {
        const files = prev.files.filter((file) => file !== name);
        return {
          ...prev,
          files,
          selectedFile: prev.selectedFile === name ? files[0] ?? null : prev.selectedFile,
        };
      }),
    setSelectedFile: (selectedFile) => setState((prev) => ({ ...prev, selectedFile })),
    updateSettings: (settings) =>
      setState((prev) => ({ ...prev, settings: { ...prev.settings, ...settings } })),
    setTermsAccepted: (termsAccepted) => setState((prev) => ({ ...prev, termsAccepted })),
    setPaymentMethod: (paymentMethod) => setState((prev) => ({ ...prev, paymentMethod })),
  }), [state]);

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within FlowProvider");
  }
  return context;
}
