# 🎬 Movie Booking Application Frontend

Release version: `1.0.0`

A React frontend for CineBook. It connects to the Movie Booking backend API and provides customer, admin, and theatre-management screens.

---

# 🚀 Project Overview

The frontend provides screens for:

* User sign up and sign in
* Movie browsing
* Movie details
* Theatre browsing
* Show listing
* Booking flow
* Payment flow
* Booking history
* Profile management
* Admin movie management
* Admin theatre management
* Admin show management
* Admin user management

---

# 🛠 Tech Stack

* React
* TypeScript
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* Razorpay checkout integration

---

# 🔗 Backend API

The frontend reads the backend URL from:

```
VITE_API_BASE_URL
```

Local example:

```
http://localhost:3000/mba/api/v1
```

Production example:

```
https://your-backend-domain.com/mba/api/v1
```

---

# 🔐 Environment Variables

Create `.env` from `.env.example`.

```
VITE_API_BASE_URL=http://localhost:3000/mba/api/v1
VITE_API_TIMEOUT=5000
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
VITE_API_KEY_SECRET=
```

Rules:

* Only public browser-safe values should be placed in frontend env variables
* Razorpay secret keys must stay on the backend
* `VITE_API_BASE_URL` must include `/mba/api/v1`

---

# 🚀 Running the Frontend

Install dependencies:

```
npm install
```

Start development server:

```
npm run dev
```

Build production assets:

```
npm run build
```

Preview production build:

```
npm run preview
```

On Windows PowerShell, use `npm.cmd` if `npm` is blocked by execution policy:

```
npm.cmd run build
```

---

# 📁 Important Folders

```
src/api          API clients
src/components   Shared UI components
src/context      Auth and toast context
src/hooks        App hooks
src/layouts      Layout components
src/pages        Route pages
src/routes       App routing
src/types        TypeScript models
src/utils        Constants and helpers
```

---

# 🌐 Vercel Deployment

This repo includes `vercel.json` for single-page app rewrites.

Set these environment variables in Vercel:

```
VITE_API_BASE_URL
VITE_RAZORPAY_KEY_ID
VITE_API_TIMEOUT
VITE_API_KEY_SECRET
```

---

# 🏷 Release Tag

For the current aligned release, tag this repository as:

```
frontend-v1.0.0
```
