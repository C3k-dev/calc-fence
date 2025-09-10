import React from 'react';
import styles from './style.module.scss';
import Icon from '@/components/Icon/Icon';

interface CutCellProps {
  type: 'gates' | 'wicket';
  name: string;
  size: string;
  onDelete?: () => void;
}

function CutCell({ type, name, size, onDelete }: CutCellProps) {
  const iconPath = type === 'gates' ? '/48/gates' : '/48/wicket';

  return (
    <div className={styles.cutCell}>
      <div className={styles.cutCell__left}>
        <Icon
          className={styles.cutCell__left__icon}
          width={48}
          height={48}
          icon={iconPath}
          color="var(--text-secondary)"
        />
        <div className={styles.cutCell__left__info}>
          <p className={styles.cutCell__left__info__name}>{name}</p>
          <p className={styles.cutCell__left__info__size}>{size}</p>
        </div>
      </div>
      <div className={styles.cutCell__right}>
        <button
          className={styles.cutCell__right__delete}
          onClick={onDelete}
        >
          <Icon width={24} height={24} icon="/24/ic_trash" />
        </button>
      </div>
    </div>
  );
}

export default CutCell;
