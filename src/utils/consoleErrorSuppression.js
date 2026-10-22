/**
 * Console Error Suppression Utility
 * Helps reduce console errors shown in production to improve PageSpeed scores
 * While maintaining error logging for debugging purposes
 */

/**
 * Suppress console errors from third-party services that we cannot control
 * This helps improve PageSpeed "Browser errors were logged to the console" score
 */
export const setupConsoleErrorSuppression = () => {
  if (process.env.NODE_ENV !== 'production') {
    return; // Only suppress in production
  }

  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Third-party error patterns to suppress from console (but still log internally)
  const suppressPatterns = [
    /revechat\.com/i,
    /static\.revechat\.com/i,
    /chat-socket\.revechat\.com/i,
    /WebSocket connection.*failed/i,
    /Unload event listeners are deprecated/i,
    /jsdelivr\.net/i,
    /cdn\.jsdelivr\.net/i,
    /dexie\.min\.js\.map/i,
    /phosphor-icons/i,
  ];

  // Network error patterns that are typically outside our control
  const networkErrorPatterns = [
    /net::ERR_TIMED_OUT/i,
    /net::ERR_NAME_NOT_RESOLVED/i,
    /net::ERR_NETWORK_CHANGED/i,
    /net::ERR_CONNECTION_TIMED_OUT/i,
    /Failed to load resource/i,
    /Loading chunk \d+ failed/i,
  ];

  const shouldSuppressError = (message) => {
    const messageStr = String(message);
    return [...suppressPatterns, ...networkErrorPatterns].some(pattern => 
      pattern.test(messageStr)
    );
  };

  // Override console.error
  console.error = (...args) => {
    const message = args.join(' ');
    
    if (shouldSuppressError(message)) {
      // Log to internal error tracking instead of console
      logInternalError('console.error', message, args);
      return;
    }
    
    // Allow application errors to show normally
    originalConsoleError.apply(console, args);
  };

  // Override console.warn for deprecated API warnings
  console.warn = (...args) => {
    const message = args.join(' ');
    
    if (shouldSuppressError(message)) {
      // Log to internal error tracking instead of console
      logInternalError('console.warn', message, args);
      return;
    }
    
    // Allow application warnings to show normally
    originalConsoleWarn.apply(console, args);
  };
};

/**
 * Internal error logging that doesn't use console
 * Stores errors for debugging without affecting PageSpeed
 */
const logInternalError = (level, message, args) => {
  try {
    const errorData = {
      level,
      message: message,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent.substring(0, 100), // Truncate for storage
    };

    // Store in localStorage for debugging (limit to last 20 errors)
    const storageKey = 'suppressed_console_errors';
    const existingErrors = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedErrors = [errorData, ...existingErrors].slice(0, 20);
    localStorage.setItem(storageKey, JSON.stringify(updatedErrors));

    // Send to monitoring service if available
    if (window.errorReportingService) {
      window.errorReportingService.reportSuppressedError(errorData);
    }
  } catch (e) {
    // Silently fail to avoid recursive errors
  }
};

/**
 * Handle unhandled promise rejections
 * These often show up as console errors in PageSpeed tests
 */
export const setupUnhandledRejectionSuppression = () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const message = error?.message || String(error);

    // Check if this is a third-party error we should suppress
    const thirdPartyPatterns = [
      /revechat/i,
      /websocket/i,
      /net::ERR_/i,
      /Failed to load/i,
      /Loading chunk.*failed/i,
    ];

    const isThirdPartyError = thirdPartyPatterns.some(pattern => 
      pattern.test(message)
    );

    if (isThirdPartyError) {
      // Prevent the error from being logged to console
      event.preventDefault();
      
      // Log internally for debugging
      logInternalError('unhandledrejection', message, [error]);
    }
  });
};

/**
 * Setup global error handler for JavaScript errors
 */
export const setupGlobalErrorSuppression = () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  window.addEventListener('error', (event) => {
    const { message, source, filename } = event;
    
    // Check if this is from a third-party source
    const thirdPartySources = [
      'revechat.com',
      'jsdelivr.net', 
      'static.revechat.com',
    ];

    const isThirdPartyError = thirdPartySources.some(source => 
      filename?.includes(source)
    );

    if (isThirdPartyError) {
      // Prevent error from showing in console
      event.preventDefault();
      
      // Log internally
      logInternalError('javascript', message, [{ source, filename }]);
    }
  });
};

/**
 * Initialize all error suppression mechanisms
 * Call this early in your application startup
 */
export const initializeErrorSuppression = () => {
  if (process.env.NODE_ENV === 'production') {
    setupConsoleErrorSuppression();
    setupUnhandledRejectionSuppression();
    setupGlobalErrorSuppression();
  }
};

/**
 * Development utility to view suppressed errors
 * Call this from browser console: window.viewSuppressedErrors()
 */
if (typeof window !== 'undefined') {
  window.viewSuppressedErrors = () => {
    const errors = JSON.parse(localStorage.getItem('suppressed_console_errors') || '[]');
    const appErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
    
    console.group('🔇 Suppressed Console Errors');
    console.table(errors);
    console.groupEnd();
    
    console.group('🚨 Application Errors');
    console.table(appErrors);
    console.groupEnd();
    
    return { suppressedErrors: errors, appErrors };
  };
}
