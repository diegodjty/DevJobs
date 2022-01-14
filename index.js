const express = require('express');
const { engine } = require('express-handlebars')
const router = require('./routes')
const path = require('path')
const app = express();


// Enable handlebars for view
app.engine('handlebars', engine({ extname: '.handlebars', defaultLayout: "layout"}));
app.set('view engine', 'handlebars')

// static files
app.use(express.static(path.join(__dirname,'public')))

app.use('/', router())

app.listen(3000)