const { emit } = require('../../app');
const User = require('../../models/userSchema');
// const user = require('../../models/userSchema')
const nodemailer = require('nodemailer')
const env = require('dotenv').config()
const bcrypt = require('bcrypt')

const loadHomePage = async (req, res) => {
    try {
        return res.render('user/home')
    } catch (error) {
        console.log('Home Page not found');
        res.status(500).send('Server error')

    }
}

const pageNotFound = async (req, res) => {
    try {
        res.render('user/page-404')
    } catch (error) {
        res.redirect('/user/pageNotFound')
    }
}

const loadSignup = async (req, res) => {
    try {
        return res.render('user/signup')
    } catch (error) {
        console.log('Signup page is not Loading');

        res.redirect('/user/pageNotFound')
    }
}


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
            return res.render('user/signup', { message: "Password do not match" })
        }

        const findUser = await User.findOne({ email })
        if (findUser) {
            return res.render("user/singup", { message: "User with this email already exists" })
        }

        const otp = generateOtp()

        const emailSent = await sendVerificationEmail(email, otp);

        if (!emailSent) {
            return res.json("email.error")
        }

        req.session.userOtp = otp;
        req.session.userData = { firstName, lastName, email, password }

        res.render('user/otp')
        console.log('OTP send', otp);


    } catch (error) {
        console.error('signup error ', error);
        res.redirect('/user/pageNotFound')
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
            return res.redirect('/user/');
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

const resentOtp = async (req, res) => {
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

const loadOTPPage = (req, res) => {
    const { email } = req.query;
    res.render('user/otp', { email });
};

const loadLogin = (req, res) => {
    res.render('user/login')
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ email });

        // If the user does not exist
        if (!user) {
            return res.render('user/login', { errorMessage: 'User does not exist' });

        }

        // Compare the plaintext password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match
        if (!isMatch) {
            return res.render('user/login', { errorMessage: 'Incorrect Password' });
        }

        // If login is successful, set session and render the home page
        req.session.user = true;
        res.render('user/home', { successMessage: 'Login Successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).render('user/login', { errorMessage: 'Internal Server Error' });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/user/');
        }
        res.render('user/login')
    });
};



const showForgotPasswordPage = (req, res) => {
    res.render('user/forgott-password');
};


const handleForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        console.log("Received email:", email);

        // Check if the email exists in the database
        const user = await User.findOne({ email });

        if (user) {
            const otp = generateOtp(); // Generate OTP
            console.log('generated OTP ', otp);
            const emailSent = await sendVerificationEmail(email, otp); // Send OTP to email


            if (!emailSent) {
                return res.render('user/forgott-password', {
                    errorMessage: 'Failed to send OTP. Please try again.',
                });
            }

            req.session.forgotPasswordOtp = otp; // Store OTP in session
            req.session.forgotPasswordEmail = email; // Store email in session

            return res.render('user/otp'); // Render OTP page
        } else {
            return res.render('user/forgott-password', {
                errorMessage: 'Email does not exist in our database.',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).render('user/forgott-password', {
            errorMessage: 'An error occurred. Please try again later.',
        });
    }
};

const verifyForgotPasswordOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log('Entered ', otp);
        console.log('Session OTP:', req.session.forgotPasswordOtp);

        if (otp.toString().trim() === req.session.forgotPasswordOtp.toString().trim()) {
            req.session.isOtpVerified = true; // Mark OTP as verified
            console.log('OTP verified successfully.');
            return res.render('user/reset-password'); // Redirect to reset password page
        } else {
            console.log('OTP mismatch.');
            return res.status(400).render('user/otp', {
                errorMessage: 'Invalid OTP. Please try again.',
            });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).render('user/otp', {
            errorMessage: 'An error occurred. Please try again later.',
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        if (!req.session.isOtpVerified) {
            return res.redirect('/user/forgott-password'); // Redirect if OTP is not verified
        }

        const { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.render('user/reset-password', {
                errorMessage: 'Passwords do not match.',
            });
        }

        const email = req.session.forgotPasswordEmail;
        const passwordHash = await securePassword(newPassword);

        await User.updateOne({ email }, { password: passwordHash }); // Update password in database

        // Clear session data
        req.session.forgotPasswordOtp = null;
        req.session.forgotPasswordEmail = null;
        req.session.isOtpVerified = null;

        return res.redirect('/user/login'); // Redirect to login page
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).render('user/reset-password', {
            errorMessage: 'An error occurred. Please try again later.',
        });
    }
};


module.exports = {
    loadHomePage,
    pageNotFound,
    loadSignup,
    signup,
    verifyOtp,
    resentOtp,
    logout,
    loadLogin,
    login,
    showForgotPasswordPage,
    loadOTPPage,
    handleForgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
}