const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Users = require('../models/Users')


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},async(email,password,done)=>{
    const user = await Users.findOne({email});
    console.log(email)
    console.log(password)
    if(!user)return done(null,false,{
        message: 'User Not Found'
    });

    // User exist, verify passwrod
    const verifyPassword = await user.comparePassword(password);
    if(!verifyPassword) return done(null,false,{
        message: 'Incorrect password'
    })

    //User exist and password correct
    return done(null, user);
}))

passport.serializeUser((user,done)=>done(null,user._id));

passport.deserializeUser(async(id,done)=>{
    const user = await Users.findById(id);
    return done(null,user)
})

module.exports = passport;