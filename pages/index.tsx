import React, { useState } from 'react';
import Map from '../components/Map';
import LevelCard from '../components/LevelCard';
import ProgressBar from '../components/ProgressBar';
import { levels } from '../utils/levels';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('error');
  const [levelStates, setLevelStates] = useState(levels);
  

  // 關卡提交邏輯（僅範例，需根據題目設計驗證）
  const handleSubmit = (input: string) => {
    // 這裡可根據每關題目驗證答案
    if (input.trim() === levelStates[currentLevel - 1].answer) {
      setFeedback('🎉 答對了！正在前往下一關...');
      setFeedbackType('success');
    
      // 更新狀態
      const newStates = levelStates.map((lv, idx) => {
        if (idx === currentLevel - 1) return { ...lv, status: 'completed' as 'completed' };
        if (idx === currentLevel) return { ...lv, status: 'unlocked' as 'unlocked' };
        return lv;
      });
      setLevelStates(newStates);
      // 動畫延遲後進入下一關
      setTimeout(() => {
        setFeedback('');
        if (currentLevel < levels.length) setCurrentLevel(currentLevel + 1);
      }, 1500);
    } else {
      setFeedback('❌ 答案不正確，請再試一次！');
      setFeedbackType('error');
      // 3秒後清除錯誤訊息
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <h1>鏈中追蹤者：區塊鏈破關任務</h1>
        <ProgressBar current={currentLevel - 1} total={levels.length} />
      </header>
      <main className={styles.main}>
        <Map currentLevel={currentLevel} onSelectLevel={setCurrentLevel} />
        <LevelCard
            key={currentLevel}
          level={levelStates[currentLevel - 1]}
          onSubmit={handleSubmit}
          feedback={feedback}
          feedbackType={feedbackType}
        />
      </main>
    </div>
  );
}
