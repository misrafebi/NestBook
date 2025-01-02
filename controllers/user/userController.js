

const { emit, render } = require('../../app');
const User = require('../../models/userSchema');
const nodemailer = require('nodemailer');
const env = require('dotenv').config();
const bcrypt = require('bcrypt');
const category = require('../../models/categorySchema');
const Product = require('../../models/productSchema');
const Category = require('../../models/categorySchema');

// const loadHomePage = async (req, res) => {

//     try {
//         const user = req.session.user
//         const categories = await Category.find({ isListed: true })
//         let products = await Product.find({
//             isBlocked: false,
//             category: { $in: categories.map(category => category._id) },
//             quantity: { $gt: 0 }
//         })

//         products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         products = products.slice(0, 4)

//         console.log(products);
//         products.forEach(product => console.log(product.productImage));

//         res.render('user/home', { products:products })
//     } catch (error) {

//     }

// }
 
const loadHomePage = async (req, res) => {
    try {
        const user = req.session.user;
        const categories = await Category.find({ isListed: true });
        let products = await Product.find({
            isBlocked: true,
            category: { $in: categories.map(category => category._id) },
            quantity: { $gt: 0 }
        });

        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        products = products.slice(0, 4);

        
        // console.log("Product images:", products.map(product => product.productImage));
        // console.log("Image paths:", products.map(product => `/uploads/re-image/${product.productImage[0]}`));

console.log(products);

        res.render('user/home', { products });
    } catch (error) {
        console.error("Error loading home page:", error);
        res.status(500).send("Internal Server Error");
    }
};


// try {
//     const user = req.session.user;

//     const categories = await category.find();



//     const productData = await Product.find({
//         isBlocked: false,
//         category: { $in: categories.map(category => category._id) },
//         quantity: { $gt: 0 }
//     });

//     const sortedProductData = productData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

//     if (user) {
//         const userData = await User.findOne({ _id: user._id });
//         return res.render('user/home', { user: userData, products: sortedProductData });
//     } else {
//         return res.render('user/home', { products: sortedProductData });
//     }
// } catch (error) {
//     console.log('Home Page not found', error);
//     res.status(500).send('Server error');
// }
// };



const pageNotFound = async (req, res) => {
    try {
        res.render('user/page-404')
    } catch (error) {
        res.redirect('/user/pageNotFound')
    }
}

const loadSignup = async (req, res) => {
    try {
        const categories = await Category.find()
        return res.render('user/signup',{categories})
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
        const categories = await Category.find()

        const { name, confirmPassword, email, password } = req.body;
        if (password !== confirmPassword) {
            return res.render('user/signup', { message: "Password do not match",categories })
        }
        console.log(req.body);


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
        req.session.userData = { name, email, password }

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
                name: user.name,

                email: user.email,
                password: passwordHash
            })

            await saveUserData.save()
            req.session.user = saveUserData._id;

            return res.redirect('/user/home');
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
        const { email } = req.session.userData;
        const newOtp = generateOtp();

        const emailSent = await sendVerificationEmail(email, newOtp);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to resend OTP. Please try again.',
            });
        }

        req.session.userOtp = newOtp;
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

const loadOTPPage = async(req, res) => {
    try {
        const categories = await Category.find()
        const { email } = req.query;
        res.render('user/otp', { email,categories });
    } catch (error) {
        
    }
   
};



const loadLogin = async(req, res) => {
    const categories = await Category.find()
    res.render('user/login',{categories})
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.render('user/login', { errorMessage: 'User does not exist' });

        }

        if (!user.isActive) {
            return res.render('user/login', { errorMessage: 'Your account has been blocked. Please contact support.' });
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('user/login', { errorMessage: 'Incorrect Password' });
        }

        req.session.user = true;
        res.redirect('/user/home')
        // res.render('user/home', { successMessage: 'Login Successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).render('user/login', { errorMessage: 'Internal Server Error' });
    }
};





const loadForgottPassword = async (req, res) => {
    const categories = await Category.find()
    res.render('user/forgott-password',{categories})
}

const forgottPassword = async (req, res) => {
    try {
        const { email } = req.body;

        console.log(req.body);

        req.session.email = email;


        const findUser = await User.findOne({ email })
        if (!findUser) {
            return res.render("user/forgott-password", { message: "No account found with this email address." });
        }

        const otp = generateOtp()

        const emailSent = await sendVerificationEmail(email, otp);

        if (!emailSent) {
            return res.render("user/forgott-password", { message: "Failed to send OTP. Please try again." });
        }

        req.session.userOtp = otp;
        req.session.userData = { email }

        res.render('user/otp-forgot')
        console.log('OTP send', otp);


    } catch (error) {
        console.error('signup error ', error);
        res.redirect('/user/pageNotFound')
    }
}

const loadOTPForgot = async (req, res) => {
    const categories = await Category.find()
    res.render('user/otp-forgot',{categories})
}


const verifyForgotOtp = async (req, res) => {
    try {
        const { otp } = req.body
        console.log(otp);
        if (otp.toString() === req.session.userOtp) {

            return res.render('user/reset-password')
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

const loadResetPassword = async(req, res) => {
    const categories = await Category.find()
    res.render('user/reset-password',{categories})
}

const resetPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;


    const email = req.session.email;

    if (!email) {
        return res.status(400).send('Email not found. Please restart the process.');
    }

    if (newPassword === '' || confirmPassword === '') {
        res.send('new password and confirm pasword required')
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        req.session.destroy();
        res.redirect('/user/home');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Server error');
    }
};


const resentForgotOtp = async (req, res) => {
    try {
        
        const { email } = req.session.userData;
        const newOtp = generateOtp();

        const emailSent = await sendVerificationEmail(email, newOtp);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to resend OTP. Please try again.',
            });
        }

        req.session.userOtp = newOtp;
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


const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/user/home');
        }
        res.render('user/login')
    });
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
    loadOTPPage,
    loadForgottPassword,
    forgottPassword,
    loadOTPForgot,
    verifyForgotOtp,
    loadResetPassword,
    resetPassword,
    resentForgotOtp,
    // categories
    // productDetails
}