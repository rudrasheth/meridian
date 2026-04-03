# Meridian — Capital Intelligence Dashboard

A full-stack financial dashboard built with **Next.js 16**, **TypeScript**, and **Zustand** for state management. Meridian provides institutional-grade capital flow visualization, transaction management, and analytics.

## Features

- **Dark Mode** — Persistent theme toggle with full CSS variable system
- **Data Persistence** — All transactions and preferences saved to `localStorage`
- **Mock API Integration** — Simulated REST endpoints with realistic network delays
- **Export Functionality** — Export filtered data as **CSV** or **JSON**
- **Advanced Filtering** — Filter by category, type (income/expense), status, and date range
- **Grouping** — Group transactions by category, type, status, or date
- **Role-Based Access** — Admin mode (full CRUD) vs Viewer mode (read-only)
- **Responsive Design** — Fully responsive layout with mobile navigation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + CSS Variables |
| State | Zustand |
| Charts | Recharts |
| Icons | Lucide React |
| Animations | Framer Motion + CSS Keyframes |
| Dates | date-fns |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with stat cards, balance trend chart, category breakdown, and transactions table |
| `/ledger` | Complete transaction history with sorting |
| `/analytics` | Balance trend and spending breakdown visualizations |
| `/market` | Market watch with sortable ETF/crypto data table |
| `/audit` | Compliance event log with status tracking |
| `/system` | Settings — theme, role, data management, profile |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Dashboard
│   ├── ledger/           # Ledger page
│   ├── analytics/        # Analytics page
│   ├── market/           # Market watch page
│   ├── audit/            # Audit trail page
│   └── system/           # Settings page
├── components/
│   ├── Dashboard/        # StatCard, Charts, TransactionsTable
│   ├── Layout/           # AppLayout wrapper
│   ├── Navbar.tsx        # Top navigation bar
│   └── Sidebar/          # Sidebar component
├── lib/
│   ├── mockApi.ts        # Mock REST API with localStorage
│   ├── mockData.ts       # Seed transaction data
│   └── utils.ts          # Utility functions
├── store/
│   └── useStore.ts       # Zustand global state
└── types/
    └── index.ts          # TypeScript interfaces
```

## Architecture Decisions

- **Zustand over Context** — Lightweight, no provider wrapping, supports selectors for performance
- **CSS Variables for theming** — Single source of truth for light/dark mode, avoids class duplication
- **Mock API layer** — Decouples UI from data source, making it easy to swap in a real backend
- **localStorage persistence** — Simple, zero-config persistence without external dependencies
