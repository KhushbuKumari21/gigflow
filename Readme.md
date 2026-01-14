# GigFlow – Mini Freelance Marketplace Platform

GigFlow is a **full‑stack freelance marketplace application** where clients can post jobs (Gigs) and freelancers can apply by placing bids. Clients can review bids and hire **only one freelancer per gig**, with transactional safety and real‑time updates.

This project fully satisfies the **Full Stack Development Internship Assignment** requirements.

## 📌 Features

### 🔐 Authentication

- Secure user registration & login
- Password hashing using bcrypt
- JWT-based authentication
- JWT stored in **HttpOnly cookies**
- Protected routes (frontend & backend)

### 👥 User Roles

- No hard-coded roles
- Any authenticated user can:

  - Post a gig (Client behavior)
  - Apply to gigs (Freelancer behavior)

### 📄 Gig Management

- Create a gig (Title, Description, Budget)
- Browse all **open gigs**
- Search gigs by title
- Gig status lifecycle:

  - `open` → `assigned`

### 💼 Bidding System

- Place bids on gigs
- Bid includes:

  - Price
  - Proposal message

- View all bids for a gig (only gig owner)

### 🧑‍💼  Logic

- Client can hire **only one freelancer** per gig
- On hire:

  - Selected bid → `hired`
  - All other bids → `rejected`
  - Gig status → `assigned`

- Hiring is **transaction-safe** (no race condition)

### ⚡ Real-Time Updates

- Socket.IO integration
- Real-time hire notifications
- User-specific socket rooms

---

## 🛠️ Tech Stack

### Frontend

- React.js (Vite)
- Tailwind CSS
- Redux Toolkit
- Axios (with credentials)
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO

---

## 📁 Project Structure

```
GigFlow/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── gig.controller.js
│   │   └── bid.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Gig.js
│   │   └── Bid.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── gig.routes.js
│   │   └── bid.routes.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Gigs.jsx
│   │   │   ├── GigDetails.jsx
│   │   │   └── PostGig.jsx
│   │   ├── redux/
│   │   │   ├── authSlice.js
│   │   │   └── store.js
│   │   ├── socket.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│
└── README.md│

## 🔑 Environment Variables

### Backend (`backend/.env`)

```

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/gigflow
JWT_SECRET=supersecretkey

```

## ▶️ Running the Project Locally

### 1️⃣ Clone Repository

```

git clone https://github.com/KhushbuKumari21/gigflow
cd gigflow

```

### 2️⃣ Backend Setup
```
cd backend
npm install
npm run dev

```
Backend runs on: **[http://localhost:5000]**


### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev

```

Frontend runs on: **[http://localhost:5173]**

---
## 🔌 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/logout`

### Gigs

* `GET /api/gigs`
* `POST /api/gigs`

### Bids

* `POST /api/bids`
* `GET /api/bids/:gigId`
* `PATCH /api/bids/:bidId/hire`

---
## 👩‍💻 Author

**Khushbu Kumari**
Full Stack Developer

