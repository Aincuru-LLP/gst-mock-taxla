import { NextRequest, NextResponse } from 'next/server';
import { createInitialState, generateSessionId } from '@/lib/state/session-store';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId') || generateSessionId();
  const session = createInitialState(sessionId);
  return NextResponse.json({
    status: 'ok',
    session
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const sessionId = body.sessionId || generateSessionId();
  const session = createInitialState(sessionId);
  return NextResponse.json({
    status: 'ok',
    session: {
      ...session,
      ...body
    }
  });
}
