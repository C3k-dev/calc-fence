import React, { useState } from "react";

interface TypeFormProps {
  type: string;
  onChange: (newType: string) => void;
}

const TypeForm: React.FC<TypeFormProps> = ({ type, onChange }) => {
  const handleSelect = (selectedType: string) => {
    onChange(selectedType);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <b>Выберите тип забора:</b>
      <div style={{ marginTop: "10px" }}>
        <button
          style={{
            marginRight: "10px",
            backgroundColor: type === "Штакетник" ? "#4caf50" : "#eee",
            color: type === "Штакетник" ? "#fff" : "#000",
            border: "1px solid #ccc",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={() => handleSelect("Штакетник")}
        >
          Штакетник
        </button>

        <button
          style={{
            backgroundColor: type === "Профлист" ? "#4caf50" : "#eee",
            color: type === "Профлист" ? "#fff" : "#000",
            border: "1px solid #ccc",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={() => handleSelect("Профлист")}
        >
          Профлист
        </button>
      </div>
    </div>
  );
};

export default TypeForm;
