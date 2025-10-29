🎬 Favorite Movies & TV Shows Management Web Application

A full‑stack web application that helps users manage their favorite movies and TV shows.  
Users can add, edit, delete, and view entries — including movie/show details and image uploads using Cloudinary.  
The project is built with React (Vite + TypeScript + TailwindCSS) on the frontend and Node.js + Express + Prisma + MySQL on the backend.

<img width="1340" height="631" alt="Screenshot5" src="https://github.com/user-attachments/assets/f67c6e3e-5b9c-4e6b-9faa-cbe68c643c78" />
<img width="1342" height="628" alt="Screenshot4" src="https://github.com/user-attachments/assets/7c56e06c-6fb1-43ab-aec6-4a7f0bbfc583" />
<img width="1347" height="635" alt="Screenshot3" src="https://github.com/user-attachments/assets/bbfa52cb-89ef-4f1b-9a9f-9b8b3980a332" />
<img width="1359" height="639" alt="Screenshot2" src="https://github.com/user-attachments/assets/4aa9e1da-2c3a-4141-8af9-3f84ca484c41" />
<img width="1349" height="641" alt="Screenshot 1" src="https://github.com/user-attachments/assets/72f8ca0f-315b-4a4b-abbd-46e8150fc2ae" />


🧑‍💻 Overview

This app allows you to maintain and manage movie and TV show records with detailed metadata:
- Title, Type (Movie/TV Show)
- Director, Budget, Location
- Duration, Year/Time
- Image Upload (stored on Cloudinary)

The project features validation, responsive UI components, modal dialogs for editing, and database persistence with Prisma/MySQL integration.

---

🧩 Tech Stack

### Frontend
- React (Vite + TypeScript)
- TailwindCSS
- Axios

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL (Aiven Cloud)

### Tools & Libraries
- Zod (Validation)
- Cloudinary (Image Hosting)

---
⚙️ Setup Instructions

Follow these steps to run both the frontend and backend locally.

### 🪄 Step 1 — Clone the Repository

```bash
git clone https://github.com/<your-username>/movies_manage.git
cd movies_manage


⚙️ Backend Setup (/backend)
1️⃣ Navigate to backend directory
  cd backend
2️⃣ Install dependencies
  npm install
3️⃣ Create a .env file in /backend and add:
# Database connection (Aiven MySQL)
  DATABASE_URL="mysql://avnadmin:AVNS_EyxwpiAHnUQG0yuWl_R@mysql-30bf9984-siddhivinayaka291-5817.l.aivencloud.com:23838/defaultdb"

# Server configuration
  PORT=5000

# Cloudinary (for image hosting)
  CLOUDINARY_CLOUD_NAME="diqynm3ie"
  CLOUDINARY_API_KEY="641644521148565"
  CLOUDINARY_API_SECRET="S8b4LFThZAi2VcS3Rr28RjJL73A"
⚠️ Replace Cloudinary values with your actual credentials from Cloudinary.

4️⃣ Define Prisma Schema
  File: backend/prisma/schema.prisma

prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Movie {
  id        Int      @id @default(autoincrement())
  title     String
  type      String
  director  String
  budget    String
  location  String
  duration  String
  yearTime  String
  imageUrl  String?
  createdAt DateTime @default(now())
}
5️⃣ Push schema to database
  npx prisma db push
  (Optional) Open Prisma Studio to visualize the data:
  npx prisma studio
  It will open at http://localhost:5555

6️⃣ Start the backend server
  npm run dev
  The server will start at: http://localhost:5000

🌐 Frontend Setup (/frontend)
1️⃣ Navigate to frontend directory
  cd ../frontend
2️⃣ Install dependencies
  npm install
3️⃣ Start the React application
  npm run dev
  Access the app at: http://localhost:5173



🗂️ Folder Structure

movies_manage/
├─ backend/
│  ├─ prisma/
│  │  └─ schema.prisma
│  ├─ src/
│  │  ├─ config/
│  │  │  └─ cloudinary.ts
│  │  ├─ controllers/
│  │  └─ index.ts
│  ├─ .env
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ setup.ps1 / setup.sh
│
├─ frontend/
│  ├─ public/
│  │  ├─ download1.jfif
│  │  ├─ download2.jfif
│  │  └─ vite.svg
│  ├─ src/
│  │  ├─ assets/
│  │  ├─ components/
│  │  │  ├─ MovieTable.tsx
│  │  │  ├─ MovieForm.tsx
│  │  │  ├─ Modal.tsx
│  │  │  └─ ConfirmationModal.tsx
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  └─ index.css
│  ├─ tailwind.config.ts
│  ├─ vite.config.ts
│  └─ package.json
│
└─ README.md
