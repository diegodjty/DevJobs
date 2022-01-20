const Position = require('../models/positions');

exports.showJobs = async (req,res,next)=>{

    const positions = await Position.find();

    if(!positions) return next();

    res.render('home',{
        pageName: 'devJobs',
        tagline: 'Find and publish Jobs for developers',
        bar: true,
        btn: true,
        positions
    })
    
}