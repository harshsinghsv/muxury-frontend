# Muxury — Frontend

Mobile-first luxury fashion e-commerce web app, built with React + Vite + TypeScript. Designed to run inside a WebView on Android/iOS or as a standalone web app.

The frontend talks to the **Muxury Backend** (Node.js + Express + Prisma + PostgreSQL) over a REST API, with Razorpay for payments.

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.8.3 |
| Build Tool | Vite | 7.3.1 |
| Styling | Tailwind CSS | 3.4.17 |
| UI Components | shadcn/ui (Radix UI) | — |
| Routing | React Router DOM | 6.30.1 |
| Server State | TanStack React Query | 5.83.0 |
| HTTP Client | Axios | 1.13.5 |
| Forms | React Hook Form + Zod | — |
| Icons | Lucide React + Heroicons | — |
| Toasts | Sonner | — |
| Charts | Recharts | — |
| Payments | Razorpay JS SDK | (CDN loaded) |
| Testing | Vitest + Testing Library | — |

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

```sh
# 1. Install dependencies
npm install

# 2. Set your environment variable
cp .env.example .env.local
# Edit .env.local → set VITE_API_URL (see Environment Variables below)

# 3. Start dev server
npm run dev
```

The dev server runs on `http://localhost:8080` by default.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ Yes | Base URL of the backend API, e.g. `http://localhost:5000/api/v1` |

Create a `.env.local` file at the root with:
```
VITE_API_URL=http://localhost:5000/api/v1
```

---

## Project Structure

```
src/
├── App.tsx                   # Root router + provider setup
├── main.tsx                  # Entry point
│
├── pages/                    # One file per route
│   ├── Index.tsx             # Home page
│   ├── Shop.tsx              # Product listing
│   ├── ProductDetails.tsx    # Single product
│   ├── Cart.tsx              # Cart page
│   ├── Checkout.tsx          # Checkout + Razorpay
│   ├── Login.tsx             # User login
│   ├── Register.tsx          # User registration
│   ├── Profile.tsx           # My Account (orders, wishlist)
│   ├── ForgotPassword.tsx    # Forgot password
│   ├── EnterOTP.tsx          # OTP entry
│   ├── CreateNewPassword.tsx # Password reset
│   ├── ChangePassword.tsx    # Change password (logged in)
│   ├── NotFound.tsx          # 404
│   └── admin/                # Admin panel pages
│       ├── AdminLogin.tsx
│       ├── Dashboard.tsx
│       ├── ProductsAdmin.tsx
│       ├── OrdersAdmin.tsx
│       ├── CustomersAdmin.tsx
│       └── CategoriesAdmin.tsx
│
├── components/               # Reusable UI components
│   ├── Header.tsx            # Top navigation bar
│   ├── BottomNav.tsx         # Mobile bottom tab bar
│   ├── ProductCard.tsx       # Product card used in listings
│   ├── CartDrawer.tsx        # Slide-in cart drawer
│   ├── SearchModal.tsx       # Full-screen search
│   ├── QuickViewModal.tsx    # Quick view without leaving page
│   ├── ProtectedRoute.tsx    # Auth guard for user routes
│   ├── ui/                   # shadcn/ui primitives (Button, Dialog, etc.)
│   ├── admin/                # Admin layout + sidebar
│   └── home/                 # Homepage section components
│
├── context/                  # Global state (React Context)
│   ├── AuthContext.tsx       # User auth state + token management
│   ├── CartContext.tsx       # Shopping cart (localStorage)
│   ├── WishlistContext.tsx   # Wishlist (localStorage)
│   └── RecentlyViewedContext.tsx
│
├── hooks/                    # Data-fetching hooks (React Query)
│   ├── useProducts.ts        # GET /products, GET /products/:id
│   └── useOrders.ts          # GET /orders/my-orders
│
├── lib/
│   └── api.ts                # Axios instance with auth + auto token refresh
│
└── data/
    └── products.ts           # Static mock product data (16 items, fallback only)
```

---

## Routes

