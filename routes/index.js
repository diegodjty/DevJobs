const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController')
const positionsController = require('../controllers/positionsController')


module.exports = () =>{
    router.get('/',homeController.showJobs)

    // Create positions
    router.get('/positions/new', positionsController.newPositionForm)
    router.post('/positions/new', positionsController.addPosition)


    
    return router
}

