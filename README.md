# Meridian — Capital Intelligence Dashboard

An institutional-grade financial dashboard built with **Next.js 16**, **TypeScript**, and **Zustand**. Meridian provides capital flow visualization, transaction management, simulated role-based access, and client-side data persistence. 

This repository represents a complete frontend technical assignment, demonstrating modular architecture, strict type-safety, and premium UI engineering without relying on heavy boilerplate templates.

## Overview of Approach

My goal was to build a highly interactive, scalable frontend architecture that mirrors production paradigms. Rather than building tightly-coupled UI components, I decoupled the data layer entirely:
1. **Mock API Layer:** All data reads/writes go through an asynchronous `mockApi.ts` layer. This mimics network latency and handles `localStorage` internally, meaning the UI is completely unaware of the actual data source. This setup makes it trivial to swap in a real Postgres/Express backend later.
2. **State Management:** Instead of prop-drilling or using heavy React Context, I utilized a lightweight **Zustand** store (`useStore.ts`) to manage global states (Theme, Active Filters, Transactions, and a custom Toast Notification system).
3. **Institutional UI Design:** I leveraged **Tailwind CSS** alongside a custom CSS Variable framework (`--surface-1`, `--accent`). This guarantees an instant, flicker-free toggle between Light and Dark modes at the root level, avoiding the clutter of chaining `dark:bg-*` utility classes everywhere.

## Features

- **Advanced Data Management** — Fully functional data grid with multi-parameter filtering, sorting, and categorical grouping.
- **Data Export** — Export active ledger datasets natively to CSV or JSON formats.
- **Visual Analytics** — Integrated `recharts` for time-based balance trending and spending breakdown categorizations.
- **Role-Based Access Control (RBAC)** — Toggleable 'Admin' vs 'Viewer' modes. Viewer mode successfully strips write permissions, hiding "New Entry" modals and table action buttons.
- **Dark Mode & CSS Theming** — Zero-flash persistent theme toggling.
- **Client-Side Persistence** — All ledger modifications and theme preferences hydrate from and persist to `localStorage`.
- **Framer Motion UX** — Bespoke interactive toast notifications, hover states, and smooth routing transitions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Core Framework** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4, Custom CSS Variables |
| **State Management** | Zustand |
| **Data Visualization**| Recharts |
| **Iconography** | Lucide React |
| **Animations** | Framer Motion |

## Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and `npm` installed.

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/rudrasheth/meridian.git
   cd meridian
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the App** 
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Known Limitations & Future Scope

Because this is a frontend-focused scope, certain production features are simulated:
- **Authentication:** The RBAC Admin/Viewer functionality is handled purely via a UI state toggle. In a real-world scenario, this would be replaced with NextAuth tracking secure JWT cookies.
- **Local Data Storage:** The data persists via the browser's `localStorage` meaning it does not sync across devices. Future scaling would replace the `mockApi` functions with fetches to an SQL database.
- **Table Pagination:** The transactions table currently renders all available mocked data into the DOM. For massive multi-year ledgers, I would introduce infinite scrolling virtualization (e.g., TanStack Virtual) or server-side pagination to maintain 60 FPS performance.
