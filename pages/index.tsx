import React, { useState, useEffect } from 'react';
import MapComponent from '../components/Map';
import LevelCard from '../components/LevelCard';
import ProgressBar from '../components/ProgressBar';
import { levels } from '../utils/levels';
import styles from '../styles/Home.module.css';
import SuccessPage from '../components/SuccessPage'; // 假設有一個成功頁面組件

// 直接定義 SuccessPage 組件避免導入問題

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('error');
  const [levelStates, setLevelStates] = useState(levels || []);

  // 關卡提交邏輯（僅範例，需根據題目設計驗證）
  const handleSubmit = (input: string) => {
    if (!levelStates || levelStates.length === 0) return;
    
    const currentLevelData = levelStates[currentLevel - 1];
    if (!currentLevelData) return;
    
    let isCorrect = false;
    
    // 檢查答案是否正確
    if (currentLevelData.answer.includes('|')) {
      // 支援多種答案組合的題目（如雜湊特性題）
      const correctAnswers = currentLevelData.answer.split('|');
      const userAnswers = input.trim().split(/\s+/); // 用空格分割使用者輸入
      
      // 檢查是否包含所有必要答案（順序不限）
      isCorrect = correctAnswers.every(answer => 
        userAnswers.some(userAnswer => userAnswer === answer)
      ) && userAnswers.length === correctAnswers.length;
    } else {
      // 一般題目的精確匹配
      isCorrect = input.trim() === currentLevelData.answer;
    }
    
    if (isCorrect) {
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
      setFeedback('❌ 答案不正確！');
      setFeedbackType('error');
      
      // 3秒後清除錯誤訊息
      setTimeout(() => {
        setFeedback('');
      }, 3000);
    }
  };

  const allCompleted = levelStates && levelStates.length > 0 && levelStates.every(lv => lv.status === 'completed');

  return (
    <div className={styles.homeContainer} style={{backgroundColor: '#1a2332', minHeight: '100vh'}}>
      {allCompleted ? (
        <SuccessPage />
      ) : (
        <>
          <header className={styles.header} style={{background: 'rgba(26, 35, 50, 0.95)', color: '#fff', padding: '20px', textAlign: 'center'}}>
            <h1 style={{color: '#00e6b8', fontSize: '2rem'}}>區塊鏈破關任務</h1>
            <ProgressBar current={currentLevel - 1} total={levels?.length || 0} />
          </header>
          <main className={styles.main} style={{display: 'flex', maxWidth: '1400px', margin: '0 auto', padding: '16px', gap: '24px'}}>
            <div className={styles.leftPanel} style={{flex: '0 0 280px', display: 'flex', flexDirection: 'column'}}>
              <MapComponent currentLevel={currentLevel} onSelectLevel={setCurrentLevel} levels={levelStates || []} />
            </div>
            <div className={styles.rightPanel} style={{flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '20px'}}>
              {levelStates && levelStates[currentLevel - 1] && (
                <LevelCard
                  key={currentLevel} // 強制重新載入組件以清空輸入框
                  level={levelStates[currentLevel - 1]}
                  onSubmit={handleSubmit}
                  feedback={feedback}
                  feedbackType={feedbackType}
                />
              )}
            </div>
          </main>
        </>
      )}
    </div>
  );
}