# 💊 PillPal

**PillPal** is a **full-stack MERN application** that helps users find **safe and affordable alternatives to medicines** using **AI**.  
The application focuses on **secure authentication**, **performance optimization**, and **API protection**, making it a practical, production-oriented project.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Signup, Login, Forgot Password, Reset Password
- **JWT-based authentication**
- Secure password hashing using **bcrypt**
- Protected routes for authenticated users

---

### 📧 Email OTP Verification
- OTP-based verification for signup and password reset
- OTP delivery via **Nodemailer**
- OTP expiry handling for improved security

---

### 🤖 AI-Powered Medicine Alternatives
- Integrated with **Gemini API** to suggest safe medicine substitutes
- Optimized with **Redis caching** to reduce repeated AI calls
- Faster responses for frequently searched medicines

---

### 🚦 API Rate Limiting (Production-Grade)
- Implemented **Token Bucket rate limiting** using **Redis (Upstash)**
- Protects sensitive routes such as:
  - Login & Signup
  - OTP & Password Reset
  - AI search (Gemini API)
- Prevents abuse, brute-force attempts, and excessive API usage
- Different rate limits applied per route based on cost and sensitivity

---

### 🗂️ State Management with Redux
- Global state handled using **Redux Toolkit**
- Async API handling using **Redux Thunks**
- Centralized error handling for API failures and rate-limit responses
- Avoids prop drilling and ensures predictable state flow

---

### 🎨 Modern & Responsive UI
- Built using **Tailwind CSS**
- Fully responsive across desktop and mobile devices
- Clean, user-friendly interface with loading states and error feedback

---

## 🛠️ Tech Stack

### Frontend
- React
- Redux Toolkit
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Redis (Upstash)

### Security & Utilities
- JWT Authentication
- Bcrypt Password Hashing
- Nodemailer (Email Service)
- Token Bucket Rate Limiting with Redis + Lua

### AI Integration
- Gemini API

---

## 📌 Key Engineering Highlights

- Redis-backed **atomic rate limiting** using Lua scripts  
- External API protection to control cost and abuse  
- Proper HTTP status handling (`429 Too Many Requests`)  
- Clean separation of concerns using Express middleware  
- Scalable architecture suitable for real-world applications  

---

## 📄 Note

This project was built with a focus on **real-world backend practices**, including security, performance optimization, and clean state management, making it suitable as a **production-ready portfolio project**.