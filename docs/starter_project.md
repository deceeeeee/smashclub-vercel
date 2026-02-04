Siap. Aku bikin **starter project React + Vite + Tailwind** yang *realistic* buat **SmashClub App** (auth, booking, ecommerce, payment) dan **state management pakai Zustand**. Ini versi **clean tapi scalable**, cocok buat lanjut ke production.

---

## 1. Tech Stack Utama

**Core**

* React 19
* Vite
* TypeScript (recommended, tapi bisa JS)
* Tailwind CSS

**State & Data**

* **Zustand** → global state
* @tanstack/react-query → server state (API, caching)
* axios → HTTP client

**Routing**

* react-router-dom v6

**UI & Utility**

* clsx / class-variance-authority → conditional class
* lucide-react → icons
* react-hook-form → form handling
* zod → schema validation
* @hookform/resolvers → RHF + Zod

**Auth & Storage**

* js-cookie atau localStorage (token handling)

**Date & Booking**

* dayjs
* react-datepicker (optional)

**Payment (future-ready)**

* Midtrans / Stripe SDK (belum dipasang di awal)

---

## 2. Create Project (Vite)

```bash
npm create vite@latest smashclub -- --template react-ts
cd smashclub
npm install
```

---

## 3. Install Dependencies

```bash
# routing & state
npm install react-router-dom zustand

# data fetching
npm install @tanstack/react-query axios

# form & validation
npm install react-hook-form zod @hookform/resolvers

# ui helpers
npm install clsx lucide-react dayjs

# dev tools
npm install -D tailwindcss postcss autoprefixer
```

---

## 4. Setup Tailwind

```bash
npx tailwindcss init -p
```

### `tailwind.config.ts`

```ts
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 5. Folder Structure (Recommended)

```txt
src/
│
├── app/
│   ├── router.tsx
│   └── queryClient.ts
│
├── features/
│   ├── auth/
│   │   ├── auth.store.ts
│   │   ├── auth.api.ts
│   │   └── Login.tsx
│   │
│   ├── booking/
│   │   ├── booking.store.ts
│   │   ├── booking.api.ts
│   │   └── BookingPage.tsx
│   │
│   ├── shop/
│   │   └── ShopPage.tsx
│   │
│   └── payment/
│       └── PaymentPage.tsx
│
├── components/
│   ├── ui/
│   └── layout/
│
├── lib/
│   ├── axios.ts
│   └── utils.ts
│
├── stores/
│   └── ui.store.ts
│
├── pages/
│   └── Home.tsx
│
├── main.tsx
└── index.css
```

---

## 6. Zustand – Contoh Global Auth Store

### `features/auth/auth.store.ts`

```ts
import { create } from "zustand"

type AuthState = {
  token: string | null
  user: any
  login: (token: string, user: any) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: (token, user) =>
    set({ token, user }),
  logout: () =>
    set({ token: null, user: null }),
}))
```

---

## 7. React Query Setup

### `app/queryClient.ts`

```ts
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient()
```

### `main.tsx`

```tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./app/queryClient"
import AppRouter from "./app/router"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </React.StrictMode>
)
```

---

## 8. Router Setup

### `app/router.tsx`

```tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../features/auth/Login"
import BookingPage from "../features/booking/BookingPage"

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/booking", element: <BookingPage /> },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
```

---

## 9. Axios Instance

### `lib/axios.ts`

```ts
import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})
```

---

## 10. Kenapa Kombinasi Ini Cocok buat SmashClub

* **Zustand** → ringan & cocok untuk auth, cart, booking state
* **React Query** → ideal untuk booking availability & order status
* **Feature-based structure** → scalable (auth, booking, shop terpisah)
* **Tailwind** → cepat styling & konsisten


