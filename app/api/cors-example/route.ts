import { NextRequest, NextResponse } from 'next/server';
import { handleCors, withCors } from '@/lib/cors';

export async function GET(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  // Your API logic here
  const data = {
    message: 'CORS is working!',
    timestamp: new Date().toISOString(),
  };

  // Return response with CORS headers
  return withCors(NextResponse.json(data));
}

export async function POST(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    const body = await request.json();
    
    const data = {
      message: 'POST request received',
      receivedData: body,
      timestamp: new Date().toISOString(),
    };

    return withCors(NextResponse.json(data));
  } catch (error) {
    return withCors(
      NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200 });
} 