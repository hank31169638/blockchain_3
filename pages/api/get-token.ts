import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// 生成驗證token
function generateVerificationToken(levelId: number, timestamp: number): string {
  const secret = process.env.SECRET_KEY || 'blockchain-game-secret-key';
  return crypto.createHash('sha256')
    .update(`${levelId}-${timestamp}-${secret}`)
    .digest('hex')
    .substring(0, 16);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { levelId } = req.body;

    if (!levelId) {
      return res.status(400).json({ error: 'Level ID is required' });
    }

    const timestamp = Date.now();
    const token = generateVerificationToken(parseInt(levelId), timestamp);

    return res.status(200).json({
      timestamp,
      token
    });

  } catch (error) {
    console.error('Token generation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
