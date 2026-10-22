import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure new route mounts at the top across browsers, especially iOS Safari
    const supportsScrollRestoration = typeof window !== "undefined" && "scrollRestoration" in window.history;
    const previousScrollRestoration = supportsScrollRestoration ? window.history.scrollRestoration : null;

    // Temporarily force manual restoration to avoid iOS restoring previous scroll
    if (supportsScrollRestoration) {
      try {
        window.history.scrollRestoration = "manual";
      } catch (_) {}
    }

    // Temporarily disable smooth behavior to avoid animated scroll from old position
    const htmlElement = document.documentElement;
    const previousBehavior = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = "auto";

    const hardScrollToTop = () => {
      // Multiple targets for cross-browser reliability
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      htmlElement.scrollTop = 0;
    };

    // Use double rAF to ensure it runs after paint/layout on route change (iOS quirk)
    requestAnimationFrame(() => {
      hardScrollToTop();
      requestAnimationFrame(() => {
        hardScrollToTop();

        // Restore original settings
        htmlElement.style.scrollBehavior = previousBehavior || "";
        if (supportsScrollRestoration && previousScrollRestoration) {
          try {
            window.history.scrollRestoration = previousScrollRestoration;
          } catch (_) {}
        } else if (supportsScrollRestoration) {
          try {
            window.history.scrollRestoration = "auto";
          } catch (_) {}
        }
      });
    });

    // No cleanup necessary; we restore within the rAF
  }, [pathname]);

  return null;
};

export default ScrollToTop;
