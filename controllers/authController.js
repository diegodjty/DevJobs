const passport = require('passport')
const Position = require('../models/positions')

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
        positions
    })
}
