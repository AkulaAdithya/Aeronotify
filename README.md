# ✈ AeroNotify

> Real-time flight tracking and automated email notification system.

AeroNotify alerts passengers instantly about gate changes, flight delays, and status updates via email. Built with the MERN stack.

---

## 🏗 Architecture

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS v4       |
| Backend    | Node.js, Express.js                   |
| Database   | MongoDB (Mongoose ODM)                |
| Auth       | JWT + Bcrypt                          |
| Email      | Nodemailer (Google SMTP)              |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Gmail account with App Password for SMTP

### 1. Clone & Install

```bash
# Server
cd server
cp .env.example .env    # Edit with your credentials
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aeronotify
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password
ADMIN_EMAIL=admin@aeronotify.com
ADMIN_PASSWORD=your_secure_admin_password
```

### 3. Seed Admin Account

```bash
cd server
npm run seed
# Creates the admin account specified in your .env
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 📡 API Endpoints

| Method | Endpoint                       | Auth | Description               |
|--------|--------------------------------|------|---------------------------|
| POST   | `/api/auth/login`              | ❌   | Admin login               |
| GET    | `/api/flights`                 | ❌   | Get all flights           |
| GET    | `/api/flights/:flightNumber`   | ❌   | Get single flight         |
| POST   | `/api/flights`                 | ✅   | Create flight             |
| PUT    | `/api/flights/:id`             | ✅   | Update flight (+ alerts)  |
| DELETE | `/api/flights/:id`             | ✅   | Delete flight             |
| POST   | `/api/passengers/register`     | ❌   | Subscribe to flight       |
| GET    | `/api/passengers/:flightNumber`| ✅   | Get subscribers           |
| GET    | `/api/health`                  | ❌   | Health check              |

---

## 📧 Email Alerts

When an admin updates a flight's **status** or **gate**, the system automatically:
1. Queries all passengers subscribed to that flight
2. Sends individual HTML email alerts via Google SMTP
3. Emails dispatch **asynchronously** — the dashboard never blocks

---

## 👥 User Roles

- **Passenger**: Search flights, subscribe to alerts (no account needed)
- **Admin**: Login, manage flights (CRUD), trigger automated alerts
