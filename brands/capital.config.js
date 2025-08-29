// AI Capital Defender - North American Enterprise Configuration
export const brandConfig = {
  // Core Branding
  brand: 'capital',
  siteName: 'AI Capital Defender',
  domain: 'aicapitaldefender.com',
  logo: 'Capital Defender',
  tagline: '100x Faster Pentesting with AI',
  
  // Regional Settings
  language: 'en',
  region: 'North America',
  timezone: 'America/New_York',
  currency: 'USD',
  
  // Contact Information
  contact: {
    solutions: {
      phone: '+1 (888) 555-SCAN',
      email: 'solutions@aicapitaldefender.com'
    },
    support: {
      phone: '+1 (888) 555-HELP',
      email: 'success@aicapitaldefender.com'
    },
    emergency: {
      phone: '+1 (888) 911-HACK',
      email: 'incident@aicapitaldefender.com'
    }
  },
  
  // Trust Indicators
  trustMetrics: {
    clients: '15+ Enterprise Clients',
    clientTypes: 'Fortune 500 & Government',
    vulnerabilities: '2,847 AI Vulnerabilities Found',
    reportTime: '48hr Time to First Report',
    detection: '99.9% Threat Detection Rate',
    revenue: '$2.5M+ Revenue Pipeline',
    investment: 'Series A Investment Ready'
  },
  
  // Compliance & Certifications
  compliance: ['SOC 2 Type II', 'ISO 27001', 'HIPAA', 'PCI DSS', 'FedRAMP Ready'],
  
  // Testimonials
  testimonials: [
    {
      quote: "AI Capital Defender found critical vulnerabilities our traditional pentesters missed.",
      author: "CISO",
      company: "Fortune 500 Financial Services"
    },
    {
      quote: "Reduced our security assessment time from 6 weeks to 48 hours.",
      author: "VP Security",
      company: "Leading Healthcare Provider"
    }
  ],
  
  // Color Scheme
  colors: {
    primary: '#1e40af',      // Professional blue
    secondary: '#7c3aed',    // AI purple
    accent: '#06b6d4',       // Cyan
    gradient: 'linear-gradient(135deg, #1e40af, #7c3aed)',
    text: '#1f2937',
    background: '#ffffff'
  },
  
  // Features to Highlight
  features: {
    primary: [
      'AI-Powered Vulnerability Discovery',
      'Continuous Security Monitoring',
      'Automated Compliance Reporting',
      'Zero False Positives'
    ],
    industries: [
      'Financial Services',
      'Healthcare',
      'Technology',
      'Government'
    ]
  },
  
  // Pricing Display
  pricing: {
    starter: '$500/month',
    growth: '$2,500/month',
    scale: '$10,000/month',
    enterprise: 'Custom'
  },
  
  // Social Media
  social: {
    twitter: 'https://twitter.com/AICapitalDef',
    linkedin: 'https://linkedin.com/company/ai-capital-defender',
    github: 'https://github.com/ai-capital-defender'
  },
  
  // API Endpoints (if different)
  api: {
    base: 'https://api.aicapitaldefender.com',
    demo: '/api/pentest-demo',
    contact: '/api/submit-form'
  }
};

export default brandConfig;