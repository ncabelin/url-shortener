'use strict';

var express = require('express');
var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

var mongoose = require('mongoose');
var dbUrl = 'mongodb://usemaster:incubus2180@ds021663.mlab.com:21663/supernotes';
mongoose.connect(dbUrl, function(err) {
  if (err) {
    console.log('Error : ' + err);
  } else {
    console.log('Connected to Database !');
  }
});

var herokuUrl = 'https://teenyurl.herokuapp.com/';

// create schema
var urlSchema = new mongoose.Schema({
  short_url: String,
  original_url: String
});

var Url = mongoose.model('Url', urlSchema);

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/new/*', function(req, res) {
  // check url if valid
  var urlArr = req.url.split('ew/');
  var url = urlArr[1];
  if (!url) {
    console.log('URL not valid');
  } else {
    console.log('URL you entered is : ' + url);
    var shorturl = herokuUrl + (Math.floor(Math.random() * (90000)) + 1);
    Url.create({
      short_url: shorturl,
      original_url: url
    });
    res.setHeader('Content-Type', 'application/json');
    res.json({'original_url':url,'short_url':shorturl});
  }
});

app.get('/:shorturl', function(req, res) {
  var url = herokuUrl + req.params.shorturl;
  console.log(url);
  Url.find( { short_url:url }, function(err, data) {
    if (err) {
      res.end('URL not found, please try again');
    } else {
      res.redirect(data[0].original_url);
    }
  });
});


app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Server started at port ' + process.env.PORT);
});