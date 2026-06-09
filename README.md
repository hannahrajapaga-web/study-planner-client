# 📚 My Study Planner — Frontend

> A clean, responsive React frontend for the My Study Planner application — helping students stay organized with tasks, schedules, and deadline reminders.

🔗 **Live Demo:** https://hannahstudyplanner.vercel.app  
⚙️ **Backend Repo:** https://github.com/hannahrajapaga-web/study-planner  

---

## ✨ Features

- 🔐 **Authentication** — Login and register with JWT token management
- 📊 **Dashboard** — Overview of tasks, subjects, schedules, and notifications
- ✅ **Task Planner** — Add, edit, complete, and delete tasks with deadlines
- 📚 **Subjects Registry** — Manage courses with custom color themes
- 📅 **Weekly Schedule** — Plan and view study blocks for each day
- 🔔 **Notification Bell** — Real-time in-app deadline alerts with unread badge
- 🍅 **Pomodoro Timer** — 25/5/15 minute focus and break timer
- ⚠️ **Overdue Detection** — Overdue tasks highlighted in red
- 🔥 **Toast Notifications** — Success and error feedback on all actions

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Lucide React | Icons |
| React Hot Toast | Toast notifications |

---

## 🎨 Design

- **Font:** Lora (serif, italic headings) + Quicksand (rounded sans-serif body)
- **Color Palette:** Earthy tones — sage, blush, peach, oat, honey, coconut
- **Theme:** Soft, warm, minimal aesthetic designed for a calm study environment

---

## 📁 Project Structure
study-planner-client/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Tasks.jsx
│   │   ├── Subjects.jsx
│   │   ├── Schedule.jsx
│   │   └── Pomodoro.jsx
│   ├── components/
│   │   └── Navbar.jsx
│   ├── api.js
│   ├── App.jsx
│   └── App.css
├── vercel.json
├── package.json
└── vite.config.js

---

## 📱 Pages

### 🏠 Dashboard
- Welcome message with username
- Stats cards: Subjects Tracked, Task Completion %, Scheduled Classes
- Active Study Goal with edit functionality
- Pending Deadlines with overdue highlighting
- Today's Schedule based on current day
- Alert Center with notification feed

### ✅ Tasks
- Add tasks with title, description, deadline, and subject
- Inline edit mode for each task
- Toggle completion with checkbox
- Past deadline validation with popup alert
- Color-coded by subject

### 📚 Subjects
- Create subjects with name and color picker
- Delete subjects (cascades to related tasks and schedules)
- Color-coded subject cards

### 📅 Schedule
- Add study blocks by day, time, and subject
- Weekly agenda view grouped by day
- Delete individual schedule blocks

### 🍅 Pomodoro
- Three modes: Focus (25 min), Short Break (5 min), Long Break (15 min)
- Animated circular progress timer
- Session counter with motivational messages
- Sound alert on timer completion

---

## 🔌 API Integration

All API calls go through `src/api.js` which:
- Sets the base URL to the backend
- Automatically attaches JWT token from localStorage to every request

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- npm

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/hannahrajapaga-web/study-planner-client.git
cd study-planner-client
```

**2. Install dependencies**
```bash
npm install
```

**3. Update API base URL**

In `src/api.js`, change the baseURL to your local backend:
```js
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});
```

**4. Run the development server**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🌐 Deployment

Deployed on **Vercel** with automatic redeployment on every GitHub push.

`vercel.json` handles React Router client-side routing:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 🔒 Authentication Flow

1. User registers/logs in → backend returns JWT token
2. Token stored in `localStorage`
3. Every API request includes `Authorization: Bearer <token>`
4. Protected routes check token existence in `App.jsx`
5. Token expires after 24 hours → user redirected to login

---

## 👩‍💻 Developer

**Hannah** — B.Tech CSE, Anurag University  
GitHub: [@hannahrajapaga-web](https://github.com/hannahrajapaga-web)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).