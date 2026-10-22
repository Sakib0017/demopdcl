import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable search input component with consistent styling
 */
const SearchInput = forwardRef(({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
  inputMode = "search",
  autoComplete = "off",
  ...props
}, ref) => {
  const baseClasses = "block py-2.5 px-2 w-full text-sm md:text-base rounded-lg shadow-2xl border border-gray-300 hover:border-PDCL-green/50 focus:outline-none focus:ring-0 focus:border-PDCL-green text-gray-900 bg-white placeholder-gray-900 peer transition-all duration-200 touch-optimized";
  
  const combinedClasses = `${baseClasses} ${className} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

  return (
    <input
      ref={ref}
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={combinedClasses}
      // iOS-specific optimizations
      inputMode={inputMode}
      autoComplete={autoComplete}
      autoCapitalize="words"
      autoCorrect="on"
      spellCheck="true"
      // Prevent iOS zoom on focus
      style={{ fontSize: '16px' }}
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  inputMode: PropTypes.string,
  autoComplete: PropTypes.string,
};

export default SearchInput;