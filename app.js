const express = require('express')
const app = express()
const flash = require('connect-flash');


const path = require('path')
const nocache = require('nocache')
const session = require('express-session')

const env = require('dotenv').config()
const passport=require('./config/passport')
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

app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(passport.initialize())
app.use(passport.session())

const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
app.use('/user', userRouter)
app.use('/admin', adminRouter)

app.listen(process.env.PORT, () =>
    console.log('server running')
)


module.exports = app