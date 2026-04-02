# URL Shortener

A full-stack URL shortening service built with Node.js, Express, and MongoDB. This application allows users to create short URLs, track clicks, and manage URL expiration.

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **URL Shortening**: Convert long URLs into short, manageable links
- **Custom Short IDs**: Option to create custom short identifiers (up to 10 characters)
- **URL Expiration**: Set expiration time for shortened URLs
- **Click Tracking**: Monitor how many times a shortened URL has been accessed
- **Automatic Cleanup**: Expired URLs are automatically removed from the database using MongoDB TTL indexes

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **URL Generation**: nanoid
- **Validation**: Custom URL validation utility

## Project Structure

```
URL Shortner/
├── package.json                 # Project dependencies and scripts
├── Backend/
│   ├── server.js                # Main application entry point
│   ├── config/
│   │   └── db.js                # MongoDB connection configuration
│   ├── controllers/
│   │   ├── urlcontroller.js     # URL shortening logic and redirection
│   │   └── usercontroller.js    # User registration and authentication
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT authentication middleware
│   │   └── errorMiddleware.js   # Global error handling
│   ├── models/
│   │   ├── Urlmodel.js          # URL schema with expiration and click tracking
│   │   └── usermodel.js         # User schema for authentication
│   ├── routes/
│   │   ├── urlroute.js          # URL-related API routes
│   │   └── userroute.js         # User authentication routes
│   └── utils/
│       └── validateurl.js       # URL validation utility
```

## API Endpoints

### User Routes (`/users`)
- `POST /users/register` - Register a new user
- `POST /users/login` - Login user and receive JWT token

### URL Routes (`/shortner`)
- `POST /shortner` - Create a new shortened URL (requires authentication)
- `GET /shortner/:shortId` - Redirect to original URL and increment click count (requires authentication)

## Usage

1. **Register/Login**: Create an account or login to get a JWT token
2. **Shorten URL**: Send a POST request to `/shortner` with:
   - `originalUrl`: The URL to shorten (required)
   - `customId`: Custom short ID (optional, max 10 characters)
   - `expireIn`: Expiration time in hours (optional)
   - Include JWT token in Authorization header: `Bearer <token>`
3. **Access Short URL**: Visit `GET /shortner/:shortId` to redirect to the original URL

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation for URLs
- Protected routes requiring authentication
- Error handling middleware

## Development

- Uses `nodemon` for development server with auto-restart
- Colors package for console logging
- Express async error handling
- MongoDB TTL indexes for automatic expiration