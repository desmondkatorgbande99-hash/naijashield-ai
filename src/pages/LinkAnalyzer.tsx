import { useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Flag,
  Globe,
  Link as LinkIcon,
  LockKeyhole,
  Search,
} from 'lucide-react';

import LoadingAnalysis, {
  type LoadingStage,
} from '../components/analyzer/LoadingAnalysis';
import { analyzeLinkWithGemini } from '../services/gemini';

const EXAMPLES = [
  {
    label: 'Suspicious Bank Link',
    url: 'https://gtbank-verify-account.com/login',
  },
  {
    label: 'Brand Look-Alike',
    url: 'https://www.paypal-secure-portal.com',
  },
  {
    label: 'Shortened Link',
    url: 'https://bit.ly/3xK9offer',
  },
  {
    label: 'Official Bank (Safe)',
    url: 'https://www.gtbank.com',
  },
];

const ANALYSIS_STAGES: LoadingStage[] = [
  { icon: Search, label: 'Parsing URL protocol & domain structure' },
  { icon: Globe, label: 'Checking brand impersonation & reputation patterns' },
  { icon: Flag, label: 'Applying Nigerian phishing intelligence' },
];

function isLikelyValidUrl(value: string): boolean {
  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const parsed = new URL(withProtocol);
    return parsed.hostname.includes('.');
  } catch {
    return false;
  }
}

function LinkAnalyzer() {
  const navigate = useNavigate();

  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);

    if (error) {
      setError('');
    }
  };

  const handleExampleClick = (exampleUrl: string) => {
    if (isAnalyzing) return;
    setUrl(exampleUrl);
    setError('');
  };

  const handleCheck = async () => {
    if (isAnalyzing) return;

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('Please enter a website link to check.');
      return;
    }

    if (!isLikelyValidUrl(trimmedUrl)) {
      setError('Please enter a valid website link (e.g., example.com or https://site.ng).');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      console.log('Sending URL to Gemini for inspection...');
      // 1. Trigger Live Gemini Link Analysis
      const liveResult = await analyzeLinkWithGemini(trimmedUrl);
      console.log('Gemini URL analysis result:', liveResult);

      // 2. Navigate to Report with live AI result
      navigate('/report', {
        state: {
          type: 'link',
          content: trimmedUrl,
          result: liveResult,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to inspect link. Please try again.';
      console.error('Gemini link analysis failed:', err);
      setError(message);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="page">
      <header className="analyzer-header">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="page-title">
            <div className="page-icon blue">
              <LinkIcon size={24} />
            </div>

            <div>
              <span className="page-eyebrow">LINK ANALYZER</span>
              <h1>Check a Suspicious Link</h1>
              <p>
                Paste a website address below. Gemini AI inspects its structure,
                brand look-alike markers, and known phishing indicators.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="analyzer-main">
        <div className="container analyzer-container">
          <section className="analyzer-panel link-panel">
            {isAnalyzing ? (
              <LoadingAnalysis
                title="Inspecting Link with Gemini..."
                stages={ANALYSIS_STAGES}
                onComplete={() => {
                  // Navigation handled when Gemini promise resolves
                }}
              />
            ) : (
              <>
                <div className="panel-heading">
                  <h2>Website URL</h2>
                  <p>Check any link before clicking or entering passwords.</p>
                </div>

                <div className="url-input-wrapper">
                  <LinkIcon size={19} />

                  <input
                    type="text"
                    inputMode="url"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="https://example.com or bit.ly/..."
                    aria-label="Website URL"
                    aria-describedby={error ? 'link-error' : undefined}
                    aria-invalid={Boolean(error)}
                  />
                </div>

                {error && (
                  <div className="input-error" id="link-error" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="link-safety-notice">
                  <LockKeyhole size={18} />
                  <p>
                    <strong>Safe inspection.</strong> You do not need to open or visit the
                    website. NaijaShield analyzes the domain structure safely in an isolated environment.
                  </p>
                </div>

                <div className="examples">
                  <span>Try an example:</span>

                  <div className="example-list">
                    {EXAMPLES.map((example) => (
                      <button
                        key={example.label}
                        type="button"
                        className="example-chip"
                        onClick={() => handleExampleClick(example.url)}
                      >
                        {example.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="analyze-button"
                  onClick={handleCheck}
                >
                  <Search size={18} />
                  Inspect Link with Gemini
                  <ArrowRight size={17} />
                </button>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default LinkAnalyzer;