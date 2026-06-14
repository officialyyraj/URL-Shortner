const express =require('express')
const urlRoutes = require('./routes/urlroute')
const userRoutes = require('./routes/userroute')
const colors = require('colors')
const PORT = process.env.PORT || 5000
const errorHandler = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
require('dotenv').config()
connectDB()
const app = express()
app.use(express.json()) // middleware to parse json body of request
app.use(express.urlencoded({extended: false})) // middleware to parse urlencoded body of request
// Enable CORS in development only
const cors = require('cors')
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173'
if(process.env.NODE_ENV !== 'production'){
    app.use(cors({ origin: FRONTEND_ORIGIN }))
}
app.use('/shortner', urlRoutes)
app.use('/users',userRoutes)
app.use(errorHandler)  // Add error handling middleware

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})