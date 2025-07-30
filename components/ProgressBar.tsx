import React from 'react';
import styles from '../styles/ProgressBar.module.css';

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className={styles.progressBar}>
      <div className={styles.bar} style={{ width: `${percent}%` }}></div>
      <span className={styles.text}>{current} / {total} 關卡</span>
    </div>
  );
}
