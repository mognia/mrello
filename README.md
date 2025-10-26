---

# Mrello with Next.js & Supabase

<div align="center">
  <br />
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/-Clerk-0072CE?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
    <img src="https://img.shields.io/badge/-@dnd--kit-FAB005?style=for-the-badge&logo=react&logoColor=white" alt="dnd-kit" />
    <img src="https://img.shields.io/badge/-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  </div>
  <h3 align="center">A Trello-Style Productivity App Built with Next.js, Supabase, Clerk & dnd‑kit</h3>
  <br />
</div>

## 📋 Table of Contents

1. [Introduction](#-introduction)
2. [Tech Stack](#-tech-stack)
3. [Features](#-features)
4. [Quick Start](#-quick-start)
5. [Screenshots](#-screenshots)
6. [Deployment](#-deployment)

---

## 🚀 Introduction

**Mrello** is a full-stack task management tool inspired by Trello. <br>
It’s built using **Next.js**, **Supabase**, and **Clerk**, offering a complete real-time **drag-and-drop** workflow for managing boards, columns, and tasks.

---

## ⚙️ Tech Stack

* **Next.js** – React framework with file‑based routing & server components
* **Supabase** – PostgreSQL database + Auth + Real-time APIs
* **Clerk** – Authentication integration
* **@dnd-kit** – Smooth, accessible drag-and-drop
* **TailwindCSS** – Utility‑first styling
* **TypeScript** – Safer and cleaner development

---

## ⚡️ Features

* 📋 **Boards & Columns**
  Create multiple boards and define custom columns.

* ➕ **Dynamic Tasks**
  Add, edit and delete tasks with title, description, assignee, priority & due date.

* 🔄 **Drag & Drop**
  Reorder tasks and move them between columns with smooth animations.

* 📡 **Real‑Time Updates**
  Changes sync instantly across clients via Supabase subscriptions.

* 🔍 **Filtering**
  Filter tasks by priority, due date, and search within a board.

* 🔐 **Auth & Billing**
  Sign up / log in with Clerk and upgrade your plan to create unlimited boards.

* 🚀 **One‑Click Deployment**
  Deploy the app on Vercel with environment variables for Supabase & Clerk.

---



### Clone and Run

```bash
git clone https://github.com/mognia/mrello.git
cd mrello
npm install
```

1. set your credentials and fill in your Supabase & Clerk credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
CLERK_SECRET_KEY=
   ```
2. Start local Supabase emulation (optional):

   ```bash
   supabase start
   supabase db push
   ```
3. Run the development server:

   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Useful Links

* [Next.js Docs](https://nextjs.org/docs)
* [Supabase Docs](https://supabase.com/docs)
* [Clerk Docs](https://clerk.com/docs)
* [dnd-kit Docs](https://docs.dndkit.com/)
* [Tailwind CSS Docs](https://tailwindcss.com/docs)
* [Vercel](https://vercel.com/)

---
