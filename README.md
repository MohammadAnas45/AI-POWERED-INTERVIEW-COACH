# 🤖 AI Powered Interview Coach

A full-stack AI-powered interview preparation platform with real-time proctoring, resume analysis, and AI-generated feedback.

---

## 🚀 Getting Started (For Collaborators)

Follow these steps **exactly** to get the project running on your machine.

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- A free [Groq API Key](https://console.groq.com/keys) (for AI features)

---

### 1. Clone the Repository

```bash
git clone https://github.com/MohammadAnas45/AI-POWERED-INTERVIEW-COACH.git
cd AI-POWERED-INTERVIEW-COACH
```

---

### 2. Set Up Environment Variables (REQUIRED)

The server needs secret keys to work. These are **not** included in the repo for security.

```bash
# Navigate to the server folder
cd server

# Copy the example file to create your own .env
copy .env.example .env
```

Now open `server/.env` in any text editor and fill in:

| Variable | What to put |
|---|---|
| `JWT_SECRET` | Any long random string (e.g. `MySecretKey123XYZ456`) |
| `GROQ_API_KEY` | Your free key from [console.groq.com/keys](https://console.groq.com/keys) |
| `MONGO_URI` | `mongodb://localhost:27017/ai_interview_db` (if using local MongoDB) |

> ⚠️ **Without this step, you will see authentication errors and the app will not work.**

---

### 3. Install Dependencies

From the **project root**:

```bash
# Go back to root
cd ..

# Install all dependencies for both client and server
npm run install-all
```

---

### 4. Run the Application

```bash
# Start both server and client together
npm run dev
```

This will start:
- **Backend Server** → `http://localhost:5000`
- **Frontend Client** → `http://localhost:5173`

Open your browser at **http://localhost:5173**

---

## 📁 Project Structure

```
AI-POWERED-INTERVIEW-COACH/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── pages/   # All page components
│       └── context/ # Auth context
├── server/          # Express.js backend
│   ├── routes/      # API routes
│   ├── controllers/ # Business logic
│   ├── models/      # Database models
│   ├── services/    # AI service (Groq)
│   └── .env.example # 👈 Copy this to .env and fill in your keys
└── package.json     # Root scripts
```

---

## ❓ Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `jwt malformed` / `invalid signature` | Missing or wrong `JWT_SECRET` | Make sure `server/.env` exists with a valid `JWT_SECRET` |
| `AI features not working` | Missing `GROQ_API_KEY` | Add your Groq API key to `server/.env` |
| `Cannot connect to server` | Server not running | Run `npm run dev` from root folder |
| `Upload failed` | `uploads/` folder missing | The server auto-creates this on startup — just restart |
| `Port 5000 already in use` | Another process using port 5000 | Kill the process or change `PORT` in `.env` |

---

## 🔑 Getting Your Groq API Key (Free)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Click **API Keys** → **Create API Key**
4. Copy the key and paste it into `server/.env` as `GROQ_API_KEY=gsk_...`

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run server` | Start only the backend server |
| `npm run client` | Start only the frontend |
| `npm run install-all` | Install all dependencies for both client and server |
