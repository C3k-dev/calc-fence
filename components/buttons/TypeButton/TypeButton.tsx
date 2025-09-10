'use client'

import React from 'react';
import styles from './style.module.scss';

interface TypeButtonProps {
  name: string;
  isActive?: boolean;
  onClick?: () => void;
}

function TypeButton({ name, isActive, onClick }: TypeButtonProps) {
  return (
    <div
      className={`${styles.typeButton} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
    <div className={`${styles.typeButton__background} ${isActive ? styles.active : ''}`} />
      <div className={styles.typeButton__wrapper}>
        <p>{name}</p>
      </div>
    </div>
  );
}


export default TypeButton;