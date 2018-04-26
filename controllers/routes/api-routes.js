const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const request = require('request');
const axios = require('axios');
const db = require("../../models");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');

var User = require('../../models/user');




mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://jefe:Brain1304@ds259119.mlab.com:59119/heroku_0hjjrjjv', {useMongoClient: true});


router.get("/", function(req, res) {

  db.Article.remove({ saved: false}, function (err) {
    if (err) return handleError(err);
    // removed!
  });
 

  // First, we grab the body of the html with request
  axios.get("https://www.kleinfeldbridal.com/product-category/dresses/new-dresses/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
    $(".type-product").each(function(i, element) {
        let result = {
          title : $(this).children("a").children("h3").text(),
          link: $(this).children("a").children("img").attr("src"),
          details: $(this).children("a").children("img").attr("alt"),
          style: $(this).children("a").children(".sku").text(),
          saved: false
        }

        db.Article.create(result)
        .then(function(dbArticle) {
            console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
      });
  })
  res.render('index');
});


router.get("/scrape", function(req, res) {

  db.Article.find({'saved': false}).then(function(data) {
      console.log(data);
      return res.json(data);
  }).catch(function(err) {
    // If an error occurred, send it to the client
    return res.json(err);
  });

});


router.get("/saved", function(req, res) {


  db.Article.find({'saved': true}).then(function(data) {
      console.log(data);
      var articleObj = {
        article: data
      };
      res.render('saved', articleObj)
  }).catch(function(err) {
    // If an error occurred, send it to the client
    return res.json(err);
  });

});

router.get("/details/:id", function(req, res) {
  var id = req.params.id;

    db.Article.findOne({_id:id}).populate("note").then(function(data) {
      console.log(data);
      var articleObj = {
        article: data
      };
    return res.render('details', articleObj)
  }).catch(function(err) {
    // If an error occurred, send it to the client
    return res.json(err);
  });
});




router.post('/save/:id', function(req, res) {

  var id = req.params.id;
  console.log(id);
  db.Article.findByIdAndUpdate(id,{
      saved: true
  }).then(function(data){
    res.send('Dress Saved');
  });
});

router.post('/note/:id', function(req, res) {

  var id = req.params.id;
  var body = req.body;
  console.log('routes'+ id);
 

  
  db.Note.create(body)
  .then(function(dbNote) {
    // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
    // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbArticle) {
    // If we were able to successfully update an Article, send it back to the client
    console.log(dbArticle.note[0]);

    db.Note.findOne({ _id: dbArticle.note[0]}).then(function(newNote){
      var result = newNote.body;

      return res.json(result);
      console.log(newNote.body);
    })
    
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

router.post('/createUser/', function(req, res) {
  var note = req.params.id;
  var id = req.params.id;

  console.log(id);
  db.Article.findByIdAndUpdate(id,{
      saved: true
  }).then(function(data){
    res.send('Dress Saved');
  });
});


router.get('/signup', (req, res) => {
  console.log(req.name);
  res.render('signup')
});

// Login


module.exports = router;
