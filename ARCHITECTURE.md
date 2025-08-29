# Parallel Animation Architecture

## Branch Strategy
- `master` - Production vanilla JavaScript (current)
- `anime-animations` - anime.js implementation 
- `animation-config` - Shared configuration and utilities

## File Organization
```
public-marketing-site/
├── index.html (shared base)
├── js/
│   ├── shared/           # Common utilities
│   │   ├── config.js     # Animation preferences
│   │   ├── analytics.js  # Performance tracking
│   │   └── utils.js      # Shared helpers
│   ├── vanilla/          # Vanilla JavaScript animations
│   │   └── animations.js
│   ├── anime/            # anime.js implementations
│   │   ├── animations.js
│   │   └── anime.min.js  # Local fallback
│   └── loader.js         # Dynamic animation loader
├── css/
│   ├── base.css          # Shared styles
│   ├── animations-vanilla.css
│   └── animations-anime.css
└── config/
    ├── vercel-vanilla.json
    └── vercel-anime.json
```

## Deployment URLs
- Production (vanilla): https://your-domain.vercel.app
- Preview (anime): https://your-domain-git-anime-animations-username.vercel.app
- Config branch: https://your-domain-git-animation-config-username.vercel.app

## Performance Monitoring
- Core Web Vitals tracking per branch
- Animation frame rate monitoring
- Bundle size comparison
- User preference analytics