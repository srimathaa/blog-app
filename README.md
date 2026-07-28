# The BlogApp

A full-stack MERN blog platform with JWT authentication, image uploads, and a clean editorial UI. Built to explore production-grade patterns beyond a typical CRUD tutorial — proper auth security, centralized error handling, and author-scoped permissions.

**Live demo:** [https://blog-app-blue-tau.vercel.app](https://blog-app-blue-tau.vercel.app)
**API:** [https://blog-app-ybmb.onrender.com](https://blog-app-ybmb.onrender.com)

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30–60 seconds to respond.

---



## Features

- **Authentication** — signup/login/logout with JWT stored in httpOnly cookies (not localStorage, to avoid XSS token theft)
- **Posts** — full CRUD, author-only edit/delete permissions enforced on the backend
- **Comments** — nested under posts, author-only delete
- **Image uploads** — cover images uploaded to Cloudinary, never stored on the app server
- **Search & tag filtering** — debounced search input, tag filters reflected in the URL (shareable/bookmarkable)
- **Pagination** — server-side, with parallelized count + fetch queries
- **Protected routes** — client-side route guards backed by real server-side authorization (the client guard is UX only; the API enforces it independently)
- **Centralized error handling** — custom `AppError` class + `catchAsync` wrapper eliminate repetitive try/catch and produce consistent error responses

---

## Tech Stack

**Frontend:** React (Vite), React Router, React Hook Form, Tailwind CSS, Axios, react-hot-toast
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Multer + Cloudinary
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

---

## Architecture Notes

A few decisions worth calling out:

- **httpOnly cookies over localStorage for JWTs.** Tokens in localStorage are readable by any injected script (XSS). httpOnly cookies aren't accessible to JavaScript at all — the browser attaches them automatically. This does mean CORS has to be configured carefully (`credentials: true` + explicit origin, not `*`), and cross-site cookies need `sameSite: 'none'` + `secure: true` in production.
- **References over embedding for comments.** Comments are a separate collection referencing `Post` and `User` by ID, rather than embedded arrays — since a popular post's comments could grow unbounded, and embedding would bloat every post read.
- **`pre('validate')` vs `pre('save')` in Mongoose.** Slug generation happens in a `pre('validate')` hook, not `pre('save')` — Mongoose runs validation *before* `save` hooks, so a slug generated too late would fail the `required` check on `slug`.
- **Centralized error handling.** Controllers throw an `AppError` and call `next(err)` (via a `catchAsync` wrapper) rather than repeating `try/catch` + `res.status(500)` in every function. One middleware normalizes all error responses and maps common Mongoose errors (`CastError`, duplicate keys, validation errors) to sensible HTTP status codes.
- **Client-side route guards are UX, not security.** `PrivateRoute` redirects unauthenticated users away from `/create`, but the actual enforcement is the `protect` middleware on the Express routes — a determined user could bypass the frontend guard entirely, so the backend never trusts the client.

---

## Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string (or local MongoDB)
- A Cloudinary account (free tier) for image uploads

### 1. Clone and install

```bash
git clone https://github.com/srimathaa/blog-app.git
cd blog-app
```

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### 2. Environment variables

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

> `server/.env` is gitignored — never commit real secrets. Generate a `JWT_SECRET` with:
> `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 3. Run it

**Backend** (from `server/`):
```bash
npm run dev
```

**Frontend** (from `client/`, in a separate terminal):
```bash
npm run dev
```

Visit `http://localhost:5173`.

---

## Project Structure

```
blogapp/
├── server/
│   ├── config/          # DB and Cloudinary connection setup
│   ├── controllers/      # Route handler logic
│   ├── middleware/        # auth, validation, error handling, uploads
│   ├── models/            # Mongoose schemas (User, Post, Comment)
│   ├── routes/            # Express route definitions
│   ├── utils/             # AppError, catchAsync, JWT helpers
│   └── server.js
└── client/
    ├── src/
    │   ├── api/            # Axios instance + endpoint functions
    │   ├── components/     # Reusable UI (Navbar, PostCard, PrivateRoute, CommentSection)
    │   ├── context/         # AuthContext
    │   ├── hooks/           # useAuth
    │   ├── pages/            # Route-level components
    │   └── App.jsx
    └── vite.config.js
```

---

## API Overview

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in, sets JWT cookie |
| POST | `/api/auth/logout` | Public | Clears JWT cookie |
| GET | `/api/auth/me` | Private | Get current logged-in user |
| GET | `/api/posts` | Public | List posts (paginated, searchable, tag-filterable) |
| GET | `/api/posts/:slug` | Public | Get a single post by slug |
| GET | `/api/posts/id/:id` | Public | Get a single post by ID |
| POST | `/api/posts` | Private | Create a post |
| PUT | `/api/posts/:id` | Private (author) | Update a post |
| DELETE | `/api/posts/:id` | Private (author) | Delete a post |
| GET | `/api/posts/:postId/comments` | Public | List comments on a post |
| POST | `/api/posts/:postId/comments` | Private | Add a comment |
| DELETE | `/api/comments/:id` | Private (author) | Delete a comment |
| POST | `/api/upload` | Private | Upload an image to Cloudinary |

---

## What I'd Do Next

- Rate limiting on auth routes
- Refresh tokens (current JWTs are long-lived; a refresh/access token pair would reduce exposure)
- Optimistic UI updates for comments/likes
- Full-text search ranking (currently uses MongoDB's basic `$text` search)
- Automated tests (Jest/Supertest for the API, React Testing Library for the frontend)

---

