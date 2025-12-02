const { use } = require('passport')
const User = require('../../models/userScehma')
const env = require('dotenv').config()
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const Category = require('../../models/categorySchema')
const Product = require('../../models/productSchema')
const Contact = require('../../models/contactSchema')
const Wishlist = require('../../models/wishlistSchema')


// const loadHome = async (req, res) => {
//     try {
//         const newArrivals = await Product.aggregate([
//             { $match: { isBlocked: false } },
//             {
//                 $lookup: {
//                     from: 'reviews',
//                     localField: '_id',
//                     foreignField: 'Product',
//                     as: 'reviewData',
//                     pipeline: [
//                         {
//                             $group: {
//                                 _id: '$Product',
//                                 avgRating: { $avg: '$rating' },
//                             }
//                         }
//                     ]
//                 }
//             },
//             {
//                 $addFields: {
//                     avgRating: {

//                         $ifNull: [{ $arrayElemAt: ['$reviewData.avgRating', 0] }, 0]
//                     }
//                 }
//             },
//             { $sort: { createdAt: -1 } },
//             { $limit: 10 }
//         ]);
//         const categories = await Category.find({})


//         const email = req.session.userData?.email
//         const user = await User.findOne({ email })
        


//         res.render('user/home', { message: '', user, categories, newArrivals })
//     } catch (error) {
//         console.log(error);
//         res.render('user/pageNotFound',
//             { message: 'Something went wrong while loading the home page. Please try again shortly.' })
//     }
// }

///////////////
//LOGIN

const loadHome = async (req, res) => {
    try {
        // Get categories first
        const categories = await Category.find({});
        
        // Get new arrivals with average ratings
        const newArrivals = await Product.aggregate([
            { 
                $match: { 
                    isBlocked: false,
                    status: 'Available' // Only show available products
                } 
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'productId', // Make sure this field name is correct in your Review model
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    avgRating: {
                        $cond: {
                            if: { $gt: [{ $size: '$reviews' }, 0] },
                            then: { $avg: '$reviews.rating' },
                            else: 0
                        }
                    },
                    reviewCount: { $size: '$reviews' }
                }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 }
        ]);

        // Initialize variables
        let user = null;
        let wishlistProductIds = [];

        // Check if user is logged in
        const email = req.session.userData?.email;
        
        if (email) {
            try {
                // Find user
                user = await User.findOne({ email });
                
                if (user) {
                    // Get wishlist with only the product IDs
                    const wishlist = await Wishlist.findOne(
                        { userId: user._id },
                        { 'items.ProductId': 1 } // Only get the ProductId field
                    );
                    
                    // Extract product IDs from wishlist
                    if (wishlist && wishlist.items && Array.isArray(wishlist.items)) {
                        wishlistProductIds = wishlist.items
                            .map(item => item.ProductId?.toString?.())
                            .filter(id => id && typeof id === 'string');
                    }
                }
            } catch (userError) {
                console.error('Error fetching user/wishlist data:', userError);
                // Continue without user/wishlist data
            }
        }

        // Check which products are in wishlist
        const newArrivalsWithWishlistStatus = newArrivals.map(product => {
            const productId = product._id.toString();
            return {
                ...product,
                isInWishlist: wishlistProductIds.includes(productId)
            };
        });

        res.render('user/home', { 
            message: '', 
            user, 
            categories, 
            newArrivals: newArrivalsWithWishlistStatus,
            wishlistProductIds // Still pass for any other use
        });
    } catch (error) {
        console.error('Error in loadHome:', error);
        res.render('user/pageNotFound', {
            message: 'Something went wrong while loading the home page. Please try again shortly.'
        });
    }
};


const loadLogin = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/login', { message: '', categories })
    } catch (error) {
        console.error('Error in load home:', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the login page. Please try again shortly.' })
    }
}

const login = async (req, res) => {
    const categories = await Category.find({})
    const { email, password } = req.body;
    const user = await User.findOne({ email })

    if (!user) {
        console.log('User does not exist.');
        return res.render('user/login',
            { message: 'Account not found. Please sign up first.', categories })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        console.log('Password does not match.');
        return res.render('user/login',
            { message: 'Incorrect password. Please try again.', categories })
    }
    const blocked = user.isBlocked
    if (blocked) {
        console.log('User is Blocked');
        return res.render('user/login',
            { message: 'Your account has been blocked. Please contact support.', categories })
    }

   // In your login controller
req.session.userData = {
    email: user.email,
    name: user.name,
    userId: user._id, // Store user ID
    isAdmin: user.isAdmin
};
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

const loadSignup = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/signup', { message: '', categories })
    } catch (error) {
        console.error('Error in load signup page', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the signup page. Please try again shortly.' })
    }
}

const signup = async (req, res) => {
    try {
        const categories = await Category.find({})
        const { name, mobile, email, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            return res.render('user/signup',
                { message: 'Passwords do not match', categories })
        }

        const findUser = await User.findOne({ email })
        if (findUser) {
            return res.render('user/signup',
                { message: 'User with this email already exists', categories })
        }

        const otp = generateOtp()
        const emailSent = await sendVerificationEmail(email, otp)

        if (!emailSent) {
            return res.render('user/signup',
                { message: "Email could not be sent", categories })
        }

        req.session.userOtp = otp
        
        req.session.userData = { name, email, password, mobile }

        res.render('user/signup-otp', { message: '', categories })
        console.log(otp);

    } catch (error) {
        console.error('Signup error: ', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while signup. Please try again shortly.' })
    }
}

const loadSignupOTP = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/signup-otp',
            { message: '', categories })
    } catch (error) {
        console.error('Error load OTP :', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the OTP page. Please try again shortly.' })
    }
}

