
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const DB = require('./config/database')
const productRoutes = require ('./routes/routerProducts')
const authRoutes = require ('./routes/authRoutes')

require('dotenv').config()
const app = express()

DB()

const corsOption = {
    origin: ['http://localhost:5173','http://localhost:5174',"https://ecommers-petshop.vercel.app","https://ecommers-petshop.onrender.com"],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
}


app.use(express.json()) 
app.use(cookieParser())
app.use(cors(corsOption))


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    console.log('Headers:', req.headers)
    next()
})


app.use('/api',productRoutes)
app.use('/api/auth',authRoutes)


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(3001,() => {
    console.log("Servidor corriendo en el local")
})