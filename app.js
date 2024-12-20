const express = require('express');
const app = express();
// const path = require('path');
// const session = require('express-session');
// const nocache = require('nocache');
// const flash = require('connect-flash');
const env = require('dotenv').config()
const db = require('./config/db')
db()

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.use(express.static('public'));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(nocache());
// app.use(flash());

// app.use(session({
//     secret: 'secretKey',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24,
//         secure: false // Ensure secure is false for development; set to true in production with HTTPS
//     }
// }));


// app.use((req, res, next) => {
//     res.locals.successMessage = req.flash('successMessage');
//     res.locals.errorMessage = req.flash('errorMessage');
//     next();
//   });
  


// const adminRouter = require('./routes/admin');
// const userRouter = require('./routes/user');
// const connectDB = require('./db/connectdb');

// app.use('/admin', adminRouter);
// app.use('/user', userRouter);

// connectDB();

app.listen(process.env.PORT,()=>{
    console.log('Server Running');
    
});

module.exports = app;