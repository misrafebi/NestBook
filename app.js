const express = require('express')
const app = express()

const path = require('path')
const nocache = require('nocache')
const session = require('express-session')

const env = require('dotenv').config()

const db = require('./config/db')
db()

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname,'public')))

app.use(express.urlencoded({extended:true}))
app.use(express.json())

const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
app.use('/user',userRouter)
app.use('/admin',adminRouter)

app.listen(3001)

module.exports = app