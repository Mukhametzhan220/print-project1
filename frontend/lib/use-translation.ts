import { useFlow } from "./flow-context";

export const translations = {
  en: {
    welcomeTitle: "Welcome to Paraq",
    welcomeSubtitle: "Sign in with your phone number",
    phoneNumber: "Phone number",
    phonePlaceholder: "+7 700 000 00 00",
    termsPrefix: "By continuing, you agree to our ",
    termsLink: "terms and conditions",
    termsSuffix: ".",
    continueButton: "Continue",
    sendingButton: "Sending...",
    telegramRequiredTitle: "Telegram Required 🤖",
    telegramRequiredText: "To receive free SMS codes, please start our Telegram bot and share your contact.",
    openTelegramButton: "Open Telegram Bot",
    botStartedButton: "I've started the bot, send code again"
  },
  ru: {
    welcomeTitle: "Добро пожаловать в Paraq",
    welcomeSubtitle: "Войдите по номеру телефона",
    phoneNumber: "Номер телефона",
    phonePlaceholder: "+7 700 000 00 00",
    termsPrefix: "Продолжая, вы соглашаетесь с ",
    termsLink: "условиями использования",
    termsSuffix: ".",
    continueButton: "Продолжить",
    sendingButton: "Отправка...",
    telegramRequiredTitle: "Требуется Telegram 🤖",
    telegramRequiredText: "Чтобы бесплатно получать коды, запустите нашего Telegram-бота и поделитесь контактом.",
    openTelegramButton: "Открыть Telegram Bot",
    botStartedButton: "Я запустил бота, отправить код снова"
  },
  kz: {
    welcomeTitle: "Paraq-қа қош келдіңіз",
    welcomeSubtitle: "Телефон нөмірімен кіріңіз",
    phoneNumber: "Телефон нөмірі",
    phonePlaceholder: "+7 700 000 00 00",
    termsPrefix: "Жалғастыру арқылы сіз ",
    termsLink: "шарттармен",
    termsSuffix: " келісесіз.",
    continueButton: "Жалғастыру",
    sendingButton: "Жіберілуде...",
    telegramRequiredTitle: "Telegram Қажет 🤖",
    telegramRequiredText: "Тегін кодтарды алу үшін Telegram-ботымызды іске қосып, контактімен бөлісіңіз.",
    openTelegramButton: "Telegram-ботты ашу",
    botStartedButton: "Ботты қостым, кодты қайта жіберу"
  }
};

export function useTranslation() {
  const { language } = useFlow();
  
  // Guard against undefined context during SSR or initial render just in case
  const lang = language || "ru"; 
  
  return translations[lang];
}
