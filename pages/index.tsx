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
  const handleSubmit = async (input: string) => {
    if (!levelStates || levelStates.length === 0) return;
    
    const currentLevelData = levelStates[currentLevel - 1];
    if (!currentLevelData) return;
    
    try {
      // 獲取 token 和時間戳
      const tokenResponse = await fetch('/api/get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          levelId: currentLevel
        }),
      });
      const { token, timestamp } = await tokenResponse.json();
      
      // 驗證答案
      const response = await fetch('/api/verify-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          levelId: currentLevel,
          answer: input.trim(),
          timestamp,
          token
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
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
        setFeedback('❌ 答案不正確！請重新投籃再試一次');
        setFeedbackType('error');
        setWrongAnswerCount(prev => prev + 1);
        setCanAnswer(false); // 答錯需要重新投籃
        
        // 3秒後清除錯誤訊息
        setTimeout(() => {
          setFeedback('');
        }, 3000);
      }
    } catch (error) {
      console.error('答案驗證錯誤:', error);
      setFeedback('❌ 系統錯誤，請稍後再試');
      setFeedbackType('error');
    }
  };

  // 處理答題嘗試的回調
  const handleAnswerAttempt = (isCorrect: boolean) => {
    setLastAnswerCorrect(isCorrect);
    // 移除這裡的投籃邏輯，由handleSubmit統一處理
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
            
                <MapComponent 
                  currentLevel={currentLevel} 
                  onSelectLevel={handleLevelChange} 
                  levels={levelStates || []} 
                />
              
              
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