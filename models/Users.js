const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrytp = require('bcrypt')


const usersSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expire: Date,
    image: String
})


// method to hash passwords
usersSchema.pre('save', async function(next){
    // if password is already has dont do nothin
    if(!this.isModified('password')){
        return next();
    }

    // if is not hash
    const hash = await bcrytp.hash(this.password,10)
    this.password = hash;
    next();
})

// Send alert when user exist already
usersSchema.post('save',function(error, doc, next){
    if(error.name === 'MongoError' && error.code === 11000){
        next('Email already exist');
    }else{
        next(error)
    }
})

// Authenticate Users
usersSchema.methods={
    comparePassword: async function(password){

        return await bcrytp.compare(password, this.password)
    }
}

module.exports = mongoose.model("Users",usersSchema)