const verifySignupOtp = async (req, res) => {
    try {
        const categories = await Category.find({})
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
                { message: 'Invalid OTP', categories })
        }


    } catch (error) {
        console.error('Error verifying Otp', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while verifying OTP. Please try again shortly.' })
    }
}

//////////////////
//FORGOT PASSWORD

const loadForgotMail = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/forgot-validate-email', { message: '', categories })
    } catch (error) {
        console.error('Error in load forgot mail page', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the verifying email page. Please try again shortly.' })
    }
}

const forgotMail = async (req, res) => {
    try {
        const categories = await Category.find({})
        const { email } = req.body
        console.log(email);
        req.session.email = email;

        const findUser = await User.findOne({ email })
        if (!findUser) {
            return res.render('user/forgot-validate-email',
                { message: "No account found with this email address.", categories })
        }
        const otp = generateOtp()

        const emailSent = await sendVerificationEmail(email, otp)

        if (!emailSent) {
            return res.render('user/forgot-validate-email',
                { message: "Failed to send OTP. Please try again.", categories })
        }

        req.session.userOtp = otp
        req.session.userData = { email }

        res.render('user/forgot-otp', { message: '', categories })
        console.log('OTP: ', otp);

    } catch (error) {
        console.error('Error in send verification mail', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while verifying email. Please try again shortly.' })
    }
}

const loadForgotOTP = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/forgot-otp', { message: '', categories })
    } catch (error) {
        console.error();
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the OTP page. Please try again shortly.' })
    }
}

const verifyForgotOTP = async (req, res) => {
    try {
        const categories = await Category.find({})
        const { otp } = req.body;
        console.log("OTP: ", otp);

        if (otp === req.session.userOtp) {
            return res.render('user/forgot-reset-password', { message: '', categories })
        } else {
            return res.render('user/forgot-otp',
                { message: 'Invalid OTP', categories })
        }

    } catch (error) {
        console.error('Error OTP verification', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while verifying OTP. Please try again shortly.' })
    }
}

const resentForgotOTP = async (req, res) => {
    try {
        const categories = await Category.find({})
        const { email } = req.session.userData?.email
        const newOtp = generateOtp()

        const emailSent = await sendVerificationEmail(email, newOtp)

        if (!emailSent) {
            res.render('user/forgot-otp',
                { message: 'Failed to resend OTP. Please try again.', categories })
        } else {
            req.session.userOtp = newOtp
            res.render('user/forgot-otp',
                { message: 'OTP resent successfully. Please check your email.', categories })
        }
    } catch (error) {
        console.error('Error rending OTP', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while resending OTP. Please try again shortly.' })
    }
}

const loadForgotPassword = async (req, res) => {

    try {
        const categories = await Category.find({})
        res.render('user/forgot-reset-password', { message: '', categories })
    } catch (error) {
        console.error();
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the reset password page. Please try again shortly.' })
    }
}

const resetPassword = async (req, res) => {


    try {
        const categories = await Category.find({})


        const { newPassword, confirmPassword } = req.body
        console.log(req.body);

        const email = req.session.userData?.email;

        if (!email) {
            return res.render('user/forgot-reset-password',
                { message: 'Email not found. Please restart the process.', categories })
        }
        if (!newPassword || !confirmPassword) {
            return res.render('user/forgot-reset-password',
                { message: 'New password and confirm password can not be empty.', categories })
        }
        if (newPassword !== confirmPassword) {
            return res.render('user/forgot-reset-password',
                { message: 'Passwords do not match. Please re-enter them.', categories })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.render('user/forgot-reset-password',
                { message: 'User not found.', categories })
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
const loadAbout = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/aboutUs', { message: '', categories })
    } catch (error) {
        console.error('Error to load about us', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the about us page. Please try again shortly.' })
    }
}
const loadContactUs = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/contactUs', { message: '', categories })
    } catch (error) {
        console.error('Error to load contact us', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while loading the contact us page. Please try again shortly.' })
    }
}

const postContactUsForm = async (req, res) => {
    try {
        const categories = await Category.find({})



        const user = req.session.userData

        if (!user) {
            return res.render('user/contactUs', {
                message: 'Cannot found user. ',
                categories
            })
        }

        const { name, email, message } = req.body
        if (!name || !email || !message) {
            return res.render('user/contactUs', {
                message: 'name, email and message requied. ',
                categories
            })
        }
        const newContact = new Contact({
            name, email, message,
            user: req.session.userData
        })

        await newContact.save()
        res.render('user/contactUs', { message: 'Message sent successfully', categories })
    } catch (error) {
        console.error('Error to load contact us', error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while posting the contact us page. Please try again shortly.' })
    }
}

////////////
//LOGOUT

const logout = async (req, res) => {
     const categories = await Category.find({})
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/user/home?message=Some issues to logout. Please try again.')
        }
       
        res.render('user/login', { message: 'You have logged out successfully', categories })
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
    postContactUsForm
}