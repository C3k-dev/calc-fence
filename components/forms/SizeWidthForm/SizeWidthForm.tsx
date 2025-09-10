import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Icon from "@/components/Icon/Icon";

interface SizeWidthFormProps {
  widthMeters: string; // результат в метрах
  onChange: (newSize: { width: string }) => void;
}

const SizeWidthForm: React.FC<SizeWidthFormProps> = ({
  widthMeters,
  onChange,
}) => {
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
      <div className={styles.sizeWidthForm__wrapper}>
        <div className={styles.sizeWidthForm__wrapper__headline}>
          <Icon
            width={300}
            height={48}
            icon={"/300/width"}
            color="var(--background-button)"
          />
          <p>Длина забора, исключая ворота и калитки</p>
        </div>

        <div className={styles.sizeWidthForm__wrapper__form}>
          <div className={styles.sizeWidthForm__wrapper__form__field}>
            {unit === "meters" ? (
              <div>
                <input
                  className={styles.sizeWidthForm__wrapper__form__field__input}
                  type="number"
                  value={metersInput}
                  onChange={handleMetersChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                <p className={styles.sizeWidthForm__wrapper__form__field__hint}>
                  метров
                </p>
              </div>
            ) : (
              <div>
                <input
                  className={styles.sizeWidthForm__wrapper__form__field__input}
                  type="number"
                  value={sotkasInput}
                  onChange={handleSotkasChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
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
              Сотки
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeWidthForm;
