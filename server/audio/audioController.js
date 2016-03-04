var Audio = require('./audioModel');
var mongoose = require('mongoose');

module.exports = {

  uploadAudio: function(req, res) {

    var thisFile = req.files[0];

    new Audio({
      audio: thisFile,
      loc: {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      },
      userId: mongoose.mongo.ObjectID(req.body.userId);
    }).save().then(function(data){
      res.json();
    }).catch(function(err) {
      console.log('could not save to db', err.message);
    });

  }

};
