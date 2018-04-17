const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const request = require('request');
const axios = require('axios');
const db = require("../../models");

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scraperDB';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


router.get("/", function(req, res) {
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

    db.Article.findOne({_id:id}).then(function(data) {
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

module.exports = router;
