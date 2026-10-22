import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary component for catching and handling React component errors
 * Provides user-friendly error messages for healthcare organization context
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error information for debugging
    this.setState({
      error,
      errorInfo,
    });

    // Log to external service in production if needed
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // In production, avoid console.error to prevent PageSpeed console error penalties
    if (process.env.NODE_ENV === 'production') {
      // Store error silently for debugging without console noise
      try {
        const errorData = {
          message: error?.message || 'Unknown error',
          stack: error?.stack || 'No stack trace',
          componentStack: errorInfo?.componentStack || 'No component stack',
          componentName: this.props.componentName || 'Unknown component',
          timestamp: new Date().toISOString(),
          retryCount: this.state.retryCount,
        };
        
        // Store in localStorage for debugging (limit to last 10 errors)
        const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        const updatedErrors = [errorData, ...existingErrors].slice(0, 10);
        localStorage.setItem('app_errors', JSON.stringify(updatedErrors));
        
        // Send to monitoring service if available (without console logging)
        if (window.errorReportingService) {
          window.errorReportingService.reportError(errorData);
        }
      } catch (e) {
        // Silently fail if error logging fails to avoid additional console errors
      }
    } else {
      // Only log to console in development for debugging
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback, showDetails = false, componentName } = this.props;

      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-red-50 border-b border-red-200 px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.318 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Something went wrong
                  </h3>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              <div className="text-sm text-gray-600 mb-4">
                {componentName 
                  ? `There was an error loading the ${componentName} section.`
                  : 'We encountered an unexpected error. This may be a temporary issue.'
                }
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 bg-[#00984a] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#007a3d] focus:outline-none focus:ring-2 focus:ring-[#00984a] focus:ring-offset-2 transition-colors">
                  Try Again
                </button>
                <button
                  onClick={this.handleReload}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                  Reload Page
                </button>
              </div>

              {/* Retry count display for debugging */}
              {this.state.retryCount > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  Retry attempts: {this.state.retryCount}
                </div>
              )}

              {/* Error details for development */}
              {showDetails && process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-3 bg-gray-50 rounded border text-xs">
                  <summary className="cursor-pointer text-gray-700 font-medium">
                    Technical Details
                  </summary>
                  <div className="mt-2 text-gray-600">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-words">
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  showDetails: PropTypes.bool,
  componentName: PropTypes.string,
};

/**
 * Higher-order component to wrap components with error boundary
 * @param {Component} Component - Component to wrap
 * @param {string} componentName - Name for error display
 */
export const withErrorBoundary = (Component, componentName) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary componentName={componentName}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Simple error display component for API errors
 */
export const ApiErrorDisplay = ({ 
  error, 
  onRetry, 
  retryLabel = "Try Again",
  className = "" 
}) => {
  if (!error) return null;

  return (
    <div className={`text-center py-8 px-4 ${className}`}>
      <div className="max-w-sm mx-auto">
        <div className="text-red-500 mb-4">
          <svg
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Unable to load content
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-[#00984a] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#007a3d] focus:outline-none focus:ring-2 focus:ring-[#00984a] focus:ring-offset-2 transition-colors">
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
};

ApiErrorDisplay.propTypes = {
  error: PropTypes.string,
  onRetry: PropTypes.func,
  retryLabel: PropTypes.string,
  className: PropTypes.string,
};

export default ErrorBoundary;