

const loadHome = (req,res) =>{
    try {
        res.render('user/home')
    } catch (error) {
        console.log(error);
        
    }
}

const loadLogin =(req,res)=>{
    try {
        res.render('user/login')
    } catch (error) {
        
    }
}

const loadSignup = (req,res) =>{
    try {
        res.render('user/signup')
    } catch (error) {
        
    }
}

const loadSignupOTP = (req,res) =>{
    try {
        res.render('user/signup-otp')
    } catch (error) {
        
    }
}

const loadForgotPassword = (req,res) =>{
    try {
        res.render('user/forgot-reset-password')
    } catch (error) {
        
    }
}

const loadForgotMail = (req,res) =>{
    try {
        res.render('user/forgot-validate-email')
    } catch (error) {
        
    }
}

const loadForgotOTP = (req,res) =>{
    try {
        res.render('user/forgot-otp')
    } catch (error) {
        
    }
}

const loadAbout = (req,res) =>{
    try {
        res.render('user/aboutUs')
    } catch (error) {
        
    }
}
const loadContactUs = (req,res) =>{
    try {
        res.render('user/contactUs')
    } catch (error) {
        
    }
}

module.exports= {
    loadHome,
    loadLogin,
    loadSignup,
    loadSignupOTP,
    loadForgotPassword,
    loadForgotMail,
    loadForgotOTP,
    loadAbout,
    loadContactUs
}