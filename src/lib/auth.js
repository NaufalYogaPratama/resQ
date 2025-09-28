import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export function verifyAuth() {
  const token = cookies().get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}