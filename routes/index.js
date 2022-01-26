const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController')
const positionsController = require('../controllers/positionsController')
const usersController = require('../controllers/usersController')
const authController  = require('../controllers/authController')

module.exports = () =>{
    router.get('/',homeController.showJobs)

    // Create positions
    router.get('/positions/new', positionsController.newPositionForm)
    router.post('/positions/new', positionsController.addPosition)

    // Show position
    router.get('/positions/:url',positionsController.showPosition)

    // Edit position
    router.get('/position/edit/:url',positionsController.editPositionForm)
    router.post('/position/edit/:url',positionsController.editPosition)
    

    //create accounts
    router.get('/create-account', usersController.createAccountForm)
    router.post('/create-account', 
        usersController.validate,
        usersController.createAccount
    )

    // Authenticate users
    router.get('/login', usersController.loginForm)
    router.post('/login', authController.authenticateUser)
    
    return router
}

