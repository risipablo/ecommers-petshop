
const express = require('express')
const cors = require('cors')
const Db = require("./config/database")
const productRoutes = require ('./routes/routerProducts')

require('dotenv').config()

const app = express()



const corsOption = {
    origin: ['http://localhost:5173','http://localhost:5174','https://ecommers-petshop.onrender.com',"https://ecommers-petshop.vercel.app"],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true,
}


app.use(express.json()) 
app.use(cors(corsOption))

Db()

app.use('/api',productRoutes)

app.listen(3001,() => {
    console.log("Servidor corriendo en el local")
})