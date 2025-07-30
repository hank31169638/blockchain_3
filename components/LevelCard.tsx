import React, { useState } from 'react';
import { Level } from '../utils/levels';
import styles from '../styles/LevelCard.module.css';

interface Props {
  level: Level;
  onSubmit: (input: string) => void;
  feedback: string;
  feedbackType?: 'success' | 'error';
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
    parsedHint = parsedHint.replace(regex, `<a href="${url}" target="_blank" rel="noopener noreferrer">$1</a>`);
  });
  
  return parsedHint;
}

interface Props {
  level: Level;
  onSubmit: (input: string) => void;
  feedback: string;
}

export default function LevelCard({ level, onSubmit, feedback, feedbackType = 'error' }: Props) {
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={styles.card}>
      <h2>{level.title}</h2>
      <p>{level.description}</p>
      <button className={styles.hintBtn} onClick={() => setShowHint(!showHint)}>
        {showHint ? '隱藏提示' : '查看提示'}
      </button>
      {showHint && (
        <div 
          className={styles.hint}
          dangerouslySetInnerHTML={{ __html: parseHintWithLinks(level.hint) }}
        />
      )}
      <div className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`請輸入答案，例如：${level.example}`}
          className={styles.input}
        />
        <button className={styles.submitBtn} onClick={handleSubmit}>
          提交
        </button>
      </div>
      {feedback && (
        <div className={`${styles.feedback} ${feedbackType === 'success' ? styles.success : styles.error}`}>
          {feedback}
        </div>
      )}
    </div>
  );
}
