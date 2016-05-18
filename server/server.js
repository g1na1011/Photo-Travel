var express = require('express');
var Flickr = require('flickr-sdk');
var bodyParser = require('body-parser');
var request = require('request');
var Promise = require('bluebird');
var port = process.env.PORT || 8000;

var flickr = new Flickr({
  'apiKey': 'd46ad4f13e391f860cbb71e0ff1fd39d',
  'apiSecret': 'ced485ff007d2a3e'
});

var app = express();

app.use(express.static(__dirname + '/../app'));
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());

app.post('/home', function(req, res) {
  flickr
  .request()
  .media()
  .search(req.body.destinationTag)
  .get({
    media: 'photos',
    sort: 'relevance'
  })
  .then(function(flickrRes) {
    var promises = flickrRes.body.photos.photo.map(function(photo) {
      return new Promise(function(resolve, reject) {
        request(`https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=d46ad4f13e391f860cbb71e0ff1fd39d&photo_id=${photo.id}&format=json&nojsoncallback=1`, function(error, reqResponse, body) {
          resolve(JSON.parse(body));
        });
      });
    });

    Promise.map(promises, function(body, index) {
      body.flickr = flickrRes.body.photos.photo[index];
      return body;
    })
    .then(function(result) {
      res.send(result);
    });
  })
  .catch(function(err) {
    res.send(err);
  });
});

app.listen(port);
console.log('Serving on port:', port);