import React from 'react';
import { levels } from '../utils/levels';
import styles from '../styles/Map.module.css';

// 節點座標（已調整適應響應式地圖）
const nodePositions = [
  { top: '70%', left: '15%' },
  { top: '55%', left: '25%' },
  { top: '40%', left: '38%' },
  { top: '25%', left: '52%' },
  { top: '15%', left: '65%' },
  { top: '10%', left: '78%' },
  { top: '8%', left: '88%' },
];

export default function Map({ currentLevel, onSelectLevel }: { currentLevel: number; onSelectLevel: (id: number) => void }) {
  return (
    <div className={styles.mapContainer}>
      {/* 地圖背景，可換成SVG或美術圖 */}
      <div className={styles.mapBg}></div>
      {/* 節點 */}
      {levels.map((level, idx) => (
        <div
          key={level.id}
          className={
            `${styles.node} ` +
            (level.status === 'completed' ? styles.completed : level.status === 'unlocked' ? styles.unlocked : styles.locked) +
            (currentLevel === level.id ? ' ' + styles.current : '')
          }
          style={{ top: nodePositions[idx]?.top, left: nodePositions[idx]?.left }}
          onClick={() => level.status !== 'locked' && onSelectLevel(level.id)}
        >
          <span>{level.id}</span>
          {level.status === 'locked' && <span className={styles.lock}>🔒</span>}
          {currentLevel === level.id && <span className={styles.player}>🧑‍🚀</span>}
        </div>
      ))}
    </div>
  );
}
