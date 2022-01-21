const Positions = require('../models/positions')

exports.newPositionForm = (req,res)=>{
    res.render('new-positions',{
        pageName: 'New Position',
        tagline: 'Fill the form and publish your position'
    })
    
}
exports.addPosition = async (req,res)=>{

    const position = new Positions(req.body)

    // create array of skills
    position.skills = req.body.skills.split(',')
    

    // save in database
    const newPosition = await position.save();

    //redirec
    res.redirect(`/positions/${newPosition.url}`)
}


exports.showPosition = async (req,res,next) =>{

    const position = await Positions.findOne({
        url: req.params.url
    })

    if(!position) return next();
    res.render('position',{
        position,
        pageName: position.title,
        barra: true
    })

}

exports.editPositionForm = async (req,res,next)=>{
    const position = await Positions.findOne({
        url: req.params.url
    })

    if(!position) return next();
    res.render('edit-positon',{
        position,
        pageName: `Edit - ${position.title}`,
        barra: true
    })
}

exports.editPosition = async(req,res,next)=>{
    const updatedPosition = req.body;

    updatedPosition.skills = req.body.skills.split(',')
    const position = await Positions.findOneAndUpdate({url: req.params.url},updatedPosition,{
        new: true,
        runValidators: true
    })

    res.redirect(`/positions/${position.url}`)
}