# Tomato - Premium MERN Stack Food Delivery & Admin Panel

This repository hosts the source code for **Tomato**, a dynamic, feature-rich online food ordering and restaurant management platform built with the MERN (MongoDB, Express.js, React, Node.js) Stack.

We have unified the client web application and the restaurant administration panel into a single frontend project to run on a single localhost port, connected it securely to MongoDB Atlas, and implemented premium UX improvements.

---

## 🌟 Key Updates & Improvements

### 1. Unified Front-End Application
* **One Port for Everything**: Previously, the user site ran on `5173` and the admin panel ran on `5174`. They have now been unified:
  - **User Web Application**: Access at `http://localhost:5173/`
  - **Admin Panel Dashboard**: Access at `http://localhost:5173/admin`
* **Shared Context**: Shared shopping cart context, API handlers, and authentication states across both panels for seamless performance.

### 2. High-Performance Password Hashing
* **Bcrypt Optimization**: Optimized `.env` configurations (setting `SALT=10`) to eliminate high-CPU hashing hangs on registration. Passwords are now hashed in milliseconds.

### 3. Direct MongoDB Atlas Connection (Bypassing DNS SRV Issues)
* **Direct Replica-Set Mapping**: Bypasses local network port 53 DNS SRV blocks by connecting directly to the MongoDB Atlas nodes.
* **Forced IPv4 Preference**: Automatically overrides Node's DNS resolving order (`dns.setDefaultResultOrder("ipv4first")`) to solve connection timeouts on IPv6-only network layers.
* **Robust Environment Loader**: Configured `dotenv` with path resolution to load `.env` correctly from any execution folder.
* **Local Fallback Database**: Includes an automatic fallback to a local JSON file database if the network goes completely offline.

### 4. Unified Full-Page Login & Route Guards
* **Role selector capsules**: Switched from pop-ups to a premium full-page login screen with toggles for **Customer** and **Restaurant Admin** roles.
* **Automatic switch on registration**: The signup form registers the user, shows a success notification, and immediately switches back to the login state to allow manual sign-in.
* **Silent Guards & Redirects**:
  - Unauthenticated guests visiting the homepage `localhost:5173` are silently redirected to `/login`.
  - Unauthenticated guests visiting `/admin` are silently redirected to `/login` with the Admin tab auto-selected.
  - Standard customer users trying to access `/admin` are shown an explicit `Access Denied` notification.

### 5. Shopping Cart Label Refinement
* Swapped the simple `x` in the cart lists for a beautifully styled **"Cancel"** action button.
* Adjusted layout grid columns to give the cancel option adequate spacing without wrapping.

### 6. Synchronous Authentication & State Fixes
* Preserves state synchronously from storage on launch, preventing page flashes or login loops on hard browser refreshes.
* Automatically resets active cart indicators and states in the navbar immediately upon logout.

### 7. Modernized Admin Header Layout
* Replaced the centered "Logout" link and static avatar with a hoverable **profile dropdown menu** in the top-right corner.
* Contains a clean **Logout** link that cleans up the session and redirects directly back to the `/login` page.

---

## 🛠️ Tech Stack
* **Frontend**: React (Vite), React Router DOM v6, React Toastify, CSS
* **Backend**: Node.js, Express.js, JWT, Bcrypt, Multer
* **Database**: MongoDB Atlas (with local file database fallback)
* **Payments**: Stripe Integration

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
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=4000
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
