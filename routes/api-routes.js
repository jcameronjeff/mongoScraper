const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const request = require('request');
const axios = require('axios');
const db = require("../models");

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
          title : $(this).children("a").attr('href'),
          link: $(this).children("a").children("img").attr("src"),
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
      return res.json(data);
  }).catch(function(err) {
    // If an error occurred, send it to the client
    return res.json(err);
  });

});







//
// app.get("/articles", function(req, res) {
//   // TODO: Finish the route so it grabs all of the articles
// });
//
// app.get("/articles/:id", function(req, res) {
//   // TODO
//   // ====
//   // Finish the route so it finds one article using the req.params.id,
//   // and run the populate method with "note",
//   // then responds with the article with the note included
// });
//
// app.post("/articles/:id", function(req, res) {
//   // TODO
//   // ====
//   // save the new note that gets posted to the Notes collection
//   // then find an article from the req.params.id
//   // and update it's "note" property with the _id of the new note
// });

router.post('/saved/', (req, res) => {
  var body = req.params

});

module.exports = router;
