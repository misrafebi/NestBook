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


module.exports ={
    loadHomePage,
    pageNotFound,
    loadSignup,
}