### Customer Routes
| Path | Page | Auth Required |
|---|---|---|
| `/` | Home | No |
| `/shop` | Product listing | No |
| `/product/:id` | Product detail | No |
| `/cart` | Cart | No |
| `/checkout` | Checkout | ✅ Login required |
| `/login` | Login | No |
| `/register` | Register | No |
| `/forgot-password` | Forgot password | No |
| `/enter-otp` | OTP entry | No |
| `/create-new-password` | Reset password | No |
| `/profile` | My account | ✅ Login required |
| `/change-password` | Change password | ✅ Login required |

### Admin Routes
| Path | Page | Auth Required |
|---|---|---|
| `/admin/login` | Admin login | No |
| `/admin/dashboard` | Dashboard overview | ✅ Admin |
| `/admin/products` | Product management | ✅ Admin |
| `/admin/orders` | Order management | ✅ Admin |
| `/admin/users` | Customer management | ✅ Admin |
| `/admin/categories` | Category management | ✅ Admin |

---

## API Calls Reference

All requests go through the Axios instance in `src/lib/api.ts`. The `Authorization: Bearer <token>` header is attached automatically. 401 responses trigger an automatic token refresh.

### Authentication
| Method | Endpoint | Used In | Trigger |
|---|---|---|---|
| `POST` | `/auth/register` | `AuthContext` | Register form submit |
| `POST` | `/auth/login` | `AuthContext` | Login form submit |
| `GET` | `/auth/me` | `AuthContext` | App mount (session restore) |
| `POST` | `/auth/logout` | `AuthContext` | Logout button |
| `POST` | `/auth/refresh` | `api.ts` (interceptor) | Auto, on 401 |

### Products
| Method | Endpoint | Used In | Trigger |
|---|---|---|---|
| `GET` | `/products` | `useProducts` | Shop page, homepage |
| `GET` | `/products/:id` | `useProducts` | Product detail page |

### Orders
| Method | Endpoint | Used In | Trigger |
|---|---|---|---|
| `GET` | `/orders/my-orders` | `useOrders` | Profile "My Orders" |
| `POST` | `/orders` | `Checkout.tsx` | "Place Order" click |

### Cart Sync (at Checkout Only)
| Method | Endpoint | Trigger |
|---|---|---|
| `DELETE` | `/cart/clear` | Before placing order |
| `POST` | `/cart/items` | Sync each item before order |

### Payments
| Method | Endpoint | Trigger |
|---|---|---|
| `POST` | `/payment/create-order` | After order is created |
| `POST` | `/payment/verify` | After Razorpay payment success |

---

## State Management

| Context | What It Manages | Storage |
|---|---|---|
| `AuthContext` | Current user, auth status, login/logout | `localStorage` (tokens) |
| `CartContext` | Cart items, quantity, totals | `localStorage` |
| `WishlistContext` | Saved product IDs | `localStorage` |
| `RecentlyViewedContext` | Recently viewed products | `localStorage` |

Server state (products, orders) is managed with **TanStack React Query** via custom hooks.

---

## Current Feature Status

| Feature | Status |
|---|---|
| User Login / Logout | ✅ Working |
| User Registration | ✅ Working |
| Auto token refresh | ✅ Working |
| Product listing + category filter | ✅ Working |
| Product detail page | ✅ Working |
| Add to cart | ✅ Working |
| Cart page (view/edit/remove) | ✅ Working |
| Checkout with Razorpay | ✅ Working (shipping address hardcoded) |
| My Orders | ✅ Working |
| Wishlist | ⚠️ Partial — localStorage only, resolves products from static mock data |
| Admin panel | ⚠️ Partial — UI complete, some API endpoints need verification |
| Forgot password / OTP / Reset password | ❌ UI only — no API calls connected |
| Change password | ❌ UI only — no API call |
| Search | ❌ UI only — input not wired to API |
| Sort / Price filter | ❌ UI only — decorative |
| Product reviews | ❌ UI only — shows static mock data |
| Email verification landing page | ❌ Missing — backend sends link to `/verify-email` which has no route |

---

## Available Scripts

```sh
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run test       # Run tests with Vitest
npm run lint       # Run ESLint
```

---

## Key Conventions

- **Fonts**: `Playfair Display` (headings) + `DM Sans` (body) — loaded from Google Fonts
- **Brand color**: `#CA8385` (rose), `#343434` (dark charcoal)
- **API shape**: All backend responses are wrapped as `{ data: { ... } }` — accessed as `response.data.data`
- **Path alias**: `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`)
