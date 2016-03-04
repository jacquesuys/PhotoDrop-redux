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
  }
};
