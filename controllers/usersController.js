const Users = require("../models/Users")
const {body,validationResult} = require('express-validator');

exports.createAccountForm = (req,res,next)=>{
    res.render('create-account',{
        pageName: 'Create an Account ',
        tagline: 'Start posting your Jobs positions, just create an account'
    })
}

exports.validate = async (req,res,next)=>{
    const rules = [
        body('name').not().isEmpty().withMessage('Name is Required').escape(),
        body('email').isEmail().withMessage('Email is Required').normalizeEmail(),
        body('password').not().isEmpty().withMessage('Password is Required').escape(),
        body('confirm').not().isEmpty().withMessage('Confirm password is required').escape(),
        body('confirm').equals(req.body.password).withMessage('Passwords dont match')
    ];
 
    await Promise.all(rules.map(validation => validation.run(req)));
    const errores = validationResult(req);
    //si hay errores
    if (!errores.isEmpty()) {
        req.flash('error', errores.array().map(error => error.msg));
        res.render('create-account', {
            nombrePagina: 'Crea una cuenta en Devjobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            messages: req.flash()
        })
        return;
    }
 
    //si toda la validacion es correcta
    next();
}

exports.createAccount = async (req,res,next)=>{

    // create user
    const user = new Users(req.body);
    
    
    if(!user) return next();
    
    try {
        await user.save();
        res.redirect('/login')
    } catch (error) {
        req.flash('error',error)
        res.redirect('/create-account')

    }

}

// form to login
exports.loginForm = async(req,res,next)=>{
    res.render('login',{
        pageName: 'Login'
    })
}