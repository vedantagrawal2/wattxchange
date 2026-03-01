# ⚡ WattXchange

A high-end React + Tailwind CSS + Framer Motion energy trading platform.

## 🎨 Tech Stack
- **React 18** with React Router v6
- **Tailwind CSS v3** (custom palette wired in tailwind.config.js)
- **Framer Motion v11** for page transitions & micro-animations
- **ES7+ JSX** (compatible with your installed snippets)

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm start
```

That's it — opens at http://localhost:3000

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx        # Fixed nav with animated links + Explore/Profile
│   ├── Particles.jsx     # Ambient floating particles
│   └── StatCard.jsx      # Animated number counter
├── hooks/
│   ├── useCustomCursor.js  # Magnetic dot + ring cursor
│   └── useCounter.js       # Smooth number animation hook
├── pages/
│   ├── Home.jsx          # Hero, orbs, energy lines, CTA → Explore Market
│   └── Market.jsx        # Buy / Sell cards with hover tooltips + low-opacity bg
├── App.jsx               # Router + AnimatePresence transitions
├── index.css             # Tailwind directives + custom CSS (cursor, particles…)
└── index.js              # React root
```

## 🎨 Color Palette
| Token   | Hex       | Usage                        |
|---------|-----------|------------------------------|
| gold    | `#ffb703` | Primary accent, titles       |
| orange  | `#fb8500` | Secondary accent, sell card  |
| navy    | `#023047` | Home page background         |
| cream   | `#fdf6e3` | Body text                    |
| dark    | `#1f2937` | Market page background       |

## ✨ Features
- **Custom magnetic cursor** — dot + ring that grows on hover
- **Framer Motion page transitions** — smooth slide in/out between pages
- **Animated hero** — staggered text reveals, flickering hollow title
- **Floating orbs + energy lines** — ambient motion on home page
- **Particle system** — gold/orange particles drifting upward
- **Animated stat counters** — numbers count up on load
- **Market cards** — low-opacity SVG backgrounds, hover tooltips, color shifts
- **Noise grain overlay** — premium tactile feel via CSS
