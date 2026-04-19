"use client";

import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "./use-local-storage";

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
  filePreviewUrl: string | null;
  fileSizeKb: number | null;
  filePages: number | null;
  termsAccepted: boolean;
  paymentMethod: "kaspi" | "card" | "apple";
  settings: PrintSettings;
  setPhone: (value: string) => void;
  setLanguage: (value: "en" | "ru" | "kz") => void;
  setCode: (value: string) => void;
  setFileName: (value: string) => void;
  setFileId: (value: string | null) => void;
  setFilePreviewUrl: (value: string | null) => void;
  setFileSizeKb: (value: number | null) => void;
  setFilePages: (value: number | null) => void;
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
  const [phone, setPhone] = useLocalStorage("flow_phone", "");
  const [language, setLanguage] = useLocalStorage<"en" | "ru" | "kz">("flow_lang", "ru");
  const [code, setCode] = useLocalStorage("flow_code", "");
  const [fileName, setFileName] = useLocalStorage("flow_fileName", "");
  const [fileId, setFileId] = useLocalStorage<string | null>("flow_fileId", null);
  const [filePreviewUrl, setFilePreviewUrl] = useLocalStorage<string | null>("flow_filePreviewUrl", null);
  const [fileSizeKb, setFileSizeKb] = useLocalStorage<number | null>("flow_fileSizeKb", null);
  const [filePages, setFilePages] = useLocalStorage<number | null>("flow_filePages", null);
  const [termsAccepted, setTermsAccepted] = useLocalStorage("flow_termsAccepted", false);
  const [paymentMethod, setPaymentMethod] = useLocalStorage<"kaspi" | "card" | "apple">("flow_paymentMethod", "kaspi");
  const [settings, setSettings] = useLocalStorage<PrintSettings>("flow_settings", defaultSettings);

  const value = useMemo(
    () => ({
      phone,
      language,
      code,
      fileName,
      fileId,
      filePreviewUrl,
      fileSizeKb,
      filePages,
      termsAccepted,
      paymentMethod,
      settings,
      setPhone,
      setLanguage,
      setCode,
      setFileName,
      setFileId,
      setFilePreviewUrl,
      setFileSizeKb,
      setFilePages,
      setTermsAccepted,
      setPaymentMethod,
      setSettings
    }),
    [phone, language, code, fileName, fileId, filePreviewUrl, fileSizeKb, filePages, termsAccepted, paymentMethod, settings, setPhone, setLanguage, setCode, setFileName, setFileId, setFilePreviewUrl, setFileSizeKb, setFilePages, setTermsAccepted, setPaymentMethod, setSettings]
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
