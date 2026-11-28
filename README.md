# KrishiBondhu AI

A smart farming assistant for farmers in Bangladesh, in Bangla and English.

Getting good farming advice is not always easy. Experts can be hard to reach, and much of what is online is written in English or technical language. KrishiBondhu AI ("Farmer's Friend") puts simple, AI-assisted help in one web app that works on both phones and computers.

## Features

- **Disease scan:** take or upload a crop photo to get a likely diagnosis and advice.
- **AI assistant:** ask farming questions, return to earlier chats, and rate or flag answers.
- **Fertilizer and crop advice:** get suggestions based on your crop, soil and season.
- **Weather:** check current conditions with a farming alert.
- **My crops:** add, view and remove your farm records.
- **Farming guide:** read short, practical tips.
- **Accounts:** register, log in and manage your profile.
- **Admin and advisor panel:** view users, suspend accounts and review flagged AI answers.
- **Two languages:** switch between Bangla and English.

### Still in progress

- Saving advice permanently (the page currently shows sample entries)
- Saving reminders, so they stay after a page refresh
- A live five-day weather forecast
- Pest and disease library
- Password reset screen
- Knowledge base management and usage reports

## Built with

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, JWT authentication
- **Database:** MongoDB with Mongoose
- **Services:** Google Gemini, OpenWeatherMap, Cloudinary, SMTP email
- **Hosting:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Project structure

```text
.
├── frontend/        React web app
├── backend/         Express API
├── database/        Database notes
├── documentation/   Proposal, SRS, system design and diagrams
├── design/          UI designs and user flows
└── README.md
```

## Getting started

### What you need

- Node.js 18 or later
- A MongoDB database (local or Atlas)
- API keys for Gemini, OpenWeatherMap and Cloudinary
- An SMTP account for password reset emails

### 1. Clone the project

```bash
git clone https://github.com/shakib-shahriar-1588/CSE4104-7G-T03-krishibondhu-ai.git
cd CSE4104-7G-T03-krishibondhu-ai
```

### 2. Start the backend

Create a file named `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
WEATHER_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

```

Then run:

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Start the frontend

Create a file named `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Open a second terminal in the project folder and run:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Admin access

New accounts are farmers by default. To open the admin panel at `/admin`, change a user's `role` to `ADMIN` or `ADVISOR` in the database, then log in again.

> Never commit your `.env` files or API keys.

## Roadmap

- **Week 06 (30 Nov – 6 Dec):** Backend development
- **Week 07 (7–13 Dec):** Frontend development
- **Week 08 (14–20 Dec):** AI integration
- **Week 09 (21–27 Dec):** Feature completion
- **Week 10 (28 Dec – 3 Jan):** Testing and debugging
- **Week 11 (4–10 Jan 2027):** Deployment and final delivery

## Team

**CSE4104-7G-T03**

- **Shakib Shahriar** (11230321588), Team Leader: backend, database and AI integration
- **Samia Rahman** (11230321590): frontend, UI/UX design and deployment
- **Tanusree Mistry** (11230321465): testing and AI quality check

Documentation is shared by all three members.

## Documentation

- Project reports and diagrams: [`documentation/`](documentation/)
- UI designs and user flows: [`design/`](design/)

## Course

CSE 4104 – Software Development III, Section 7G  
Department of Computer Science and Engineering  
Northern University of Business and Technology, Khulna

Course teacher: Md. Riaz Mahmud, Assistant Professor

## A note on AI advice

KrishiBondhu AI gives preliminary, AI-generated guidance. It can be wrong. Please check with an agricultural expert or your local agriculture office before making important decisions, especially about chemicals.
