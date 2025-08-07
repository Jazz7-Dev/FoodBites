# Food Delivery App

**Live Demo:** [https://client-iota-lyart.vercel.app](https://client-iota-lyart.vercel.app)

## 🚀 Project Overview

A full-stack Food Delivery application where users can browse restaurants, add items to their cart, and place orders securely. It includes:

* **User Authentication**: Sign up/in with email/password and OAuth providers.
* **JWT Authorization**: Secure API endpoints with JSON Web Tokens.
* **Responsive UI**: Built with React and Tailwind CSS for mobile-first design.
* **RESTful API**: Node.js (Express) backend for handling data operations.

## 🧰 Tech Stack

* **Frontend:** React, Tailwind CSS, React Router
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Authentication:** JSON Web Tokens (JWT), OAuth (Google, GitHub)
* **Deployment:** Vercel (Frontend), Render/Heroku (Backend)
* **CI/CD:** GitHub Actions → Vercel/Render

## 🔥 Key Features

1. **User Accounts**: Register/login with email & OAuth (Google/GitHub).
2. **JWT Protected Routes**: Secure endpoints for placing orders and viewing user profile.
3. **Restaurant Listings**: Browse restaurants with search and category filters.
4. **Order Management**: Add to cart, checkout flow, order history.
5. **Responsive Design**: Works seamlessly on mobile, tablet, and desktop.

## 📂 Folder Structure

```
├── client/                # React frontend
│   ├── public/
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── services/      # API calls
│       └── App.js         # Root component
├── server/                # Node.js backend
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth & error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   └── server.js          # Entry point
└── .github/
    └── workflows/         # CI/CD pipelines
```

## ⚙️ Installation & Setup

### Prerequisites

* Node.js v14+
* npm or yarn
* MongoDB Atlas URI

### Clone & Setup Backend

```bash
git clone https://github.com/Jazz7-Dev/food-delivery-app.git
cd food-delivery-app/server
npm install
cp .env.example .env
# Set MONGO_URI, JWT_SECRET, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET
npm run dev
```

### Setup Frontend

```bash
cd ../client
npm install
cp .env.example .env
# Set REACT_APP_API_URL, REACT_APP_OAUTH_CLIENT_ID
npm run start
```

## 🎯 Usage

1. Register or log in using email/password or Google/GitHub.
2. Browse the restaurant list and filter by cuisine.
3. Add desired items to the cart.
4. Checkout and view order confirmation.
5. View order history in your profile.

## 🔒 Authentication Flow

1. **OAuth**: User clicks Google/GitHub → redirected for consent → backend exchanges code for access token.
2. **JWT**: On login/sign-up, backend issues a JWT → stored in `localStorage` → sent on each API request via `Authorization` header.

## 🚢 Deployment & CI/CD

* **Frontend** deployed on Vercel: auto-deploys on push to `main`.
* **Backend** deployed on Render: configured with GitHub Actions for tests and deployment.



*Built with ❤️ by Devansh (Jazz7-Dev)*
