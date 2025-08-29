// Brand Configuration Loader
// Automatically loads the correct brand based on domain or environment variable

import capitalConfig from './capital.config.js';
import fronteraConfig from './frontera.config.js';

// Detect brand from domain or environment
export function detectBrand() {
  // Check environment variable first (for local development)
  if (typeof process !== 'undefined' && process.env?.BRAND) {
    return process.env.BRAND;
  }
  
  // Check domain in browser
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname.includes('frontera')) {
      return 'frontera';
    } else if (hostname.includes('capital')) {
      return 'capital';
    }
    
    // Default for localhost development
    const port = window.location.port;
    if (port === '3001') return 'frontera';
    if (port === '3000') return 'capital';
  }
  
  // Default brand
  return 'capital';
}

// Load brand configuration
export function loadBrandConfig(brandOverride = null) {
  const brand = brandOverride || detectBrand();
  
  switch(brand) {
    case 'frontera':
      return fronteraConfig;
    case 'capital':
    default:
      return capitalConfig;
  }
}

// Helper functions for brand-specific content
export function getBrandContent(key, brand = null) {
  const config = loadBrandConfig(brand);
  
  // Navigate nested keys (e.g., "contact.solutions.phone")
  const keys = key.split('.');
  let value = config;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  
  return value;
}

// Check if current brand is Frontera (for bilingual content)
export function isFrontera() {
  return detectBrand() === 'frontera';
}

// Get text in appropriate language
export function getText(enText, esText = null) {
  if (isFrontera() && esText) {
    // For Frontera, could return Spanish or bilingual
    return `${esText} | ${enText}`; // Bilingual format
  }
  return enText;
}

// Format currency based on brand
export function formatCurrency(amount, showBoth = false) {
  const brand = detectBrand();
  
  if (brand === 'frontera') {
    const mxn = amount * 20; // Approximate exchange rate
    if (showBoth) {
      return `$${amount.toLocaleString()} USD / $${mxn.toLocaleString()} MXN`;
    }
    return `$${amount.toLocaleString()} USD`;
  }
  
  return `$${amount.toLocaleString()}`;
}

// Get compliance badges for brand
export function getComplianceBadges() {
  const config = loadBrandConfig();
  return config.compliance;
}

// Export current brand config as default
const currentConfig = loadBrandConfig();
export default currentConfig;