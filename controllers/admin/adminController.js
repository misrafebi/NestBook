// const { emit } = require('../../app')

const env = require('dotenv').config()
const Admin = require('../../models/adminSchema')




const loadLogin = (req, res) => {
    try {
        res.render('admin/login', {
            message: ''
        })
    } catch (error) {
        console.error(error.message);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findOne({ email })

        if (!admin) {
            return res.render('admin/login',
                { message: 'No account found with the provided email. Please check and try again.' })
        }

        if (password != admin.password) {
            return res.render('admin/login',
                { message: 'The password you entered is incorrect. Please try again.' })
        }

        req.session.admin = { email: admin.email };

        res.redirect('/admin/dashboard?message=You have successfully logged in.');

    } catch (error) {
        console.error(error.message);
        res.render('admin/login', { message: 'An error occurred. Please try again.' });
    }
}

const loadDashboard = (req, res) => {
    try {
        res.render('admin/dashboard', { message: '' });
    } catch (error) {
        console.error('Error in loadDashboard:', error.message);
        res.render('admin/login', { message: 'An error occurred. Please try again.' });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Failed to logout');
            return res.render('admin/dashboard', {
                message: 'Error logging out. Please try again.'
            });
        }
        res.redirect('/admin/login?message=You have successfully logged out.');
    })
}

const loadChangePassword = (req, res) => {
    try {
        res.render('admin/changePassword',
            { message: '' }
        )
    } catch (error) {
        console.error('Error in loadChangePassowrd:', error.message);
        res.render('admin/login', { message: 'An error occurred. Please try again.' })
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPass, newPass, confirmPass } = req.body
        const adminSession = req.session?.admin

        if (!adminSession) {
            return res.render('admin/changePassword',
                { message: 'Session expired. Please log in again.' })
        }

        const admin = await Admin.findOne({ email: adminSession.email })

        if (!admin) {
            return res.render('admin/changePassword',
                { message: 'Admin not found. Please contact support.' })
        }

        if (admin.password != currentPass) {
            return res.render('admin/changePassword',
                { message: 'Current password is incorrect.' })
        }

        if (newPass !== confirmPass) {
            return res.render('admin/changePassword',
                { message: 'New password and confirm password do not match.' })
        }

        admin.password = newPass;
        await admin.save();

        res.render('admin/changePassword',
            { message: 'Password changed successfully.' })

    } catch (error) {
        console.error('Error in changePassword: ', error.message)
        res.render('admin/login', { message: 'An error occurred. Please try again.' })
    }
}



module.exports = {
    loadLogin,
    changePassword,
    loadDashboard,
    login,
    logout,
    loadChangePassword
}