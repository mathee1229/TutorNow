# TutorNow - On-Demand Lesson & Topic Marketplace

**TutorNow** is a reverse-bidding tutoring platform engineered for Sri Lankan students (O/L, A/L, University) who need instant single-session doubt clearance without committing to long monthly tuition classes.

---

## 🌟 Key Features

1. **Reverse-Bidding Marketplace:** Students post specific topics, doubt units, and budgets; verified university tutors bid with custom pricing and schedules.
2. **Safe Escrow Guarantee:** 100% of student funds are securely held in platform escrow until the lesson is completed to their satisfaction.
3. **10% Platform Commission:** Automatic 90/10 split (90% to tutor, 10% platform fee) handled dynamically.
4. **Dual Delivery Modes:**
   - **Online:** Instant live video classroom meeting link generation (`meet.jit.si`).
   - **Physical (In-Person):** Privacy-first address protection (only Town/Area is revealed to bidders; exact address is unlocked upon escrow funding).
5. **PayHere Sri Lanka Integration:** Sandbox MD5 signature hash generation and IPN webhook processor for automated escrow capture.
6. **Mutual Reviews:** Star ratings and reviews calculated dynamically into tutor profile averages.

---

## 🎨 Theme & UI Specs

- **Primary Action Accent:** Neon Orange (`#FF5F1F`)
- **Background Surfaces:** Porcelain (`#F7F8F9`)
- **Card Highlights:** White with soft glassmorphic shadows and Lucide React icons.

---

## 🚀 Quick Start (Local Development)

### 1. Spring Boot Backend

The backend includes an embedded H2 database configuration for zero-setup local testing.

```powershell
cd backend
mvn spring-boot:run
```
- Server starts on: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:tutornowdb`)

### 2. React (Vite) Frontend

```powershell
cd frontend
npm install
npm run dev
```
- Web Application starts on: `http://localhost:5173`

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Test Ready)

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Student** | `sandun@student.lk` | `student123` | Active student with posted requests in Combined Maths & Physics |
| **Tutor (Mora)** | `kavindu@tutors.lk` | `tutor123` | University of Moratuwa Engineering graduate (Verified badge) |
| **Tutor (Colombo)** | `nethmi@tutors.lk` | `tutor123` | University of Colombo Chemistry graduate (Verified badge) |
| **Admin** | `admin@tutornow.lk` | `admin123` | Platform Admin |

---

## ☁️ Deployment Guide

### A. Deploy Frontend to Vercel (Free & Instant)
1. Push `tutornow/frontend` to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import the repository and select `/frontend` as the Root Directory.
4. In Build Settings:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**.

### B. Deploy Backend to Render or Railway (Free / Low Cost)
1. Connect your repository to [Railway](https://railway.app) or [Render](https://render.com).
2. Provision a **MySQL Database** service.
3. Deploy the backend using the included [Dockerfile](file:///C:/Users/PC/.gemini/antigravity/scratch/tutornow/backend/Dockerfile).
4. Configure environment variables:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<HOST>:<PORT>/<DB_NAME>?useSSL=false&serverTimezone=UTC`
   - `SPRING_DATASOURCE_USERNAME`: `<DB_USER>`
   - `SPRING_DATASOURCE_PASSWORD`: `<DB_PASSWORD>`
   - `APP_PAYHERE_MERCHANT_ID`: Your PayHere Merchant ID
   - `APP_PAYHERE_MERCHANT_SECRET`: Your PayHere Secret
