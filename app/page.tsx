"use client";

import { useEffect, useState } from "react";
import TypeForm from "@/components/forms/TypeForm/TypeForm";
import SizeWidthForm from "@/components/forms/SizeWidthForm/SizeWidthForm";
import SizeHeightForm from "@/components/forms/SizeHeightForm/SizeHeightForm";
import GapForm from "@/components/forms/GapForm/GapForm";
import styles from "./page.module.scss";
import { useTelegram } from "@/provider/TelegramProvider";

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
  const { tg, isReady } = useTelegram();

  const isStepValid = () => {
    switch (step) {
      case 0:
        return !!size.type;
      case 1:
        return !!size.width && Number(size.width) > 0;
      case 2:
        return !!size.height && Number(size.height) >= 1 && Number(size.height) <= 5;
      case 3:
        return size.type !== "Штакетник" || (size.gap !== "" && Number(size.gap) >= -3 && Number(size.gap) <= 7);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) setStep(step + 1);
  };

  const handleBack = () => {
    // Сброс текущего шага
    switch (step) {
      case 1:
        setSize((prev) => ({ ...prev, width: "" }));
        break;
      case 2:
        setSize((prev) => ({ ...prev, height: "" }));
        break;
      case 3:
        setSize((prev) => ({ ...prev, gap: "" }));
        break;
    }
    if (step > 0) setStep(step - 1);
  };

  // MainButton Telegram
  useEffect(() => {
    if (!isReady || !tg || !tg.MainButton) return;

    const updateButton = () => {
      if (isStepValid()) {
        tg.MainButton.setText("Продолжить");
        tg.MainButton.enable();
      } else {
        tg.MainButton.setText("Заполните поле");
        tg.MainButton.disable();
      }
      tg.MainButton.show();
    };

    // Устанавливаем обработчик клика
    const onClick = () => {
      if (isStepValid()) handleNext();
    };

    tg.MainButton.onClick(onClick);

    updateButton();

    return () => {
      tg.MainButton.offClick(onClick);
      tg.MainButton.hide();
    };
  }, [isReady, tg, step, size]);

  return (
    <div className={styles.page}>
      {step === 0 && (
        <TypeForm
          type={size.type}
          onChange={(newType) => setSize((prev) => ({ ...prev, type: newType }))}
        />
      )}

      {step === 1 && (
        <SizeWidthForm
          widthMeters={size.width}
          onChange={(newSize) => setSize((prev) => ({ ...prev, ...newSize }))}
        />
      )}

      {step === 2 && (
        <SizeHeightForm
          height={size.height}
          fenceType={size.type}
          onChange={(newHeight) => setSize((prev) => ({ ...prev, ...newHeight }))}
        />
      )}

      {step === 3 && size.type === "Штакетник" && (
        <GapForm
          fenceType={size.type}
          gap={size.gap}
          onChange={(newGap) => setSize((prev) => ({ ...prev, gap: newGap }))}
        />
      )}

      {/* Кнопка назад HTML */}
      <div style={{ marginTop: "20px" }}>
        {step > 0 && (
          <button
            style={{ padding: "8px 16px", marginRight: "10px", cursor: "pointer" }}
            onClick={handleBack}
          >
            Назад
          </button>
        )}
      </div>

      {/* Общая информация */}
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
