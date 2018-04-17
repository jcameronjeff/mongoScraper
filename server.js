const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const request = require('request');
const path = require('path');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use('/details/', express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({
    extname:'handlebars',
    defaultLayout:'main.handlebars',
    layoutsDir: 'views/layouts'

}));
app.set("view engine", "handlebars");

const routes = require('./controllers/routes/api-routes');
app.use(routes);

// Index Route
app.get('/', (req, res) => {
  console.log(req.name);
  res.render('index')
});

app.get('/signup', (req, res) => {
  console.log(req.name);
  res.render('signup')
});



// About Route
// app.get('/about', (req, res) => {
//   res.render('index');
// });


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
