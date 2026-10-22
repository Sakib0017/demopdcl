/**
 * Accessibility utilities for enhanced keyboard navigation and screen reader support
 * Phase 3 implementation for PDCL Search Component
 */

/**
 * Keyboard navigation constants
 */
export const KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  SPACE: ' ',
  HOME: 'Home',
  END: 'End',
};

/**
 * Screen reader announcements utility
 */
export class ScreenReaderAnnouncer {
  constructor() {
    this.liveRegion = null;
    this.politeRegion = null;
    this.createLiveRegions();
  }

  createLiveRegions() {
    // Assertive region for important announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'assertive');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.setAttribute('class', 'sr-only');
    this.liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(this.liveRegion);

    // Polite region for less urgent announcements
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.politeRegion.setAttribute('class', 'sr-only');
    this.politeRegion.style.cssText = this.liveRegion.style.cssText;
    document.body.appendChild(this.politeRegion);
  }

  announce(message, priority = 'polite') {
    const region = priority === 'assertive' ? this.liveRegion : this.politeRegion;
    if (region) {
      region.textContent = '';
      setTimeout(() => {
        region.textContent = message;
      }, 100);
    }
  }

  announceSearchResults(count, searchTerm) {
    const message = count === 0 
      ? `No results found for "${searchTerm}"`
      : `${count} result${count === 1 ? '' : 's'} found for "${searchTerm}"`;
    this.announce(message, 'polite');
  }

  announceSelection(selectedItem, index, total) {
    const message = `${selectedItem}, ${index + 1} of ${total}`;
    this.announce(message, 'polite');
  }

  cleanup() {
    if (this.liveRegion) {
      document.body.removeChild(this.liveRegion);
    }
    if (this.politeRegion) {
      document.body.removeChild(this.politeRegion);
    }
  }
}

/**
 * Keyboard navigation manager for dropdowns and lists
 */
export class KeyboardNavigationManager {
  constructor(options = {}) {
    this.options = {
      loop: true,
      homeEndEnabled: true,
      typeaheadEnabled: true,
      ...options
    };
    
    this.items = [];
    this.activeIndex = -1;
    this.typeaheadBuffer = '';
    this.typeaheadTimeout = null;
    this.announcer = new ScreenReaderAnnouncer();
  }

  setItems(items) {
    this.items = items;
    this.activeIndex = -1;
  }

  handleKeyDown(event, callbacks = {}) {
    const { key } = event;
    const {
      onSelect,
      onClose,
      onOpen,
      onNavigate,
    } = callbacks;

    switch (key) {
      case KEYS.ARROW_DOWN:
        event.preventDefault();
        this.navigateNext();
        if (onNavigate) onNavigate(this.activeIndex);
        break;

      case KEYS.ARROW_UP:
        event.preventDefault();
        this.navigatePrevious();
        if (onNavigate) onNavigate(this.activeIndex);
        break;

      case KEYS.HOME:
        if (this.options.homeEndEnabled) {
          event.preventDefault();
          this.navigateToFirst();
          if (onNavigate) onNavigate(this.activeIndex);
        }
        break;

      case KEYS.END:
        if (this.options.homeEndEnabled) {
          event.preventDefault();
          this.navigateToLast();
          if (onNavigate) onNavigate(this.activeIndex);
        }
        break;

      case KEYS.ENTER:
      case KEYS.SPACE:
        event.preventDefault();
        if (this.activeIndex >= 0 && onSelect) {
          onSelect(this.items[this.activeIndex], this.activeIndex);
        }
        break;

      case KEYS.ESCAPE:
        event.preventDefault();
        if (onClose) onClose();
        break;

      case KEYS.TAB:
        if (onClose) onClose();
        break;

      default:
        if (this.options.typeaheadEnabled && key.length === 1) {
          this.handleTypeahead(key, onNavigate);
        }
        break;
    }
  }

  navigateNext() {
    if (this.items.length === 0) return;
    
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
    } else if (this.options.loop) {
      this.activeIndex = 0;
    }
    
