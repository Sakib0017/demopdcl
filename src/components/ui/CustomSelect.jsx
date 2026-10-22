import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Mobile-optimized custom select dropdown with search functionality
 * Replaces native select for better mobile UX
 */
const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  disabled = false,
  className = "",
  searchable = true,
  showPopularFirst = false,
  popularOptions = [],
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter options based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setSearchTerm('');
  };

  const handleOptionSelect = (option) => {
    onChange({ target: { value: option.value } });
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedOption = options.find(opt => opt.value === value);

  // Group options for better mobile experience
  const organizedOptions = () => {
    if (!showPopularFirst || popularOptions.length === 0) {
      return [{ type: 'all', options: filteredOptions }];
    }

    const popular = filteredOptions.filter(opt => 
      popularOptions.includes(opt.value)
    );
    const regular = filteredOptions.filter(opt => 
      !popularOptions.includes(opt.value)
    );

    const groups = [];
    if (popular.length > 0) {
      groups.push({ type: 'popular', options: popular });
    }
    if (regular.length > 0) {
      groups.push({ type: 'regular', options: regular });
    }
    return groups;
  };

  const baseClasses = "relative w-full";
  const triggerClasses = `
    flex items-center justify-between w-full px-3 py-2.5 
    text-sm md:text-base rounded-lg border border-gray-300 
    bg-white hover:border-PDCL-green/50 focus:outline-none 
    focus:ring-0 focus:border-PDCL-green transition-all duration-200
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${isOpen ? 'border-PDCL-green ring-1 ring-PDCL-green/20' : ''}
    touch-manipulation select-none
  `;

  return (
    <div ref={dropdownRef} className={`${baseClasses} ${className}`} {...props}>
      {/* Trigger Button */}
      <div
        onClick={handleToggle}
        className={triggerClasses}
        style={{ fontSize: '16px' }} // Prevent iOS zoom
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden mobile-dropdown">
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-gray-100">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-PDCL-green focus:border-PDCL-green"
                style={{ fontSize: '16px' }} // Prevent iOS zoom
              />
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto max-h-60 ios-scroll">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                {searchTerm ? 'No matching options found' : 'No options available'}
              </div>
            ) : (
              organizedOptions().map((group, groupIndex) => (
                <div key={groupIndex}>
                  {/* Group Header */}
                  {showPopularFirst && group.type === 'popular' && (
                    <div className="px-3 py-2 text-xs font-semibold text-PDCL-green bg-green-50 border-b border-green-100">
                      Popular Branches
                    </div>
                  )}
                  {showPopularFirst && group.type === 'regular' && popularOptions.length > 0 && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-100">
                      All Branches
                    </div>
                  )}

                  {/* Options */}
                  {group.options.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleOptionSelect(option)}
                      className={`
                        px-3 py-3 cursor-pointer transition-colors duration-150
                        hover:bg-gray-50 active:bg-gray-100 border-b border-gray-50 last:border-b-0
                        ${value === option.value ? 'bg-PDCL-green/10 text-PDCL-green font-medium' : 'text-gray-900'}
                        touch-manipulation select-none
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{option.label}</span>
                        {value === option.value && (
                          <svg className="w-4 h-4 text-PDCL-green" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

CustomSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
  searchable: PropTypes.bool,
  showPopularFirst: PropTypes.bool,
  popularOptions: PropTypes.array,
};

export default CustomSelect;