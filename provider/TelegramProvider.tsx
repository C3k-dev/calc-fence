"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TelegramWebApps } from "./telegram-web-app";

// Контекст Telegram
interface TelegramContextProps {
  tg: TelegramWebApps.WebApp | null;
  isReady: boolean;
  showMainButton: (text: string) => void;
  hideMainButton: () => void;
  showBackButton: () => void;
  hideBackButton: () => void;
}

const TelegramContext = createContext<TelegramContextProps>({
  tg: null,
  isReady: false,
  showMainButton: () => {},
  hideMainButton: () => {},
  showBackButton: () => {},
  hideBackButton: () => {},
});

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tg, setTg] = useState<TelegramWebApps.WebApp | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const telegram = window.Telegram.WebApp;
      telegram.ready && telegram.ready();
      setTg(telegram);
      setIsReady(true);
    }
  }, []);

  const showMainButton = (text: string) => {
    tg?.MainButton?.setText(text);
    tg?.MainButton?.show();
  };

  const hideMainButton = () => {
    tg?.MainButton?.hide();
  };

  const showBackButton = () => {
    tg?.BackButton?.show();
  };

  const hideBackButton = () => {
    tg?.BackButton?.hide();
  };

  return (
    <TelegramContext.Provider
      value={{
        tg,
        isReady,
        showMainButton,
        hideMainButton,
        showBackButton,
        hideBackButton,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

// Хук для использования Telegram
export const useTelegram = () => useContext(TelegramContext);
