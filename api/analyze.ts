/// <reference types="node" />

const GEMINI_MODEL = 'gemini-3.6-flash';

// Simple in-memory rate limiting: 25 requests per minute per IP
const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 25;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: 'Too many requests. Please wait a minute before analyzing again.',
    });
  }

  // Read secret API key from Vercel server environment
  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.error('GEMINI_API_KEY is not configured in server environment.');
    return res.status(500).json({
      error: 'Gemini API key is not configured on the server. Please add GEMINI_API_KEY in Vercel Environment Variables.',
    });
  }

  const payload = req.body;
  if (!payload || !payload.contents) {
    return res.status(400).json({ error: 'Invalid request body. "contents" array is required.' });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  try {
    const googleResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await googleResponse.json();
    return res.status(googleResponse.status).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Error forwarding to Gemini API:', message);
    return res.status(502).json({
      error: 'Upstream AI service is unreachable. Please try again in a few seconds.',
    });
  }
}
