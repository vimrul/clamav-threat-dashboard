# 🛡️ ClamAV Threat Dashboard

A modern full-stack dashboard to visualize ClamAV scan reports in a clean, searchable, and sortable interface. Built with **FastAPI** for the backend and **React + TailwindCSS** for the frontend. Designed for scalability with Docker and persistent volume support.

---

## 📦 Features

- 🔍 Searchable and sortable table of scan results
- 🌗 Dark/Light mode toggle with local preference saving
- 📊 Summary statistics (total reports, clean VMs, threats found)
- ⬇ Export scan reports to CSV (PDF coming soon)
- 📦 Dockerized backend (PostgreSQL + FastAPI)
- 📦 Dockerized frontend (React + Vite + TailwindCSS)
- 🔄 Automatically fetches live scan reports from the backend
- 💾 Persistent storage of ClamAV scan reports in PostgreSQL

---

## 🚀 Getting Started

### 1. 📁 Clone the Repository

```bash
git clone https://github.com/vimrul/clamav-threat-dashboard.git
cd clamav-threat-dashboard
```

### 2. ⚙️ Environment Setup

Create a `.env` file in the project root:

```env
POSTGRES_USER=clamav
POSTGRES_PASSWORD=securepassword
POSTGRES_DB=clamavdb
POSTGRES_PORT=5432
```

---

### 3. 🐳 Run with Docker Compose

```bash
docker-compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/redoc

---

## 📁 Project Structure

```
clamav-threat-dashboard/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   └── database.py
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   └── components/
│   │       └── DarkModeToggle.jsx
│   └── public/
├── docker-compose.yml
└── README.md
```

---

## 💡 Future Enhancements

- 📄 PDF export of reports
- 📈 Charts for threat trends
- 📤 Upload scan reports manually
- 🔐 Auth & RBAC

---

## 📃 License

MIT © 2025 [Mohammad Imrul Hasan]