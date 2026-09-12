import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

function ScrollToTop() {
  const { pathname } = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 1. Automatic Reset: Instantly reset scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const rAF = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    return () => cancelAnimationFrame(rAF);
  }, [pathname]);

  // 2. Scroll Listener: Detect when user has scrolled down > 280px
  useEffect(() => {
    const handleScroll = () => {
      const scrollOffset =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (scrollOffset > 280) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Smooth visual glide to top when clicked
  const handleSmoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {showScrollTop && (
        <button
          type="button"
          className="floating-scroll-top-btn"
          onClick={handleSmoothScrollToTop}
          aria-label="Scroll back to top"
          title="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}

export default ScrollToTop;