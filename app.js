const express = require('express')
const app = express()

const path = require('path')
const nocache = require('nocache')
const session = require('express-session')

const env = require('dotenv').config()

const db = require('./config/db')
db()

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 72 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
    }
}));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())



const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
app.use('/user', userRouter)
app.use('/admin', adminRouter)





app.listen(process.env.PORT, () =>
    console.log('server running')
)


module.exports = app