const Users = require("../models/Users")
const {body,validationResult} = require('express-validator');
const multer = require("multer");
const shortid = require('shortid')

exports.UploadImage = (req,res,next)=>{
    upload(req,res,function(error){
        
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error','File is too big, max 100kb');
                }else{
                    req.flash('error',error.message)
                }
           }else{
               req.flash('error',error.message)
           }
           res.redirect('/admin');
           return;
        }else{
            next();
        }
    })
}
const multerConfig = {
    limits: {fileSize: 100000},
    storage : fileStorage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null,__dirname+'../../public/uploads/profile');
        },
        filename: (req,file,cb)=>{
            const extension = file.mimetype.split('/')[1];
            cb(null,`${shortid.generate()}.${extension}`)
        },
        fileFilter:(req,file,cb)=>{
            if(file.mimetype==='image/jpeg' || file.mimetype== 'image/png'){
                // if supported mimetype 
                cb(null, true)
            }else{
                cb(new Error('Format Not Valid'), false)
            }
        }
        
    })
}
const upload = multer(multerConfig).single('image');



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

exports.editProfileForm = (req,res,next)=>{
    res.render('edit-profile',{
        pageName:'Edit your Profile',
        user: req.user,
        closeSession: true,
        name: req.user.name,
    })
}

exports.editProfile = async (req,res)=>{
    const user = await Users.findById(req.user._id);
    
    user.name = req.body.name;
    user.email = req.body.email;

    if(req.body.password){
        user.password = req.body.password;
    }

    if(req.file){
        user.image = req.file.filename;
    }
  
    await user.save();

    req.flash('correcto', 'Saved succesfully')

    res.redirect('/admin')
}

