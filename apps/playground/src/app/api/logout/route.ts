import { NextRequest, NextResponse } from 'next/server';
import { zauth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  await zauth.auth.logout();
  const response = NextResponse.json({ ok: true });
  return response;
}