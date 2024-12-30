// Middleware to redirect logged-in users from the login page
function preventLoggedInAccess(req, res, next) {
    if (req.session.admin) {
        return res.redirect('/admin/dashboard'); // Redirect to dashboard if already logged in
    }
    next(); // Continue to the requested page if not logged in
}

// Middleware to protect dashboard and other admin routes
function isLoggedIn(req, res, next) {
    if (!req.session.admin) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }
    next(); // Continue to the requested page if logged in
}

module.exports = { preventLoggedInAccess, isLoggedIn };
