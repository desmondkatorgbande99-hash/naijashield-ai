import type { AnalysisResult } from '../types/analysis';

const GEMINI_MODEL = 'gemini-3.6-flash';

/* ========================================
   SPECIALIZED NIGERIAN FRAUD INTELLIGENCE PROMPT
======================================== */
const SYSTEM_INSTRUCTION = `
You are NaijaShield AI, Nigeria's premier cybersecurity intelligence engine specialized in analyzing suspicious messages, links, and screenshots for scams and financial fraud.

Your mission:
1. Recognize legitimate Nigerian banking debit/credit alerts (Union Bank, GTBank, Zenith, Access, FirstBank, UBA, OPAY, Palmpay, Kuda).
   - Legitimate alerts show: Account masking (e.g. 004****321), Amount (NGN / ₦), Date/Time, Reference, and Available Balance.
   - Legitimate alerts DO NOT contain cancellation links or urge customers to call cell numbers to "reverse" charges. If an alert has no phishing hooks, mark it as LOW RISK (5-15%).
2. Detect Nigerian cyberfraud patterns:
   - Fake job offers requiring registration fees or interview processing money.
   - Fake Federal Government grants (Youth Empowerment, Survival Fund) requiring an "activation fee".
   - Bank phishing links or SMS threatening account blocking or BVN/NIN deactivation.
   - Ponzi schemes promising "double your money in 45 minutes / 7 days".
   - Impersonation on WhatsApp/Telegram asking for urgent family assistance.
   - Fake transfer receipts and altered mobile screenshots.

CRITICAL: You MUST respond ONLY with a raw JSON object (no markdown, no backticks) matching this schema:
{
  "riskLevel": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "riskScore": <integer between 0 and 100>,
  "riskSummary": "<concise 1-2 sentence executive summary>",
  "category": "<clear classification, e.g. Legitimate Debit Alert, Bank Phishing, Fake Job Scam>",
  "indicators": [
    {
      "title": "<Indicator Name>",
      "description": "<Detailed explanation of what was found or why it is safe>"
    }
  ],
  "aiExplanation": "<2-3 sentence clear explanation tailored to a Nigerian audience, citing specific elements observed>",
  "recommendations": [
    "<Actionable step 1>",
    "<Actionable step 2>",
    "<Actionable step 3>"
  ]
}
`;

function normalizeMimeType(type: string): string {
  const lower = (type || '').toLowerCase();
  if (lower === 'image/jpg' || lower === 'jpg') return 'image/jpeg';
  if (['image/jpeg', 'image/png', 'image/webp'].includes(lower)) return lower;
  return 'image/jpeg';
}

function extractJsonString(raw: string): string {
  let cleaned = raw.trim();

  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned.trim();
}

export function fileToBase64(file: File): Promise<{ mimeType: string; data: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({
        mimeType: normalizeMimeType(file.type),
        data: base64Data,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Calls Gemini with automatic retries for transient "high demand" errors
 */
async function callGemini(contents: any[], retryCount = 0): Promise<AnalysisResult> {
  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
    },
  };

  const clientKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();

  let response: Response;
  try {
    // 1. Primary path: Route through secure serverless proxy (/api/analyze)
    // This keeps the Gemini API key hidden from Chrome DevTools / Network tab
    response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // 2. Local dev fallback: If running Vite dev server without Vercel serverless CLI,
    // fall back to direct Google call if a local key is present in .env
    if (
      (response.status === 404 || response.status === 405) &&
      clientKey &&
      clientKey !== 'your_gemini_api_key_here'
    ) {
      const directEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${clientKey}`;
      response = await fetch(directEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
  } catch (networkErr: unknown) {
    if (clientKey && clientKey !== 'your_gemini_api_key_here') {
      const directEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${clientKey}`;
      response = await fetch(directEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      const msg = networkErr instanceof Error ? networkErr.message : String(networkErr);
      throw new Error(`Network error communicating with AI service: ${msg}`, {
        cause: networkErr,
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const apiMessage =
      typeof errorData?.error === 'string'
        ? errorData.error
        : errorData?.error?.message || '';
    const status = response.status;

    // Check if the server is busy / experiencing high demand
    const isHighDemand =
      status === 503 ||
      status === 429 ||
      apiMessage.toLowerCase().includes('high demand') ||
      apiMessage.toLowerCase().includes('overloaded') ||
      apiMessage.toLowerCase().includes('too many requests');

    // Automatic retry (up to 2 times with a 2-second pause)
    if (isHighDemand && retryCount < 2) {
      console.warn(`Gemini busy (attempt ${retryCount + 1}). Retrying in 2 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return callGemini(contents, retryCount + 1);
    }

    if (isHighDemand) {
      throw new Error(
        apiMessage ||
          'Google AI servers are currently busy with high traffic. Please tap Analyze again in a few seconds.',
      );
    }

    if (status === 400 && apiMessage.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API key. Please check your key at https://aistudio.google.com/app/apikey.');
    }

    throw new Error(apiMessage || `AI Error (HTTP ${status}): ${response.statusText}`);
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0];

  if (!candidate) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }

  if (candidate.finishReason === 'SAFETY') {
    throw new Error('The submitted content was blocked by safety filters.');
  }

  const rawText = candidate?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini did not return any text in the analysis.');
  }

  try {
    const jsonString = extractJsonString(rawText);
    const parsed = JSON.parse(jsonString) as AnalysisResult;
    return parsed;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Failed to parse Gemini JSON:', rawText);

    throw new Error(`AI returned invalid format: ${message}`, { cause: err });
  }
}

/* ========================================
   PUBLIC ANALYSIS METHODS
======================================== */

export async function analyzeMessageWithGemini(message: string): Promise<AnalysisResult> {
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Analyze this message received by a Nigerian user:\n\n"""\n${message}\n"""`,
        },
      ],
    },
  ];

  return callGemini(contents);
}

export async function analyzeLinkWithGemini(url: string): Promise<AnalysisResult> {
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Analyze this link URL for phishing, brand impersonation, or obfuscation:\n\nURL: ${url}`,
        },
      ],
    },
  ];

  return callGemini(contents);
}

export async function analyzeScreenshotWithGemini(file: File): Promise<AnalysisResult> {
  const imagePart = await fileToBase64(file);

  const contents = [
    {
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: imagePart.mimeType,
            data: imagePart.data,
          },
        },
        {
          text: 'Inspect all visible text, logos, headers, balances, and links in this screenshot. Determine whether this is a genuine bank alert, legitimate conversation, or a fraudulent scam/phishing attempt.',
        },
      ],
    },
  ];

  return callGemini(contents);
}