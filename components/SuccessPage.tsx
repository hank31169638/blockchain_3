import React from "react";

export default function SuccessPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2332 0%, #2d3f4f 50%, #3a5a6a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      color: '#fff'
    }}>
      <h1 style={{
        fontSize: '3rem',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #00e6b8 0%, #ffffff 50%, #00e6b8 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🎉 恭喜通關！
      </h1>
      <p style={{
        fontSize: '1.2rem',
        marginBottom: '32px',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        你已成功重建失落的區塊鏈分支，成為鏈中追蹤者的傳奇！
      </p>
      
      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: 'rgba(0, 230, 184, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(0, 230, 184, 0.3)',
        maxWidth: '500px'
      }}>
        <p style={{
          margin: 0,
          fontSize: '1rem',
          color: '#00e6b8',
          marginBottom: '16px'
        }}>
          🧩 彩蛋：真正的區塊鏈精神，是永不放棄的探索！
        </p>
        
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '0.9rem',
            color: '#ffffff',
            opacity: 0.8
          }}>
            🎯 通關密碼
          </p>
          <p style={{
            margin: 0,
            fontSize: '1.5rem',
            fontFamily: 'monospace',
            color: '#00e6b8',
            fontWeight: 'bold',
            letterSpacing: '2px'
          }}>
            47b88d534
          </p>
        </div>
      </div>
    </div>
  );
}
