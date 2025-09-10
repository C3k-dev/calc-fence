import TypeButton from "@/components/buttons/TypeButton/TypeButton";
import React, { useState, useEffect } from "react";
import styles from './style.module.scss';

interface TypeFormProps {
  type: string;
  onChange: (newType: string) => void;
}

const TypeForm: React.FC<TypeFormProps> = ({ type, onChange }) => {
  const [selectedType, setSelectedType] = useState<string>("Штакетник");

  // Инициализируем родительский state дефолтным значением
  useEffect(() => {
    onChange(selectedType);
  }, []);

  const handleSelect = (newType: string) => {
    setSelectedType(newType);
    onChange(newType);
  };

  return (
    <div className={styles.typeForm}>
      <div className={styles.typeForm__headline}>
        <p>Калькулятор цены забора</p>
      </div>
      <div className={styles.typeForm__buttons}>
        <TypeButton
          id={1}
          isActive={selectedType === "Штакетник"}
          onClick={() => handleSelect("Штакетник")}
        />
        <TypeButton
          id={2}
          isActive={selectedType === "Профнастил"}
          onClick={() => handleSelect("Профнастил")}
        />
      </div >
    </div>
  );
};

export default TypeForm;
