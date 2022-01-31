const passport = require('passport')
const Position = require('../models/positions')
const Users = require('../models/Users')
const crypto = require('crypto');
const sendEmail = require('../handlers/email');

exports.authenticateUser = passport.authenticate('local',{
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
});

// check if user is authenticated
exports.verifyUser = (req,res,next)=>{

    if(req.isAuthenticated()){
        return next() // is authenticated
    }

    // redirect
    res.redirect('/login')
}

exports.showPanel = async (req,res)=>{

    // find authenticated user
    const positions = await Position.find({
        author: req.user._id
    });

    res.render('admin',{
        pageName: 'Admin Panel',
        tagline: 'Create and manage your positions',
        closeSession: true,
        name: req.user.name,
        positions,
        image: req.user.image
    })
}

exports.logout = (req, res)=>{
    req.logout();
    req.flash('correcto','Logout succesfully')
    return res.redirect('/login')
}

exports.resetPasswordForm = (req,res,next)=>{
    res.render('reset-password',{
        pageName: 'Reset your Password',
        tagline: 'If you have an account but forgot your password, insert your emial'
    })
}

exports.savePassword =async (req,res)=>{

    const user = await Users.findOne({
        token: req.params.token,
        expire: {
            $gt: Date.now()
        }
    });

    if(!user){
        req.flash('error','The form is not valid, Try again');
        return res.redirect('/reset-password');
    }

    // asign new password and clean previuos values
    user.password = req.body.password;
    user.token = undefined;
    user.expire = undefined;

    
    await user.save();
    
    req.flash('correcto','Password reset succesfully');
        return res.redirect('/login');
}

// validate token and if user exist
exports.resetPassword = async(req,res,next)=>{
    const user = await Users.findOne({
        token: req.params.token,
        expire: {
            $gt: Date.now()
        }
    });

    if(!user){
        req.flash('error','The form is not valid, Try again');
        return res.redirect('/reset-password');
    }

    res.render('new-password',{
        pageName: 'New Password'
    })
}

// Create token in user table
exports.sendToken = async(req,res,next)=>{

    const user = await Users.findOne({email:req.body.email});

    if(!user){
        req.flash('error','Account dosnt exist')
        return res.redirect('/login')
    }

   // if user exist
   user.token = crypto.randomBytes(20).toString('hex');
   user.expire = Date.now()+3600000;

   await user.save();
   const resetUrl = `http://${req.headers.host}/reset-password/${user.token}`;


    await sendEmail.send({
        user,
        subject: 'Password Reset',
        resetUrl,
        file: 'reset'
    })

   req.flash('correcto','Check email for instructions');
   res.redirect('/login');

}