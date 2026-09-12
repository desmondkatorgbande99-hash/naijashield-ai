import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUp,
  CheckCircle,
  ChevronRight,
  Globe,
  Image as ImageIcon,
  Menu,
  MessageSquare,
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'NaijaShield AI | Nigerian Scam & Fraud Protection';
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="page">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="brand">
            <div className="brand-icon">
              <Shield size={22} />
            </div>
            <div className="brand-text">
              <span>NaijaShield</span>
              <strong>AI</strong>
            </div>
          </Link>

          <nav className={`desktop-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/analyze-message" onClick={closeMobileMenu}>
              Message Check
            </Link>
            <Link to="/check-link" onClick={closeMobileMenu}>
              Link Check
            </Link>
            <Link to="/scan-screenshot" onClick={closeMobileMenu}>
              Screenshot Scan
            </Link>
            <a href="#how-it-works" onClick={closeMobileMenu}>
              How It Works
            </a>
          </nav>

          <Link to="/analyze-message" className="nav-cta">
            <ShieldCheck size={16} />
            Check a Scam Now
          </Link>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              NIGERIA'S AI FRAUD DEFENSE
            </div>

            <h1>
              Stop scams before they <span>cost you.</span>
            </h1>

            <p className="hero-description">
              Verify suspicious SMS messages, WhatsApp job offers, fake bank alerts,
              deceptive links, and chat screenshots with intelligence tailored specifically
              to Nigerian scam patterns.
            </p>

            <div className="hero-actions">
              <Link to="/analyze-message" className="primary-button">
                Analyze a Message
                <ArrowRight size={17} />
              </Link>
              <Link to="/scan-screenshot" className="secondary-button">
                <ImageIcon size={17} />
                Scan a Screenshot
              </Link>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <CheckCircle size={15} />
                <span>100% Free to Use</span>
              </div>
              <div className="trust-item">
                <CheckCircle size={15} />
                <span>Zero Account Required</span>
              </div>
              <div className="trust-item">
                <CheckCircle size={15} />
                <span>Privacy-First Analysis</span>
              </div>
            </div>
          </div>

          {/* HERO VISUAL DEMO */}
          <div className="protection-visual">
            <div className="visual-glow visual-glow-one" />
            <div className="visual-glow visual-glow-two" />

            <div className="visual-card message-card">
              <div className="visual-card-header">
                <div className="visual-icon warning-icon">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <span className="visual-label">INCOMING SUSPICIOUS SMS</span>
                  <div className="visual-status">
                    <span /> Unverified sender
                  </div>
                </div>
              </div>

              <div className="message-preview">
                <p>
                  "URGENT: Your bank account will be blocked within 24 hours. Verify your account
                  immediately by clicking below..."
                </p>
                <div className="message-highlight">
                  Flagged: Credential Harvesting Phishing
                </div>
              </div>
            </div>

            <div className="analysis-connector">
              <div className="connector-line" />
              <div className="ai-badge">
                <ShieldCheck size={14} />
                <span>NAIJASHIELD ENGINE</span>
              </div>
              <div className="connector-line" />
            </div>

            <div className="visual-card risk-card">
              <div className="risk-top">
                <div className="risk-shield">
                  <ShieldAlert size={22} />
                </div>
                <div className="risk-heading">
                  <span>DETECTED THREAT</span>
                  <strong>Bank Impersonation</strong>
                </div>
                <div className="risk-score">
                  <strong>94</strong>
                  <span>/100</span>
                </div>
              </div>

              <div className="risk-indicators">
                <div><span>⚠️</span> Fake bank domain</div>
                <div><span>⏳</span> Fear & urgency tactics</div>
                <div><span>🛑</span> Do not share OTP/PIN</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE ANALYZER CARDS */}
      <section className="analyzers-section" id="analyzers">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-eyebrow">CHOOSE YOUR SHIELD</span>
            <h2>Three Ways to Verify</h2>
            <p>
              Scammers use multiple angles. NaijaShield gives you dedicated tools for
              messages, URLs, and conversation screenshots.
            </p>
          </div>

          <div className="analyzer-grid">
            {/* Card 1: Message */}
            <article className="analyzer-card">
              <div className="analyzer-card-top">
                <div className="analyzer-icon green">
                  <MessageSquare size={24} />
                </div>
                <span className="card-number">01</span>
              </div>
              <h3>Message Analyzer</h3>
              <p>
                Paste suspicious SMS text, WhatsApp job opportunities, fake Federal
                grants, or Ponzi investment promises to detect advance-fee scam markers.
              </p>
              <Link to="/analyze-message" className="card-action">
                Check a Message
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Card 2: Link */}
            <article className="analyzer-card">
              <div className="analyzer-card-top">
                <div className="analyzer-icon blue">
                  <Globe size={24} />
                </div>
                <span className="card-number">02</span>
              </div>
              <h3>Link Checker</h3>
              <p>
                Verify suspicious URLs before clicking. We inspect domain reputation,
                look-alike banking domains, and obscured short links.
              </p>
              <Link to="/check-link" className="card-action">
                Check a Website Link
                <ChevronRight size={16} />
              </Link>
            </article>

            {/* Card 3: Screenshot */}
            <article className="analyzer-card">
              <div className="analyzer-card-top">
                <div className="analyzer-icon purple">
                  <ImageIcon size={24} />
                </div>
                <span className="card-number">03</span>
              </div>
              <h3>Screenshot Scanner</h3>
              <p>
                Upload debit alerts, payment receipts, or entire chat conversations to
                visually inspect the interaction for inconsistencies and fraud hooks.
              </p>
              <Link to="/scan-screenshot" className="card-action">
                Scan a Screenshot
                <ChevronRight size={16} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-eyebrow">SIMPLE 3-STEP PROCESS</span>
            <h2>How NaijaShield Protects You</h2>
            <p>
              Fast, anonymous verification designed for everyday Nigerians on mobile or desktop.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step">
              <span className="step-number">STEP 01</span>
              <div className="step-icon">
                <MessageSquare size={20} />
              </div>
              <h3>Submit Content</h3>
              <p>
                Paste text, enter a link, or drag-and-drop a screenshot without needing an account.
              </p>
            </div>

            <div className="step-connector">
              <ArrowRight size={24} />
            </div>

            <div className="step">
              <span className="step-number">STEP 02</span>
              <div className="step-icon">
                <ShieldCheck size={20} />
              </div>
              <h3>AI Intelligence Scan</h3>
              <p>
                NaijaShield matches indicators against known Nigerian scam playbooks.
              </p>
            </div>

            <div className="step-connector">
              <ArrowRight size={24} />
            </div>

            <div className="step">
              <span className="step-number">STEP 03</span>
              <div className="step-icon">
                <CheckCircle size={20} />
              </div>
              <h3>Instant Risk Report</h3>
              <p>
                Get a clear 0–100 risk score with tailored, actionable recommendations on what to do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="disclaimer-section">
        <div className="container">
          <div className="disclaimer">
            <div className="disclaimer-icon">
              <Shield size={19} />
            </div>
            <div>
              <strong>Privacy & Safety Notice</strong>
              <p>
                NaijaShield AI analyzes submitted content strictly for scam detection.
                Never submit your banking OTP, ATM PIN, or account passwords.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
            {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="brand-text">
              <span>NaijaShield</span>
              <strong>AI</strong>
            </div>
            <p>Empowering Nigerians with artificial intelligence against digital fraud.</p>
          </div>

          <div className="footer-right">
            <span>Built for Nigeria 🇳🇬</span>
            <span>Privacy-First & Free</span>

            {/* FOOTER BACK TO TOP BUTTON */}
            <button
              type="button"
              className="footer-scroll-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll back to the top of the page"
            >
              <span>Back to top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;