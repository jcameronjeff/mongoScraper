const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const app = express();

var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static("public"));
app.use('/details/', express.static(__dirname + '/public'));
app.use('/signup/', express.static(__dirname + '/public'));
app.use('/register/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({
    extname:'handlebars',
    defaultLayout:'main.handlebars',
    layoutsDir: 'views/layouts'

}));
app.set("view engine", "handlebars");

const routes = require('./controllers/routes/api-routes');
app.use(routes);
const users = require('./controllers/routes/users');


// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Index Route
app.get('/', (req, res) => {
  console.log(req.name);
  res.render('index')
});



app.use('/users', users);


const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
