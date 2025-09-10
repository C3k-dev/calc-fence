import React, { useState, useEffect } from "react";

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
    <div style={{ marginBottom: "20px" }}>
      <b>Size Width Form</b>

      <div style={{ marginTop: "10px" }}>
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

      <div style={{ marginTop: "10px" }}>
        {unit === "meters" ? (
          <label>
            Укажите общую длину в метрах:
            <input
              type="number"
              value={metersInput}
              onChange={handleMetersChange}
              placeholder="м"
              min="0"
              step="0.01"
            />
          </label>
        ) : (
          <label>
            Укажите размер участка в сотках:
            <input
              type="number"
              value={sotkasInput}
              onChange={handleSotkasChange}
              placeholder="сотки"
              min="0"
              step="0.01"
            />
          </label>
        )}
      </div>

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#555" }}>
        <div>
          {unit === "meters"
            ? `Ширина = ${metersInput || 0} м`
            : `метры = ceil(√(${sotkasInput || 0} × 100)) = ${convertSotkasToMeters(sotkasInput || "") || "-"}`}
        </div>
      </div>
    </div>
  );
};

export default SizeWidthForm;
