"use client";

import { useEffect, useState } from "react";

export default function TelegramButtonTest() {
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const telegram = (window as any)?.Telegram?.WebApp;

    if (!telegram) {
      console.warn("Не Telegram WebApp");
      return;
    }

    telegram.ready();
    setTg(telegram);

    telegram.MainButton.setText("Продолжить");
    telegram.MainButton.show();

    const handleClick = () => {
      alert("Кнопка Telegram нажата!");
    };

    telegram.MainButton.onClick(handleClick);

    return () => {
      telegram.MainButton.offClick(handleClick);
      telegram.MainButton.hide();
    };
  }, []);

  return <div>Если кнопка не видна — откройте этот Mini App в Telegram.</div>;
}
