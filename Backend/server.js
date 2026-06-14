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
const cors = require('cors')
app.use(cors());
app.use('/shortner', urlRoutes)
app.use('/users',userRoutes)
app.use(errorHandler)  // Add error handling middleware

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})