import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// 答案數據（在生產環境中應該存儲在環境變量或數據庫中）
const answers = {
  1: "唯一性|固定輸出長度|不可逆|小變化大差異",
  2: "1314", 
  3: "fef2f3adf2b8",
  4: "相容性",
  5: "HIGH99",
  6: "CHAIN3N1",
  7: "VOTENONESX21"
};

// 答案驗證函數
function validateAnswer(levelId: number, userAnswer: string): boolean {
  const correctAnswer = answers[levelId as keyof typeof answers];
  if (!correctAnswer) return false;

  if (correctAnswer.includes('|')) {
    // 支援多種答案組合的題目
    const correctAnswers = correctAnswer.split('|');
    const userAnswers = userAnswer.trim().split(/\s+/);
    
    return correctAnswers.every(answer => 
      userAnswers.some(userAnswer => userAnswer === answer)
    ) && userAnswers.length === correctAnswers.length;
  } else {
    // 一般題目的精確匹配
    return userAnswer.trim() === correctAnswer;
  }
}

// 生成驗證token（防止暴力破解）
function generateVerificationToken(levelId: number, timestamp: number): string {
  const secret = process.env.SECRET_KEY || 'blockchain-game-secret-key';
  return crypto.createHash('sha256')
    .update(`${levelId}-${timestamp}-${secret}`)
    .digest('hex')
    .substring(0, 16);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { levelId, answer, timestamp, token } = req.body;

    // 基本驗證
    if (!levelId || answer === undefined || !timestamp || !token) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 時間戳驗證（防止重放攻擊）
    const now = Date.now();
    const requestTime = parseInt(timestamp);
    if (Math.abs(now - requestTime) > 300000) { // 5分鐘內有效
      return res.status(400).json({ error: 'Request expired' });
    }

    // Token驗證（防止偽造請求）
    const expectedToken = generateVerificationToken(parseInt(levelId), requestTime);
    if (token !== expectedToken) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // 驗證答案
    const isCorrect = validateAnswer(parseInt(levelId), answer);

    // 添加一些隨機延遲，防止時間攻擊
    const delay = Math.random() * 100 + 50;
    await new Promise(resolve => setTimeout(resolve, delay));

    if (isCorrect) {
      return res.status(200).json({ 
        success: true, 
        message: 'Correct answer!',
        levelId: parseInt(levelId)
      });
    } else {
      return res.status(200).json({ 
        success: false, 
        message: 'Incorrect answer. Please try again.',
        levelId: parseInt(levelId)
      });
    }

  } catch (error) {
    console.error('Answer verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
