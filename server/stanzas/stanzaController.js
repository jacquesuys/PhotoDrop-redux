var Stanza = require('./stanzaModel');
var mongoose = require('mongoose');

module.exports = {
  // save that stanza as  a model in db
  saveStanzaModelToDB: function(req, res, next) {
    console.log('server received save stanza req', req.body.text);
    new Stanza({
      text: req.body.text,
      loc: {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      },
      userId: mongoose.mongo.ObjectID(req.body.userId)
    }).save().then(function(data) {
      Stanza.ensureIndexes({ loc: '2dsphere' });
      res.json();
    }).catch(function(err) {
      console.error('could not save to db', err.message);
    });
  },

  // fetch all photos from DB
  fetchStanzas: function(req, res, next) {
    var maxDistance = Number(req.query.radius);
    var coords = [req.query.lon, req.query.lat];

    Stanza.find({
      loc: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coords
          },
          $maxDistance: maxDistance
        }
      }
    }, function(err, stanzas) {
      if (err) {
        next(err);
      }
      if (stanzas) { 
        stanzas = stanzas.sort(function(a, b) {
          return b.views - a.views;
        });
      }
      res.json(stanzas);
    });
  },

  fetchStanzaLocations: function(req, res, next) {
    var lat = Number(req.query.lat);
    var lon = Number(req.query.lon);
    var latdelta = Number(req.query.latdelta);
    var londelta = Number(req.query.londelta);
    var coords = [
      [
        [lon - londelta, lat + latdelta],
        [lon + londelta, lat + latdelta],
        [lon + londelta, lat - latdelta],
        [lon - londelta, lat - latdelta],
        [lon - londelta, lat + latdelta]
      ]
    ];

    var revealedStanzas = undefined;

    Stanza.find({
      loc: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [req.query.lon, req.query.lat]
          },
          $maxDistance: 50
        }
      }
    }, function(err, stanzas) {
      if (err) {
        next(err);
      }
      revealedStanzas = stanzas;
      Stanza.find({
        loc: {
          $geoWithin: {
            $geometry: {
              type: 'Polygon',
              coordinates: coords
            }
          }
        },
        _id: {
          $nin: revealedStanzas.map(function(stanza) {
            return stanza._id;
          })
        }
      }, 'loc', function(err, stanzas) {
        if (err) {
          next(err);
        }
        res.json(stanzas);
      });
    });
  },

  fetchUserStanzas: function(req, res, next) {
    Stanza.find({ userId: mongoose.mongo.ObjectID(req.query.userId) }, function(err, stanzas) {
      if (err) {
        next(err);
      }
      res.json(stanzas);
    });
  },

  incrementViews: function(req, res, next) {
    Stanza.findOne({ text: req.query.text }, function(err, stanza) {
      if (err) {
        next(err);
      }
      if (!stanza) {
        return next(new Error('Text not added yet'));
      }
      stanza.views++;
      stanza.save(function(err, savedStanza) {
        if (err) {
          next(err);
        }
        res.json({views: savedStanza.views});
      });
    });
  }

};
