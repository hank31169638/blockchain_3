import React from 'react';

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = Math.round((current / total) * 100);
  
  const progressBarStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  };

  const barStyle: React.CSSProperties = {
    width: `${percent}%`,
    height: '100%',
    background: 'linear-gradient(90deg, #00e6b8, #007a5e)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
    boxShadow: '0 0 10px rgba(0, 230, 184, 0.5)'
  };

  const textStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
    display: 'block',
    marginTop: '4px'
  };

  return (
    <div style={progressBarStyle}>
      <div style={barStyle}></div>
      <span style={textStyle}>{current} / {total} 關卡</span>
    </div>
  );
}
