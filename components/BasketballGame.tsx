import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from '../styles/BasketballGame.module.css';

interface Props {
  onScoreSuccess: () => void;
  disabled?: boolean;
  resetTrigger?: number; // 用於觸發重置的計數器
}

interface Position {
  x: number;
  y: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isMoving: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function BasketballGame({ onScoreSuccess, disabled = false, resetTrigger = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [ball, setBall] = useState<Ball>({
    x: 70,
    y: 400, // 調整初始位置適應新的地面高度（50px地面）
    vx: 0,
    vy: 0,
    isMoving: false
  });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseStartPos, setMouseStartPos] = useState<Position>({ x: 0, y: 0 });
  const [trajectory, setTrajectory] = useState<Position[]>([]);
  const [hasScored, setHasScored] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const CANVAS_WIDTH = 450;
  const CANVAS_HEIGHT = 500; // 增加高度讓下邊界更長
  const BALL_RADIUS = 12;
  const BASKET_X = 320;
  const BASKET_Y = 180;
  const BASKET_WIDTH = 80;
  const BASKET_HEIGHT = 12;
  const GRAVITY = 0.5;
  const FRICTION = 0.99;

  // 創建進球粒子效果
  const createScoreParticles = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 45, // 減少生命週期，確保更快消失
        maxLife: 45
      });
    }
    setParticles(newParticles);
    
    // 設置定時器確保粒子被清除
    setTimeout(() => {
      setParticles([]);
    }, 3000); // 3秒後強制清除所有粒子
  }, []);

  // 繪製遊戲場景
  const drawGame = useCallback((ctx: CanvasRenderingContext2D, currentBall: Ball, currentParticles: Particle[]) => {
    // 清空畫布
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 繪製深層漸層背景（天空效果）
    const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGradient.addColorStop(0, '#0d1421'); // 深藍夜空
    bgGradient.addColorStop(0.3, '#1a2332'); // 中層藍
    bgGradient.addColorStop(0.6, '#2a3441'); // 淺層
    bgGradient.addColorStop(0.85, '#3a4451'); // 接近地面
    bgGradient.addColorStop(1, '#2a3441'); // 地面反射
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 繪製星星背景
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const stars = [
      {x: 50, y: 30, size: 1},
      {x: 120, y: 45, size: 1.5},
      {x: 200, y: 25, size: 1},
      {x: 300, y: 40, size: 2},
      {x: 380, y: 35, size: 1},
      {x: 80, y: 70, size: 1.5},
      {x: 250, y: 60, size: 1},
      {x: 400, y: 80, size: 1.5},
    ];
    
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      
      // 添加星星閃爍效果
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(Date.now() * 0.005 + star.x) * 0.3})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // 繪製遠山輪廓
    ctx.fillStyle = 'rgba(42, 52, 65, 0.6)';
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT - 150);
    ctx.quadraticCurveTo(100, CANVAS_HEIGHT - 180, 200, CANVAS_HEIGHT - 160);
    ctx.quadraticCurveTo(300, CANVAS_HEIGHT - 140, 450, CANVAS_HEIGHT - 170);
    ctx.lineTo(450, CANVAS_HEIGHT - 50);
    ctx.lineTo(0, CANVAS_HEIGHT - 50);
    ctx.closePath();
    ctx.fill();
    
    // 繪製城市天際線
    ctx.fillStyle = 'rgba(26, 35, 50, 0.8)';
    const buildings = [
      {x: 0, y: CANVAS_HEIGHT - 120, width: 60, height: 70},
      {x: 60, y: CANVAS_HEIGHT - 100, width: 40, height: 50},
      {x: 100, y: CANVAS_HEIGHT - 140, width: 50, height: 90},
      {x: 150, y: CANVAS_HEIGHT - 110, width: 35, height: 60},
      {x: 185, y: CANVAS_HEIGHT - 130, width: 45, height: 80},
      {x: 280, y: CANVAS_HEIGHT - 105, width: 40, height: 55},
      {x: 320, y: CANVAS_HEIGHT - 125, width: 55, height: 75},
      {x: 375, y: CANVAS_HEIGHT - 115, width: 30, height: 65},
      {x: 405, y: CANVAS_HEIGHT - 135, width: 45, height: 85},
    ];
    
    buildings.forEach(building => {
      ctx.fillRect(building.x, building.y, building.width, building.height);
      
      // 添加建築物窗戶燈光
      ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < Math.floor(building.height / 15); j++) {
          if (Math.random() > 0.7) {
            ctx.fillRect(
              building.x + 5 + i * 15, 
              building.y + 5 + j * 15, 
              8, 8
            );
          }
        }
      }
      ctx.fillStyle = 'rgba(26, 35, 50, 0.8)';
    });
    
    // 繪製地面（籃球場效果）
    const floorGradient = ctx.createLinearGradient(0, CANVAS_HEIGHT - 50, 0, CANVAS_HEIGHT);
    floorGradient.addColorStop(0, '#4a5461');
    floorGradient.addColorStop(0.3, '#3a4451');
    floorGradient.addColorStop(0.7, '#2a3441');
    floorGradient.addColorStop(1, '#1a2332');
    ctx.fillStyle = floorGradient;
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
    
    // 繪製籃球場紋理線條
    ctx.strokeStyle = 'rgba(0, 230, 184, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_WIDTH; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, CANVAS_HEIGHT - 50);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    // 繪製場地邊線
    ctx.strokeStyle = 'rgba(0, 230, 184, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT - 50);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 50);
    ctx.stroke();
    
    // 繪製籃球場中圈（部分可見）
    ctx.strokeStyle = 'rgba(0, 230, 184, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(150, CANVAS_HEIGHT - 10, 40, Math.PI, 0);
    ctx.stroke();
    
    // 繪製環境光效果
    const lightGradient = ctx.createRadialGradient(
      BASKET_X + BASKET_WIDTH / 2, BASKET_Y - 50, 0,
      BASKET_X + BASKET_WIDTH / 2, BASKET_Y - 50, 200
    );
    lightGradient.addColorStop(0, 'rgba(255, 215, 0, 0.1)');
    lightGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.05)');
    lightGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 繪製籃球架背板
    const backboardX = BASKET_X + BASKET_WIDTH / 2 + 20;
    const backboardY = BASKET_Y - 40;
    const backboardGradient = ctx.createLinearGradient(backboardX, backboardY, backboardX + 8, backboardY + 80);
    backboardGradient.addColorStop(0, '#ffffff');
    backboardGradient.addColorStop(0.5, '#e8e8e8');
    backboardGradient.addColorStop(1, '#d0d0d0');
    ctx.fillStyle = backboardGradient;
    ctx.fillRect(backboardX, backboardY, 8, 80);
    
    // 繪製背板邊框
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    ctx.strokeRect(backboardX, backboardY, 8, 80);
    
    // 添加背板反光效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(backboardX + 1, backboardY + 5, 2, 70);
    
    // 繪製籃球架支柱
    const poleGradient = ctx.createLinearGradient(BASKET_X + BASKET_WIDTH / 2 - 3, BASKET_Y, BASKET_X + BASKET_WIDTH / 2 + 3, BASKET_Y);
    poleGradient.addColorStop(0, '#8B4513');
    poleGradient.addColorStop(0.5, '#A0522D');
    poleGradient.addColorStop(1, '#8B4513');
    ctx.fillStyle = poleGradient;
    ctx.fillRect(BASKET_X + BASKET_WIDTH / 2 - 3, BASKET_Y, 6, CANVAS_HEIGHT - BASKET_Y - 50);
    
    // 繪製籃框支架
    ctx.strokeStyle = '#FF4500';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(BASKET_X + BASKET_WIDTH / 2 + 3, BASKET_Y);
    ctx.lineTo(backboardX, BASKET_Y);
    ctx.stroke();
    
    // 繪製籃框外圈（金屬光澤）
    const rimGradient = ctx.createLinearGradient(BASKET_X, BASKET_Y - 3, BASKET_X, BASKET_Y + 3);
    rimGradient.addColorStop(0, '#FFD700');
    rimGradient.addColorStop(0.5, '#FF4500');
    rimGradient.addColorStop(1, '#B8860B');
    ctx.strokeStyle = rimGradient;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(BASKET_X + BASKET_WIDTH / 2, BASKET_Y, BASKET_WIDTH / 2, 8, 0, 0, Math.PI);
    ctx.stroke();
    
    // 繪製籃框內圈
    ctx.strokeStyle = '#CD853F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(BASKET_X + BASKET_WIDTH / 2, BASKET_Y, BASKET_WIDTH / 2 - 3, 6, 0, 0, Math.PI);
    ctx.stroke();
    
    // 繪製改良的籃網
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    const netSegments = 8;
    const netLength = 25;
    
    for (let i = 0; i < netSegments; i++) {
      const angle = (Math.PI / (netSegments - 1)) * i;
      const startX = BASKET_X + BASKET_WIDTH / 2 + Math.cos(angle) * (BASKET_WIDTH / 2 - 3);
      const startY = BASKET_Y;
      
      // 創建網繩的波浪效果
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      for (let j = 1; j <= 5; j++) {
        const segmentY = startY + (netLength / 5) * j;
        const wave = Math.sin(j * 0.5) * 3;
        ctx.lineTo(startX + wave, segmentY);
      }
      ctx.stroke();
    }
    
    // 繪製網的橫線
    ctx.lineWidth = 2;
    for (let i = 1; i <= 3; i++) {
      const y = BASKET_Y + (netLength / 4) * i;
      ctx.beginPath();
      ctx.arc(BASKET_X + BASKET_WIDTH / 2, y, (BASKET_WIDTH / 2 - 3) * (1 - i * 0.15), 0, Math.PI);
      ctx.stroke();
    }
    
    // 繪製軌跡預測線（滑鼠按下時）- 更明顯的虛線
    if (isMouseDown && trajectory.length > 0) {
      // 外層白色陰影線
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 5;
      ctx.setLineDash([12, 6]);
      ctx.beginPath();
      ctx.moveTo(trajectory[0].x, trajectory[0].y);
      for (let i = 1; i < trajectory.length; i++) {
        const alpha = 1 - (i / trajectory.length) * 0.3; // 減少透明度變化，保持更明顯
        ctx.globalAlpha = alpha;
        ctx.lineTo(trajectory[i].x, trajectory[i].y);
      }
      ctx.stroke();
      
      // 內層青色線
      ctx.strokeStyle = 'rgba(0, 230, 184, 1)';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(trajectory[0].x, trajectory[0].y);
      for (let i = 1; i < trajectory.length; i++) {
        const alpha = 1 - (i / trajectory.length) * 0.2;
        ctx.globalAlpha = alpha;
        ctx.lineTo(trajectory[i].x, trajectory[i].y);
      }
      ctx.stroke();
      
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
    
    // 繪製籃球（增強版）
    const ballGradient = ctx.createRadialGradient(
      currentBall.x - 4, currentBall.y - 4, 0,
      currentBall.x, currentBall.y, BALL_RADIUS
    );
    ballGradient.addColorStop(0, '#FF8C00');
    ballGradient.addColorStop(0.6, '#FF4500');
    ballGradient.addColorStop(0.9, '#B22222');
    ballGradient.addColorStop(1, '#8B0000');
    
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(currentBall.x, currentBall.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    
    // 籃球線條（更真實的籃球紋路）
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 2;
    
    // 垂直線
    ctx.beginPath();
    ctx.moveTo(currentBall.x, currentBall.y - BALL_RADIUS);
    ctx.lineTo(currentBall.x, currentBall.y + BALL_RADIUS);
    ctx.stroke();
    
    // 水平線
    ctx.beginPath();
    ctx.moveTo(currentBall.x - BALL_RADIUS, currentBall.y);
    ctx.lineTo(currentBall.x + BALL_RADIUS, currentBall.y);
    ctx.stroke();
    
    // 弧形線條
    ctx.beginPath();
    ctx.arc(currentBall.x, currentBall.y, BALL_RADIUS * 0.7, -Math.PI/4, Math.PI/4);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(currentBall.x, currentBall.y, BALL_RADIUS * 0.7, 3*Math.PI/4, 5*Math.PI/4);
    ctx.stroke();
    
    // 顯示可點擊區域提示（當球靜止時）
    if (!currentBall.isMoving) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.arc(currentBall.x, currentBall.y, BALL_RADIUS * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // 繪製增強的粒子效果
    currentParticles.forEach(particle => {
      const alpha = Math.max(0, particle.life / particle.maxLife); // 確保透明度不為負
      const size = Math.max(0, 3 * alpha); // 確保大小不為負
      
      if (alpha > 0.05) { // 只繪製還有足夠透明度的粒子
        // 星星形狀的粒子
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加光暈效果
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [isMouseDown, trajectory]);

  // 計算軌跡預測
  const calculateTrajectory = useCallback((startX: number, startY: number, vx: number, vy: number) => {
    const points: Position[] = [];
    let x = startX;
    let y = startY;
    let velX = vx;
    let velY = vy;
    
    for (let i = 0; i < 100; i++) {
      points.push({ x, y });
      x += velX;
      y += velY;
      velY += GRAVITY;
      velX *= FRICTION;
      
      if (y >= CANVAS_HEIGHT - 50 - BALL_RADIUS || x < 0 || x > CANVAS_WIDTH) {
        break;
      }
    }
    
    return points;
  }, []);

  // 檢查是否進球
  const checkScore = useCallback((ballX: number, ballY: number, ballVY: number) => {
    const basketCenterX = BASKET_X + BASKET_WIDTH / 2;
    const basketCenterY = BASKET_Y;
    
    // 檢查球是否從上方通過籃框（模擬真實籃球）
    if (ballY > basketCenterY && ballY < basketCenterY + 30 && ballVY > 0) {
      if (Math.abs(ballX - basketCenterX) < BASKET_WIDTH / 2 - BALL_RADIUS) {
        return true;
      }
    }
    return false;
  }, []);

  // 動畫循環
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setBall(prevBall => {
      if (!prevBall.isMoving) {
        drawGame(ctx, prevBall, particles);
        return prevBall;
      }

      const newBall = {
        ...prevBall,
        x: prevBall.x + prevBall.vx,
        y: prevBall.y + prevBall.vy,
        vx: prevBall.vx * FRICTION,
        vy: prevBall.vy + GRAVITY
      };

      // 邊界檢查
      if (newBall.x <= BALL_RADIUS || newBall.x >= CANVAS_WIDTH - BALL_RADIUS) {
        newBall.vx = -newBall.vx * 0.7;
        newBall.x = Math.max(BALL_RADIUS, Math.min(CANVAS_WIDTH - BALL_RADIUS, newBall.x));
      }

      // 地面碰撞
      if (newBall.y >= CANVAS_HEIGHT - 50 - BALL_RADIUS) {
        newBall.y = CANVAS_HEIGHT - 50 - BALL_RADIUS;
        newBall.vy = -newBall.vy * 0.6;
        newBall.vx = newBall.vx * 0.8;
        
        // 停止條件
        if (Math.abs(newBall.vy) < 2 && Math.abs(newBall.vx) < 1) {
          newBall.isMoving = false;
          newBall.vx = 0;
          newBall.vy = 0;
        }
      }

      // 檢查進球
      if (!hasScored && checkScore(newBall.x, newBall.y, newBall.vy)) {
        setHasScored(true);
        createScoreParticles(BASKET_X + BASKET_WIDTH / 2, BASKET_Y);
        setTimeout(() => {
          onScoreSuccess();
        }, 500);
      }

      drawGame(ctx, newBall, particles);
      return newBall;
    });

    // 更新粒子
    setParticles(prevParticles => 
      prevParticles.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx: particle.vx * 0.98, // 添加摩擦力讓粒子減速
        vy: particle.vy + 0.2,
        life: particle.life - 1
      })).filter(particle => {
        // 確保粒子在邊界內且生命值大於0
        return particle.life > 0 && 
               particle.x >= -50 && particle.x <= CANVAS_WIDTH + 50 &&
               particle.y >= -50 && particle.y <= CANVAS_HEIGHT + 50;
      })
    );

    animationRef.current = requestAnimationFrame(animate);
  }, [drawGame, checkScore, hasScored, onScoreSuccess]);

  // 重置球的位置
  const resetBall = useCallback(() => {
    setBall({
      x: 70,
      y: 400, // 調整初始位置適應新的地面高度（50px地面）
      vx: 0,
      vy: 0,
      isMoving: false
    });
    setHasScored(false);
    setTrajectory([]);
    setParticles([]); // 確保清除所有粒子
  }, []);

  // 滑鼠事件處理
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled || ball.isMoving) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 增加點擊範圍，讓球更容易被抓住
    const distance = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);
    if (distance <= BALL_RADIUS * 2) { // 擴大點擊範圍
      setIsMouseDown(true);
      setMouseStartPos({ x: mouseX, y: mouseY });
    }
  }, [disabled, ball]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown || disabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const deltaX = (mouseStartPos.x - mouseX) * 0.25; // 降低靈敏度讓控制更容易
    const deltaY = (mouseStartPos.y - mouseY) * 0.25;
    
    const trajectory = calculateTrajectory(ball.x, ball.y, deltaX, deltaY);
    setTrajectory(trajectory);
  }, [isMouseDown, disabled, mouseStartPos, ball, calculateTrajectory]);

  const handleMouseUp = useCallback(() => {
    if (!isMouseDown || disabled) return;
    
    const deltaX = trajectory.length > 1 ? (trajectory[1].x - trajectory[0].x) : 0;
    const deltaY = trajectory.length > 1 ? (trajectory[1].y - trajectory[0].y) : 0;
    
    setBall(prevBall => ({
      ...prevBall,
      vx: deltaX,
      vy: deltaY,
      isMoving: true
    }));
    
    setIsMouseDown(false);
    setTrajectory([]);
  }, [isMouseDown, disabled, trajectory]);

  // 初始化動畫
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // 初始繪製
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawGame(ctx, ball, particles);
  }, [drawGame, ball]);

  // 當 resetTrigger 改變時重置遊戲
  useEffect(() => {
    if (resetTrigger > 0) {
      resetBall();
    }
  }, [resetTrigger, resetBall]);

  return (
    <div className={styles.basketballGameContainer}>
      <div className={styles.gameCanvas}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={`${styles.canvas} ${
            disabled ? styles.disabled : 
            ball.isMoving ? styles.moving : 
            styles.grab
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsMouseDown(false)}
        />
      </div>
      
      <div className={styles.gameInfo}>
        <p className={styles.gameTitle}>
          🏀 投籃挑戰
        </p>
        <p className={styles.gameInstructions}>
          點擊籃球附近區域拖曳來瞄準，放開發射！
          <br/>
          沒投進請按重新開始
        </p>
        {hasScored && (
          <p className={styles.scoreMessage}>
            進球了！強ㄝ！
          </p>
        )}
        <button
          onClick={resetBall}
          disabled={disabled}
          className={styles.resetButton}
        >
          重新開始
        </button>
      </div>
    </div>
  );
}
