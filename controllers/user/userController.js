const User = require('../../models/userSchema');
// const user = require('../../models/userSchema')

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

const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        console.log(req.body); // Debugging req.body
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).send('Email already registered.');
        }
        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();
        res.redirect('/signup');
        // res.render('home')
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).send('Internal server error');
    }
};


module.exports ={
    loadHomePage,
    pageNotFound,
    loadSignup,
    signup
}