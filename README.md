# Muxury — Modern Indian E-Commerce Frontend

Mobile-first luxury fashion e-commerce web app, built with React + Vite + TypeScript. Designed with strict Indian market standards, featuring a brutalist-minimalist UI, seamless global state management, and optimized conversion funnels. 

The frontend interfaces with the **Muxury Backend** (Node.js + Express + Prisma + PostgreSQL) over a REST API and handles live transactions using Razorpay.

---

## 🚀 Key Mastered Features

During the recent modernization sweep, this codebase was upgraded into a production-ready Indian single-seller storefront:

- **Brutalist-Minimalist Aesthetics:** Consistent Playfair/DM Sans typography with `#CA8385` accenting. Highly legible layout systems ensuring product focus.
- **Indian Market Readiness:** 
  - All metrics globally formatted to `Intl.NumberFormat('en-IN')` rendering prices as `₹1,45,000` structure. 
  - Standardized MRP vs. Sale Price UX displaying dynamic "Discount %" and "Total Savings" badges.
  - Integration of an active **Indian PIN Code** live validation custom hook via India Post APIs.
- **Comprehensive Search & Discovery:** Fully-functional URL-driven `Search`, `Category Filtering`, `Pricing Filters`, and `Sort` parameters making all views immediately shareable / bookmarkable.
- **Dynamic Wishlist:** Converted the Wishlist isolated from primitive arrays to an actionable drawer list where users can `Move to Cart` synchronously merging local and global states without desynchronizing.
- **Live User Support:** Anchored global `<WhatsAppWidget />` that ties users straight from application errors into direct contact lines.
- **Premium User Interactions:** Custom-tailored `<LoadingButton />` processing spinners across the entire app protecting from duplicated API checkout triggers. Built-in global `<BackToTop />` and mobile-native `<BottomNav />` execution.
- **Static Foundations Established:** Scalable global `<Footer />` generating trust anchors mapping to dynamically-driven Static Pages (About Us, Returns, Shipping, Contact, Privacy, Terms).

---

## 🛠 Tech Stack

| Layer | Library | 
|---|---|
| **Framework** | React 18.3.1 | 
| **Language** | TypeScript 5.8.3 |
| **Build Tool** | Vite 7.3.1 | 
| **Styling** | Tailwind CSS 3.4.17 |
| **Design Icons** | Solar Icons (Premium Set) |
| **Routing** | React Router DOM 6.30.1 | 
| **Server State** | TanStack React Query 5.83.0 | 
| **HTTP Client** | Axios 1.13.5 | 
| **Toasts** | Sonner |
| **Payments** | Razorpay JS SDK (CDN loaded) | 

---

## ⚙️ Getting Started

**Prerequisites:** Node.js 18+ and npm.

```sh
# 1. Install dependencies
npm install

# 2. Set your environment variables
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

The localized dev server will populate on `http://localhost:8080`.

### Environment Setup (`.env.local`)
| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ Yes | Base URL of the backend API, e.g. `http://localhost:5000/api/v1` |

---

## 📂 Architecture

```
src/
├── pages/                    # High-Level Routable Views
│   ├── Index.tsx             # Home: Hero, Trusted Brands, Countdowns
│   ├── Shop.tsx              # PLP: Infinite Scroll & Parameterized Search
│   ├── ProductDetails.tsx    # PDP: Complex variant/size interactions
│   ├── Checkout.tsx          # Order Compilation + Razorpay Tunnel
│   ├── StaticPage.tsx        # Dynamic Generator for Terms/Privacy Copy
│   ├── Contact.tsx           # Mockup Live-Form Integration
│   └── Profile.tsx           # Authentication gateway & order history
│
├── components/               # Global UI Primitives
│   ├── Header.tsx            # Desktop Global Navbar 
│   ├── Footer.tsx            # Trust & Link Aggregation
│   ├── BottomNav.tsx         # Mobile Overrides
│   ├── WhatsAppWidget.tsx    # wa.me redirect anchor
│   └── LoadingButton.tsx     # Normalized state-lock abstraction
│
├── context/                  # React Contexts
│   ├── CartContext.tsx       # Live calculations & synced basket
│   ├── WishlistContext.tsx   # Persistent user preferences
│   └── AuthContext.tsx       # Local user sessions
│
└── config/                   # Constants
    └── constants.ts          # Centralized Copy Strings
```

---

## ✅ Current Feature Status List

| Feature | Status |
|---|---|
| User Login / Logout | ✅ Fully Working |
| User Registration | ✅ Fully Working |
| Auto token refresh | ✅ Fully Working |
| Product listing + category filter | ✅ Fully Working (URL driven) |
| Product detail page | ✅ Fully Working |
| Live Product Search | ✅ Fully Working (Debounced + History) |
| Multi-level Sort / Filters | ✅ Fully Working |
| Add to cart / Cart Drawer | ✅ Fully Working |
| Subtotal & Savings Calculations | ✅ Indian Formatting Secured |
| Wishlist -> Move to Cart | ✅ Functional Conversion |
| Checkout flow + Validation | ✅ Form-protected, Pin Code synced |
| Global Footer & Trust Pages | ✅ Fully Live |

---

## 🎨 Design System Constraints

When collaborating on this repository, strictly adhere to:
- **Fonts**: `Playfair Display` (serif headings) + `DM Sans` (clean sans body).
- **Brand Identity**: `#CA8385` (Primary Rose-Gold), `#343434` (Deep Charcoal for dominant type/accents).
- **Iconography**: Entirely ported over from `lucide` and scattered vectors into a cohesive `@solar-icons/react` premium ecosystem. Use `Bold`/`Mirror` variants whenever maintaining semantic continuity.
- **Format Numbers Constantly**: Always pipe currency injections via `.toLocaleString("en-IN", { minimumFractionDigits: 2 })`.
