import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function verifyAuth() {
  const cookieStore = cookies(); 
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch { 
    return null;
  }
}