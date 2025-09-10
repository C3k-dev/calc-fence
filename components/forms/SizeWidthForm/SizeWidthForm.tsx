"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./style.module.scss";
import SelectButton from "@/components/buttons/SelectButton/SelectButton";

interface SizeWidthFormProps {
  widthMeters: string;
  onChange: (newSize: { width: string }) => void;
}

const MAX_METERS = 10000;
const MAX_SOTKAS = 1000;

const SizeWidthForm: React.FC<SizeWidthFormProps> = ({ widthMeters, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [unit, setUnit] = useState<"meters" | "sotkas">("meters");
  const [metersInput, setMetersInput] = useState("");
  const [sotkasInput, setSotkasInput] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const onlyDigits = (value: string) => value.replace(/\D/g, "");
  const formatNumber = (value: string) => (value ? Number(value).toLocaleString("ru-RU") : "");
  const convertSotkasToMeters = (sotkas: string) => {
    if (!sotkas) return "";
    return Math.ceil(Math.sqrt(Number(sotkas) * 100)).toString();
  };

  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "meters" | "sotkas"
  ) => {
    let raw = onlyDigits(e.target.value);

    if (type === "meters") {
      if (Number(raw) > MAX_METERS) raw = String(MAX_METERS);
      setMetersInput(raw);

      if (!raw) setError("Введите длину");
      else if (Number(raw) <= 0) setError("Длина должна быть больше 0");
      else if (Number(raw) > MAX_METERS) setError(`Слишком большое значение (макс ${MAX_METERS})`);
      else setError("");

      onChange({ width: raw });
    }

    if (type === "sotkas") {
      if (Number(raw) > MAX_SOTKAS) raw = String(MAX_SOTKAS);
      setSotkasInput(raw);

      if (!raw) setError("Введите сотки");
      else if (Number(raw) <= 0) setError("Сотки должны быть больше 0");
      else if (Number(raw) > MAX_SOTKAS) setError(`Слишком много соток (макс ${MAX_SOTKAS})`);
      else setError("");

      onChange({ width: convertSotkasToMeters(raw) });
    }
  };

  const handleUnitChange = (selected: "meters" | "sotkas") => {
    setUnit(selected);
    setMetersInput("");
    setSotkasInput("");
    setError("");
  };

  useEffect(() => {
    if (unit === "meters") setMetersInput(widthMeters);
  }, [widthMeters, unit]);

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
          <p>Длина забора, c учётом ворот и калиток</p>
        </div>

        <div className={styles.sizeWidthForm__wrapper__form}>
          <div className={styles.sizeWidthForm__wrapper__form__format}>
            <SelectButton
              name="В метрах"
              isActive={unit === "meters"}
              onClick={() => handleUnitChange("meters")}
            />
            <SelectButton
              name="В сотках"
              isActive={unit === "sotkas"}
              onClick={() => handleUnitChange("sotkas")}
            />
          </div>

          <div className={styles.sizeWidthForm__wrapper__form__field}>
            {unit === "meters" ? (
              <div>
                <input
                  ref={inputRef}
                  className={`${styles.sizeWidthForm__wrapper__form__field__input} ${
                    error ? styles.errorInput : ""
                  }`}
                  type="tel"
                  inputMode="numeric"
                  value={formatNumber(metersInput)}
                  onChange={(e) => handleNumericChange(e, "meters")}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="0"
                  maxLength={5}
                />
                <p
                  className={`${styles.sizeWidthForm__wrapper__form__field__hint} ${
                    isFocused ? styles.focusedHint : ""
                  }`}
                >
                  метров
                </p>
                <p
                  className={`${styles.sizeWidthForm__wrapper__form__field__error} ${
                    !error ? styles.hidden : ""
                  }`}
                >
                  {error}
                </p>
              </div>
            ) : (
              <div>
                <input
                  className={`${styles.sizeWidthForm__wrapper__form__field__input} ${
                    error ? styles.errorInput : ""
                  }`}
                  type="tel"
                  inputMode="numeric"
                  value={formatNumber(sotkasInput)}
                  onChange={(e) => handleNumericChange(e, "sotkas")}
                  placeholder="0"
                  maxLength={4}
                />
                <p
                  className={`${styles.sizeWidthForm__wrapper__form__field__hint} ${
                    isFocused ? styles.focusedHint : ""
                  }`}
                >
                  сотки {sotkasInput && `| ${convertSotkasToMeters(sotkasInput)} метров`}
                </p>
                <p
                  className={`${styles.sizeWidthForm__wrapper__form__field__error} ${
                    !error ? styles.hidden : ""
                  }`}
                >
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeWidthForm;
