"use client";

import { useEffect, useState, useRef } from "react";
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

  // Ref для актуального состояния
  const stepRef = useRef(step);
  const sizeRef = useRef(size);

  useEffect(() => { stepRef.current = step; }, [step]);
  useEffect(() => { sizeRef.current = size; }, [size]);

  const isStepValid = (s: SizeState, st: number) => {
    switch (st) {
      case 0: return !!s.type;
      case 1: return !!s.width && Number(s.width) > 0;
      case 2: return !!s.height && Number(s.height) >= 1 && Number(s.height) <= 5;
      case 3: return s.type !== "Штакетник" || (s.gap !== "" && Number(s.gap) >= -3 && Number(s.gap) <= 7);
      default: return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(sizeRef.current, stepRef.current)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    switch (stepRef.current) {
      case 1: setSize(prev => ({ ...prev, width: "" })); break;
      case 2: setSize(prev => ({ ...prev, height: "" })); break;
      case 3: setSize(prev => ({ ...prev, gap: "" })); break;
    }
    if (stepRef.current > 0) setStep(prev => prev - 1);
  };

  // Инициализация кнопок один раз
  useEffect(() => {
    if (typeof window === "undefined") return;
    const telegram = window.Telegram?.WebApp;
    if (!telegram) return;

    telegram.ready();
    setTg(telegram);

    // MainButton
    if (telegram.MainButton) {
      telegram.MainButton.setText("Продолжить").show();

      telegram.MainButton.onClick(() => {
        handleNext(); // использует актуальные значения через Ref
      });
    }

    // SecondaryButton
    if (telegram.SecondaryButton) {
      telegram.SecondaryButton.onClick(() => handleBack());
    }
  }, []);

  // Обновление параметров кнопок при изменении step/size
  useEffect(() => {
    if (!tg) return;

    // MainButton
    if (tg.MainButton) {
      const valid = isStepValid(size, step);
      const color = valid ? tg.themeParams.button_color : "#ccc";
      tg.MainButton.setParams({ color, text: "Продолжить", is_active: valid, is_visible: true }).show();
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
        <TypeForm type={size.type} onChange={newType => setSize(prev => ({ ...prev, type: newType }))} />
      )}
      {step === 1 && (
        <SizeWidthForm widthMeters={size.width} onChange={newSize => setSize(prev => ({ ...prev, ...newSize }))} />
      )}
      {step === 2 && (
        <SizeHeightForm height={size.height} fenceType={size.type} onChange={newHeight => setSize(prev => ({ ...prev, ...newHeight }))} />
      )}
      {step === 3 && size.type === "Штакетник" && (
        <GapForm fenceType={size.type} gap={size.gap} onChange={newGap => setSize(prev => ({ ...prev, gap: newGap }))} />
      )}

      {/* <div style={{ marginTop: "30px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
        <b>Выбранные параметры:</b>
        <div><b>Тип:</b> {size.type || "-"}</div>
        <div><b>Длина:</b> {size.width || "-"} метров</div>
        <div><b>Высота:</b> {size.height || "-"} метров</div>
        {size.type === "Штакетник" && <div><b>Зазор:</b> {size.gap || "-"} см</div>}
      </div> */}
    </div>
  );
}
