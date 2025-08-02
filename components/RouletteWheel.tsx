import React, { useState } from 'react';
import styles from './SuccessPage.module.css';

const RouletteWheel: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string>('');

  const prizes = [
    '🎁 區塊鏈徽章',
    '💎 加密貨幣體驗',
    '📚 程式學習資源',
    '🏆 特殊成就',
    '⭐ 技能點數',
    '🎯 隱藏關卡'
  ];

  const spin = () => {
    if (spinning) return;
    
    setSpinning(true);
    setResult('');
    
    // 模擬轉盤旋轉
    setTimeout(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setResult(randomPrize);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className={styles.rouletteContainer}>
      <h3>🎰 獎勵轉盤</h3>
      <div className={`${styles.wheel} ${spinning ? styles.spinning : ''}`}>
        <div className={styles.wheelContent}>
          {spinning ? '🌀' : '🎯'}
        </div>
      </div>
      
      <button 
        className={styles.spinButton} 
        onClick={spin}
        disabled={spinning}
      >
        {spinning ? '旋轉中...' : '開始抽獎'}
      </button>
      
      {result && (
        <div className={styles.result}>
          <h4>🎉 恭喜獲得：</h4>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default RouletteWheel;
