# SmartLedger Lite

**SmartLedger Lite** is a modern, AI-powered finance management SaaS application built with Next.js 16. It helps individuals and small businesses track expenses, manage invoices, visualize financial analytics, and receive AI-generated financial insights — all in one secure, responsive platform.

This is a **full-stack finance management platform** with authentication, persistent data storage, server-side business logic, and intelligent reporting powered by Google Gemini.

---

## Features

| Feature | Description |
|--------|-------------|
| **Authentication & Protected Routes** | Secure sign-up and login with JWT sessions; middleware guards dashboard routes |
| **Expense Management (CRUD)** | Create, read, update, and delete expenses with categories and validation |
| **Invoice Management (CRUD)** | Full invoice lifecycle — draft, send, track status, and manage line items |
| **Dynamic Dashboard Analytics** | Real-time stats, expense trends, category breakdowns, and recent activity |
| **AI Financial Insights** | Personalized recommendations generated via Google Gemini AI |
| **Responsive SaaS UI** | Mobile-first layout with sidebar navigation, sheets, and polished shadcn/ui components |
| **Secure User-Specific Data** | All queries scoped to the authenticated user — no cross-tenant data leakage |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) |
| **Authentication** | [Auth.js](https://authjs.dev/) (NextAuth v4) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **AI** | [Google Gemini AI](https://ai.google.dev/) (`@google/genai`) |
| **Forms & Validation** | React Hook Form + [Zod](https://zod.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## Architecture Decisions

### Server Actions

Mutations (create, update, delete) for expenses and invoices run through **Next.js Server Actions** instead of a separate REST API layer. This keeps form submissions colocated with the UI, reduces boilerplate, and leverages built-in progressive enhancement — no client-side fetch wrappers required for core CRUD flows.

### MongoDB

**MongoDB with Mongoose** was chosen for its flexible document model, which maps naturally to nested invoice line items and variable expense metadata. Mongoose provides schema validation, middleware hooks, and a mature ecosystem that pairs well with server-side Next.js data access patterns.

### Google Gemini AI

**Gemini** powers the financial insights panel by analyzing aggregated expense and invoice summaries server-side. It delivers contextual, plain-language recommendations without exposing raw user credentials to the client, and scales cost-effectively for a SaaS demo or portfolio project.

### App Router

The **Next.js App Router** enables route groups (`(auth)`, `(dashboard)`), nested layouts, loading states, and server components by default. Dashboard pages fetch data on the server, improving initial load performance and keeping sensitive logic off the client bundle.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB connection string (MongoDB Atlas or local)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/smartledger?retryWrites=true&w=majority

# Auth.js / NextAuth secret — generate with: openssl rand -base64 32
AUTH_SECRET=your-auth-secret-here

# Google Gemini API key — https://aistudio.google.com/apikey
GEMINI_API_KEY=your-gemini-api-key-here

# Application URL (use http://localhost:3000 for local development)
NEXTAUTH_URL=http://localhost:3000
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `AUTH_SECRET` | Yes | Secret for signing JWT sessions |
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI insights |
| `NEXTAUTH_URL` | Yes | Canonical app URL for auth callbacks |

---

## Local Setup

### Prerequisites

- **Node.js** 20+
- **npm** (or pnpm / yarn)
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Google Gemini API key**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/TirthDavra/smartledger.git
cd smartledger-lite

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local   # or create .env.local manually (see above)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

---

## Deployment

SmartLedger Lite is designed for deployment on **[Vercel](https://vercel.com/)**:

1. Push your repository to GitHub.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Add all environment variables (`MONGODB_URI`, `AUTH_SECRET`, `GEMINI_API_KEY`, `NEXTAUTH_URL`).
4. Set `NEXTAUTH_URL` to your production domain (e.g. `https://smartledger-lite.vercel.app`).
5. Deploy — Vercel will detect Next.js and configure the build automatically.

> Ensure your MongoDB Atlas cluster allows connections from Vercel's IP ranges (or use `0.0.0.0/0` for development).

---

## Demo Credentials

> Update this section once a seeded demo account is available.

| Field | Value |
|-------|-------|
| **Email** | `qohivywev@mailinator.com` |
| **Password** | `Pa$$w0rd!` |

Use these credentials to explore the dashboard without creating a new account. 

---

## Folder Structure

```
smartledger-lite/
├── public/                      # Static assets
├── src/
│   ├── actions/                 # Server Actions (auth, expenses, invoices)
│   ├── app/
│   │   ├── (auth)/              # Login & register pages
│   │   ├── (dashboard)/         # Protected app routes
│   │   │   ├── dashboard/       # Analytics dashboard
│   │   │   ├── expenses/        # Expense management
│   │   │   └── invoices/        # Invoice management
│   │   ├── api/
│   │   │   ├── auth/            # NextAuth API routes
│   │   │   └── ai/              # Gemini financial insights endpoint
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── dashboard/           # Charts, sidebar, AI panel
│   │   ├── expenses/            # Expense forms & tables
│   │   ├── invoices/            # Invoice forms & tables
│   │   ├── landing/             # Marketing page
│   │   ├── layout/              # Site footer
│   │   └── ui/                  # shadcn/ui primitives
│   ├── constants/               # App-wide constants
│   ├── lib/                     # DB connection, utils, formatters
│   ├── models/                  # Mongoose schemas (User, Expense, Invoice)
│   ├── providers/               # Session provider
│   ├── schemas/                 # Zod validation schemas
│   ├── services/                # AI service (Gemini)
│   ├── types/                   # TypeScript declarations
│   ├── auth.ts                  # NextAuth configuration
│   └── proxy.ts                 # Route protection middleware
├── components.json              # shadcn/ui config
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Future Improvements

- **Receipt scanning** — OCR-powered expense capture from uploaded receipts
- **PDF export** — Download invoices and financial reports as PDF

---

## Author

**Tirth**

---

<p align="center">
  Built with Next.js, MongoDB, and Gemini AI · © 2026 SmartLedger Lite
</p>
