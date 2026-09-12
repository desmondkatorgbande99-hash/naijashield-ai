import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle,
  Copy,
  Download,
  Image as ImageIcon,
  Link as LinkIcon,
  MessageSquare,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { analyzeMessage, analyzeLink, analyzeScreenshot } from '../utils/mockAnalysis';
import type { ReportNavigationState, RiskLevel } from '../types/analysis';

const ANALYZER_ROUTES: Record<ReportNavigationState['type'], string> = {
  message: '/analyze-message',
  link: '/check-link',
  screenshot: '/scan-screenshot',
};

interface RiskThemeConfig {
  cardClass: string;
  icon: LucideIcon;
  badgeLabel: string;
}

const RISK_THEMES: Record<RiskLevel, RiskThemeConfig> = {
  LOW: {
    cardClass: 'risk-card-low',
    icon: ShieldCheck,
    badgeLabel: 'LOW RISK',
  },
  MODERATE: {
    cardClass: 'risk-card-moderate',
    icon: AlertCircle,
    badgeLabel: 'MODERATE RISK',
  },
  HIGH: {
    cardClass: 'risk-card-high',
    icon: AlertTriangle,
    badgeLabel: 'HIGH RISK',
  },
  CRITICAL: {
    cardClass: 'risk-card-critical',
    icon: ShieldAlert,
    badgeLabel: 'CRITICAL RISK',
  },
};

