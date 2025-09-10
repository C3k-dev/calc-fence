"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TelegramWebApps } from "./telegram-web-app";

interface TelegramContextProps {
  tg: TelegramWebApps.WebApp | null;
  isReady: boolean;
  showMainButton: (text: string) => void;
  hideMainButton: () => void;
}

const TelegramContext = createContext<TelegramContextProps>({
  tg: null,
  isReady: false,
  showMainButton: () => {},
  hideMainButton: () => {},
});

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tg, setTg] = useState<TelegramWebApps.WebApp | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const telegram = window.Telegram?.WebApp;
    if (!telegram || !telegram.initData) return;

    telegram.ready();
    telegram.disableVerticalSwipes();
    setTg(telegram);
    setIsReady(true);
  }, []);

  const showMainButton = (text: string) => {
    tg?.MainButton?.setText(text);
    tg?.MainButton?.show();
  };

  const hideMainButton = () => tg?.MainButton?.hide();

  return (
    <TelegramContext.Provider value={{ tg, isReady, showMainButton, hideMainButton }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
