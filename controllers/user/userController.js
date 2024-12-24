const { emit } = require('../../app');
const User = require('../../models/userSchema');
// const user = require('../../models/userSchema')
const nodemailer = require('nodemailer')
const env = require('dotenv').config()
const bcrypt = require('bcrypt')

const loadHomePage = async (req, res) => {
    try {
        return res.render('home')
    } catch (error) {
        console.log('Home Page not found');
        res.status(500).send('Server error')

    }
}

const pageNotFound = async (req, res) => {
    try {
        res.render('page-404')
    } catch (error) {
        res.redirect('/pageNotFound')
    }
}

const loadSignup = async (req, res) => {
    try {
        return res.render('signup')
    } catch (error) {
        console.log('Signup page is not Loading');

        res.redirect('/pageNotFound')
    }
}

// const signup = async (req, res) => {
//     const { firstName, lastName, email, password } = req.body;
//     try {
//         console.log(req.body); // Debugging req.body
//         const emailExists = await User.findOne({ email });
//         if (emailExists) {
//             return res.status(400).send('Email already registered.');
//         }
//         const newUser = new User({ firstName, lastName, email, password });
//         await newUser.save();
//         res.redirect('/signup');
//         // res.render('home')
//     } catch (error) {
//         console.error('Error details:', error);
//         res.status(500).send('Internal server error');
//     }
// };

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
                pass: process.env.NODEMAILER_PASSWORD
            }
        })

        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'Verify your account',
            text: `Your OTP is &{otp}`,
            html: `<b> Your OTP :${otp} </b>`
        })

        return info.accepted.length > 0
    } catch (error) {
        console.error('Error sending email ', error);
        return false
    }
}

const signup = async (req, res) => {
    try {
        const { firstName, lastName, confirmPassword, email, password } = req.body;
        if (password !== confirmPassword) {
            return res.render('signup', { message: "Password do not match" })
        }

        const findUser = await User.findOne({ email })
        if (findUser) {
            return res.render("singup", { message: "User with this email already exists" })
        }

        const otp = generateOtp()

        const emailSent = await sendVerificationEmail(email, otp);

        if (!emailSent) {
            return res.json("email.error")
        }

        req.session.userOtp = otp;
        req.session.userData = { firstName, lastName, email, password }

        res.render('otp')
        console.log('OTP send', otp);


    } catch (error) {
        console.error('signup error ', error);
        res.redirect('/pageNotFound')
    }
}


const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}
const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body
        console.log(otp);
        if (otp.toString() === req.session.userOtp) {
            const user = req.session.userData
            const passwordHash = await securePassword(user.password);

            const saveUserData = new User({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: passwordHash
            })

            await saveUserData.save()
            req.session.user = saveUserData._id;
            // return res.json({
            //     success: true,
            //     redirect: '/'
            // })
            return res.redirect('/');
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            })
        }
    } catch (error) {
        console.error('Error verifying otp ', error);
        return res.status(500).json({
            success: false,
            message: 'An error occured'
        })

    }
}

const resentOtp = async (req,res) =>{
    try {
        const { email } = req.session.userData; // Assuming email is stored in the session
        const newOtp = generateOtp();

        const emailSent = await sendVerificationEmail(email, newOtp);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to resend OTP. Please try again.',
            });
        }

        req.session.userOtp = newOtp; // Update session with new OTP
        res.status(200).json({
            success: true,
            message: 'OTP resent successfully.',
        });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.',
        });
    }
}

module.exports = {
    loadHomePage,
    pageNotFound,
    loadSignup,
    signup,
    verifyOtp,
    resentOtp,
}