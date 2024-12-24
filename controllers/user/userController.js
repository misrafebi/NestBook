const { emit } = require('../../app');
const User = require('../../models/userSchema');
// const user = require('../../models/userSchema')
const nodemailer = require('nodemailer')
const env = require('dotenv').config()

const loadHomePage = async (req,res)=>{
    try {
        return res.render('home')
    } catch (error) {
        console.log('Home Page not found');
        res.status(500).send('Server error')
        
    }
}

const pageNotFound = async (req,res)=>{
    try {
        res.render('page-404')
    } catch (error) {
        res.redirect('/pageNotFound')
    }
}

const loadSignup = async (req,res) =>{
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

function generateOtp(){
    return Math.floor(100000+ Math.random()*900000).toString()
}

async function sendVerificationEmail(email, otp){
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            requireTLS: true,
            auth:{
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            }
        })

        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'Verify your account',
            text: `Your OTP is &{otp}`,
            html:`<b> Your OTP :${otp} </b>`
        })

        return info.accepted.length>0
    } catch (error) {
        console.error('Error sending email ',error);
        return false        
    }
}

const signup = async (req, res) => {
    try {
        const { confirmPassword, email, password } = req.body;
        if(password!==confirmPassword){
            return res.render('signup',{message:"PAssword do not match"})
        }

        const findUser= await User.findOne({email})
        if(findUser){
            return res.render("singup",{message:"User with this email already exists"})
        }

        const otp = generateOtp()
        
        const emailSent = await sendVerificationEmail(email,otp);

        if(!emailSent){
            return res.json("email.error")
        }

        req.session.userOtp = otp;
        req.session.userData ={email,password}

        // res.render('otp')
        console.log('OTP send', otp);
        
        
    } catch (error) {
        console.error('signup error ',error);
        res.redirect('/pageNotFound')
    }
}


module.exports ={
    loadHomePage,
    pageNotFound,
    loadSignup,
    signup
}