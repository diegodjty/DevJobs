const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController')
const positionsController = require('../controllers/positionsController')


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
    
    return router
}

