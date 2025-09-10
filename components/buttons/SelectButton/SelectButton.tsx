import React from 'react';
import styles from './style.module.scss';

interface SelectButtonProps {
    name: string;
    isActive?: boolean;
    onClick?: () => void;
}

function SelectButton({ name, isActive, onClick }: SelectButtonProps) {
  return (
    <div
      className={`${styles.selectButton} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <p>{name}</p>
    </div>
  );
}

export default SelectButton;
