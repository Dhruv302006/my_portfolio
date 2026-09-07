# Dhruv Thakur — Engineering Portfolio

> **Production Full-Stack & Applied AI Engineer** • IIT Hyderabad  
> **Live Site:** [https://dhruv302006.github.io/my_portfolio/](https://dhruv302006.github.io/my_portfolio/)

A modern, high-performance developer portfolio built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. Features interactive mouse-scrubbed 3D video animation, live terminal simulations, cybernetic glassmorphism, and deep architectural telemetry breakdowns.

---

## ⚡ Core Features

- **3D Stop-Motion Felt Character Interactive Background**:
  - Full-screen `<video>` backdrop featuring stop-motion character animation that scrubs in real-time based on horizontal cursor/touch movement.
  - Performance-optimized with state-free `useRef` event pipelines, avoiding React re-render overhead.
- **Interactive Code Terminal (`dhruv.js`)**:
  - Glassmorphic translucent IDE editor with custom line-by-line syntax highlighting, interactive token typing, and active blinking cursor.
- **Twinkling Star Particle Background**:
  - Viewport-fixed HTML5 Canvas particle system providing continuous starfield physics across all dark content sections with cursor hover bubble and click repulse interactions.
- **Technical Arsenal & Skills**:
  - Single-line continuous infinite marquee displaying official brand tech badges.
  - Interactive cybernetic cards with animated proficiency meters, real-world project achievements, and category filtering.
- **Flagship Systems & Projects Breakdown**:
  - **Apex Wallet & Ledger System**: 166+ TPS event-driven double-entry accounting engine with Kafka outbox and sub-millisecond Redis idempotency gates.
  - **AI Financial Analyst**: Local Ollama (Llama 3.1 8B / Llama 3.2 1B) ReAct agent loop with controlled QLoRA fine-tuning (+51.4pp accuracy gain).
  - **MapLink Real-Time Geospatial Platform**: Multi-node Socket.io cluster with Redis adapter, PostGIS spatial indexing, and write-behind batching.
  - **Aura Intel**: FinTech predictive operations suite with Random Forest cashflow forecasting (94% R²) and Isolation Forest anomaly surveillance.
- **Upstream Open Source Contributions**:
  - **`supabase/auth` (PR #2668)**: Exact case-insensitive email lookup on admin API in Go and PostgreSQL.
  - **`rakutentech/querycraft` (PR #109)**: Offline Prisma ORM schema parser to SQL DDL transpiler in TypeScript.
- **Comprehensive Mobile Responsiveness**:
  - Fluid responsiveness down to 320px screen width with custom portrait math centering the character face on mobile devices, dynamic viewport height (`100dvh`), and no-scrollbar horizontal carousels.

---

## 🛠️ Tech Stack

- **Framework**: React 19, TypeScript
- **Bundler & Tooling**: Vite, PostCSS, Oxlint
- **Styling**: Tailwind CSS, CSS Keyframe Animations
- **Deployment**: GitHub Pages, GitHub Actions CI/CD

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- npm or pnpm

### Installation

```bash
git clone https://github.com/Dhruv302006/my_portfolio.git
cd my_portfolio
npm install
```

### Local Development

```bash
npm run dev
```
Open [http://localhost:5180](http://localhost:5180) in your browser.

### Production Build

```bash
npm run build
```

### Deploy to GitHub Pages

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages upon pushing to the `main` branch.

Alternatively, deploy manually via:
```bash
npm run deploy
```

---

## 📄 License
MIT © [Dhruv Thakur](https://github.com/DhruvThakur)
