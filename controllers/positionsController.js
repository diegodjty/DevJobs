const Positions = require('../models/positions')

exports.newPositionForm = (req,res)=>{
    res.render('new-positions',{
        pageName: 'New Position',
        tagline: 'Fill the form and publish your position'
    })
    
}
exports.addPosition = async (req,res)=>{
    console.log(req.body)
    const position = new Positions(req.body)

    // create array of skills
    position.skills = req.body.skills.split(',')
    

    // save in database
    const newPosition = await position.save();

    //redirec
    res.redirect(`/positions/${newPosition.url}`)
}
