## 1️⃣ Tech Stack

* ⚛️ **React 18**
* ⚡ **Vite**
* 🎨 **Tailwind CSS**
* 🧠 **Zustand** (state management)
* 🌐 **Axios** (API client)
* 🧭 **React Router DOM**
* 🧾 **Zod** (schema validation)
* 🧩 **React Hook Form**
* 🔐 **JWT decode**
* 🍞 **React Hot Toast**
* 🛠️ **ESLint + Prettier**
* 🔄 **TanStack Query (opsional tapi sangat disarankan)**

## 3️⃣ Install Dependencies

### Core

```bash
npm install react-router-dom axios zustand
```

### Form & Validation

```bash
npm install react-hook-form zod @hookform/resolvers
```

### UX

```bash
npm install react-hot-toast clsx
```

### Auth & Utils

```bash
npm install jwt-decode
```

### Data Fetching (recommended)

```bash
npm install @tanstack/react-query
```

---

## 4️⃣ Tailwind Setup

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### `tailwind.config.js`

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 5️⃣ Folder Structure (Recommended)

```txt
src/
├─ app/
│  ├─ router.jsx
│  ├─ queryClient.js
│
├─ components/
│  ├─ ui/
│  ├─ layout/
│
├─ features/
│  ├─ auth/
│  │  ├─ auth.store.js
│  │  ├─ auth.api.js
│  │  └─ auth.schema.js
│  ├─ club/
│  └─ booking/
│
├─ stores/
│  └─ app.store.js
│
├─ services/
│  ├─ axios.js
│
├─ hooks/
├─ utils/
│
├─ pages/
│  ├─ Login.jsx
│  ├─ Dashboard.jsx
│
├─ App.jsx
└─ main.jsx
```

> 💡 **Pattern ini cocok banget buat SmashClub** karena mudah di-scale (auth, booking, match, payment, dll)

---

## 6️⃣ Zustand Store Example

### `src/features/auth/auth.store.js`

```js
import { create } from "zustand"

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false
    })
}))
```

---

## 7️⃣ Axios Instance

### `src/services/axios.js`

```js
import axios from "axios"
import { useAuthStore } from "../features/auth/auth.store"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

---

## 8️⃣ Router Setup

### `src/app/router.jsx`

```jsx
import { createBrowserRouter } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/", element: <Dashboard /> }
])
```

### `main.jsx`

```jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/router"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

---

## 9️⃣ Optional tapi Highly Recommended

* 🔐 **ProtectedRoute component**
* 💾 **Persist Zustand** (`zustand/middleware`)
* 🎭 **Role & Permission Guard**
* 🌍 **i18n** (kalau multi bahasa)
* 🧪 **Vitest + Testing Library**