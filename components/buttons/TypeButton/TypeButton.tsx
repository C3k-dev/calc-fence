'use client'

import React from 'react';
import styles from './style.module.scss';
import Icon from '@/components/Icon/Icon';

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
    <div className={`${styles.typeButton__background} ${isActive ? styles.activeBackground : ''}`} />
      <div className={styles.typeButton__wrapper}>
        <Icon width={128} height={80} icon={'/128/fance_type_1'} color={isActive ? ('var(--background-button)') : ('var(--text-secondary)')} />
        <p>{name}</p>
      </div>
    </div>
  );
}


export default TypeButton;