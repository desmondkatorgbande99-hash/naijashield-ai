import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ScrollToTop from './components/common/ScrollToTop';
import Home from './pages/Home';
import MessageAnalyzer from './pages/MessageAnalyzer';
import LinkAnalyzer from './pages/LinkAnalyzer';
import ScreenshotAnalyzer from './pages/ScreenshotAnalyzer';
import Report from './pages/Report';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app">
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Three Dedicated Analyzers */}
          <Route path="/analyze-message" element={<MessageAnalyzer />} />
          <Route path="/check-link" element={<LinkAnalyzer />} />
          <Route path="/scan-screenshot" element={<ScreenshotAnalyzer />} />

          {/* Unified Report Page */}
          <Route path="/report" element={<Report />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;