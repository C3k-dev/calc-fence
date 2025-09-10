import React, { useState, useEffect } from "react";
import { standardHeightsMap } from "@/data/standardHeights";
import { useModal } from "@/components/modal/ModalContext";

interface SizeHeightFormProps {
  height: string;
  fenceType: string; // Штакетник или Профлист
  onChange: (newSize: { height: string }) => void;
}

const SizeHeightForm: React.FC<SizeHeightFormProps> = ({ height, fenceType, onChange }) => {
  const [custom, setCustom] = useState(false); // показываем модалку
  const [standardHeights, setStandardHeights] = useState<string[]>([]);
  const { showModal } = useModal();

  // обновляем стандартные высоты при смене типа забора
  useEffect(() => {
    setStandardHeights(standardHeightsMap[fenceType] || []);
    if (!custom && height && !standardHeightsMap[fenceType]?.includes(height)) {
      // height останется кастомным
    }
  }, [fenceType]);

  const handleStandardClick = (value: string) => {
    setCustom(false);
    onChange({ height: value });
  };

  const handleCustomSelect = () => {
    showModal({
      content: (
        <div style={{ padding: "20px" }}>
          <p>Введите свою высоту в метрах (от 1.0 до 5.0):</p>
          <input
            type="number"
            min={1}
            max={5}
            step={0.01}
            defaultValue={height}
            onChange={(e) => {
            let value = e.target.value;
                if (Number(value) < 1) value = "1.0";
                if (Number(value) > 5) value = "5.0";
                onChange({ height: value });
            }}
          />
        </div>
      ),
      onClose: () => setCustom(false),
    });
    setCustom(true); // показываем, что сейчас кастом выбран
  };

  const isCustomActive = custom || (height && !standardHeights.includes(height));

  return (
    <div style={{ marginBottom: "20px" }}>
      <b>Size Height Form</b>

      <div style={{ marginTop: "10px" }}>
        {standardHeights.map((h) => (
          <button
            key={h}
            style={{
              marginRight: "10px",
              backgroundColor: height === h ? "#4caf50" : "#eee",
              color: height === h ? "#fff" : "#000",
              border: "1px solid #ccc",
              padding: "5px 10px",
              cursor: "pointer",
            }}
            onClick={() => handleStandardClick(h)}
          >
            {h} м
          </button>
        ))}

        <button
          style={{
            backgroundColor: isCustomActive ? "#4caf50" : "#eee",
            color: isCustomActive ? "#fff" : "#000",
            border: "1px solid #ccc",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={handleCustomSelect}
        >
          Свой размер
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <b>Выбранная высота: {height || "-"}</b>
      </div>
      <hr />
    </div>
  );
};

export default SizeHeightForm;
