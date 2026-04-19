"use client";

import { useFlow } from "@/lib/flow-context";

export function LangSwitcher() {
  const { language, setLanguage } = useFlow();

  return (
    <div className="lang-switch">
      <button 
        className={language === "en" ? "active" : ""} 
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <button 
        className={language === "ru" ? "active" : ""} 
        onClick={() => setLanguage("ru")}
      >
        RU
      </button>
      <button 
        className={language === "kz" ? "active" : ""} 
        onClick={() => setLanguage("kz")}
      >
        KZ
      </button>
    </div>
  );
}
