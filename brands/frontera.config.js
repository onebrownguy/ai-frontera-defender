// AI Frontera Defender - Southern/Latin American Configuration
export const brandConfig = {
  // Core Branding
  brand: 'frontera',
  siteName: 'AI Frontera Defender',
  domain: 'aifronteradefender.com',
  logo: 'Frontera Defender',
  tagline: 'Seguridad AI en la Frontera Digital | AI Security at the Digital Border',
  
  // Regional Settings
  language: 'es-en', // Bilingual
  region: 'Texas & México',
  timezone: 'America/Mexico_City',
  currency: 'USD/MXN',
  
  // Contact Information - Texas/Border focused
  contact: {
    solutions: {
      phone: '+1 (956) 555-SAFE', // Laredo area code
      phoneAlt: '+52 (81) 5555-7233', // Monterrey, Mexico
      email: 'soluciones@aifronteradefender.com'
    },
    support: {
      phone: '+1 (915) 555-HELP', // El Paso area code
      phoneAlt: '+52 (55) 5555-4357', // Mexico City
      email: 'soporte@aifronteradefender.com'
    },
    emergency: {
      phone: '+1 (210) 911-HACK', // San Antonio area code
      phoneAlt: '+52 (81) 9111-4225',
      email: 'incidente@aifronteradefender.com'
    }
  },
  
  // Trust Indicators - Regional focus
  trustMetrics: {
    clients: '50+ Maquiladoras',
    clientTypes: 'Empresas Fronterizas | Border Enterprises',
    vulnerabilities: '3,521 Vulnerabilidades Detectadas',
    reportTime: '24hr Respuesta Rápida',
    detection: '99.9% Detección de Amenazas',
    revenue: '$8.5M+ MXN Pipeline',
    investment: 'Serie A Ready'
  },
  
  // Compliance & Certifications - Mexican and US standards
  compliance: [
    'NOM-151-SCFI', // Mexican data protection
    'LFPDPPP', // Mexican Federal Law on Protection of Personal Data
    'SOC 2 Type II',
    'ISO 27001',
    'CCPA', // California
    'TXPPA' // Texas Privacy Protection Act
  ],
  
  // Bilingual Testimonials
  testimonials: [
    {
      quote: "AI Frontera Defender protege nuestras operaciones en ambos lados de la frontera.",
      translation: "AI Frontera Defender protects our operations on both sides of the border.",
      author: "Director de TI",
      company: "Maquiladora Fortune 500"
    },
    {
      quote: "Reduced cross-border cyber threats by 87% in just 3 months.",
      translation: "Redujo las amenazas cibernéticas transfronterizas en un 87% en solo 3 meses.",
      author: "CISO",
      company: "Texas Manufacturing Corp"
    },
    {
      quote: "Cumplimiento perfecto con NOM-151 y SOC 2. Impresionante.",
      translation: "Perfect compliance with NOM-151 and SOC 2. Impressive.",
      author: "Gerente de Cumplimiento",
      company: "Grupo Industrial Monterrey"
    }
  ],
  
  // Color Scheme - Warmer, regional colors
  colors: {
    primary: '#dc2626',      // Warm red (energy)
    secondary: '#ea580c',    // Orange (sunset)
    accent: '#16a34a',       // Green (prosperity)
    gradient: 'linear-gradient(135deg, #dc2626, #ea580c)',
    text: '#1f2937',
    background: '#fffbf0'    // Warm white
  },
  
  // Features to Highlight - Bilingual
  features: {
    primary: [
      'Protección AI Bilingüe | Bilingual AI Protection',
      'Monitoreo 24/7 en Español e Inglés',
      'Cumplimiento NOM-151 & SOC 2',
      'Soporte Local en la Frontera'
    ],
    industries: [
      'Maquiladoras',
      'Manufactura | Manufacturing',
      'Logística Transfronteriza',
      'Comercio Internacional',
      'Tecnología Nearshore'
    ]
  },
  
  // Regional Value Props
  regionalBenefits: [
    {
      es: 'Equipo local que entiende la frontera',
      en: 'Local team that understands the border'
    },
    {
      es: 'Reportes en español e inglés',
      en: 'Reports in Spanish and English'
    },
    {
      es: 'Precios en USD y MXN',
      en: 'Pricing in USD and MXN'
    },
    {
      es: 'Cumplimiento mexicano y estadounidense',
      en: 'Mexican and US compliance'
    }
  ],
  
  // Pricing Display - Regional pricing
  pricing: {
    starter: '$500 USD / $10,000 MXN mes',
    growth: '$2,500 USD / $50,000 MXN mes',
    scale: '$10,000 USD / $200,000 MXN mes',
    enterprise: 'Cotización Personalizada | Custom Quote'
  },
  
  // Social Media - Regional presence
  social: {
    twitter: 'https://twitter.com/AIFronteraDef',
    linkedin: 'https://linkedin.com/company/ai-frontera-defender',
    facebook: 'https://facebook.com/AIFronteraDefender' // More popular in Mexico
  },
  
  // Partner Logos
  partners: [
    'CANACINTRA', // Mexican manufacturing chamber
    'AMAC', // Mexican cybersecurity association
    'Border Trade Alliance',
    'TECMA', // Maquiladora association
    'NASCO' // North American trade corridor
  ],
  
  // Special Regional Features
  specialFeatures: {
    crossBorderCompliance: true,
    bilingualSupport: true,
    maquiladoraIntegration: true,
    nafta2compliance: true,
    nearshoreOptimized: true
  },
  
  // API Endpoints (can be same or different)
  api: {
    base: 'https://api.aifronteradefender.com',
    demo: '/api/pentest-demo',
    contact: '/api/submit-form'
  }
};

export default brandConfig;