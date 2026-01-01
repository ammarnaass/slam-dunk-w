# 🏀 Slam Dunk Ultimate - Streaming & Community Platform

A professional, full-stack streaming platform for the "Slam Dunk" anime series, featuring advanced user management, interactive content, and a companion mobile application.

![Platform Banner](https://slam-dunk-w.vercel.app/og-image.jpg)

## 🌟 Overview

This project provides a premium streaming experience tailored for anime fans. It combines a high-performance **Next.js 15 Web App** with a **Flutter Mobile App**, all powered by a robust **Prisma + PostgreSQL** backend.

### 🌐 Live Web App
[https://slam-dunk-w.vercel.app](https://slam-dunk-w.vercel.app)

---

## ✨ Core Features

### 🎞️ Streaming Experience
- **Complete Library**: All 101 episodes of Slam Dunk in various qualities.
- **Smart Player**: Fast-loading video player with support for Mega.nz and server switching.
- **Progress Tracking**: Automatic history tracking and "Continue Watching" functionality.
- **Watchlist**: Save your favorite episodes and movies to your personal list.

### 🍱 Content & Community
- **Character Database**: Detailed profiles of players, teams, and staff with stats and positions.
- **Latest News**: Real-time updates on the Slam Dunk world.
- **Comments & Reviews**: Share your thoughts on episodes and characters.

### 👤 User Profiles
- **Personalized Space**: Manage your profile picture (Base64), gender, birthdate, and contact info.
- **Auth Integration**: Secure login via email/password or **Google Sign-In**.
- **Role Awareness**: Dedicated badges for premium members and administrators.

### ⚙️ Admin Dashboard (The Control Center)
- **Slider Management**: Fully dedicated interface for managing the homepage hero slider with visual previews.
- **User & Subscriber Management**: Monitor registrations, manage user roles, and track subscriptions.
- **Content Management**: Effortlessly add, update, or remove animes, episodes, and characters.
- **Site Branding**: Update logos, favicons, and site settings directly via Base64 (optimized for Vercel persistence).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend (Web)** | Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons |
| **Mobile App** | Flutter, Dart |
| **Backend / API** | Next.js API Routes, Server Actions |
| **Database** | Prisma ORM, PostgreSQL |
| **Authentication** | JWT (Jose), Bcrypt, Google Cloud Console (OAuth 2.0) |
| **Styling** | Vanilla CSS Animations, Framer Motion (Subtle) |
| **Infrastructure** | Vercel (Production), GitHub (CI/CD) |

---

## 📱 Mobile Integration (Flutter)

The project includes a native Flutter application (`/flutter_app`) that syncs perfectly with the web backend.
- **Unified Auth**: Same account works on web and mobile.
- **Cross-Platform Sync**: Watchlist and History sync across devices.
- **Premium Design**: Material Design 3 implementation for a modern feel.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL Database
- Google Cloud Console Project (for OAuth)

### 2. Environment Variables
Create a `.env` file in the root:
```env
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_secret"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_id"
```

### 3. Installation
```bash
# Install dependencies
npm install

# Push database schema
npx prisma db push

# Run development server
npm run dev
```

---

## 🔑 Admin Access

Administrators can access the control panel at `/admin`.
- **Default Login**: Provided during the first setup (contact developer for staging creds).
- **Google Admin**: Users with emails matching the admin configuration are automatically granted elevated permissions.

---

## 🤝 Contribution & Support

Contributions are welcome! If you're looking to help improve the basketball streaming experience, feel free to fork and PR.

## 📄 License

Open source under the [MIT License](LICENSE).

---
Developed with ❤️ for the Slam Dunk community.