function Report() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as ReportNavigationState | null;
  const [copied, setCopied] = useState(false);
  const [reportId] = useState(() => Math.floor(100000 + Math.random() * 900000));

  useEffect(() => {
    if (!state?.content) {
      navigate('/analyze-message', { replace: true });
    }
  }, [state, navigate]);

  // Use the live AI result from state if available, otherwise fall back to local engine
  const result = useMemo(() => {
    if (!state?.content) return null;

    if (state.result) {
      return state.result;
    }

    if (state.type === 'link') return analyzeLink(state.content);
    if (state.type === 'screenshot') return analyzeScreenshot(state.content);
    return analyzeMessage(state.content);
  }, [state]);

  if (!state?.content || !result) {
    return null;
  }

  const analyzeAnotherPath = ANALYZER_ROUTES[state.type] ?? '/analyze-message';
  const normalizedLevel = (result.riskLevel?.toUpperCase() as RiskLevel) || 'MODERATE';
  const theme = RISK_THEMES[normalizedLevel] ?? RISK_THEMES.MODERATE;
  const RiskIcon = theme.icon;

  const indicators = result.indicators || [];
  const recommendations = result.recommendations || [];
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Generates the formatted text for WhatsApp & Social sharing
  const generateShareText = () => {
    const isSafe = normalizedLevel === 'LOW';
    const alertEmoji = isSafe ? '🟢' : normalizedLevel === 'CRITICAL' ? '🚨' : '⚠️';

    return (
      `${alertEmoji} *NAIJASHIELD AI SCAM CHECK* 🛡️\n\n` +
      `*Verdict:* ${normalizedLevel} RISK (${result.riskScore}/100)\n` +
      `*Category:* ${result.category}\n\n` +
      `*Summary:*\n"${result.riskSummary}"\n\n` +
      `*Key Safety Advice:*\n👉 ${recommendations[0] || 'Verify independently through official channels.'}\n\n` +
      `_Check suspicious messages, links & screenshots for free on NaijaShield AI 🇳🇬_`
    );
  };

  const handleShareToWhatsApp = () => {
    const text = generateShareText();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyWarning = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="page report-page-root">
      <header className="report-header">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="report-brand">
            <div className="brand-icon">
              <Shield size={21} />
            </div>

            <span>NaijaShield AI</span>
          </div>
        </div>
      </header>

      {/* PRINT-ONLY OFFICIAL CERTIFICATE HEADER */}
      <div className="print-certificate-header">
        <div className="print-badge">OFFICIAL FRAUD AUDIT REPORT</div>
        <h1>NaijaShield AI Cybersecurity Assessment</h1>
        <p>Verified on: {formattedDate} | ID: NS-{reportId}</p>
      </div>

      <main className="report-main">
        <div className="container report-container">
          <div className="report-heading">
            <span>NAIJASHIELD AI</span>
            <h1>Risk Report</h1>
            <p>Here's the security assessment generated from your submission.</p>
          </div>

          {/* SUBMITTED CONTENT BANNER */}
          <div className="submitted-banner">
            <div className="submitted-type">
              {state.type === 'message' && <MessageSquare size={13} />}
              {state.type === 'link' && <LinkIcon size={13} />}
              {state.type === 'screenshot' && <ImageIcon size={13} />}
              <span>
                {state.type === 'message'
                  ? 'Analyzed Message'
                  : state.type === 'link'
                  ? 'Analyzed Link'
                  : 'Analyzed Screenshot'}
              </span>
            </div>

            <div className="submitted-preview">
              <p>{state.content}</p>
            </div>
          </div>

          {/* DYNAMIC RISK CARD */}
          <section className={`risk-result-card ${theme.cardClass}`}>
            <div className="risk-result-icon">
              <RiskIcon size={32} />
            </div>

            <div className="risk-result-content">
              <span className="risk-badge-label">{theme.badgeLabel}</span>

              <h2>{normalizedLevel} RISK</h2>

              <p>{result.riskSummary}</p>
            </div>

            <div className="large-score">
              <strong>{result.riskScore ?? 50}</strong>
              <span>/100</span>
            </div>
          </section>

          {/* SHARE & DOWNLOAD ACTION BAR */}
          <section className="report-share-bar">
            <div className="share-bar-title">
              <Share2 size={16} />
              <span>Warn Family & Friends or Save Report</span>
            </div>

            <div className="share-bar-buttons">
              {/* WhatsApp Share Button */}
              <button
                type="button"
                className="share-button whatsapp"
                onClick={handleShareToWhatsApp}
                title="Share this report directly to WhatsApp"
              >
                <span className="whatsapp-dot">●</span>
                Share to WhatsApp
              </button>

              {/* Copy Warning Button */}
              <button
                type="button"
                className="share-button copy"
                onClick={handleCopyWarning}
                title="Copy warning text to clipboard"
              >
                {copied ? <Check size={15} color="#059669" /> : <Copy size={15} />}
                <span>{copied ? 'Copied Alert!' : 'Copy Warning'}</span>
              </button>

              {/* Download PDF / Print Button */}
              <button
                type="button"
                className="share-button download"
                onClick={handleDownloadPdf}
                title="Download this report as an official PDF certificate"
              >
                <Download size={15} />
                <span>Download PDF</span>
              </button>
            </div>
          </section>

          <section className="report-section">
            <span className="report-label">LIKELY SCAM CATEGORY</span>
            <h2>{result.category}</h2>
          </section>

          <section className="report-section">
            <div className="report-section-heading">
              <span className="report-label">DETECTED INDICATORS</span>
              <span className="indicator-count">{indicators.length} detected</span>
            </div>

            <div className="indicator-grid">
              {indicators.map((indicator, index) => (
                <Indicator
                  key={`${indicator.title}-${index}`}
                  title={indicator.title}
                  description={indicator.description}
                  riskLevel={normalizedLevel}
                />
              ))}
            </div>
          </section>

          <section className="ai-explanation">
            <div className="ai-explanation-header">
              <Shield size={19} />
              <h2>What NaijaShield AI Found</h2>
            </div>
            <p>{result.aiExplanation}</p>
          </section>

          <section className="recommendations">
            <span className="report-label">SAFETY RECOMMENDATIONS</span>
            <h2>What You Should Do</h2>

            <div className="recommendation-list">
              {recommendations.map((text, index) => (
                <Recommendation key={`${text}-${index}`} text={text} />
              ))}
            </div>
          </section>

          <div className="report-actions">
            <Link to={analyzeAnotherPath} className="secondary-button">
              Analyze Another
            </Link>

            <Link to="/" className="primary-button">
              Back to Home
            </Link>
          </div>

          <div className="report-disclaimer">
            <CheckCircle size={17} />
            <p>
              This assessment is powered by NaijaShield AI cybersecurity heuristics and does
              not constitute legal guarantee. When in doubt, verify information through certified institutions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

interface IndicatorProps {
  title: string;
  description: string;
  riskLevel: RiskLevel;
}

function Indicator({ title, description, riskLevel }: IndicatorProps) {
  const isSafe = riskLevel === 'LOW';

  return (
    <article className="indicator-card">
      <div className={`indicator-icon ${isSafe ? 'indicator-safe' : 'indicator-alert'}`}>
        {isSafe ? <ShieldCheck size={17} /> : <AlertTriangle size={17} />}
      </div>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}

interface RecommendationProps {
  text: string;
}

function Recommendation({ text }: RecommendationProps) {
  return (
    <div className="recommendation">
      <CheckCircle size={19} />
      <span>{text}</span>
    </div>
  );
}

export default Report;