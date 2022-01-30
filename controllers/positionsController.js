const Positions = require('../models/positions')

exports.newPositionForm = (req,res)=>{
    res.render('new-positions',{
        pageName: 'New Position',
        tagline: 'Fill the form and publish your position',
        closeSession: true,
        name: req.user.name,
    })
    
}
exports.addPosition = async (req,res)=>{

    const position = new Positions(req.body)

    // auther of position
    position.author = req.user._id

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
    }).populate('author')

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
        closeSession: true,
        name: req.user.name,
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

exports.deletePosition  = async (req,res,next)=>{
    const {id} = req.params;

    const positon = await Positions.findById(id);
    
    if(verifyAuthor(positon,req.user)){
        // Is the author, can delete
        positon.remove(); 
        res.status(200).send('Deleted correctly')
    }else{
        // is not the author, cannot delete
        res.status(403).send('Error')
    }

    
}

const verifyAuthor = (position = {}, user={})=>{
    if(!position.author.equals(user._id)){
        return false
    }
    return true
}