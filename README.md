# Tomato Express - Premium MERN Stack Food Delivery & Admin Panel

This repository hosts the source code for **Tomato Express**, a dynamic, feature-rich online food ordering and restaurant management platform built with the MERN (MongoDB, Express.js, React, Node.js) Stack.

We have unified the client web application and the restaurant administration panel into a single frontend project to run on a single port, connected it securely to MongoDB Atlas, implemented transactional SMS notifications via AWS SNS, and deployed the frontend to Vercel and the backend to AWS EC2 using Docker.

---

## 🌟 Key Updates & Improvements

### 1. Brand Rebranding (Tomato Express)
* Replaced the static raster image logo (`logo.png`) in the customer navbar, footer, and restaurant admin dashboard with a modern, high-performance responsive CSS text logo (**Tomato Express**) styled globally.
* Updated all application references, legal text, and contact emails (`contact@tomatoexpress.com` / `TomatoExpress.com`).

### 2. Mobile Number Integration & Direct Checkout
* **User DB Schema Update**: Added `phone` number storage into the MongoDB User database schema.
* **SignUp Field Integration**: Implemented a **Mobile Number** input field in the signup interface to capture user contact numbers during account creation.
* **Direct Order Placement**: Replaced the Stripe payment redirect flow with a direct order confirmation flow. The checkout button was updated to **"PLACE THE ORDER"**, which immediately posts the order, clears the active shopping cart state, and displays a success notification without redirecting.

### 3. Transactional SMS Notifications via AWS SNS
* Integrated AWS SDK (SNS Client) into the order backend controllers.
* Upon hitting **"PLACE THE ORDER"**, the backend immediately triggers an SMS dispatch via **AWS Simple Notification Service (SNS)**, sending the message `"The order placed is successfully"` to the customer's registered phone number.

### 4. Vercel Frontend Deployment & Routing Proxy
* Deployed the React frontend application securely to **Vercel**: [https://food-delivery-mlgs1.vercel.app](https://food-delivery-mlgs1.vercel.app)
* Configured `vercel.json` with reverse-proxy rewrites mapping all `/api/*` and `/images/*` endpoints directly to the EC2 server (`http://13.51.171.228:4000`). This completely resolves **Mixed Content Warnings** (preventing secure HTTPS websites from requesting insecure HTTP servers).
* Configured explicit route rewrites for React Router SPA (Single Page Application) endpoints (`/login`, `/cart`, `/order`, etc.) targeting the root index `"/"` to resolve direct navigation 404 errors.

### 5. AWS EC2 & Docker Deployment (Backend)
* The backend API server and database connections are deployed on an **AWS EC2** instance.
* Structured inside **Docker Compose** containers for high-availability (`food-backend` on port `4000`, `food-frontend` on port `80`).
* Built a deployment script pipeline using AWS Systems Manager (SSM) for automatic git-pulling and container builds.

### 6. Full-Page Login & Route Guards
* **Role selector capsules**: Switched from pop-ups to a premium full-page login screen with toggles for **Customer** and **Restaurant Admin** roles.
* **Automatic switch on registration**: The signup form registers the user, shows a success notification, and immediately switches back to the login state to allow manual sign-in.
* **Silent Guards & Redirects**:
  - Unauthenticated guests visiting the homepage are silently redirected to `/login`.
  - Unauthenticated guests visiting `/admin` are silently redirected to `/login` with the Admin tab auto-selected.
  - Standard customer users trying to access `/admin` are shown an explicit `Access Denied` notification.

---

## 🛠️ Tech Stack
* **Frontend**: React (Vite), React Router DOM v6, React Toastify, CSS
* **Backend**: Node.js, Express.js, JWT, Bcrypt, AWS SDK (SNS Client)
* **Hosting (Frontend)**: Vercel (HTTPS, serverless reverse proxy)
* **Hosting (Backend)**: AWS EC2 (Dockerized containers, Docker Compose)
* **Database**: MongoDB Atlas (with local file database fallback)
* **Messaging/Alerts**: AWS Simple Notification Service (SNS)

---

## 🚀 How to Run Locally

### 1. Project Structure
```
Food-Delivery/
├── backend/       # Express API Server (Port 4000)
└── frontend/      # Unified React Client + Admin App (Port 5173)
```

### 2. Install Dependencies
Run `npm install` inside both directories:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Configure the Environment
Create a `.env` file inside the `backend` folder:
```env
JWT_SECRET=your_jwt_secret_key
SALT=10
MONGO_URL=mongodb://sateesh6302_db_user:sateeshmlgs630211@ac-cnhg3ee-shard-00-00.kcajood.mongodb.net:27017,ac-cnhg3ee-shard-00-01.kcajood.mongodb.net:27017,ac-cnhg3ee-shard-00-02.kcajood.mongodb.net:27017/tomato?ssl=true&replicaSet=atlas-ogrb7n-shard-0&authSource=admin
PORT=4000

# AWS Credentials for SNS SMS Delivery
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=eu-north-1
```

### 4. Start the Application

#### Start the Backend Server
```bash
cd backend
npm run start
```
*Console should log:*
`🟢 [Ready] MongoDB Atlas is active and listening for requests!`

#### Start the Frontend Client + Admin Server
```bash
cd frontend
npm run dev
```
*Console should log:*
`➜  Local:   http://localhost:5173/`
