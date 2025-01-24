const { use } = require('passport')
const User = require('../../models/userScehma')
const env = require('dotenv').config()
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

const loadHome =async (req, res) => {
    try {
        const email=req.session.userData?.email
        const user=await User.findOne({email})
        res.render('user/home', { message: '',user })
    } catch (error) {
        console.log(error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the home page. Please try again shortly.' })
    }
}

///////////////
//LOGIN

const loadLogin = (req, res) => {
    try {
        res.render('user/login', { message: '' })
    } catch (error) {
        console.error('Error in load home:', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the login page. Please try again shortly.' })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })

    if (!user) {
        console.log('User does not exist.');
        return res.render('user/login',
            { message: 'Account not found. Please sign up first.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        console.log('Password does not match.');
        return res.render('user/login',
            { message: 'Incorrect password. Please try again.' })
    }
const active = user.isBlocked
    if(!active){
        console.log('User is Blocked');
       return res.render('user/login',
            {message:'Your account has been blocked. Please contact support.'})
    }

    req.session.userData = email
    return res.redirect('/user/home?message=User logged in successfully.')
}

////////////
/////////////

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendVerificationEmail(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            }
        });


        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'Verify your account',
            text: `Your OTP is ${otp} <br>`,
            html: `<b> Your OTP : ${otp} </b>`
        })

        return info.accepted.length > 0
    } catch (error) {
        console.error('Error sending email', error);
        return false
    }
}

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.error('Error hashing password', error);
        throw error
    }
}

////////////
//SIGNUP

