const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const positionsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: 'Name is required',
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true,
        required: 'Location is require'
    },
    salary: {
        type: String,
        default: 0
    },
    contract: {
        type: String
    },
    description: {
        type: String,
        trim: true
    },
    url:{
        type: String,
        lowercase: true
    },
    skills: [String],
    candidates: [{
        name: String,
        email: String,
        resume: String
    }],
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: 'Author is Required'
    }


}) 

positionsSchema.pre('save', function(next){
    

    // Create URL
    const url = slug(this.title);
    this.url = `${url}-${shortid.generate()}`

    next()
})

module.exports = mongoose.model('Positions',positionsSchema)