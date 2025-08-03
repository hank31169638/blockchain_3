import React from 'react';
import { Level } from '../utils/levels';

interface MapProps {
  currentLevel: number;
  onSelectLevel: (level: number) => void;
  levels: Level[];
}

const MapComponent: React.FC<MapProps> = ({ currentLevel, onSelectLevel, levels }) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(0, 230, 184, 0.2)',
      height: '100%',
    }}>
      <h3 style={{color: '#00e6b8', marginBottom: '16px', fontSize: '1.1rem'}}>關卡地圖</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
        {levels.map((level) => (
          <div
            key={level.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              borderRadius: '8px',
              cursor: level.status !== 'locked' ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              border: '1px solid transparent',
              background: level.status === 'completed' 
                ? 'rgba(0, 230, 184, 0.2)' 
                : level.status === 'unlocked' 
                ? 'rgba(0, 230, 184, 0.1)' 
                : 'transparent',
              borderColor: level.status === 'completed' 
                ? '#00e6b8' 
                : level.status === 'unlocked' 
                ? 'rgba(0, 230, 184, 0.3)' 
                : 'transparent',
              opacity: level.status === 'locked' ? 0.5 : 1
            }}
            onClick={() => {
              if (level.status !== 'locked') {
                onSelectLevel(level.id);
              }
            }}
          >
            <span style={{
              background: '#00e6b8',
              color: '#1a2332',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              marginRight: '12px'
            }}>{level.id}</span>
            <span style={{
              flex: 1,
              color: '#fff',
              fontSize: '0.9rem'
            }}>{level.title}</span>
            {level.status === 'completed' && <span style={{color: '#00e6b8', fontSize: '1.2rem'}}>✓</span>}
            {level.status === 'locked' && <span style={{fontSize: '1rem'}}>🔒</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;
