#  URL Shortener

A full-stack URL shortening service built with **Node.js**, **Express**, and **MongoDB**. Create short, shareable links from long URLs, set custom aliases, configure expiration windows, and track click activity — all behind JWT-based user authentication.

---

##  Features

- **User Authentication** – Register and log in with JWT-based authentication
- **URL Shortening** – Convert long URLs into short, manageable links
- **Custom Short IDs** – Optionally choose your own short identifier (up to 10 characters)
- **URL Expiration** – Set an expiration time for any shortened URL
- **Click Tracking** – Track how many times a short link has been visited
- **Automatic Cleanup** – Expired URLs are removed automatically via MongoDB TTL indexes

---

##  Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing
- nanoid for short ID generation
- express-validator for request validation
- express-async-handler for cleaner async error handling
- nodemon for local development

**Frontend**
- JavaScript-based client (`Frontend/`) that consumes the backend API

---

##  Project Structure

```
URL-Shortner/
├── package.json                 # Root dependencies and scripts
├── Backend/
│   ├── server.js                # Application entry point
│   ├── config/
│   │   └── db.js                # MongoDB connection setup
│   ├── controllers/
│   │   ├── urlcontroller.js     # URL shortening & redirection logic
│   │   └── usercontroller.js    # User registration & authentication
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT authentication middleware
│   │   └── errorMiddleware.js   # Global error handling
│   ├── models/
│   │   ├── Urlmodel.js          # URL schema (expiration, click tracking)
│   │   └── usermodel.js         # User schema
│   ├── routes/
│   │   ├── urlroute.js          # URL-related API routes
│   │   └── userroute.js         # Authentication routes
│   └── utils/
│       └── validateurl.js       # URL validation helper
└── Frontend/                     # Client application
```

---

##  Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A running [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/officialyyraj/URL-Shortner.git
   cd URL-Shortner
   ```

2. Install backend dependencies

   ```bash
   npm install
   ```

3. Install frontend dependencies

   ```bash
   cd Frontend
   npm install
   cd ..
   ```

4. Create a `.env` file in the project root with the following variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

### Running the App

Run the backend in development mode (auto-restart with nodemon):

```bash
npm run server
```

Run the backend and frontend together:

```bash
npm run dev
```

Run the backend in production mode:

```bash
npm start
```

---

## 📡 API Endpoints

### User Routes (`/users`)

| Method | Endpoint           | Description                      |
| ------ | ------------------ | -------------------------------- |
| POST   | `/users/register`  | Register a new user              |
| POST   | `/users/login`     | Log in and receive a JWT token   |

### URL Routes (`/shortner`)

| Method | Endpoint              | Description                                                  | Auth Required |
| ------ | --------------------- | ------------------------------------------------------------- | :-----------: |
| POST   | `/shortner`           | Create a new shortened URL                                     | ✅            |
| GET    | `/shortner/:shortId`  | Redirect to the original URL and increment the click count    | ✅            |

---

##  Usage

1. **Register or log in** to obtain a JWT token.
2. **Shorten a URL** by sending a `POST` request to `/shortner` with:
   - `originalUrl` *(required)* – the URL to shorten
   - `customId` *(optional)* – a custom short ID, up to 10 characters
   - `expireIn` *(optional)* – expiration time in hours
   - Include the token in the request header: `Authorization: Bearer <token>`
3. **Visit the short link** via `GET /shortner/:shortId` to be redirected to the original URL.

---

##  Security

- Passwords are hashed with bcrypt before being stored
- All sensitive routes are protected by JWT authentication
- Incoming URLs are validated before being shortened
- Centralized error-handling middleware for consistent error responses
- Expired links are purged automatically via MongoDB TTL indexes

---

##  Contributing

Contributions, issues, and feature requests are welcome! Feel free to open a pull request or submit an issue.

## 📄 License

This project is licensed under the ISC License.
