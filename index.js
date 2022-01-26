const mongoose = require('mongoose');
require('./config/db')
require('dotenv').config({path:'variables.env'})
const express = require('express');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const router = require('./routes')
const path = require('path')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const { body, validationResult } = require('express-validator');

const app = express();

// Enable body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))


// Validation


// Enable handlebars for view
app.engine('handlebars',
    exphbs.engine({
        handlebars: allowInsecurePrototypeAccess(handlebars),
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);
app.set('view engine', 'handlebars')

// static files
app.use(express.static(path.join(__dirname,'public')))

app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    key: process.env.key,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.DATABASE})
}))

// Alerts and flash messages
app.use(flash());

// create 
app.use( (req, res, next)=>{
    res.locals.messages = req.flash();
    next();
});

app.use('/', router())

app.listen(process.env.PORT)