const loadSignup = (req, res) => {
    try {
        res.render('user/signup', { message: '' })
    } catch (error) {
        console.error('Error in load signup page', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the signup page. Please try again shortly.' })
    }
}

const signup = async (req, res) => {
    try {
        const { name, mobile, email, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            return res.render('user/signup',
                { message: 'Passwords do not match' })
        }

        const findUser = await User.findOne({ email })
        if (findUser) {
            return res.render('user/signup',
                { message: 'User with this email already exists' })
        }

        const otp = generateOtp()
        const emailSent = await sendVerificationEmail(email, otp)

        if (!emailSent) {
            return res.render('user/signup',
                { message: "Email could not be sent" })
        }

        req.session.userOtp = otp
        req.session.userData = { name, email, password, mobile }

        res.render('user/signup-otp', { message: '' })
        console.log(otp);

    } catch (error) {
        console.error('Signup error: ', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while signup. Please try again shortly.' })
    }
}

const loadSignupOTP = (req, res) => {
    try {
        res.render('user/signup-otp',
            { message: '' })
    } catch (error) {
        console.error('Error load OTP :', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the OTP page. Please try again shortly.' })
    }
}

const verifySignupOtp = async (req, res) => {
    try {
        const { otp } = req.body
        console.log(otp);

        if (otp === req.session.userOtp) {
            req.session.user = true
            const user = req.session.userData
            const passwordHash = await securePassword(user.password)

            const saveUserData = new User({
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                password: passwordHash
            })

            await saveUserData.save()
            req.session.user = saveUserData._id;
            const email = req.session.userData?.email
            req.session.userData = email

            return res.redirect('/user/home?message=User signed up successfully.')
        } else {
            res.render('user/signup-otp',
                { message: 'Invalid OTP' })
        }


    } catch (error) {
        console.error('Error verifying Otp', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while verifying OTP. Please try again shortly.' })
    }
}

//////////////////
//FORGOT PASSWORD

const loadForgotMail = (req, res) => {
    try {
        res.render('user/forgot-validate-email', { message: '' })
    } catch (error) {
        console.error('Error in load forgot mail page', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the verifying email page. Please try again shortly.' })
    }
}

const forgotMail = async (req, res) => {
    try {

        const { email } = req.body
        console.log(email);
        req.session.email = email;

        const findUser = await User.findOne({ email })
        if (!findUser) {
            return res.render('user/forgot-validate-email',
                { message: "No account found with this email address." })
        }
        const otp = generateOtp()

        const emailSent = await sendVerificationEmail(email, otp)

        if (!emailSent) {
            return res.render('user/forgot-validate-email',
                { message: "Failed to send OTP. Please try again." })
        }

        req.session.userOtp = otp
        req.session.userData = { email }

        res.render('user/forgot-otp', { message: '' })
        console.log('OTP: ', otp);

    } catch (error) {
        console.error('Error in send verification mail', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while verifying email. Please try again shortly.' })
    }
}

const loadForgotOTP = (req, res) => {
    try {
        res.render('user/forgot-otp', { message: '' })
    } catch (error) {
        console.error();
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the OTP page. Please try again shortly.' })
    }
}

const verifyForgotOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log("OTP: ", otp);

        if (otp === req.session.userOtp) {
            return res.render('user/forgot-reset-password', { message: '' })
        } else {
            return res.render('user/forgot-otp',
                { message: 'Invalid OTP' })
        }

    } catch (error) {
        console.error('Error OTP verification', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while verifying OTP. Please try again shortly.' })
    }
}

const resentForgotOTP = async (req, res) => {
    try {
        const { email } = req.session.userData?.email
        const newOtp = generateOtp()

        const emailSent = await sendVerificationEmail(email, newOtp)

        if (!emailSent) {
            res.render('user/forgot-otp',
                { message: 'Failed to resend OTP. Please try again.' })
        } else {
            req.session.userOtp = newOtp
            res.render('user/forgot-otp',
                { message: 'OTP resent successfully. Please check your email.' })
        }
    } catch (error) {
        console.error('Error rending OTP', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while resending OTP. Please try again shortly.' })
    }
}

const loadForgotPassword = (req, res) => {
    console.log('enterd into load resetPassword page');
    try {
        console.log('enterd into load resetPassword page try');

        res.render('user/forgot-reset-password', { message: '' })
    } catch (error) {
        console.error();
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the reset password page. Please try again shortly.' })
    }
}

const resetPassword = async (req, res) => {
    console.log('entered into resetPassword');

    try {
        console.log('entered into try');

        const { newPassword, confirmPassword } = req.body
        console.log(req.body);

        const email = req.session.userData?.email;

        if (!email) {
            return res.render('user/forgot-reset-password',
                { message: 'Email not found. Please restart the process.' })
        }
        if (!newPassword || !confirmPassword) {
            return res.render('user/forgot-reset-password',
                { message: 'New password and confirm password can not be empty.' })
        }
        if (newPassword !== confirmPassword) {
            return res.render('user/forgot-reset-password',
                { message: 'Passwords do not match. Please re-enter them.' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.render('user/forgot-reset-password',
                { message: 'User not found.' })
        }

        const passwordHash = await bcrypt.hash(newPassword, 10)
        user.password = passwordHash
        await user.save()
        req.session.userData = email
        return res.redirect('/user/home?message=Password changed successfully.')
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while reset password. Please try again shortly.' })
    }
}

/////////
//ABOUT & CONTACT
const loadAbout = (req, res) => {
    try {
        res.render('user/aboutUs', { message: '' })
    } catch (error) {
        console.error('Error to load about us', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the about us page. Please try again shortly.' })
    }
}
const loadContactUs = (req, res) => {
    try {
        res.render('user/contactUs', { message: '' })
    } catch (error) {
        console.error('Error to load contact us', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the contact us page. Please try again shortly.' })
    }
}

////////////
//LOGOUT

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/user/home?message=Some issues to logout. Please try again.')
        }
        res.render('user/login', { message: 'You have logged out successfully' })
    })

}

module.exports = {
    loadHome,
    loadLogin,
    loadSignup,
    loadSignupOTP,
    loadForgotPassword,
    loadForgotMail,
    loadForgotOTP,
    loadAbout,
    loadContactUs,
    login,
    signup,
    verifySignupOtp,
    logout,
    forgotMail,
    verifyForgotOTP,
    resetPassword,
    resentForgotOTP,
}