# 🌐 Job Dekho — Frontend (React + Vite)

> Part of the **Job Dekho** full-stack job portal project.

---

## 🔗 Project Repositories

| Repo | Description |
|------|-------------|
| **[🌐 Frontend (this repo)](https://github.com/aayRJ23/Project-Job-Dekho-Client)** | React + Vite SPA |
| **[📦 Backend (Server)](https://github.com/aayRJ23/Project-Job-Dekho-Server)** | Express + MongoDB REST API + Socket.IO |
| **[🤖 ChatBot](https://github.com/aayRJ23/ChatBot-JobDekho)** | Flask ML chatbot microservice |

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
- [Environment Variables (.env Setup)](#environment-variables-env-setup)
- [Installation & Running](#installation--running)
- [Role-Based Access](#role-based-access)
- [Real-time Notifications](#real-time-notifications)
- [Chatbot Integration](#chatbot-integration)

---

## Overview

The frontend is a **React 18 + Vite** single-page application (SPA) that provides a clean, responsive job portal UI. It communicates with the Express backend via Axios (REST) and Socket.IO (real-time), and with the Flask chatbot via a simple fetch call.

The app supports two distinct user roles — **Employer** and **Job Seeker** — with role-based views, protected routes, and a full notification system.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI library |
| Vite | Build tool & dev server |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP requests to backend |
| Socket.IO Client | Real-time notifications |
| React Hot Toast | Toast notifications |
| Framer Motion | Animations |
| React Icons + FontAwesome | Icon sets |

---

## Project Structure

```
Project-Job-Dekho-Client/
├── public/
│   ├── CVs/                     # Sample resume images (cv1.jpg – cv5.jpg)
│   └── *.png / *.jpg            # Hero images, logos
├── src/
│   ├── components/
│   │   ├── Application/
│   │   │   ├── Application.jsx       # Job application form (seeker)
│   │   │   ├── MyApplications.jsx    # Seeker's application list with status
│   │   │   └── ResumeModal.jsx       # Modal to preview resume image
│   │   ├── Auth/
│   │   │   ├── Login.jsx             # Login form
│   │   │   └── Register.jsx          # Registration form (role selection)
│   │   ├── Chatbot/
│   │   │   └── Chatbot.jsx           # Floating chatbot widget (calls Flask API)
│   │   ├── Details/
│   │   │   └── Details.jsx           # Animated welcome details component
│   │   ├── Home/
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── HeroSection.jsx       # Top banner
│   │   │   ├── HowItWorks.jsx        # Steps section
│   │   │   ├── PopularCategories.jsx # Job category tiles
│   │   │   └── PopularCompanies.jsx  # Company showcase
│   │   ├── InterviewDashboard/
│   │   │   └── InterviewDashboard.jsx # Interview schedule view (both roles)
│   │   ├── Job/
│   │   │   ├── Jobs.jsx              # Browse all active jobs
│   │   │   ├── JobDetails.jsx        # Single job detail page
│   │   │   ├── PostJob.jsx           # Employer: post a new job
│   │   │   └── MyJobs.jsx            # Employer: manage own jobs
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx            # Top navigation with notification badge
│   │   │   └── Footer.jsx            # Footer
│   │   ├── NotFound/
│   │   │   └── NotFound.jsx          # 404 page
│   │   └── Notifications/
│   │       └── Notifications.jsx     # Full notification list page
│   ├── App.jsx                       # Root component, routes, socket setup
│   ├── App.css                       # Global styles
│   ├── main.jsx                      # Entry point, Context provider
│   └── socket.js                     # Socket.IO client instance
├── .env                              # Environment variables
├── index.html
├── vite.config.js
└── package.json
```

---

## Pages & Features

### For Everyone
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Landing page — hero, how it works, categories, companies |
| `/login` | `Login` | Login form |
| `/register` | `Register` | Registration with role selector |
| `/job/getall` | `Jobs` | Browse all active job listings |
| `/job/:id` | `JobDetails` | View full details of a single job |

### For Job Seekers
| Route | Component | Description |
|-------|-----------|-------------|
| `/application/:id` | `Application` | Submit application (cover letter + resume upload) |
| `/applications/me` | `MyApplications` | Track all submitted applications and their status |
| `/interview-dashboard` | `InterviewDashboard` | View scheduled interviews |
| `/notifications` | `Notifications` | Full notification history |

### For Employers
| Route | Component | Description |
|-------|-----------|-------------|
| `/job/post` | `PostJob` | Post a new job listing |
| `/job/me` | `MyJobs` | View, edit, expire, delete own jobs + manage applications |
| `/interview-dashboard` | `InterviewDashboard` | Manage interview schedules |
| `/notifications` | `Notifications` | Notifications when seekers apply |

---

## Environment Variables (.env Setup)

Create a `.env` file in the **root** of the client project (same level as `package.json`):

```env
# URL of the Flask chatbot service
VITE_CHATBOT_URL=http://127.0.0.1:5000
```

> In Vite, all environment variables exposed to the browser **must** start with `VITE_`.

### If you deploy the chatbot to a server, update this to:

```env
VITE_CHATBOT_URL=https://your-chatbot-domain.com
```

> ⚠️ **Never commit `.env` to Git.** It is already listed in `.gitignore`.

---

## Installation & Running

### Prerequisites

- Node.js v18+
- npm
- Backend server running on `http://localhost:4000`
- Chatbot (optional) running on `http://127.0.0.1:5000`

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/aayRJ23/Project-Job-Dekho-Client.git
cd Project-Job-Dekho-Client

# 2. Install dependencies
npm install

# 3. Create environment file
echo "VITE_CHATBOT_URL=http://127.0.0.1:5000" > .env

# 4. Start development server
npm run dev
```

The app will open at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Role-Based Access

The app uses a **React Context** (`Context` in `main.jsx`) to store the logged-in user's role globally. Components conditionally render UI based on `user.role`:

- **Navbar** — shows "Post a Job" and "My Jobs" links only to Employers; shows "My Applications" only to Seekers
- **Jobs page** — "Apply Now" button shown only to Job Seekers
- **MyJobs** — visible only to Employers; contains application review panel
- **Chatbot** — only rendered when `isAuthorized` is true

---

## Real-time Notifications

Notifications are powered by **Socket.IO**. Here's how it works end-to-end:

1. On login, the client connects to the Socket.IO server and emits `register` with the user's `_id`
2. The server maps that `userId → socketId`
3. When a job is posted, an application submitted, accepted, rejected, or a final verdict set — the server emits `new_notification` to the relevant user's socket
4. The client catches `new_notification` in `App.jsx` and:
   - Increments the unread badge in the Navbar
   - Prepends the notification to the live list

The **Notifications page** (`/notifications`) shows the full persisted history fetched from the database and marks all as read on visit.

---

## Chatbot Integration

The chatbot widget (`Chatbot.jsx`) is a floating button (💬) visible on every page when the user is logged in. It:

1. Takes user's free-text query as input
2. Sends a `POST` request to `{VITE_CHATBOT_URL}/predict` with body `{ "User Input": "..." }`
3. Displays the ML model's response in a chat bubble

See the [ChatBot repo](https://github.com/aayRJ23/ChatBot-JobDekho) for model details.

---

## Notes

- The backend API base URL is hardcoded as `http://localhost:4000` in component files. For production, consider moving this to an environment variable like `VITE_API_URL`.
- Resume uploads accept **image files only** (PNG, JPG, WEBP) — this matches the backend's Cloudinary upload restriction.
- The `socket.js` file exports a single shared Socket.IO client instance to avoid duplicate connections.