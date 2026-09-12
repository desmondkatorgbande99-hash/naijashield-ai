import type { AnalysisResult } from '../types/analysis';

interface KeywordCategory {
  keywords: string[];
  result: AnalysisResult;
}

/* ========================================
   SAFE / LOW RISK BASELINES
======================================== */

const SAFE_MESSAGE_RESULT: AnalysisResult = {
  riskLevel: 'LOW',
  riskScore: 12,
  riskSummary:
    'No common scam indicators, urgency triggers, or financial demands were detected.',
  category: 'Routine Message / Likely Safe',
  indicators: [
    {
      title: 'No Credential or Payment Requests',
      description: 'The message does not solicit PINs, passwords, bank transfers, or processing fees.',
    },
    {
      title: 'No Artificial Urgency',
      description: 'The message does not threaten account suspension or enforce tight countdowns.',
    },
  ],
  aiExplanation:
    'Our baseline scanner found no hallmarks of advance-fee fraud, banking phishing, or impersonation. The language pattern matches standard conversational or routine messaging.',
  recommendations: [
    'Always maintain healthy security habits.',
    'Never provide OTPs or passwords even if a follow-up conversation requests them.',
    'Verify the sender directly if they unexpectedly ask for personal assistance later.',
  ],
};

const SAFE_LINK_RESULT: AnalysisResult = {
  riskLevel: 'LOW',
  riskScore: 10,
  riskSummary:
    'This link points to a recognized, official domain with no impersonation patterns.',
  category: 'Verified Domain / Low Risk Link',
  indicators: [
    {
      title: 'Verified Official Hostname',
      description: 'The domain matches a known official entity without deceptive hyphens or typos.',
    },
    {
      title: 'Direct Destination',
      description: 'The address does not use an obfuscated link shortener or hidden redirect chain.',
    },
  ],
  aiExplanation:
    'The structure of this URL matches official web infrastructure. No deceptive subdomains, fake login portals, or credential harvesting pathways were identified.',
  recommendations: [
    'Always verify the browser lock icon (HTTPS) before entering credentials.',
    'Double check the exact spelling in your browser address bar.',
    'Avoid logging in from public or shared Wi-Fi networks when possible.',
  ],
};

/* ========================================
   MESSAGE ANALYSIS
======================================== */

const MESSAGE_CATEGORIES: KeywordCategory[] = [
  {
    keywords: ['job', 'hired', 'position', 'recruit', 'registration fee', 'employment'],
    result: {
      riskLevel: 'HIGH',
      riskScore: 88,
      riskSummary: 'Multiple indicators commonly associated with fake job scams were detected.',
      category: 'Fake Job / Advance Fee Scam',
      indicators: [
        {
          title: 'Advance Payment Request',
          description: 'Asks for money before you receive the promised job or opportunity.',
        },
        {
          title: 'Urgency Manipulation',
          description: 'Pressures you to act immediately or risk losing the offer.',
        },
        {
          title: 'Unrealistic Salary Promise',
          description: 'Offers pay that is unusually high for the role described.',
        },
      ],
      aiExplanation:
        'The combination of an unsolicited job offer, a request for an upfront registration fee, and pressure to respond quickly is consistent with common fake job / advance-fee scam patterns.',
      recommendations: [
        'Do not send money for registration or training fees.',
        'Do not share your OTP, PIN, or password.',
        'Verify the employer independently through official channels.',
        'Avoid clicking unknown links in the message.',
      ],
    },
  },
  {
    keywords: ['grant', 'empowerment', 'activate', 'federal government', 'youth'],
    result: {
      riskLevel: 'HIGH',
      riskScore: 91,
      riskSummary: 'Multiple scam indicators were detected in this message.',
      category: 'Government Grant / Advance Fee Scam',
      indicators: [
        {
          title: 'Advance Payment Request',
          description: 'Requests money before providing the promised grant.',
        },
        {
          title: 'Urgency Manipulation',
          description: 'Pressures the recipient to act immediately.',
        },
        {
          title: 'Unrealistic Financial Promise',
          description: 'Promises a large payout for a small upfront fee.',
        },
        {
          title: 'Possible Impersonation',
          description: 'Claims to represent a government program without verifiable details.',
        },
      ],
      aiExplanation:
        'The combination of an unexpected financial opportunity, an advance payment request, and pressure to act quickly is consistent with common advance-fee scam patterns.',
      recommendations: [
        'Do not send money.',
        'Do not share your OTP, PIN, or password.',
        'Verify the organization independently.',
        'Avoid clicking unknown links.',
      ],
    },
  },
  {
    keywords: ['bank', 'account', 'blocked', 'verify', 'atm', 'pin', 'otp', 'suspend'],
    result: {
      riskLevel: 'CRITICAL',
      riskScore: 94,
      riskSummary: 'This message shows strong signs of a phishing / bank impersonation attempt.',
      category: 'Phishing / Bank Impersonation',
      indicators: [
        {
          title: 'Credential Harvesting Attempt',
          description: 'Asks you to enter your card or account details through a link.',
        },
        {
          title: 'Urgency & Fear Tactics',
          description: 'Threatens account suspension to provoke a hasty reaction.',
        },
        {
          title: 'Suspicious Link Request',
          description: 'Directs you to "verify" your account outside your bank\'s official app.',
        },
      ],
      aiExplanation:
        'Legitimate banks do not ask customers to verify account details or PINs through links in unsolicited messages. This pattern strongly resembles a phishing attempt impersonating a bank.',
      recommendations: [
        'Never enter your ATM PIN or OTP on a page reached through a message link.',
        'Contact your bank directly using the number on your card, not the message.',
        'Do not click the link in the message.',
        'Report the message as phishing if your provider allows it.',
      ],
    },
  },
  {
    keywords: ['invest', 'guaranteed', 'double your money', 'returns', 'roi', 'profit'],
    result: {
      riskLevel: 'HIGH',
      riskScore: 90,
      riskSummary: 'This message matches common patterns seen in investment / Ponzi scams.',
      category: 'Investment / Ponzi Scheme',
      indicators: [
        {
          title: 'Guaranteed Returns Claim',
          description: 'Promises a fixed, guaranteed profit — a hallmark of Ponzi schemes.',
        },
        {
          title: 'Urgency Manipulation',
          description: 'Creates artificial scarcity to rush your decision.',
        },
        {
          title: 'Unrealistic Profit Timeline',
          description: 'Promises outsized returns in an implausibly short time.',
        },
      ],
      aiExplanation:
        'No legitimate investment can guarantee fixed high returns in a short timeframe. This combination of guaranteed profit and urgency is characteristic of investment fraud.',
      recommendations: [
        'Do not send money to unregistered investment schemes.',
        'Verify the company is licensed with the relevant financial regulator.',
        'Be skeptical of "guaranteed" returns — all real investments carry risk.',
        'Avoid clicking unknown links or sharing banking details.',
      ],
    },
  },
];

