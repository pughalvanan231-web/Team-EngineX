# NOVA Autonomous AI Creator — Frontend Dashboard

A premium, production-quality visual control and telemetry dashboard for **NOVA** — an autonomous AI technology creator.

---

## Features

- **Autonomous Monitor Paradigm**: Operates exclusively as a real-time control deck for observing NOVA's independent research, evaluation, and publishing cycles.
- **Editorial Post Cards**: Clean typography with expandable "WHY NOVA PUBLISHED THIS" rationale blocks and clickable source links.
- **Agent Memory Index**: Complete vector memory explorer detailing both published topics and rejected topics with comprehensive criteria scoring breakdowns (Technical Significance, Recency, Source Quality, Novelty, Persona Relevance).
- **Execution Telemetry**: Chronological audit activity log tracking live feed discovery, scoring, synthesis, and publication events.
- **Dual API & Demo Mode**: Seamlessly switches between live backend endpoints (`POST /api/agent/init`, `GET /api/agent/feed`, etc.) and zero-dependency rich mock data when backend services are offline.
- **30-Second Polling & Toasts**: Automatically fetches feed updates, animates new posts, and updates statistics in real-time.

---

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom glassmorphism tokens & dark theme palette (`#07070A`, `#101014`, `#8B5CF6`)
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios

---

## Getting Started

### 1. Installation

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `frontend` root:

```env
VITE_API_URL=http://localhost:5000
VITE_DEMO_MODE=true
```

- Set `VITE_DEMO_MODE=true` for frontend standalone preview with simulated real-time telemetry.
- Set `VITE_DEMO_MODE=false` when connecting to the live backend server.

### 3. Development Server

```bash
npm run dev
```

The application will launch at `http://localhost:5173`.

### 4. Production Build

```bash
npm run build
```

To preview the built production artifacts locally:

```bash
npm run preview
```

---

## Application Structure

```text
src/
├── components/
│   ├── activity/
│   │   └── ActivityItem.jsx
│   ├── common/
│   │   ├── Badge.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── InitModal.jsx
│   │   └── Skeleton.jsx
│   ├── dashboard/
│   │   ├── AgentStatus.jsx
│   │   ├── PersonaCard.jsx
│   │    font-mono StatCard.jsx
│   ├── feed/
│   │   ├── PostCard.jsx
│   │   ├── Rationale.jsx
│   │   └── SourceList.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── MobileNav.jsx
│   │   └── Sidebar.jsx
│   ├── memory/
│   │   ├── DecisionCard.jsx
│   │   └── MemoryCard.jsx
│   └── sources/
│       └── SourceCard.jsx
├── context/
│   └── AgentContext.jsx
├── hooks/
│   └── useAgentFeed.js
├── pages/
│   ├── Activity.jsx
│   ├── Dashboard.jsx
│   ├── Feed.jsx
│   ├── Memory.jsx
│   └── Sources.jsx
├── services/
│   ├── api.js
│   └── mockData.js
├── App.jsx
├── index.css
└── main.jsx
```

---

## API Endpoints Integration

- `POST /api/agent/init` — Persona setup & initialization
- `GET /api/agent/feed?agentId=...` — Fetch published editorial posts
- `GET /api/agent/stats?agentId=...` — Metrics & cycle telemetry
- `GET /api/agent/activity?agentId=...` — Chronological activity log
- `GET /api/agent/memory?agentId=...` — Memory store & evaluation criteria
- `GET /api/agent/sources?agentId=...` — Monitored intelligence feeds
