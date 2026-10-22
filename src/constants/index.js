// Optimized constants index - all data is now split into focused modules
// This approach improves performance through code splitting and lazy loading

// Re-export from optimized split files
export { ourTechnologies, servicePartners, healthPakage } from './homepage';
export { branch, reportDownload } from './branches';
export { healthPackages } from './health';
export { topManagement } from './management';