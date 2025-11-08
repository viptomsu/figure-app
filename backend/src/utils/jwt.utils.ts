import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  role: string;
}

export const generateAccessToken = async (userId: string, role: string): Promise<string> => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }

  const payload: TokenPayload = { id: userId, role };

  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const generateRefreshToken = async (userId: string, role: string): Promise<string> => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }

  const payload: TokenPayload = { id: userId, role };

  return jwt.sign(payload, secret, { expiresIn: '7d' });
};