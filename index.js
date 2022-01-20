const mongoose = require('mongoose');
require('./config/db')
require('dotenv').config({path:'variables.env'})
const express = require('express');
const { engine } = require('express-handlebars')
const router = require('./routes')
const path = require('path')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// Enable handlebars for view
app.engine('handlebars', engine(
    { 
        extname: '.handlebars', 
        defaultLayout: "layout",
        helpers: require('./helpers/handlebars')
    }
    ));
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

app.use('/', router())

app.listen(process.env.PORT)