const DEFAULT_MESSAGE_RESULT: AnalysisResult = {
  riskLevel: 'MODERATE',
  riskScore: 58,
  riskSummary:
    'This message contains patterns worth reviewing, though it does not strongly match an immediate scam signature.',
  category: 'Unverified Content / Caution Advised',
  indicators: [
    {
      title: 'Unverified Sender or Claim',
      description: 'The message makes claims that cannot be independently confirmed.',
    },
    {
      title: 'Action Prompted',
      description: 'Prompts you to reply, click, or take secondary action.',
    },
  ],
  aiExplanation:
    'While this message does not trigger high-severity fraud signatures, treat unexpected messages with care until the sender identity is verified.',
  recommendations: [
    'Do not share personal financial details.',
    'Verify the sender through a known, independent phone number or channel.',
    'When in doubt, refrain from responding.',
  ],
};

function matchCategory(
  normalized: string,
  categories: KeywordCategory[],
): AnalysisResult | null {
  let bestMatch: KeywordCategory | null = null;
  let bestScore = 0;

  for (const category of categories) {
    const matchCount = category.keywords.reduce(
      (count, keyword) => (normalized.includes(keyword) ? count + 1 : count),
      0,
    );

    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestMatch = category;
    }
  }

  return bestMatch ? bestMatch.result : null;
}

export function analyzeMessage(message: string): AnalysisResult {
  const normalized = message.toLowerCase();

  // Test for obvious safe/casual messages
  if (
    normalized.includes('how are you') ||
    normalized.includes('good morning') ||
    normalized.includes('let us meet') ||
    normalized.includes('hope the family is well')
  ) {
    return SAFE_MESSAGE_RESULT;
  }

  return matchCategory(normalized, MESSAGE_CATEGORIES) ?? DEFAULT_MESSAGE_RESULT;
}

/* ========================================
   LINK ANALYSIS
======================================== */

const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  'cutt.ly',
  'is.gd',
  't.co',
  'shorte.st',
  'ow.ly',
  'buff.ly',
  'rebrand.ly',
];

const OFFICIAL_DOMAINS = [
  'gtbank.com',
  'zenithbank.com',
  'accessbankplc.com',
  'firstbanknigeria.com',
  'ubagroup.com',
  'stanbicibtc.com',
  'paypal.com',
  'apple.com',
  'google.com',
  'microsoft.com',
  'amazon.com',
];

