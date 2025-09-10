import React, { useState, useEffect } from "react";
import styles from './style.module.scss';

interface SizeWidthFormProps {
  widthMeters: string; // результат в метрах
  onChange: (newSize: { width: string }) => void;
}

const SizeWidthForm: React.FC<SizeWidthFormProps> = ({ widthMeters, onChange }) => {
  const [unit, setUnit] = useState<"meters" | "sotkas">("meters");
  const [metersInput, setMetersInput] = useState<string>("");
  const [sotkasInput, setSotkasInput] = useState<string>("");

  // конвертация соток в метры
  const convertSotkasToMeters = (sotkas: string) => {
    if (!sotkas) return "";
    return Math.ceil(Math.sqrt(Number(sotkas) * 100)).toString();
  };

  // обработка изменения метров
  const handleMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMetersInput(value);
    onChange({ width: value });
  };

  // обработка изменения соток
  const handleSotkasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSotkasInput(value);
    const meters = convertSotkasToMeters(value);
    onChange({ width: meters });
  };

  // смена единицы
  const handleUnitChange = (selectedUnit: "meters" | "sotkas") => {
    setUnit(selectedUnit);
    // не очищаем поле полностью, оставляем введённое для удобства
  };

  // синхронизация при изменении props.widthMeters
  useEffect(() => {
    if (unit === "meters") {
      setMetersInput(widthMeters);
    }
  }, [widthMeters, unit]);

  return (
    <div className={styles.sizeWidthForm}>

      <div className={styles.sizeWidthForm__headline}>
        <p>Длина забора, исключая ворота и калитки</p>
      </div>
      <div>
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
          Сотки
        </label>
      </div>

      <div>
        {unit === "meters" ? (
            <input
              className={styles.sizeWidthForm__input}
              type="number"
              value={metersInput}
              onChange={handleMetersChange}
              placeholder="м"
              min="0"
              step="0.01"
            />
        ) : (
            <input
              className={styles.sizeWidthForm__input}
              type="number"
              value={sotkasInput}
              onChange={handleSotkasChange}
              placeholder="сотки"
              min="0"
              step="0.01"
            />
        )}
      </div>
    </div>
  );
};

export default SizeWidthForm;
