const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController')
const positionsController = require('../controllers/positionsController')
const usersController = require('../controllers/usersController')
const authController  = require('../controllers/authController')

module.exports = () =>{
    router.get('/',homeController.showJobs)

    // Create positions
    router.get('/positions/new', 
        authController.verifyUser,
        positionsController.newPositionForm
    )
    router.post('/positions/new', 
        authController.verifyUser,
        positionsController.addPosition
    )

    // Show position
    router.get('/positions/:url',positionsController.showPosition)

    // Edit position
    router.get('/positions/edit/:url',
        authController.verifyUser,
        positionsController.editPositionForm
    )
    router.post('/positions/edit/:url',
        authController.verifyUser,
        positionsController.editPosition
    )
    
    // delete positions
    router.delete('/positions/delete/:id',
        positionsController.deletePosition
    )

    //create accounts
    router.get('/create-account', usersController.createAccountForm)
    router.post('/create-account', 
        usersController.validate,
        usersController.createAccount
    )

    // Authenticate users
    router.get('/login', usersController.loginForm)
    router.post('/login', authController.authenticateUser)

    // Logout
    router.get('/logout',
        authController.verifyUser,
        authController.logout
    )
    
    // admin panel
    router.get('/admin', 
        authController.verifyUser,
        authController.showPanel
    );


    // Edit Profile
    router.get('/edit-profile',
        authController.verifyUser,
        usersController.editProfileForm
    )

    router.post('/edit-profile',
    
        authController.verifyUser,
        usersController.UploadImage,
        usersController.editProfile
    )

    return router
}

