'use client'

import React from 'react';
import styles from './style.module.scss';
import Icon from '@/components/Icon/Icon';

interface TypeButtonProps {
  id: number;
  isActive?: boolean;
  onClick?: () => void;
}

function TypeButton({ id, isActive, onClick }: TypeButtonProps) {
  const name = id === 1 ? "Штакетник" : id === 2 ? "Профнастил" : "Неизвестно";
  const iconPath = id === 1 ? "/128/fance_type_1" : id === 2 ? "/128/fance_type_2" : "/128/default";

  return (
    <div
      className={`${styles.typeButton} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={`${styles.typeButton__background} ${isActive ? styles.activeBackground : ''}`} />
      <div className={styles.typeButton__wrapper}>
        <Icon
          width={128}
          height={80}
          icon={iconPath}
          color={isActive ? 'var(--background-button)' : 'var(--text-secondary)'}
        />
        <p>{name}</p>
      </div>
    </div>
  );
}

export default TypeButton;
