const passport = require('passport')
const GoogleStrategy=require('passport-google-oauth20')

const User=require('../models/userScehma')
const env=require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3002/user/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            user.newUser = false; // Set flag for session handling
            return done(null, user); // Pass user to serializeUser
        } else {
            const newUser = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
            });
            await newUser.save();
            newUser.newUser = true; // Set flag for session handling
            return done(null, newUser); // Pass user to serializeUser
        }
    } catch (error) {
        return done(error);
    }
}
));


passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize the user ID into the session
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            if (user) {
                done(null, user); // Attach the full user object to req.user
            } else {
                done(null, false);
            }
        })
        .catch(err => done(err, null));
});

module.exports=passport
console.log('Callback URL:', process.env.CALLBACK_URL);
