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
    router.get('/position/edit/:url',
        authController.verifyUser,
        positionsController.editPositionForm
    )
    router.post('/position/edit/:url',
        authController.verifyUser,
        positionsController.editPosition
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
    
    // admin panel
    router.get('/admin', 
        authController.verifyUser,
        authController.showPanel
    );

    return router
}

