

const checkSession = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/user/login')
    }
}

const isLogin = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/user/home')
    } else {
        next()
    }
}
const noCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '-1');
    next();
};


module.exports = { checkSession, isLogin,noCache }