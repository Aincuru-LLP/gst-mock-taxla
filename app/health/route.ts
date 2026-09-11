import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'taxla-gst-mock',
    environment: 'demo',
    version: '1.0.0'
  });
}
