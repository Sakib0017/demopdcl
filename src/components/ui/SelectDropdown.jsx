import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable select dropdown component with consistent styling
 */
const SelectDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses = "block py-2.5 px-2 w-full text-sm md:text-base rounded-lg shadow-2xl border border-gray-300 hover:border-PDCL-green/50 focus:outline-none focus:ring-0 focus:border-PDCL-green text-gray-900 bg-white peer transition-all duration-200 touch-optimized";
  
  const combinedClasses = `${baseClasses} ${className} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={combinedClasses}
      // iOS-specific optimizations
      style={{ fontSize: '16px' }} // Prevent iOS zoom on focus
      autoComplete="off"
      {...props}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

SelectDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default SelectDropdown;