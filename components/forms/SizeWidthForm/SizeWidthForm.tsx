"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./style.module.scss";
import SelectButton from "@/components/buttons/SelectButton/SelectButton";
import { useModal } from "@/components/modal/ModalContext";
import CutCell from "@/components/cells/CutCell/CutCell";

interface SizeWidthFormProps {
  widthMeters: string;
  onChange: (newSize: { width: string }) => void;
}

interface Item {
  id: number;
  type: "Ворота" | "Калитка";
  size: number;
  number: number;
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
  const [items, setItems] = useState<Item[]>([]);

  const { showModal, closeModal } = useModal();

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

  const isFieldActive = (value: string) => isFocused || !!value;

  const addItem = () => {
    showModal({ content: <ItemModal /> });
  };

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  const totalItemsSize = items.reduce((acc, i) => acc + i.size, 0);
  const finalSize =
    unit === "meters"
      ? Math.max(0, Number(metersInput || 0) - totalItemsSize)
      : Math.max(0, Number(convertSotkasToMeters(sotkasInput || "")) - totalItemsSize);

  // Модалка для добавления ворот/калиток
  const ItemModal = () => {
    const [type, setType] = useState<"Ворота" | "Калитка">("Ворота");
    const [customSize, setCustomSize] = useState("");
    const gateSizes = ["3", "3.5", "4"];
    const doorSizes = ["90", "100", "120"];

    const sizes = type === "Ворота" ? gateSizes : doorSizes;

    const nextNumber = (t: "Ворота" | "Калитка") =>
      items.filter((i) => i.type === t).length + 1;

    const addSelectedSize = (size: number) => {
      setItems((prev) => [
        ...prev,
        { id: Date.now(), type, size, number: nextNumber(type) },
      ]);
      closeModal();
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p>Выберите тип:</p>
        <div style={{ display: "flex", gap: 12 }}>
          <SelectButton
            name="Ворота"
            isActive={type === "Ворота"}
            onClick={() => setType("Ворота")}
          />
          <SelectButton
            name="Калитка"
            isActive={type === "Калитка"}
            onClick={() => setType("Калитка")}
          />
        </div>

        <p>Выберите размер:</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {sizes.map((s) => (
            <button
              key={s}
              style={{ padding: "8px 12px", borderRadius: "8px", cursor: "pointer" }}
              onClick={() => addSelectedSize(Number(s))}
            >
              {s} {type === "Калитка" ? "см" : "м"}
            </button>
          ))}
        </div>

        <p>Свой размер:</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            placeholder="Введите размер"
            style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc" }}
          />
          <button
            style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}
            onClick={() => {
              if (!customSize) return;
              addSelectedSize(Number(customSize));
            }}
          >
            Добавить
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.sizeWidthForm}>
      <div className={styles.sizeWidthForm__wrapper}>
        <div className={styles.sizeWidthForm__wrapper__headline}>
          {/* <p>Длина забора, c учётом ворот и калиток</p> */}
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
              <div className={styles.inputWrapper}>
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
                <label
                  className={`${styles.floatingLabel} ${
                    isFieldActive(metersInput) ? styles.activeLabel : ""
                  }`}
                >
                  метров
                </label>
                <p
                  className={`${styles.sizeWidthForm__wrapper__form__field__error} ${
                    !error ? styles.hidden : ""
                  }`}
                >
                  {error}
                </p>
              </div>
            ) : (
              <div className={styles.inputWrapper}>
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
                <label
                  className={`${styles.floatingLabel} ${
                    isFieldActive(sotkasInput) ? styles.activeLabel : ""
                  }`}
                >
                  сотки {sotkasInput && `| ${convertSotkasToMeters(sotkasInput)} метров`}
                </label>
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

          <button
            onClick={addItem}
            style={{ marginTop: 24, padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}
          >
            Добавить ворота или калитку
          </button>

          <p style={{ marginTop: 16, fontWeight: 600 }}>
            Финальный размер: {finalSize} {unit === "meters" ? "м" : "м"}
          </p>
        </div>
      </div>

      <div className={styles.sizeWidthForm__cut}>
            {items.map((item) => (
              <CutCell
                key={item.id}
                type={item.type === "Ворота" ? "gates" : "wicket"}
                name={`${item.type} № ${item.number}`}
                size={`${item.size} ${item.type === "Калитка" ? "см" : "м"}`}
                onDelete={() => removeItem(item.id)}
              />
            ))}
          </div>
    </div>
  );
};

export default SizeWidthForm;
