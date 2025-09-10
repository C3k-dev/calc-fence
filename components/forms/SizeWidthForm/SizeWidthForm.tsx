"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./style.module.scss";
import Icon from "@/components/Icon/Icon";

interface SizeWidthFormProps {
  widthMeters: string;
  onChange: (newSize: { width: string }) => void;
}

const SizeWidthForm: React.FC<SizeWidthFormProps> = ({
  widthMeters,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [unit, setUnit] = useState<"meters" | "sotkas">("meters");
  const [metersInput, setMetersInput] = useState("");
  const [sotkasInput, setSotkasInput] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  /** Убираем все нецифры */
  const onlyDigits = (value: string) => value.replace(/\D/g, "");

  /** Форматирование: 1000 → "1 000" */
  const formatNumber = (value: string) =>
    value ? Number(value).toLocaleString("ru-RU") : "";

  /** Конвертация соток в метры */
  const convertSotkasToMeters = (sotkas: string) => {
    if (!sotkas) return "";
    return Math.ceil(Math.sqrt(Number(sotkas) * 100)).toString();
  };

  /** Общий обработчик числовых полей */
  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "meters" | "sotkas"
  ) => {
    const raw = onlyDigits(e.target.value);

    if (type === "meters") {
      setMetersInput(raw);

      if (!raw) {
        setError("Введите длину");
        onChange({ width: "" });
        return;
      }

      const num = Number(raw);
      if (num <= 0) setError("Длина должна быть больше 0");
      else if (num > 10000) setError("Слишком большое значение");
      else setError("");

      onChange({ width: raw });
    }

    if (type === "sotkas") {
      setSotkasInput(raw);
      onChange({ width: convertSotkasToMeters(raw) });
    }
  };

  /** Смена единицы */
  const handleUnitChange = (selected: "meters" | "sotkas") => {
    setUnit(selected);
  };

  /** Синхронизация с пропсами */
  useEffect(() => {
    if (unit === "meters") {
      setMetersInput(widthMeters);
    }
  }, [widthMeters, unit]);

  /** Автофокус с костылём для iOS */
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.click();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.sizeWidthForm}>
      <div className={styles.sizeWidthForm__wrapper}>
        <div className={styles.sizeWidthForm__wrapper__headline}>
          {/* <Icon
            width={300}
            height={48}
            icon={"/300/width"}
            color="var(--background-button)"
          /> */}
          <p>Длина забора, включая ворота и калитки</p>
        </div>

        <div className={styles.sizeWidthForm__wrapper__form}>
          <div className={styles.sizeWidthForm__wrapper__form__field}>
            {unit === "meters" ? (
              <div>
                <input
                  ref={inputRef}
                  className={styles.sizeWidthForm__wrapper__form__field__input}
                  type="tel" // ✅ цифровая клавиатура
                  inputMode="numeric"
                  value={formatNumber(metersInput)}
                  onChange={(e) => handleNumericChange(e, "meters")}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="0"
                />
                <p className={styles.sizeWidthForm__wrapper__form__field__hint}>
                  метров
                </p>
                {error && !isFocused && (
                  <p className={styles.sizeWidthForm__wrapper__form__field__error}>
                    {error}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <input
                  className={styles.sizeWidthForm__wrapper__form__field__input}
                  type="tel" // ✅ цифровая клавиатура
                  inputMode="numeric"
                  value={formatNumber(sotkasInput)}
                  onChange={(e) => handleNumericChange(e, "sotkas")}
                  placeholder="0"
                />
                <p className={styles.sizeWidthForm__wrapper__form__field__hint}>
                  {convertSotkasToMeters(sotkasInput || "")} метров
                </p>
              </div>
            )}
          </div>

          <div className={styles.sizeWidthForm__wrapper__form__format}>
            <label>
              <input
                type="radio"
                checked={unit === "meters"}
                onChange={() => handleUnitChange("meters")}
              />
              В метрах
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                checked={unit === "sotkas"}
                onChange={() => handleUnitChange("sotkas")}
              />
              В сотках
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeWidthForm;