    this.announceCurrentItem();
  }

  navigatePrevious() {
    if (this.items.length === 0) return;
    
    if (this.activeIndex > 0) {
      this.activeIndex--;
    } else if (this.options.loop) {
      this.activeIndex = this.items.length - 1;
    }
    
    this.announceCurrentItem();
  }

  navigateToFirst() {
    if (this.items.length > 0) {
      this.activeIndex = 0;
      this.announceCurrentItem();
    }
  }

  navigateToLast() {
    if (this.items.length > 0) {
      this.activeIndex = this.items.length - 1;
      this.announceCurrentItem();
    }
  }

  handleTypeahead(char, onNavigate) {
    clearTimeout(this.typeaheadTimeout);
    this.typeaheadBuffer += char.toLowerCase();
    
    const matchIndex = this.items.findIndex((item, index) => 
      index > this.activeIndex && 
      this.getItemText(item).toLowerCase().startsWith(this.typeaheadBuffer)
    );
    
    if (matchIndex >= 0) {
      this.activeIndex = matchIndex;
      this.announceCurrentItem();
      if (onNavigate) onNavigate(this.activeIndex);
    }
    
    this.typeaheadTimeout = setTimeout(() => {
      this.typeaheadBuffer = '';
    }, 1000);
  }

  getItemText(item) {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      return item.label || item.name || item.text || String(item);
    }
    return String(item);
  }

  announceCurrentItem() {
    if (this.activeIndex >= 0 && this.activeIndex < this.items.length) {
      const currentItem = this.getItemText(this.items[this.activeIndex]);
      this.announcer.announceSelection(currentItem, this.activeIndex, this.items.length);
    }
  }

  reset() {
    this.activeIndex = -1;
    this.typeaheadBuffer = '';
    clearTimeout(this.typeaheadTimeout);
  }

  getCurrentItem() {
    return this.activeIndex >= 0 ? this.items[this.activeIndex] : null;
  }

  cleanup() {
    clearTimeout(this.typeaheadTimeout);
    this.announcer.cleanup();
  }
}

/**
 * Focus management utilities
 */
export class FocusManager {
  constructor() {
    this.previouslyFocused = null;
    this.focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');
  }

  trapFocus(container) {
    if (!container) return;

    const focusableElements = container.querySelectorAll(this.focusableSelectors);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event) => {
      if (event.key !== KEYS.TAB) return;

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  saveFocus() {
    this.previouslyFocused = document.activeElement;
  }

  restoreFocus() {
    if (this.previouslyFocused && this.previouslyFocused.focus) {
      this.previouslyFocused.focus();
      this.previouslyFocused = null;
    }
  }

  moveFocusToElement(element) {
    if (element && element.focus) {
      element.focus();
    }
  }

  getFocusableElements(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll(this.focusableSelectors));
  }
}

/**
 * ARIA utilities for better accessibility
 */
export const ariaUtils = {
  setExpanded(element, expanded) {
    if (element) {
      element.setAttribute('aria-expanded', expanded.toString());
    }
  },

  setSelected(element, selected) {
    if (element) {
      element.setAttribute('aria-selected', selected.toString());
    }
  },

  setActivedescendant(element, descendantId) {
    if (element) {
      if (descendantId) {
        element.setAttribute('aria-activedescendant', descendantId);
      } else {
        element.removeAttribute('aria-activedescendant');
      }
    }
  },

  associateLabel(input, labelId) {
    if (input && labelId) {
      input.setAttribute('aria-labelledby', labelId);
    }
  },

  setDescription(element, descriptionId) {
    if (element && descriptionId) {
      element.setAttribute('aria-describedby', descriptionId);
    }
  },

  setRole(element, role) {
    if (element) {
      element.setAttribute('role', role);
    }
  },

  setAutocomplete(element, value) {
    if (element) {
      element.setAttribute('aria-autocomplete', value);
    }
  }
};

/**
 * High contrast and preference detection
 */
export const accessibilityPreferences = {
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: high)').matches;
  },

  prefersDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  addMotionPreferenceListener(callback) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener(callback);
    return () => mediaQuery.removeListener(callback);
  }
};

// Global instance for screen reader announcements
export const globalAnnouncer = new ScreenReaderAnnouncer();