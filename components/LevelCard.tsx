import React, { useState, useEffect } from 'react';
import { Level } from '../utils/levels';

interface Props {
  level: Level;
  onSubmit: (input: string) => void;
  feedback: string;
  feedbackType?: 'success' | 'error';
  onAnswerAttempt?: (isCorrect: boolean) => void;
  canAnswer?: boolean;
  onBasketballSuccess?: () => void;
}

// 工具連結對應表
const toolLinks: { [key: string]: string } = {
  'CyberChef': 'https://gchq.github.io/CyberChef/',
  'sha256 online': 'https://emn178.github.io/online-tools/sha256.html',
  'sha256 online 工具': 'https://emn178.github.io/online-tools/sha256.html',
  'Python': 'https://www.python.org/',
  'JS brute force': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
};

// 將提示文字中的工具名稱轉換為超連結
function parseHintWithLinks(hint: string) {
  let parsedHint = hint;
  
  Object.entries(toolLinks).forEach(([toolName, url]) => {
    const regex = new RegExp(`(${toolName})`, 'gi');
    parsedHint = parsedHint.replace(regex, `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #00e6b8; text-decoration: none;">$1</a>`);
  });
  
  return parsedHint;
}

export default function LevelCard({ level, onSubmit, feedback, feedbackType = 'error', onAnswerAttempt, canAnswer = false }: Props) {
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  // 監控feedback變化，如果答案正確就清空輸入框
  useEffect(() => {
    if (feedback && feedback.includes('🎉')) {
      setTimeout(() => {
        setInput('');
      }, 1000); // 延遲1秒後清空，讓使用者看到自己的答案
    }
  }, [feedback]);

  const handleSubmit = () => {
    if (input.trim() && canAnswer) {
      const previousInput = input.trim();
      onSubmit(previousInput);
      
      // 通知父組件有答題嘗試
      if (onAnswerAttempt) {
        // 我們需要等feedback更新後再判斷答案是否正確
        setTimeout(() => {
          const isCorrect = !feedback.includes('❌');
          onAnswerAttempt(isCorrect);
        }, 100);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canAnswer) {
      handleSubmit();
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(0, 230, 184, 0.2)',
    backdropFilter: 'blur(10px)',
    width: '100%',
    height: '100%',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  };

  const titleStyle: React.CSSProperties = {
    color: '#00e6b8',
    fontSize: '1.5rem',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const narratorStyle: React.CSSProperties = {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '16px',
    padding: '12px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    borderLeft: '4px solid #00e6b8'
  };

  const descriptionStyle: React.CSSProperties = {
    color: '#fff',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '16px'
  };

  const hintButtonStyle: React.CSSProperties = {
    background: 'rgba(255, 193, 7, 0.2)',
    color: '#ffc107',
    border: '1px solid rgba(255, 193, 7, 0.5)',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginBottom: '12px'
  };

  const hintStyle: React.CSSProperties = {
    color: '#ffc107',
    fontSize: '0.9rem',
    background: 'rgba(255, 193, 7, 0.1)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 193, 7, 0.3)',
    marginBottom: '20px'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '1px solid rgba(0, 230, 184, 0.3)',
    borderRadius: '8px',
    background: 'rgba(0, 0, 0, 0.3)',
    color: '#fff',
    fontSize: '1rem',
    marginBottom: '12px',
    marginRight: '12px',
    cursor: 'text'
  };

  const submitButtonStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #00e6b8, #007a5e)',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 230, 184, 0.3)'
  };

  const feedbackStyle: React.CSSProperties = {
    marginTop: '16px',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '500',
    ...(feedbackType === 'success' ? {
      background: 'rgba(0, 230, 184, 0.2)',
      color: '#00e6b8',
      border: '1px solid #00e6b8'
    } : {
      background: 'rgba(255, 99, 71, 0.2)',
      color: '#ff6347',
      border: '1px solid #ff6347'
    })
  };

  const storyBgStyle: React.CSSProperties = {
    marginBottom: '20px',
    padding: '16px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    borderLeft: '4px solid #00e6b8',
    color: '#fff',
    fontStyle: 'italic',
    fontSize: '0.9rem'
  };

  const inputRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{level.title}</h2>
      
      <div>
        {/* 內心獨白 */}
        {level.narrator && (
          <div style={narratorStyle}>
            {level.narrator}
          </div>
        )}
        
        {/* 故事背景 */}
        {level.storyBg && (
          <div style={storyBgStyle}>
            {level.storyBg}
          </div>
        )}
        
        {/* 題目描述 */}
        <div style={descriptionStyle}>
          {level.description.includes('<br />') || level.description.includes('<code>') ? 
            <span dangerouslySetInnerHTML={{ __html: level.description }} /> :
            level.description.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
        </div>
        
        {/* 提示按鈕和內容 */}
        <button style={hintButtonStyle} onClick={() => setShowHint(!showHint)}>
          {showHint ? '🔒 隱藏提示' : '💡 查看提示'}
        </button>
        
        {showHint && (
          <div style={hintStyle}>
            <span dangerouslySetInnerHTML={{ __html: parseHintWithLinks(level.hint) }} />
          </div>
        )}
        
        {/* 狀態判斷：已完成顯示答案，未完成顯示輸入框 */}
        {level.status === 'completed' ? (
          <>
            {feedback && (
              <div style={feedbackStyle}>
                {feedback}
              </div>
            )}
          </>
        ) : (
          <div>
            {/* 投籃狀態提示 */}
            {!canAnswer && (
              <div style={{
                marginBottom: '16px',
                padding: '12px',
                background: 'rgba(255, 193, 7, 0.2)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 193, 7, 0.5)',
                color: '#ffc107',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                🏀 請先在右側投籃成功才能回答問題！
                {level.id > 1 && (
                  <div>
                    <br />
                    <small>每關都需要重新投籃證明實力！</small>
                  </div>
                )}
              </div>
            )}
            
            <div style={inputRowStyle}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={canAnswer ? `範例：${level.example}` : '請先投籃成功！'}
                disabled={!canAnswer}
                style={{
                  ...inputStyle, 
                  flex: 1,
                  opacity: canAnswer ? 1 : 0.5,
                  cursor: canAnswer ? 'text' : 'not-allowed'
                }}
              />
              <button 
                style={{
                  ...submitButtonStyle,
                  opacity: canAnswer ? 1 : 0.5,
                  cursor: canAnswer ? 'pointer' : 'not-allowed'
                }} 
                onClick={handleSubmit}
                disabled={!canAnswer}
              >
                提交
              </button>
            </div>
            {feedback && (
              <div style={feedbackStyle}>
                {feedback}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
