import React, { useState } from 'react';
import BasketballGame from './BasketballGame';
import styles from '../styles/BasketballGame.module.css';

interface Props {
  onScoreSuccess: () => void;
  canAnswer: boolean;
  wrongAnswerCount: number;
  currentLevel: number;
}

export default function BasketballGameContainer({ onScoreSuccess, canAnswer, wrongAnswerCount, currentLevel }: Props) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      height: '100%',
      justifyContent: 'flex-start',
      paddingTop: '20px'
    }}>
      {/* 關卡指示 */}
      <div style={{
        marginBottom: '16px',
        padding: '8px 16px',
        background: 'rgba(0, 230, 184, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(0, 230, 184, 0.3)',
        color: '#00e6b8',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        第 {currentLevel} 關投籃挑戰
      </div>

      {/* 投籃遊戲 */}
      <BasketballGame 
        onScoreSuccess={onScoreSuccess}
        disabled={false}
        resetTrigger={currentLevel} // 關卡改變時觸發重置
      />
      
      {/* 狀態訊息 */}
      {!canAnswer && wrongAnswerCount === 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(255, 193, 7, 0.2)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 193, 7, 0.5)',
          color: '#ffc107',
          fontSize: '14px',
          textAlign: 'center',
          maxWidth: '300px'
        }}>
          🎯 請先投籃成功才能開始答題！
        </div>
      )}
      
      {!canAnswer && wrongAnswerCount > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(255, 99, 71, 0.2)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 99, 71, 0.5)',
          color: '#ff6347',
          fontSize: '14px',
          textAlign: 'center',
          maxWidth: '300px'
        }}>
          ❌ 答錯了！請重新投籃成功後再試！<br />
          <small>錯誤次數：{wrongAnswerCount}</small>
        </div>
      )}

      {canAnswer && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(0, 230, 184, 0.2)',
          borderRadius: '8px',
          border: '1px solid rgba(0, 230, 184, 0.5)',
          color: '#00e6b8',
          fontSize: '14px',
          textAlign: 'center',
          maxWidth: '300px'
        }}>
          🎉 投籃成功！現在可以回答問題了！
        </div>
      )}
    </div>
  );
}
