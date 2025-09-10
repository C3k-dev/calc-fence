"use client";

import { useEffect, useState } from "react";
import TypeForm from "@/components/forms/TypeForm/TypeForm";
import SizeWidthForm from "@/components/forms/SizeWidthForm/SizeWidthForm";
import SizeHeightForm from "@/components/forms/SizeHeightForm/SizeHeightForm";
import GapForm from "@/components/forms/GapForm/GapForm";
import styles from "./page.module.scss";
import { TelegramWebApps } from "@/provider/telegram-web-app";

interface SizeState {
  type: string;
  width: string;
  height: string;
  gap: string;
}

export default function Home() {
  const [size, setSize] = useState<SizeState>({
    type: "",
    width: "",
    height: "",
    gap: "",
  });

  const [step, setStep] = useState(0);
  const [tg, setTg] = useState<TelegramWebApps.WebApp | null>(null);

  const isStepValid = () => {
    switch (step) {
      case 0: return !!size.type;
      case 1: return !!size.width && Number(size.width) > 0;
      case 2: return !!size.height && Number(size.height) >= 1 && Number(size.height) <= 5;
      case 3: return size.type !== "Штакетник" || (size.gap !== "" && Number(size.gap) >= -3 && Number(size.gap) <= 7);
      default: return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) setStep(step + 1);
  };

  const handleBack = () => {
    switch (step) {
      case 1: setSize(prev => ({ ...prev, width: "" })); break;
      case 2: setSize(prev => ({ ...prev, height: "" })); break;
      case 3: setSize(prev => ({ ...prev, gap: "" })); break;
    }
    if (step > 0) setStep(step - 1);
  };

  // Инициализация кнопок один раз
  useEffect(() => {
    if (typeof window === "undefined") return;

    const telegram = window.Telegram?.WebApp;
    if (!telegram) return;

    telegram.ready();
    setTg(telegram);

    // MainButton — один раз
    if (telegram.MainButton) {
      telegram.MainButton.setText("Продолжить").show();

      telegram.MainButton.onClick(() => {
        if (isStepValid()) handleNext();
      });
    }

    // SecondaryButton — один раз
    if (telegram.SecondaryButton) {
      telegram.SecondaryButton.onClick(() => handleBack());
    }
  }, []);

  // Обновление параметров кнопок при изменении step/size
  useEffect(() => {
    if (!tg) return;

    // MainButton
    if (tg.MainButton) {
      const color = isStepValid() ? tg.themeParams.button_color : "#ccc";
      tg.MainButton.setParams({ color, text: "Продолжить", is_active: true, is_visible: true }).show();
    }

    // SecondaryButton
    if (tg.SecondaryButton) {
      if (step > 0) {
        tg.SecondaryButton
          .setParams({
            text: "Назад",
            color: tg.themeParams.bottom_bar_bg_color,
            is_visible: true,
            is_active: true,
            position: "left",
          })
          .show();
      } else {
        tg.SecondaryButton.hide();
      }
    }
  }, [tg, step, size]);

  return (
    <div className={styles.page}>
      {step === 0 && (
        <TypeForm
          type={size.type}
          onChange={newType => setSize(prev => ({ ...prev, type: newType }))}
        />
      )}
      {step === 1 && (
        <SizeWidthForm
          widthMeters={size.width}
          onChange={newSize => setSize(prev => ({ ...prev, ...newSize }))}
        />
      )}
      {step === 2 && (
        <SizeHeightForm
          height={size.height}
          fenceType={size.type}
          onChange={newHeight => setSize(prev => ({ ...prev, ...newHeight }))}
        />
      )}
      {step === 3 && size.type === "Штакетник" && (
        <GapForm
          fenceType={size.type}
          gap={size.gap}
          onChange={newGap => setSize(prev => ({ ...prev, gap: newGap }))}
        />
      )}

      <div style={{ marginTop: "30px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
        <b>Выбранные параметры:</b>
        <div><b>Тип:</b> {size.type || "-"}</div>
        <div><b>Длина:</b> {size.width || "-"} метров</div>
        <div><b>Высота:</b> {size.height || "-"} метров</div>
        {size.type === "Штакетник" && <div><b>Зазор:</b> {size.gap || "-"} см</div>}
      </div>
    </div>
  );
}
