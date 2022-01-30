const Positions = require('../models/positions')
const multer = require('multer')
const shortid = require('shortid')

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

// Upload Resume
exports.uploadResume = (req,res,next)=>{
    upload(req,res,function(error){
        
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error','File is too big, max 300kb');
                }else{
                    req.flash('error',error.message)
                }
           }else{
               req.flash('error',error.message)
           }
           res.redirect('back');
           return;
        }else{
            next();
        }
    })
}
const multerConfig = {
    limits: {fileSize: 300000},
    storage : fileStorage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null,__dirname+'../../public/uploads/resume');
        },
        filename: (req,file,cb)=>{
            const extension = file.mimetype.split('/')[1];
            cb(null,`${shortid.generate()}.${extension}`)
        },
        fileFilter:(req,file,cb)=>{
            if(file.mimetype==='application/pdf'){
                // if supported mimetype 
                cb(null, true)
            }else{
                cb(new Error('Format Not Valid'), false)
            }
        }
        
    })
}
const upload = multer(multerConfig).single('resume');

exports.contact = async (req,res,next)=>{
    const position = await Positions.findOne({url: req.params.url});

    if(!position) return next();

    const newCandidate  = {
        name: req.body.name,
        email: req.body.email,
        resume: req.file.filename
    }

    // Save to DB
    position.candidates.push(newCandidate);
    await position.save();

    req.flash('correcto', 'Resume Sent Succesfully');
    res.redirect('/')
}

exports.showCandidates = async(req,res,next)=>{
    const position = await Positions.findById(req.params.id);

    if(position.author != req.user._id.toString()){
        return next();
    }
    if(!position) return next();
    res.render('candidates',{
        pageName: `Candidates Position = ${position.title}`,
        logout: false,
        name: req.user.name,
        candidates: position.candidates
    })
}