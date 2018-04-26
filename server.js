const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const request = require('request');
const path = require('path');
const app = express();
var cookieParser = require('cookie-parser');

const routes = require('./controllers/routes/api-routes');
app.use(routes);
const users = require('./controllers/routes/users');

const port = process.env.PORT || 3003;


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


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
