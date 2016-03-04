var Audio = require('./audioModel');
var mongoose = require('mongoose');

module.exports = {

  saveAudioToDb: function(req, res) {
    console.log('Save audio to db: ------------', typeof parseFloat(req.body.longitude), req.body.latitude);

    var thisFile = req.files[0];

    new Audio({
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
  }
};
