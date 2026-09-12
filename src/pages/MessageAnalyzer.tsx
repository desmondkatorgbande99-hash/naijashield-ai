import { useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Flag,
  MessageSquare,
  Search,
  Sparkles,
} from 'lucide-react';

import LoadingAnalysis, {
  type LoadingStage,
} from '../components/analyzer/LoadingAnalysis';
import { analyzeMessageWithGemini } from '../services/gemini';

const MAX_LENGTH = 5000;

const EXAMPLES = [
  {
    label: 'Fake Job Offer',
    message:
      'Congratulations! You have been selected for a remote position at Shell Nigeria paying ₦450,000 monthly. To secure your onboarding slot and uniform, pay a ₦7,500 registration fee immediately to Account: 0123456789. Limited slots!',
  },
  {
    label: 'FG Grant Scam',
    message:
      'FEDERAL GOVERNMENT YOUTH EMPOWERMENT: Your application for the ₦500,000 presidential grant has been approved. Pay ₦2,500 processing charge immediately to disburse funds to your account.',
  },
  {
    label: 'Bank Phishing SMS',
    message:
      'URGENT ACCESS BANK: Your BVN has been flagged for deactivation due to incomplete KYC. Update your account immediately within 12 hours to avoid total restriction: https://access-bvn-update.com/login',
  },
  {
    label: 'Ponzi Investment',
    message:
      'Double your money in 45 minutes! Invest ₦20,000 and receive ₦40,000 directly to your bank account. 100% guaranteed with CAC registration. Send proof of payment on WhatsApp to start.',
  },
  {
    label: 'Safe Family Chat',
    message:
      'Good morning bro, hope you slept well. Please send me the document you mentioned yesterday when you get to the office.',
  },
];

const ANALYSIS_STAGES: LoadingStage[] = [
  { icon: Search, label: 'Examining language & urgency patterns' },
  { icon: BrainCircuit, label: 'Scanning for Nigerian fraud signatures' },
  { icon: Flag, label: 'Evaluating financial & credential demands' },
];

function MessageAnalyzer() {
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    if (value.length > MAX_LENGTH) {
      return;
    }

    setMessage(value);

    if (error) {
      setError('');
    }
  };

  const handleExampleClick = (exampleMessage: string) => {
    if (isAnalyzing) return;
    setMessage(exampleMessage);
    setError('');
  };

  const handleAnalyze = async () => {
    if (isAnalyzing) return;

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError('Please enter a message to analyze.');
      return;
    }

    if (trimmedMessage.length < 15) {
      setError(
        'Please provide a little more detail so NaijaShield can perform a thorough analysis.',
      );
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      console.log('Sending message to Gemini...');
      // 1. Trigger Live Gemini Analysis
      const liveResult = await analyzeMessageWithGemini(trimmedMessage);
      console.log('Gemini message analysis result:', liveResult);

      // 2. Navigate to Report with live AI result
      navigate('/report', {
        state: {
          type: 'message',
          content: trimmedMessage,
          result: liveResult,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze message. Please try again.';
      console.error('Gemini message analysis failed:', err);
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
            <div className="page-icon green">
              <MessageSquare size={25} />
            </div>

            <div>
              <span className="page-eyebrow">MESSAGE ANALYZER</span>
              <h1>Analyze a Suspicious Message</h1>
              <p>
                Paste a suspicious SMS, WhatsApp message, email, or social media offer.
                Gemini AI will inspect it against known Nigerian scam tactics.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="analyzer-main">
        <div className="container analyzer-container">
          <section className="analyzer-panel">
            {isAnalyzing ? (
              <LoadingAnalysis
                title="Analyzing Message with Gemini..."
                stages={ANALYSIS_STAGES}
                onComplete={() => {
                  // Navigation handled when Gemini promise resolves
                }}
              />
            ) : (
              <>
                <div className="panel-heading">
                  <h2>What message do you want to check?</h2>
                  <p>
                    Paste the suspicious text below. NaijaShield will identify red flags,
                    assess the risk tier, and provide safety guidance.
                  </p>
                </div>

                <textarea
                  className="message-textarea"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Paste a suspicious SMS, WhatsApp message, email, job offer, grant announcement, or investment proposal here..."
                  maxLength={MAX_LENGTH}
                  aria-label="Suspicious message"
                  aria-describedby={error ? 'message-error' : undefined}
                  aria-invalid={Boolean(error)}
                />

                <div className="textarea-footer">
                  <span className="character-count">
                    {message.length} / {MAX_LENGTH}
                  </span>

                  <span className="input-hint">
                    Never include passwords, PINs, or bank OTPs.
                  </span>
                </div>

                {error && (
                  <div className="input-error" id="message-error" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="examples">
                  <span>Try an example:</span>

                  <div className="example-list">
                    {EXAMPLES.map((example) => (
                      <button
                        key={example.label}
                        type="button"
                        className="example-chip"
                        onClick={() => handleExampleClick(example.message)}
                      >
                        {example.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="analyze-button"
                  onClick={handleAnalyze}
                >
                  <Sparkles size={18} />
                  Analyze Message with Gemini
                  <ArrowRight size={17} />
                </button>

                <div className="analyzer-notice">
                  <CheckCircle2 size={17} />
                  <p>
                    <strong>Stay protected.</strong> Genuine Nigerian banks and government
                    agencies will never ask you to pay an upfront fee to receive a job, grant,
                    or lottery prize.
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default MessageAnalyzer;