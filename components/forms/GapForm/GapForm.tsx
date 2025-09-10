import React, { useState } from "react";

interface GapFormProps {
  fenceType: string; // выбранный тип забора
  gap: string;       // текущее значение зазора
  onChange: (newGap: string) => void;
}

const GapForm: React.FC<GapFormProps> = ({ fenceType, gap, onChange }) => {
  const [chessOrder, setChessOrder] = useState(false);

  if (fenceType !== "Штакетник") return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const numValue = Number(value);

    if (chessOrder) {
      // диапазон -3 до 7
      if (numValue < -3) value = "-3";
      if (numValue > 7) value = "7";
    } else {
      // диапазон 0 до 7
      if (numValue < 0) value = "0";
      if (numValue > 7) value = "7";
    }

    onChange(value);
  };

  const toggleChessOrder = () => setChessOrder((prev) => !prev);

  const renderFence = () => {
    const gapValue = Number(gap) || 0;
    const numPickets = 12;
    const pickets = [];

    for (let i = 0; i < numPickets; i++) {
      const isChess = chessOrder && i % 2 === 1;
      pickets.push(
        <div
          key={i}
          style={{
            display: "inline-block",
            width: "20px",
            height: "100px",
            marginLeft: i === 0 ? 0 : `${gapValue}px`,
            backgroundColor: isChess ? "#2e7d32" : "#4caf50",
            borderRadius: "2px",
          }}
        />
      );
    }

    return <div style={{ marginTop: "20px" }}>{pickets}</div>;
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <b>Зазор между штакетинами (см):</b>
      <div style={{ marginTop: "10px" }}>
        <input
          type="number"
          value={gap}
          onChange={handleChange}
          placeholder={chessOrder ? "-3 до 7" : "0 до 7"}
          min={chessOrder ? -3 : 0}
          max={7}
          step={0.1}
        />
      </div>

      <button
        onClick={toggleChessOrder}
        style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}
      >
        {chessOrder ? "Выключить шахматный порядок" : "Включить шахматный порядок"}
      </button>

      <div style={{ marginTop: "10px" }}>
        <b>Выбранный зазор:</b> {gap || "-"} см
      </div>

      {renderFence()}
    </div>
  );
};

export default GapForm;
