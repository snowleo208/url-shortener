// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var validUrl = require('valid-url');

var mongoose = require('mongoose');
var ShortenUrl = require('./model/shortenurl.js');


mongoose.connect('mongodb://' + process.env.USER + ":" + process.env.PASS + "@" + process.env.SECRET);
mongoose.set('debug', true);
mongoose.connection.on('error', console.error.bind(console, '# Mongo DB: connection error:'));
mongoose.connection.once('openUri()', function (callback) {
  console.log("# Mongo DB:  Connected to server");
});

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/new/:site*", function (request, response) {
  const checkUrl = validUrl.isUri(request.path.replace('/new/',''));
  const final = request.path.replace(/(\/new\/https?:\/\/)+/g,'');
  console.log(checkUrl);
  //console.log(encodeURIComponent(request.params.url));
  
  if(checkUrl) {
    var shortened = 0;
    var setting = new ShortenUrl({ url : final });
			setting.save(function (err,id) {
			if (err) return (err);
        shortened = id.shortened;
        return response.json({"original_url": "http://" + final, "shorten_url": "https://plum-bush.glitch.me/" + shortened});
			});
} else {
    response.json({"original_url": null});
  }
});

app.get("/:id", function (request, response) {
  const newInfo = 0;
  console.log(request.params.id);
  ShortenUrl.findOne({shortened: request.params.id}, function(err,final) {
    if(err) {return err;}
    console.log(final.url);
    response.redirect("http://" + final.url);
  });
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
