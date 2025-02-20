const nocache = require("nocache")

const checkSession = (req, res,next) => {
    if (req.session.admin) {
        next();
    } else {
        res.redirect('/admin/login')
        // res.render('admin/login')
    }
}

const isLogin = (req, res,next) => {
    if (req.session.admin) {
        res.redirect('/admin/dashboard')
        // res.render('admin/dashboard')
    } else {
        next();
    }
}
const noCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '-1');
    next();
};



module.exports = {
    checkSession,
    isLogin,
    noCache,
   
}