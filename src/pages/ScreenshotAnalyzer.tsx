import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Flag,
  Image as ImageIcon,
  ScanLine,
  Shield,
  Upload,
  X,
} from 'lucide-react';

import LoadingAnalysis, {
  type LoadingStage,
} from '../components/analyzer/LoadingAnalysis';
import { analyzeScreenshotWithGemini } from '../services/gemini';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_FILE_SIZE_MB = 8;

const ANALYSIS_STAGES: LoadingStage[] = [
  { icon: ImageIcon, label: 'Reading screenshot pixels' },
  { icon: ScanLine, label: 'Extracting text and logos with Gemini Vision' },
  { icon: BrainCircuit, label: 'Detecting scam indicators' },
  { icon: Flag, label: 'Applying Nigerian fraud intelligence' },
];

function ScreenshotAnalyzer() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const applyFile = (file: File) => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const isImage = /\.(png|jpe?g)$/i.test(fileName) || ACCEPTED_TYPES.includes(fileType);

    if (!isImage) {
      setError('Please upload a PNG or JPG/JPEG screenshot.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      applyFile(file);
    }
    event.target.value = '';
  };

  const handleChooseClick = () => {
    if (isAnalyzing) return;
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isAnalyzing) return;
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);

    if (isAnalyzing) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      applyFile(file);
    }
  };

  const handleRemoveScreenshot = () => {
    if (isAnalyzing) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (isAnalyzing) return;

    if (!selectedFile) {
      setError('Please upload a screenshot to analyze.');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      console.log('Sending screenshot to Gemini Vision...');
      // 1. Await the real Gemini Vision call directly
      const liveResult = await analyzeScreenshotWithGemini(selectedFile);
      console.log('Gemini Vision response received:', liveResult);

      // 2. Navigate immediately with the real AI result
      navigate('/report', {
        state: {
          type: 'screenshot',
          content: selectedFile.name,
          result: liveResult, // ✅ Direct AI result (no fallback!)
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze screenshot. Please try again.';
      console.error('Gemini Vision failed:', err);
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
            <div className="page-icon purple">
              <ImageIcon size={24} />
            </div>

            <div>
              <span className="page-eyebrow">SCREENSHOT ANALYZER</span>
              <h1>Scan a Suspicious Screenshot</h1>
              <p>
                Upload a screenshot of a debit alert, chat conversation, payment receipt,
                or job offer. Gemini Vision will read the text and inspect it for fraud.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="analyzer-main">
        <div className="container analyzer-container">
          <section className="analyzer-panel">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="visually-hidden-input"
              onChange={handleFileInputChange}
              aria-label="Choose screenshot file"
            />

            {isAnalyzing ? (
              <LoadingAnalysis
                title="Analyzing Screenshot with Gemini Vision..."
                stages={ANALYSIS_STAGES}
                onComplete={() => {
                  // The navigate is handled when Gemini finishes
                }}
              />
            ) : (
              <>
                {!selectedFile ? (
                  <div
                    className={`upload-area ${isDraggingOver ? 'drag-active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="upload-icon">
                      <ImageIcon size={30} />
                    </div>

                    <h2>Drop your screenshot here</h2>
                    <p>or</p>

                    <button
                      type="button"
                      className="upload-button"
                      onClick={handleChooseClick}
                    >
                      <Upload size={17} />
                      Choose Screenshot
                    </button>

                    <small>PNG • JPG • JPEG · up to {MAX_FILE_SIZE_MB}MB</small>
                  </div>
                ) : (
                  <div className="screenshot-preview">
                    <div className="preview-image-wrapper">
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Selected screenshot preview"
                          className="preview-image"
                        />
                      )}
                    </div>

                    <div className="preview-info">
                      <span className="preview-filename">{selectedFile.name}</span>
                      <span className="preview-status">Ready for AI Vision scan</span>
                    </div>

                    <div className="preview-actions">
                      <button
                        type="button"
                        className="preview-secondary-button"
                        onClick={handleChooseClick}
                      >
                        Change
                      </button>

                      <button
                        type="button"
                        className="preview-remove-button"
                        onClick={handleRemoveScreenshot}
                        aria-label="Remove screenshot"
                      >
                        <X size={15} />
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="input-error" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="button"
                  className="analyze-button"
                  onClick={handleAnalyze}
                  disabled={!selectedFile}
                >
                  <Shield size={18} />
                  Analyze Screenshot with Gemini Vision
                  <ArrowRight size={17} />
                </button>

                <div className="analyzer-notice">
                  <Shield size={17} />
                  <p>
                    <strong>Privacy-first AI vision.</strong> Your screenshot is processed
                    in memory to extract text and identify scam signatures. Avoid uploading
                    images showing your confidential PINs or full account passwords.
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

export default ScreenshotAnalyzer;