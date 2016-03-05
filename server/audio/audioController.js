var Audios = require('./audioModel');
var mongoose = require('mongoose');

module.exports = {

  saveAudioToDb: function(req, res) {
    console.log('Save audio to db: ------------', typeof parseFloat(req.body.longitude), req.body.latitude);

    var thisFile = req.files[0];

    new Audios({
      audio: JSON.stringify( thisFile ),
      loc: {
        type: "Point",
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      },
      userId: mongoose.mongo.ObjectID(req.body.user_id)
    }).save().then(function(data){
      console.log('Confirms mongod data saving');
      res.json();
    }).catch(function(err) {
      console.log('could not save to db', err.message);
    });
  },

  incrementViews: function(req, res, next) {
    Audios.findOne({ _id: mongoose.mongo.ObjectID(req.query.id) }, function(err, audio) {
      if (err) {
        next(err);
      }
      console.log( " HI IM IN THE BAKC END AND THE ID IS!!!!!! --- ", req.query.id);
      if (!audio) {
        return next(new Error('Text not added yet'));
      }
      audio.views++;
      audio.save(function(err, savedAudio) {
        if (err) {
          next(err);
        }
        res.json({views: savedAudio.views});
      });
    });
  },

  // fetch all audios from DB
  fetchAudios: function(req, res, next) {
    console.log('Fetch audios!------------Server side controller--------')
    var maxDistance = Number(req.query.radius);
    var coords = [req.query.lon, req.query.lat];

    Audios.find({
      loc: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coords
          },
          $maxDistance: maxDistance
        }
      }
    }, function(err, audios) {
      if (err) {
        next(err);
      }
      if (audios) {
        audios = audios.sort(function(a, b) {
          return b.views - a.views;
        });
      }
      res.json(audios);
    });
  },

  fetchAudiosLocations: function(req, res, next) {
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

    var revealedAudios = undefined;

    Audios.find({
      loc: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [req.query.lon, req.query.lat]
          },
          $maxDistance: 50
        }
      }
    }, function(err, audios) {
      if (err) {
        next(err);
      }
      revealedAudios = audios;
      Audios.find({
        loc: {
          $geoWithin: {
            $geometry: {
              type: 'Polygon',
              coordinates: coords
            }
          }
        },
        _id: {
          $nin: revealedAudios.map(function(audio) {
            return audio._id;
          })
        }
      }, 'loc', function(err, audios) {
        if (err) {
          next(err);
        }
        res.json(audios);
      });
    });
  },

  fetchUserAudios: function(req, res, next) {
    Audios.find({ userId: mongoose.mongo.ObjectID(req.query.userId) }, function(err, audios) {
      if (err) {
        next(err);
      }
      res.json(audios);
    });
  },

};
