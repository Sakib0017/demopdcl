import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * SearchSuggestions component with auto-complete functionality
 * Provides intelligent search suggestions and quick filters
 */
const SearchSuggestions = ({
  suggestions = [],
  quickFilters = [],
  onSuggestionSelect,
  onQuickFilterSelect,
  isVisible = false,
  currentTerm = '',
  className = '',
  maxSuggestions = 5,
  showQuickFilters = true,
}) => {
  const containerRef = useRef(null);
  
  // Auto-focus management
  useEffect(() => {
    if (isVisible && containerRef.current) {
      // Scroll suggestion into view if needed
      const firstSuggestion = containerRef.current.querySelector('[data-suggestion-item]');
      if (firstSuggestion) {
        firstSuggestion.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const limitedSuggestions = suggestions.slice(0, maxSuggestions);
  const hasContent = limitedSuggestions.length > 0 || (showQuickFilters && quickFilters.length > 0);

  if (!hasContent) return null;

  const highlightMatch = (text, term) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-PDCL-green/20 text-PDCL-green font-medium">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden mobile-dropdown ${className}`}
      role="listbox"
      aria-label="Search suggestions"
    >
      {/* Search History & Suggestions */}
      {limitedSuggestions.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50">
            {currentTerm ? 'Suggestions' : 'Recent Searches'}
          </div>
          <div className="max-h-48 overflow-y-auto ios-scroll">
            {limitedSuggestions.map((suggestion, index) => (
              <button
                key={index}
                data-suggestion-item
                onClick={() => onSuggestionSelect(suggestion)}
                className="w-full px-3 py-3 text-left hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-50 focus:outline-none transition-colors duration-150 border-b border-gray-50 last:border-b-0 touch-manipulation"
                role="option"
                aria-selected="false"
              >
                <div className="flex items-center space-x-3">
                  <svg 
                    className="w-4 h-4 text-gray-400 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    {currentTerm ? (
                      // Search icon for suggestions
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    ) : (
                      // History icon for recent searches
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  <span className="text-sm text-gray-900 flex-1">
                    {highlightMatch(suggestion, currentTerm)}
                  </span>
                  <svg 
                    className="w-4 h-4 text-gray-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l3-3 3 3m0 8l-3 3-3-3" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Filters */}
      {showQuickFilters && quickFilters.length > 0 && (
        <div>
          <div className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50">
            Quick Filters
          </div>
          <div className="p-3">
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => onQuickFilterSelect(filter)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-PDCL-green bg-PDCL-green/10 border border-PDCL-green/20 rounded-full hover:bg-PDCL-green/20 focus:outline-none focus:ring-2 focus:ring-PDCL-green/20 transition-colors duration-150 touch-manipulation"
                >
                  {filter.icon && (
                    <span className="mr-1.5">{filter.icon}</span>
                  )}
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer with keyboard hint */}
      <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span>Use ↑↓ to navigate, Enter to select</span>
          <span className="text-PDCL-green">ESC to close</span>
        </div>
      </div>
    </div>
  );
};

SearchSuggestions.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string),
  quickFilters: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
      icon: PropTypes.string,
    })
  ),
  onSuggestionSelect: PropTypes.func.isRequired,
  onQuickFilterSelect: PropTypes.func,
  isVisible: PropTypes.bool,
  currentTerm: PropTypes.string,
  className: PropTypes.string,
  maxSuggestions: PropTypes.number,
  showQuickFilters: PropTypes.bool,
};

export default SearchSuggestions;