import React, { useState, useEffect } from 'react';
import MapComponent from '../components/Map';
import LevelCard from '../components/LevelCard';
import ProgressBar from '../components/ProgressBar';
import BasketballGameContainer from '../components/BasketballGameContainer';
import { levels } from '../utils/levels';
import styles from '../styles/Home.module.css';
import SuccessPage from '../components/SuccessPage'; // 假設有一個成功頁面組件

// 直接定義 SuccessPage 組件避免導入問題

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('error');
  const [levelStates, setLevelStates] = useState(levels || []);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(true);
  const [canAnswer, setCanAnswer] = useState(false);
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);

  // 當切換關卡時重置投籃狀態
  const handleLevelChange = (newLevel: number) => {
    setCurrentLevel(newLevel);
    setCanAnswer(false);
    setWrongAnswerCount(0);
    setFeedback('');
  };

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
        if (currentLevel < levels.length) {
          setCurrentLevel(currentLevel + 1);
          // 進入下一關時重置投籃狀態
          setCanAnswer(false);
          setWrongAnswerCount(0);
        }
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

  // 處理答題嘗試的回調
  const handleAnswerAttempt = (isCorrect: boolean) => {
    setLastAnswerCorrect(isCorrect);
    if (!isCorrect) {
      setWrongAnswerCount(prev => prev + 1);
      setCanAnswer(false); // 答錯需要重新投籃
    }
  };

  // 處理投籃成功
  const handleBasketballSuccess = () => {
    setCanAnswer(true);
  };

  // 確保遊戲開始時需要先投籃
  useEffect(() => {
    setCanAnswer(false);
    setWrongAnswerCount(0);
  }, []);

  const allCompleted = levelStates && levelStates.length > 0 && levelStates.every(lv => lv.status === 'completed');

  return (
    <div className={styles.container}>
      {/* 裝飾性背景元素 */}
      <div className={styles.decorativeElements}></div>
      
      {allCompleted ? (
        <div className={styles.successOverlay}>
          <SuccessPage />
        </div>
      ) : (
        <>
          {/* 標題區域 */}
          <header className={styles.header}>
            <h1 className={styles.title}>區塊鏈挑戰之旅</h1>
            <p className={styles.subtitle}>
              探索區塊鏈的奧秘，解鎖去中心化世界的智慧。每一個問題都是通往未來的密鑰。
            </p>
            <div className={styles.progressSection}>
              <ProgressBar current={currentLevel - 1} total={levels?.length || 0} />
            </div>
          </header>

          {/* 主要內容區域 */}
          <main className={styles.mainContent}>
            <div className={styles.gameLayout}>
              {/* 地圖區域 */}
              <div className={`${styles.mapSection} ${styles.loading}`}>
                <MapComponent 
                  currentLevel={currentLevel} 
                  onSelectLevel={handleLevelChange} 
                  levels={levelStates || []} 
                />
              </div>
              
              {/* 題目區域 */}
              <div className={`${styles.questionSection} ${styles.loading}`}>
                {levelStates && levelStates[currentLevel - 1] && (
                  <LevelCard
                    key={currentLevel}
                    level={levelStates[currentLevel - 1]}
                    onSubmit={handleSubmit}
                    feedback={feedback}
                    feedbackType={feedbackType}
                    onAnswerAttempt={handleAnswerAttempt}
                    canAnswer={canAnswer}
                  />
                )}
              </div>
              
              {/* 投籃遊戲區域 */}
              <div className={`${styles.basketballSection} ${styles.loading}`}>
                <BasketballGameContainer 
                  onScoreSuccess={handleBasketballSuccess}
                  canAnswer={canAnswer}
                  wrongAnswerCount={wrongAnswerCount}
                  currentLevel={currentLevel}
                />
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}