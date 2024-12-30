const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

const env = require('dotenv').config()
const db = require('./config/db')
const passport = require('./config/passport')
db()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(passport.initialize())
app.use(passport.session())


const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRoutes')
app.use('/user', userRouter);
app.use('/admin',adminRouter)


app.listen(process.env.PORT,()=>{
    console.log('Server Running');
    
});

module.exports = app;