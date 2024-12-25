const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
// const nocache = require('nocache');
// const flash = require('connect-flash');
const env = require('dotenv').config()
const db = require('./config/db')
const userRouter = require('./routes/userRouter')
const passport = require('./config/passport')
db()

// app.set('views', path.join(__dirname, 'views'));
app.set('views',[path.join(__dirname,'views/user'),path.join(__dirname,'views/admin')])
app.set('view engine', 'ejs');
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'public')))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(nocache());
// app.use(flash());

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 72 * 60 * 60 * 1000,
        secure: false, // Ensure secure is false for development; set to true in production with HTTPS
        httpOnly: true,
    }
}));


// app.use((req, res, next) => {
//     res.locals.successMessage = req.flash('successMessage');
//     res.locals.errorMessage = req.flash('errorMessage');
//     next();
//   });
  


// const adminRouter = require('./routes/admin');
// const userRouter = require('./routes/user');
// const connectDB = require('./db/connectdb');

// app.use('/admin', adminRouter);
app.use(passport.initialize())
app.use(passport.session())

app.use('/', userRouter);

// connectDB();

app.listen(process.env.PORT,()=>{
    console.log('Server Running');
    
});

module.exports = app;