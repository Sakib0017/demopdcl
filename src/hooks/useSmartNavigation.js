/**
 * useSmartNavigation Hook
 * AI-powered contextual navigation that adapts based on user behavior and page context
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useSmartNavigation = () => {
  const location = useLocation();
  const [userBehavior, setUserBehavior] = useState({
    frequentPages: [],
    lastVisitedPages: [],
    sessionStartTime: Date.now(),
    pageViews: {},
    preferredActions: [],
  });

  const [contextualActions, setContextualActions] = useState([]);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [visibleSuggestions, setVisibleSuggestions] = useState([]);
  const [pageNavigationTime, setPageNavigationTime] = useState(Date.now());

  // Track user behavior and navigation timing
  useEffect(() => {
    const currentPath = location.pathname;
    const timestamp = Date.now();

    // Reset navigation time and visible suggestions on page change
    setPageNavigationTime(timestamp);
    setVisibleSuggestions([]);

    setUserBehavior(prev => {
      const updatedPageViews = {
        ...prev.pageViews,
        [currentPath]: (prev.pageViews[currentPath] || 0) + 1,
      };

      const updatedLastVisited = [
        currentPath,
        ...prev.lastVisitedPages.filter(page => page !== currentPath).slice(0, 4)
      ];

      // Calculate frequent pages (visited more than 2 times)
      const frequentPages = Object.entries(updatedPageViews)
        .filter(([_, count]) => count > 2)
        .sort(([,a], [,b]) => b - a)
        .map(([page]) => page)
        .slice(0, 5);

      return {
        ...prev,
        pageViews: updatedPageViews,
        lastVisitedPages: updatedLastVisited,
        frequentPages,
      };
    });

    // Store in localStorage for persistence
    localStorage.setItem('pdcl_navigation_behavior', JSON.stringify({
      timestamp,
      path: currentPath,
    }));
  }, [location.pathname]);

  // Generate contextual actions based on current page
  const generateContextualActions = useCallback(() => {
    const currentPath = location.pathname;
    let actions = [];

    // Dynamic hotline action based on time and location
    const isOnHotlinesPage = currentPath === '/hotlines';
    const shouldShowCalling = emergencyMode || isOnHotlinesPage;
    
    actions.push({
      id: 'hotline',
      label: shouldShowCalling ? (emergencyMode ? '24/7 Emergency Support' : 'Medical Hotline') : 'Medical Hotline',
      icon: 'phone',
      ...(shouldShowCalling 
        ? { 
            href: 'tel:10636', // Direct call link
            external: true,
            type: 'emergency'
          }
        : { 
            to: '/hotlines', // Navigate to hotlines page
            type: 'primary'
          }
      ),
      priority: 'high',
      description: shouldShowCalling 
        ? (emergencyMode ? 'Immediate medical assistance available' : 'Call for medical consultation')
        : 'View hotline numbers and information',
    });

    // Page-specific contextual actions
    if (currentPath === '/') {
      // Homepage actions - The 3 most important actions
      actions.push(
        {
          id: 'report-download',
          label: 'Download Reports',
          icon: 'download',
          href: '/patient_portal',
          priority: 'high',
          type: 'primary',
          description: 'Access and download your medical reports'
        },
        {
          id: 'find-doctor',
          label: 'Find Doctor',
          icon: 'user-doctor',
          href: '/our-doctors',
          priority: 'high',
          type: 'primary',
          description: 'Search for doctors and consultants'
        },
        {
          id: 'book-appointment',
          label: 'Book Appointment',
          icon: 'calendar',
          href: 'https://appointment.populardiagnostic.com/appointment',
          priority: 'high',
          type: 'primary',
          external: true,
          description: 'Schedule your medical appointment online'
        }
      );
    } else if (currentPath.includes('/our-doctors')) {
      // Doctor pages - Next logical steps after finding a doctor
      actions.push(
        {
          id: 'book-appointment',
          label: 'Book Appointment',
          icon: 'calendar',
          href: 'https://appointment.populardiagnostic.com/appointment',
          priority: 'high',
          type: 'primary',
          external: true,
          description: 'Schedule appointment with selected doctor'
        },
        {
          id: 'find-branch',
          label: 'Find Branch',
          icon: 'map-pin',
          href: '/our-branches',
          priority: 'medium',
          type: 'secondary',
          description: 'Locate nearest branch for consultation'
        }
      );
    } else if (currentPath.includes('/our-branches')) {
      // Branch pages - Location-based services
      actions.push(
        {
          id: 'branch-hotlines',
          label: 'Branch Hotlines',
          icon: 'phone',
          href: '/hotlines',
          priority: 'high',
          type: 'primary',
          description: 'Get contact numbers for all branches'
        },
        {
          id: 'health-packages',
          label: 'Health Packages',
          icon: 'heart',
          href: '/health',
          priority: 'medium',
          type: 'secondary',
          description: 'Explore health packages for Dhanmondi'
        }
      );
    } else if (currentPath.includes('/health')) {
      // Health package pages - Dhanmondi specific
      actions.push(
        {
          id: 'book-health-appointment',
          label: 'Book Package',
          icon: 'calendar',
          href: 'https://appointment.populardiagnostic.com/appointment',
          priority: 'high',
          type: 'primary',
          external: true,
          description: 'Book your health package appointment'
        },
        {
          id: 'dhanmondi-branch',
          label: 'Dhanmondi Branch',
          icon: 'building',
          href: '/our-branches',
          priority: 'medium',
          type: 'secondary',
          description: 'Find Dhanmondi branch location and details'
        }
      );
    } else if (currentPath.includes('/patient_portal')) {
      // Patient portal - Report download related services
      actions.push(
        {
          id: 'support-complain',
          label: 'Need Support?',
          icon: 'question-circle',
          href: 'https://complain.populardiagnostic.com/',
          priority: 'high',
          type: 'primary',
          external: true,
          description: 'Submit complaints or get help'
        },
        {
          id: 'follow-up-appointment',
          label: 'Follow-up Appointment',
          icon: 'calendar',
          href: 'https://appointment.populardiagnostic.com/appointment',
          priority: 'medium',
          type: 'secondary',
          external: true,
          description: 'Book follow-up consultation'
        }
      );
    } else if (currentPath.includes('/hotlines')) {
      // Hotlines page - Emergency and appointment services
      actions.push(
        {
          id: 'online-appointment',
          label: 'Online Booking',
          icon: 'calendar',
          href: 'https://appointment.populardiagnostic.com/appointment',
          priority: 'high',
          type: 'primary',
          external: true,
          description: 'Book appointment online instead of calling'
        },
        {
          id: 'find-branches',
          label: 'All Branches',
          icon: 'building',
          href: '/our-branches',
          priority: 'medium',
          type: 'secondary',
          description: 'View all branch locations and services'
        }
      );
    }

    // Add frequent pages as quick actions
    userBehavior.frequentPages.slice(0, 2).forEach((page, index) => {
      if (page !== currentPath) {
        actions.push({
          id: `frequent-${index}`,
          label: getPageTitle(page),
          icon: 'star',
          href: page,
          priority: 'low',
          type: 'frequent',
        });
      }
    });

    // Sort by priority
    actions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return actions.slice(0, 6); // Limit to 6 actions to avoid overwhelming
  }, [location.pathname, userBehavior.frequentPages, emergencyMode]);

  // Helper function to get page titles
  const getPageTitle = (path) => {
    const pageTitles = {
      '/': 'Home',
      '/our-doctors': 'Find Doctors & Consultants',
      '/our-branches': 'Branch Locations',
      '/health': 'Health Packages (Dhanmondi)',
      '/patient_portal': 'Report Download',
      '/contact-us': 'Contact',
      '/about': 'About Us',
      '/hotlines': 'Branch Hotlines',
      'https://appointment.populardiagnostic.com/appointment': 'Book Appointment',
      'https://complain.populardiagnostic.com/': 'Submit Complaint & Feedback',
    };
    return pageTitles[path] || 'Page';
  };

  // Update contextual actions when dependencies change
  useEffect(() => {
    const actions = generateContextualActions();
    setContextualActions(actions);
  }, [generateContextualActions]);

  // Enhanced emergency detection for healthcare context
  const detectEmergencyContext = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // After-hours detection (7 AM to 11 PM, 7 days a week)
    const isAfterHours = currentHour < 7 || currentHour >= 23;
    // PDCL operates 7 days a week - no weekend emergency mode
    const isHoliday = checkIfHoliday(now); // Could be enhanced with actual holiday data
    
    // Page context detection
    const isEmergencyPage = location.pathname.includes('/hotlines') || 
                           location.pathname.includes('/emergency');
    
    // User behavior patterns (emergency indicators)
    const hasRepeatedVisits = userBehavior.pageViews[location.pathname] > 3;
    const quickNavigation = Date.now() - userBehavior.sessionStartTime < 2 * 60 * 1000; // Within 2 minutes
    
    // Enhanced emergency mode for healthcare (7 days operation)
    return isAfterHours || isHoliday || isEmergencyPage || (quickNavigation && hasRepeatedVisits);
  }, [location.pathname, userBehavior.pageViews, userBehavior.sessionStartTime]);

  // Basic holiday detection (can be enhanced with actual holiday API)
  const checkIfHoliday = (date) => {
    // Add basic holiday detection for Bangladesh
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Some major holidays in Bangladesh (can be expanded)
    const holidays = [
      { month: 2, day: 21 }, // International Mother Language Day
      { month: 3, day: 26 }, // Independence Day
      { month: 12, day: 16 }, // Victory Day
      // Add more holidays as needed
    ];
    
    return holidays.some(holiday => holiday.month === month && holiday.day === day);
  };

  useEffect(() => {
    setEmergencyMode(detectEmergencyContext());
  }, [detectEmergencyContext]);

  // Progressive suggestion revelation with staggered timing
  useEffect(() => {
    const allSuggestions = getSmartSuggestions();

    // Clear any existing timers
    setVisibleSuggestions([]);

    if (allSuggestions.length === 0) return;

    const timers = [];

    allSuggestions.forEach((suggestion, index) => {
      // Calculate delay based on priority and index
      let baseDelay;

      if (suggestion.type === 'emergency-care' || emergencyMode) {
        baseDelay = 500; // Emergency suggestions appear quickly
      } else if (suggestion.priority === 'high') {
        baseDelay = 3000 + Math.random() * 2000; // High priority after 3-5 seconds
      } else if (suggestion.priority === 'medium') {
        baseDelay = 3000 + Math.random() * 2000; // Medium priority after 3-5 seconds
      } else {
        baseDelay = 3000 + Math.random() * 2000; // Low priority after 3-5 seconds
      }

      // Add staggered delay between suggestions (5-7 seconds apart)
      const staggerDelay = index * (5000 + Math.random() * 2000); // 5-7 seconds random interval
      const totalDelay = baseDelay + staggerDelay;

      const timer = setTimeout(() => {
        setVisibleSuggestions(prev => {
          // Only add if not already visible and within limits
          if (!prev.find(s => s.action === suggestion.action)) {
            return [...prev, suggestion];
          }
          return prev;
        });
      }, totalDelay);

      timers.push(timer);
    });

    // Cleanup timers on unmount or dependency change
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [location.pathname, emergencyMode, pageNavigationTime]);

  // Track user actions for learning
  const trackAction = useCallback((actionId, actionType) => {
    setUserBehavior(prev => {
      const updatedActions = [...prev.preferredActions];
      const existingIndex = updatedActions.findIndex(a => a.id === actionId);
      
      if (existingIndex >= 0) {
        updatedActions[existingIndex].count += 1;
      } else {
        updatedActions.push({ id: actionId, type: actionType, count: 1 });
      }

      // Keep only top 10 preferred actions
      updatedActions.sort((a, b) => b.count - a.count);
      
      return {
        ...prev,
        preferredActions: updatedActions.slice(0, 10),
      };
    });
  }, []);

  // Helper function to check if an action leads to the current page
  const isCurrentPage = useCallback((actionPath, currentPath) => {
    // Normalize paths by removing trailing slashes and converting to lowercase
    const normalizePath = (path) => {
      if (!path || typeof path !== 'string') return '';
      // Handle external URLs
      if (path.startsWith('http') || path.startsWith('tel:') || path.startsWith('mailto:')) {
        return path; // Don't normalize external URLs
      }
      return path.toLowerCase().replace(/\/$/, '') || '/';
    };

    const normalizedAction = normalizePath(actionPath);
    const normalizedCurrent = normalizePath(currentPath);

    // Direct path match
    if (normalizedAction === normalizedCurrent) return true;

    // Handle branch page equivalents (e.g., /our-branches and specific branch pages)
    const branchPages = [
      '/our-branches', '/shantinagar', '/shyamoli', '/mirpur', '/uttarasector4',
      '/bogura', '/rangpur', '/badda', '/barishal', '/chattogram', '/dhanmondi',
      '/dinajpur', '/englishRoad', '/gazipur', '/jatrabari', '/khulna',
      '/kushtia', '/mymensingh', '/narayangonj', '/noakhali', '/rajshahi',
      '/savar', '/uttarasector13'
    ];

    // If both are branch-related pages, consider them equivalent
    if (branchPages.includes(normalizedAction) && branchPages.includes(normalizedCurrent)) {
      return true;
    }

    return false;
  }, []);

  // Get smart suggestions based on healthcare context and behavior
  const getSmartSuggestions = useCallback(() => {
    const suggestions = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentPath = location.pathname;
    
    // Context-aware suggestions based on current page
    switch (currentPath) {
      case '/':
        // Homepage suggestions - guide users to key services
        if (currentHour >= 7 && currentHour < 23) {
          suggestions.push({
            text: 'Book an appointment with our specialists',
            action: 'https://appointment.populardiagnostic.com/appointment',
            type: 'primary-service',
            priority: 'high'
          });
        }
        suggestions.push({
          text: 'Download your medical reports',
          action: '/patient_portal',
          type: 'primary-service',
          priority: 'medium'
        });
        suggestions.push({
          text: 'Find a doctor or consultant',
          action: '/our-doctors',
          type: 'healthcare-navigation',
          priority: 'medium'
        });
        break;

      case '/our-doctors':
        // Doctor page suggestions - next logical steps after finding a doctor
        suggestions.push({
          text: 'Book appointment with selected doctor',
          action: 'https://appointment.populardiagnostic.com/appointment',
          type: 'next-step',
          priority: 'high'
        });
        suggestions.push({
          text: 'Find nearest branch location',
          action: '/our-branches',
          type: 'location-service',
          priority: 'medium'
        });
        break;

      case '/our-branches':
        // Branch page suggestions - help with location-based services
        suggestions.push({
          text: 'Get branch hotline numbers',
          action: '/hotlines',
          type: 'contact-service',
          priority: 'high'
        });
        suggestions.push({
          text: 'Check health packages for Dhanmondi',
          action: '/health',
          type: 'service-info',
          priority: 'medium'
        });
        break;

      case '/health':
        // Health packages page - guide to booking
        suggestions.push({
          text: 'Book your health package appointment',
          action: 'https://appointment.populardiagnostic.com/appointment',
          type: 'booking-service',
          priority: 'high'
        });
        suggestions.push({
          text: 'Find Dhanmondi branch location',
          action: '/our-branches',
          type: 'location-service',
          priority: 'medium'
        });
        break;

      case '/patient_portal':
        // Report download page - additional services
        suggestions.push({
          text: 'Need help? Contact our support',
          action: 'https://complain.populardiagnostic.com/',
          type: 'support-service',
          priority: 'medium'
        });
        suggestions.push({
          text: 'Book follow-up appointment',
          action: 'https://appointment.populardiagnostic.com/appointment',
          type: 'follow-up',
          priority: 'medium'
        });
        break;

      case '/hotlines':
        // Hotlines page - emergency and appointment services
        if (emergencyMode || currentHour < 7 || currentHour >= 23) {
          suggestions.push({
            text: '24/7 emergency medical assistance',
            action: 'tel:10636',
            type: 'emergency-care',
            priority: 'high'
          });
        }
        suggestions.push({
          text: 'Book appointment online',
          action: 'https://appointment.populardiagnostic.com/appointment',
          type: 'online-service',
          priority: 'medium'
        });
        break;

      default:
        // General suggestions for other pages
        if (currentHour >= 7 && currentHour < 23) {
          suggestions.push({
            text: 'Book medical appointment',
            action: 'https://appointment.populardiagnostic.com/appointment',
            type: 'general-service',
            priority: 'medium'
          });
        }
        
        // Emergency mode suggestions
        if (emergencyMode) {
          suggestions.push({
            text: '24/7 emergency hotline available',
            action: '/hotlines',
            type: 'emergency-care',
            priority: 'high'
          });
        }
        break;
    }

    // Behavior-based suggestions (complement page-specific ones)
    if (userBehavior.frequentPages.includes('/patient_portal') && currentPath !== '/patient_portal') {
      suggestions.push({
        text: 'Quick access to your reports',
        action: '/patient_portal',
        type: 'frequent-access',
        priority: 'low'
      });
    }

    if (userBehavior.frequentPages.includes('/our-doctors') && currentPath !== '/our-doctors') {
      suggestions.push({
        text: 'Find your preferred doctor',
        action: '/our-doctors',
        type: 'frequent-access',
        priority: 'low'
      });
    }

    // Time-sensitive suggestions
    if (currentHour >= 22 || currentHour < 7) {
      suggestions.push({
        text: 'Submit feedback or complaints anytime',
        action: 'https://complain.populardiagnostic.com/',
        type: 'after-hours-service',
        priority: 'low'
      });
    }

    // Filter out suggestions that lead to the current page
    const filteredSuggestions = suggestions.filter(suggestion =>
      !isCurrentPage(suggestion.action, currentPath)
    );

    // Add fallback suggestions if too many were filtered out
    const addFallbackSuggestions = (filteredList) => {
      if (filteredList.length < 2) {
        const fallbackSuggestions = [
          {
            text: 'Explore our medical services',
            action: '/',
            type: 'fallback-navigation',
            priority: 'low'
          },
          {
            text: 'Find doctors & consultants',
            action: '/our-doctors',
            type: 'fallback-navigation',
            priority: 'low'
          },
          {
            text: 'Locate our branches',
            action: '/our-branches',
            type: 'fallback-navigation',
            priority: 'low'
          },
          {
            text: 'Download medical reports',
            action: '/patient_portal',
            type: 'fallback-navigation',
            priority: 'low'
          },
          {
            text: 'Contact our support team',
            action: '/contact-us',
            type: 'fallback-navigation',
            priority: 'low'
          }
        ];

        // Add fallback suggestions that don't lead to current page
        const validFallbacks = fallbackSuggestions.filter(fallback =>
          !isCurrentPage(fallback.action, currentPath)
        );

        return [...filteredList, ...validFallbacks].slice(0, 3);
      }
      return filteredList;
    };

    const finalSuggestions = addFallbackSuggestions(filteredSuggestions);

    // Sort by priority
    const sortedSuggestions = finalSuggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Dynamic suggestion count based on context
    const getSuggestionLimit = () => {
      const hasEmergency = sortedSuggestions.some(s => s.type === 'emergency-care');
      const hasMultipleHigh = sortedSuggestions.filter(s => s.priority === 'high').length > 1;

      // Special cases: Show up to 3 suggestions
      if (emergencyMode || hasEmergency || hasMultipleHigh) {
        return 3;
      }

      // Normal cases: Show 1-2 suggestions
      return Math.min(2, sortedSuggestions.length);
    };

    return sortedSuggestions.slice(0, getSuggestionLimit());
  }, [userBehavior.frequentPages, userBehavior.pageViews, location.pathname, emergencyMode, isCurrentPage]);

  return {
    contextualActions,
    emergencyMode,
    userBehavior,
    trackAction,
    getSmartSuggestions: visibleSuggestions, // Return visible suggestions instead of all suggestions
    allSuggestions: getSmartSuggestions(), // Keep all suggestions available for debugging
    isNewUser: userBehavior.sessionStartTime > Date.now() - 5 * 60 * 1000, // First 5 minutes
  };
};