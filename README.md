# Chronocruz Bio-Dex
##This application was completely coded with the help of Google Gemini and Anthropic Claude Code.

A Pokedex-inspired biodiversity dashboard for exploring the animal kingdom, powered by live data and AI.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

## About

Chronocruz Bio-Dex is a web app that lets you browse, search, and learn about animals from around the world. It pulls real-time data from biodiversity APIs and uses Google Gemini AI to generate summaries, fun facts, and an interactive naturalist chat for each species.

The UI is styled after the classic Pokedex device -- complete with CRT scanlines, indicator lights, and a retro-tech aesthetic.

## Features

- **Alphabetical Index** -- Browse 160+ pre-cached animals organized A-Z
- **Live Search** -- Search any species by common or scientific name
- **Taxonomy Filters** -- Filter by 16+ categories: Mammals, Birds, Reptiles, Amphibians, Fish, Sharks & Rays, Insects, Arachnids, Crustaceans, Mollusks, Cnidarians, Primates, Carnivores, Cetaceans, Rodents, Beetles, Butterflies, Bees & Ants
- **Species Detail Modal** -- View taxonomy, conservation status, image gallery, and habitat info
- **AI-Powered Insights** -- Gemini AI generates species summaries and fun facts
- **Naturalist Chat** -- Ask Gemini questions about any animal in a conversational interface
- **Responsive Design** -- Works on desktop and mobile with adjustable UI scale (1x / 1.25x / 1.5x)

## Data Sources

| Source | Usage |
|--------|-------|
| [iNaturalist API](https://api.inaturalist.org) | Species search, photos, taxonomy, observations |
| [GBIF API](https://www.gbif.org/developer/summary) | Taxonomic backbone, species occurrence data |
| [Google Gemini AI](https://ai.google.dev) | AI summaries, fun facts, naturalist chat |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or later recommended)
- A [Google Gemini API key](https://aistudio.google.com/apikey) (free tier available)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chronocruz/Chronocruz-Bio-Dex.git
   cd Chronocruz-Bio-Dex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 19** -- UI components and state management
- **TypeScript** -- Type safety across the codebase
- **Vite** -- Fast dev server and optimized production builds
- **Tailwind CSS** -- Utility-first styling with a custom Pokedex theme
- **Google Generative AI SDK** -- Gemini integration for AI features

## Project Structure

```
Chronocruz-Bio-Dex/
├── App.tsx                  # Main app layout (Pokedex shell, state, routing)
├── index.tsx                # React entry point
├── index.html               # HTML template with Tailwind config and theme
├── types.ts                 # TypeScript interfaces and enums
├── constants.ts             # Pre-cached animal list (A-Z)
├── components/
│   ├── FilterBar.tsx        # Search bar, taxonomy filters, alphabet nav
│   ├── AnimalCard.tsx       # Grid card for each animal
│   └── AnimalModal.tsx      # Detail modal with AI chat
├── services/
│   ├── biodiversityService.ts  # iNaturalist & GBIF API integration
│   └── geminiService.ts        # Gemini AI service (summaries, chat)
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript compiler options
└── package.json             # Dependencies and scripts
```

## License

This project is open source and available for personal and educational use.
