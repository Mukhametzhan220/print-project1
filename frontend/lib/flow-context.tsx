"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type PrintSettings = {
  copies: number;
  colorMode: "bw" | "color";
  duplex: boolean;
};

type FlowState = {
  phone: string;
  language: "en" | "ru" | "kz";
  code: string;
  fileName: string;
  fileId: string | null;
  termsAccepted: boolean;
  paymentMethod: "kaspi" | "card" | "apple";
  settings: PrintSettings;
  setPhone: (value: string) => void;
  setLanguage: (value: "en" | "ru" | "kz") => void;
  setCode: (value: string) => void;
  setFileName: (value: string) => void;
  setFileId: (value: string | null) => void;
  setTermsAccepted: (value: boolean) => void;
  setPaymentMethod: (value: "kaspi" | "card" | "apple") => void;
  setSettings: (value: PrintSettings) => void;
};

const defaultSettings: PrintSettings = {
  copies: 1,
  colorMode: "bw",
  duplex: true
};

const FlowContext = createContext<FlowState | undefined>(undefined);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState<"en" | "ru" | "kz">("ru");
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileId, setFileId] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"kaspi" | "card" | "apple">("kaspi");
  const [settings, setSettings] = useState<PrintSettings>(defaultSettings);

  const value = useMemo(
    () => ({
      phone,
      language,
      code,
      fileName,
      fileId,
      termsAccepted,
      paymentMethod,
      settings,
      setPhone,
      setLanguage,
      setCode,
      setFileName,
      setFileId,
      setTermsAccepted,
      setPaymentMethod,
      setSettings
    }),
    [phone, language, code, fileName, fileId, termsAccepted, paymentMethod, settings]
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within FlowProvider");
  }
  return context;
}