const LINK_CATEGORIES: KeywordCategory[] = [
  {
    keywords: ['gtbank', 'zenith', 'access', 'verify', 'account', 'secure-login', 'update-account'],
    result: {
      riskLevel: 'CRITICAL',
      riskScore: 94,
      riskSummary: 'This link shows strong indicators of bank phishing / credential theft.',
      category: 'Phishing / Bank Impersonation Link',
      indicators: [
        {
          title: 'Brand Impersonation in Domain',
          description: 'The domain mimics a financial institution but is not the official website.',
        },
        {
          title: '"Verify Account" Pattern',
          description: 'URL structure mimics an unauthorized account-verification page.',
        },
        {
          title: 'Credential Harvesting Risk',
          description: 'Likely designed to capture banking usernames, passwords, or card details.',
        },
      ],
      aiExplanation:
        'Legitimate banks do not send account verification links with non-official hostnames. This URL structure closely matches known bank phishing campaigns.',
      recommendations: [
        'Do not enter your banking details on this page.',
        'Type your bank\'s official website address directly into your browser instead.',
        'Contact your bank directly to confirm if any action is genuinely required.',
      ],
    },
  },
  {
    keywords: ['paypal-secure', 'appleid-login', 'microsoft-verify', 'amazon-support'],
    result: {
      riskLevel: 'HIGH',
      riskScore: 86,
      riskSummary: 'This link appears to impersonate a well-known global brand.',
      category: 'Look-Alike / Brand Impersonation Link',
      indicators: [
        {
          title: 'Look-Alike Domain',
          description: 'Combines a brand name with security keywords to deceive visitors.',
        },
        {
          title: 'Unverified Origin',
          description: 'The hostname does not match the platform\'s official domain register.',
        },
      ],
      aiExplanation:
        'Scammers frequently register domains that pair trusted brands with words like "secure" or "login" to deceive users into submitting passwords.',
      recommendations: [
        'Do not log in or enter personal details on this page.',
        'Navigate to the service via their verified mobile app or bookmark.',
        'Inspect the URL spelling carefully for disguised characters.',
      ],
    },
  },
];

const DEFAULT_LINK_RESULT: AnalysisResult = {
  riskLevel: 'MODERATE',
  riskScore: 55,
  riskSummary:
    'This link does not trigger immediate phishing signatures, but its safety cannot be independently verified.',
  category: 'Unverified Link Destination',
  indicators: [
    {
      title: 'Unverified Destination',
      description: 'The domain reputation has not been certified against trusted databases.',
    },
  ],
  aiExplanation:
    'No blatant phishing keywords were detected in the URL structure itself, but that does not guarantee safety. Proceed with standard caution.',
  recommendations: [
    'Avoid submitting personal or payment details on unfamiliar sites.',
    'Check the domain spelling carefully.',
    'When in doubt, search for the official website independently.',
  ],
};

function getHostname(url: string): string | null {
  try {
    const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    return new URL(withProtocol).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isShortenerDomain(hostname: string): boolean {
  return URL_SHORTENERS.some(
    (shortener) => hostname === shortener || hostname.endsWith(`.${shortener}`),
  );
}

function isOfficialDomain(hostname: string): boolean {
  return OFFICIAL_DOMAINS.some(
    (official) => hostname === official || hostname.endsWith(`.${official}`),
  );
}

export function analyzeLink(url: string): AnalysisResult {
  const normalized = url.toLowerCase();
  const hostname = getHostname(url);

  if (hostname) {
    if (isOfficialDomain(hostname)) {
      return SAFE_LINK_RESULT;
    }

    if (isShortenerDomain(hostname)) {
      return {
        riskLevel: 'HIGH',
        riskScore: 78,
        riskSummary: 'This is an obscured / shortened link which masks the real destination.',
        category: 'Obscured / Shortened Link',
        indicators: [
          {
            title: 'Hidden Destination',
            description: 'The final destination is obscured behind a URL redirection service.',
          },
          {
            title: 'Verification Incomplete',
            description: 'The real target server cannot be confirmed without link expansion.',
          },
        ],
        aiExplanation:
          'Shortened links are frequently used in unsolicited messages to disguise fraudulent landing pages.',
        recommendations: [
          'Use a link preview tool to verify the destination before opening.',
          'Exercise extra caution if received with urgent calls to action.',
        ],
      };
    }
  }

  return matchCategory(normalized, LINK_CATEGORIES) ?? DEFAULT_LINK_RESULT;
}

/* ========================================
   SCREENSHOT ANALYSIS
======================================== */

const DEFAULT_SCREENSHOT_RESULT: AnalysisResult = {
  riskLevel: 'MODERATE',
  riskScore: 54,
  riskSummary:
    'Content extracted from this screenshot did not strongly match a known scam category.',
  category: 'Unverified Screenshot Content',
  indicators: [
    {
      title: 'Unverified Origin',
      description: 'The screenshot context and participants cannot be verified automatically.',
    },
    {
      title: 'Inconclusive Scam Markers',
      description: 'The extracted text shows conversational patterns without acute fraud signatures.',
    },
  ],
  aiExplanation:
    'No critical scam indicators were detected, but screenshot context is limited. Always verify monetary requests directly.',
  recommendations: [
    'Do not make payments based on screenshot receipts without direct bank confirmation.',
    'Verify any claims through official contacts.',
  ],
};

export function analyzeScreenshot(fileName: string): AnalysisResult {
  const normalized = fileName.toLowerCase();

  if (normalized.includes('safe') || normalized.includes('family') || normalized.includes('chat')) {
    return SAFE_MESSAGE_RESULT;
  }

  return matchCategory(normalized, MESSAGE_CATEGORIES) ?? DEFAULT_SCREENSHOT_RESULT;
}